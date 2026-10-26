/**
 * Listings Service — Supabase query layer
 *
 * All field names and code values use the UC Export API conventions.
 * action: 1=Sale, 3=Rent (replaces old transaction_id 127/123/124)
 * category: 1-11 (replaces old category_id 8-72)
 * status: integer (replaces old string status)
 */

import { supabase } from './supabaseClient';
import type { Listing, ListingImage, ListingWithImages, ListingFilters } from './types';
import { getCategoryType } from './mappings';

// ============================================
// IMAGE URL HELPERS
// ============================================

function appendCacheBust(url: string, version?: string | null): string {
    if (!version) return url;
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}v=${encodeURIComponent(version)}`;
}

/**
 * Checks whether an image URL points to an AI-enhanced version (R2 bucket or legacy Supabase bucket)
 * rather than the original UC export image (which already has a baked-in watermark).
 * Used to conditionally overlay the FRISCO logo on enhanced images so the watermark
 * is consistent across all listing photos.
 */
export function isEnhancedImage(url: string): boolean {
    return url.includes('/storage/v1/object/public/enhanced-images/')
        || url.includes('.r2.dev/');
}

/**
 * Returns the stored enhanced/upscaled URL only when it is a real enhanced output
 * (R2 or legacy Supabase enhanced-images bucket). Some rows hold a stale UC signed
 * URL in enhanced_url; those must be ignored in favour of original_url.
 */
function getEnhancedOutputUrl(image: ListingImage): string | null {
    if (image.upscaled_url && isEnhancedImage(image.upscaled_url)) return image.upscaled_url;
    if (image.enhanced_url && isEnhancedImage(image.enhanced_url)) return image.enhanced_url;
    return null;
}

/**
 * Returns the best available image URL for a listing image.
 * Priority: real enhanced output (upscaled -> enhanced) -> original
 */
export function getBestImageUrl(image: ListingImage): string {
    const enhanced = getEnhancedOutputUrl(image);
    if (enhanced) return appendCacheBust(enhanced, image.updated_at);
    return image.original_url;
}

/**
 * Determines whether the CSS watermark overlay should be shown for a ListingImage.
 *
 * Show the overlay only when the displayed image is a real enhanced output
 * (R2 / legacy Supabase bucket). Original UC images already carry UC's own
 * watermark, so no overlay there.
 */
export function shouldShowOverlay(image: ListingImage): boolean {
    return getEnhancedOutputUrl(image) !== null;
}

/**
 * Returns the primary image URL for a listing (first image, best quality).
 */
export function getPrimaryImage(listing: ListingWithImages): string | null {
    if (!listing.images || listing.images.length === 0) return null;
    const sorted = [...listing.images].sort((a, b) => a.sort_order - b.sort_order);
    return getBestImageUrl(sorted[0]);
}

// ============================================
// FETCH LISTINGS
// ============================================

/** listing_images columns the UI actually uses (avoid `*`). */
const LISTING_IMAGE_COLUMNS = 'id, listing_id, original_url, enhanced_url, upscaled_url, sort_order, updated_at';
const LISTING_WITH_IMAGES_SELECT = `*, images:listing_images(${LISTING_IMAGE_COLUMNS})`;

function withSortedImages(listing: any): ListingWithImages {
    return {
        ...listing,
        images: (listing.images || []).sort((a: ListingImage, b: ListingImage) => a.sort_order - b.sort_order),
    };
}

/**
 * Fetch active, non-deleted listings with their images.
 * Supports filtering by category type, transaction (sale/rent), locality, price range, and sorting.
 */
export async function fetchListings(filters?: ListingFilters): Promise<ListingWithImages[]> {
    // Build query — only active, non-deleted listings
    let query = supabase
        .from('listings')
        .select(LISTING_WITH_IMAGES_SELECT)
        .eq('is_deleted', false)
        .eq('status', 1); // 1 = Aktívna (Export API)

    // Transaction filter: sale vs rent
    if (filters?.transaction === 'sale') {
        query = query.eq('action', 1); // Export API: 1 = Predaj
    } else if (filters?.transaction === 'rent') {
        query = query.eq('action', 3); // Export API: 3 = Prenájom
    }

    // Category type filter (apartment, house, land, etc.)
    if (filters?.category && filters.category !== 'all') {
        const categoryType = filters.category;
        // Map category type string to Export API category codes
        const categoryCodesMap: Record<string, number[]> = {
            apartment: [4],         // Byty
            house: [6, 8],          // Domy a vily, Nájomné domy
            land: [3],              // Pozemky
            commercial: [2, 9, 7],  // Komerčné objekty, Komerčné priestory, Hotely
            cottage: [10],          // Chaty a rekreačné objekty
            garage: [11],           // Malé objekty, garáže
        };
        const codes = categoryCodesMap[categoryType];
        if (codes && codes.length > 0) {
            query = query.in('category', codes);
        }
    }

    // Locality filter — match on city name (exact match for dropdown values)
    if (filters?.locality && filters.locality !== 'all') {
        const loc = filters.locality;
        query = query.or(
            `location_city.eq.${loc},location_district.eq.${loc}`
        );
    }

    // Price range filter
    if (filters?.priceRange) {
        const [min, max] = filters.priceRange;
        if (min > 0) query = query.gte('price', min);
        if (max > 0) query = query.lte('price', max);
    }

    // Sorting
    switch (filters?.sort) {
        case 'price-asc':
            query = query.order('price', { ascending: true });
            break;
        case 'price-desc':
            query = query.order('price', { ascending: false });
            break;
        case 'oldest':
            query = query.order('created_at', { ascending: true });
            break;
        case 'newest':
            query = query.order('created_at', { ascending: false });
            break;
        case 'recommended':
        default:
            // Featured/top listings first, then newest
            query = query
                .order('is_top', { ascending: false })
                .order('is_exclusive', { ascending: false })
                .order('created_at', { ascending: false });
            break;
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching listings:', error);
        return [];
    }

    // Sort images by sort_order within each listing
    return (data || []).map(withSortedImages);
}

/**
 * Query ALL active, non-deleted listings. THROWS on database error/timeout so
 * callers (e.g. the server-side cache) can avoid caching an empty result.
 * Pass an AbortSignal to enforce a timeout.
 */
export async function queryAllActiveListings(signal?: AbortSignal): Promise<ListingWithImages[]> {
    let query = supabase
        .from('listings')
        .select(LISTING_WITH_IMAGES_SELECT)
        .eq('is_deleted', false)
        .eq('status', 1)
        .order('created_at', { ascending: false });
    if (signal) query = query.abortSignal(signal);

    const { data, error } = await query;
    if (error) throw new Error(`Error fetching all listings: ${error.message}`);

    return (data || []).map(withSortedImages);
}

/**
 * Fetch ALL active, non-deleted listings (no filters).
 * Used as the single cached data source for client-side filtering (React Query).
 * Swallows errors and returns [] (client behaviour). Server components should use
 * getCachedActiveListings from listingsServer.ts instead.
 */
export async function fetchAllActiveListings(): Promise<ListingWithImages[]> {
    try {
        return await queryAllActiveListings();
    } catch (err) {
        console.error(err);
        return [];
    }
}

/**
 * Query a single listing by ID (UUID) or slug. Returns null when it does not
 * exist; THROWS on database error/timeout.
 */
export async function queryListingById(idOrSlug: string, signal?: AbortSignal): Promise<ListingWithImages | null> {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);

    const run = async (column: 'id' | 'slug') => {
        let query = supabase
            .from('listings')
            .select(LISTING_WITH_IMAGES_SELECT)
            .eq(column, idOrSlug)
            .limit(1);
        if (signal) query = query.abortSignal(signal);
        const { data, error } = await query;
        if (error) throw new Error(`Error fetching listing ${idOrSlug}: ${error.message}`);
        return data && data.length > 0 ? withSortedImages(data[0]) : null;
    };

    // UUIDs match listings.id; anything else can only be a slug (a non-UUID
    // string would make the id lookup fail with an invalid-uuid error).
    return run(isUuid ? 'id' : 'slug');
}

/**
 * Fetch a single listing by ID (UUID) or slug. Swallows errors (returns null).
 */
export async function fetchListingById(idOrSlug: string): Promise<ListingWithImages | null> {
    try {
        return await queryListingById(idOrSlug);
    } catch (err) {
        console.error(err);
        return null;
    }
}

// ============================================
// AGENT HELPERS
// ============================================

/**
 * Query an agent by UC user ID (matches listings.agent_id). Returns null when
 * not found; THROWS on database error/timeout.
 */
export async function queryAgentByUcId(ucUserId: string, signal?: AbortSignal): Promise<import('./types').Agent | null> {
    let query = supabase
        .from('agents')
        .select('*')
        .eq('uc_user_id', ucUserId)
        .eq('is_deleted', false)
        .limit(1);
    if (signal) query = query.abortSignal(signal);
    const { data, error } = await query;
    if (error) throw new Error(`Error fetching agent ${ucUserId}: ${error.message}`);
    return data && data.length > 0 ? (data[0] as import('./types').Agent) : null;
}

/**
 * Fetch an agent by their UC user ID (matches listings.agent_id).
 */
export async function fetchAgentByUcId(ucUserId: string): Promise<import('./types').Agent | null> {
    try {
        return await queryAgentByUcId(ucUserId);
    } catch (err) {
        console.error(err);
        return null;
    }
}

// ============================================
// FILTER HELPERS (for useListingFilters hook)
// ============================================

/**
 * Get the maximum price across all listings.
 */
export function getMaxPrice(listings: ListingWithImages[]): number {
    if (listings.length === 0) return 0;
    return Math.max(...listings.map(l => l.price || 0));
}

/**
 * Get unique localities from listings for the locality filter dropdown.
 * Uses location_city first, then location_district, with street as fallback.
 */
export function getUniqueLocalities(listings: ListingWithImages[]): string[] {
    const localities = new Set<string>();
    for (const listing of listings) {
        if (listing.location_city) localities.add(listing.location_city);
    }
    return Array.from(localities).sort();
}

/**
 * Get unique category types from listings for the type filter.
 */
export function getUniqueTypes(listings: ListingWithImages[]): string[] {
    const types = new Set<string>();
    for (const listing of listings) {
        types.add(getCategoryType(listing.category));
    }
    return Array.from(types);
}

