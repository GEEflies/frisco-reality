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
 * Returns the best available image URL for a listing image.
 * Priority: upscaled → enhanced → original
 */
export function getBestImageUrl(image: ListingImage): string {
    if (image.upscaled_url) {
        return appendCacheBust(image.upscaled_url, image.updated_at);
    }

    if (image.enhanced_url) {
        return appendCacheBust(image.enhanced_url, image.updated_at);
    }

    return image.original_url;
}

/**
 * Checks whether an image URL points to an AI-enhanced version (Supabase bucket)
 * rather than the original UC export image (which already has a baked-in watermark).
 * Used to conditionally overlay the FRISCO logo on enhanced images so the watermark
 * is consistent across all listing photos.
 */
export function isEnhancedImage(url: string): boolean {
    return url.includes('/storage/v1/object/public/enhanced-images/');
}

/**
 * Determines whether the CSS watermark overlay should be shown for a ListingImage.
 * Uses the `has_baked_logo` flag set by the Python logo-detection script.
 * - has_baked_logo === true  →  baked-in logo exists → do NOT show overlay
 * - has_baked_logo === false →  no baked-in logo    → show overlay
 * - has_baked_logo === null  →  unknown              → do NOT show overlay
 *
 * The overlay must never be shown on original UC images, otherwise we create
 * the exact double-watermark problem the user reported.
 */
export function shouldShowOverlay(image: ListingImage): boolean {
    const baseUrl = image.upscaled_url || image.enhanced_url;
    if (!baseUrl || !isEnhancedImage(baseUrl)) return false;
    if (image.has_baked_logo !== false) return false;
    return true;
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

/**
 * Fetch active, non-deleted listings with their images.
 * Supports filtering by category type, transaction (sale/rent), locality, price range, and sorting.
 */
export async function fetchListings(filters?: ListingFilters): Promise<ListingWithImages[]> {
    // Build query — only active, non-deleted listings
    let query = supabase
        .from('listings')
        .select('*, images:listing_images(*)')
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
    return (data || []).map((listing: any) => ({
        ...listing,
        images: (listing.images || []).sort((a: ListingImage, b: ListingImage) => a.sort_order - b.sort_order),
    }));
}

/**
 * Fetch ALL active, non-deleted listings (no filters).
 * Used as the single cached data source for client-side filtering.
 */
export async function fetchAllActiveListings(): Promise<ListingWithImages[]> {
    const { data, error } = await supabase
        .from('listings')
        .select('*, images:listing_images(*)')
        .eq('is_deleted', false)
        .eq('status', 1)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching all listings:', error);
        return [];
    }

    return (data || []).map((listing: any) => ({
        ...listing,
        images: (listing.images || []).sort((a: ListingImage, b: ListingImage) => a.sort_order - b.sort_order),
    }));
}

/**
 * Fetch a single listing by ID (UUID) or slug.
 */
export async function fetchListingById(idOrSlug: string): Promise<ListingWithImages | null> {
    // Try by slug first, then by UUID
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);

    let query;
    if (isUuid) {
        query = supabase
            .from('listings')
            .select('*, images:listing_images(*)')
            .eq('id', idOrSlug)
            .single();
    } else {
        query = supabase
            .from('listings')
            .select('*, images:listing_images(*)')
            .eq('slug', idOrSlug)
            .single();
    }

    const { data, error } = await query;

    if (error || !data) {
        // If slug lookup failed, try UUID anyway (fallback)
        if (!isUuid) {
            const { data: fallback } = await supabase
                .from('listings')
                .select('*, images:listing_images(*)')
                .eq('id', idOrSlug)
                .single();
            if (fallback) {
                return {
                    ...fallback,
                    images: (fallback.images || []).sort((a: any, b: any) => a.sort_order - b.sort_order),
                } as ListingWithImages;
            }
        }
        return null;
    }

    return {
        ...data,
        images: (data.images || []).sort((a: any, b: any) => a.sort_order - b.sort_order),
    } as ListingWithImages;
}

// ============================================
// AGENT HELPERS
// ============================================

/**
 * Fetch an agent by their UC user ID (matches listings.agent_id).
 */
export async function fetchAgentByUcId(ucUserId: string): Promise<import('./types').Agent | null> {
    const { data, error } = await supabase
        .from('agents')
        .select('*')
        .eq('uc_user_id', ucUserId)
        .eq('is_deleted', false)
        .single();

    if (error || !data) return null;
    return data as import('./types').Agent;
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

