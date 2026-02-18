/**
 * Listings Service
 * Fetches listings from Supabase with enhanced images
 */

import { supabase, isSupabaseConfigured } from './supabaseClient';
import type { ListingWithImages, ListingFilters, ListingImage } from './types';
import { getCategoryType } from './mappings';

// ============================================
// SERVICE FUNCTIONS
// ============================================

/**
 * Fetch all listings with optional filters
 */
export async function fetchListings(filters?: ListingFilters): Promise<ListingWithImages[]> {
    if (!isSupabaseConfigured) {
        console.warn('[listingsService] Supabase is not configured');
        return [];
    }

    try {
        let query = supabase
            .from('listings')
            .select(`
                *,
                images:listing_images(*)
            `)
            .eq('status', 'active')
            .order('created_at', { ascending: false });

        // Apply filters to query
        if (filters?.transaction === 'rent') {
            query = query.in('transaction_id', [123, 124]);
        } else if (filters?.transaction === 'sale') {
            query = query.eq('transaction_id', 127);
        }

        if (filters?.priceRange) {
            query = query
                .gte('price', filters.priceRange[0])
                .lte('price', filters.priceRange[1]);
        }

        const { data, error } = await query;

        if (error) {
            console.error('[listingsService] Error fetching listings:', error.message || error);
            return [];
        }

        return applyFilters(data || [], filters);
    } catch (error) {
        console.error('[listingsService] Error:', error instanceof Error ? error.message : error);
        return [];
    }
}

/**
 * Fetch a single listing by slug (preferred) or UUID
 */
export async function fetchListingById(idOrSlug: string): Promise<ListingWithImages | null> {
    if (!isSupabaseConfigured) {
        console.warn('[listingsService] Supabase is not configured');
        return null;
    }

    try {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);

        let query = supabase
            .from('listings')
            .select(`
                *,
                images:listing_images(*)
            `);

        if (isUuid) {
            query = query.eq('id', idOrSlug);
        } else {
            query = query.eq('slug', idOrSlug);
        }

        const { data, error } = await query.single();

        if (error) {
            console.error('[listingsService] Error fetching listing:', error.message || error);
            return null;
        }

        return data;
    } catch (error) {
        console.error('[listingsService] Error:', error instanceof Error ? error.message : error);
        return null;
    }
}

/**
 * Get the best available image URL (upscaled > enhanced > original)
 */
export function getBestImageUrl(image: ListingImage): string {
    return image.upscaled_url || image.enhanced_url || image.original_url;
}

/**
 * Get the primary image for a listing
 */
export function getPrimaryImage(listing: ListingWithImages): string | undefined {
    const sorted = [...listing.images].sort((a, b) => a.sort_order - b.sort_order);
    const primary = sorted[0];
    return primary ? getBestImageUrl(primary) : undefined;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function applyFilters(listings: ListingWithImages[], filters?: ListingFilters): ListingWithImages[] {
    if (!filters) return listings;

    let result = [...listings];

    if (filters.category && filters.category !== 'all') {
        result = result.filter(listing => getCategoryType(listing.category_id) === filters.category);
    }

    if (filters.transaction && filters.transaction !== 'all') {
        result = result.filter(listing => {
            if (filters.transaction === 'rent') {
                return listing.transaction_id === 123 || listing.transaction_id === 124;
            }
            return listing.transaction_id === 127;
        });
    }

    if (filters.locality && filters.locality !== 'all') {
        const normalizedLocality = filters.locality.toLowerCase();
        result = result.filter(listing => {
            const city = listing.location_city?.toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/\s+/g, '-') || '';
            return city.includes(normalizedLocality) || normalizedLocality.includes(city);
        });
    }

    if (filters.priceRange) {
        result = result.filter(listing =>
            listing.price >= filters.priceRange![0] && listing.price <= filters.priceRange![1]
        );
    }

    if (filters.sort) {
        switch (filters.sort) {
            case 'price-asc':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'newest':
                result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
                break;
            case 'oldest':
                result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
                break;
        }
    }

    return result;
}

/**
 * Get maximum price from listings (for filter slider)
 */
export function getMaxPrice(listings: ListingWithImages[]): number {
    if (listings.length === 0) return 100000; // Default minimum for empty state
    return Math.max(...listings.map(l => l.price));
}

/**
 * Get unique localities from listings
 */
export function getUniqueLocalities(listings: ListingWithImages[]): string[] {
    const localities = new Set<string>();
    listings.forEach(l => {
        if (l.location_city) localities.add(l.location_city);
    });
    return Array.from(localities).sort();
}

/**
 * Get unique types from listings (includes both transactions and categories)
 */
export function getUniqueTypes(listings: ListingWithImages[]): string[] {
    const types = new Set<string>();
    
    // Check for rent transactions
    const hasRent = listings.some(l => l.transaction_id === 123 || l.transaction_id === 124);
    if (hasRent) types.add('rent');
    
    // Add categories
    listings.forEach(l => {
        const type = getCategoryType(l.category_id);
        types.add(type);
    });
    
    return Array.from(types);
}

