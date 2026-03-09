'use client';

/**
 * React Query Hooks for Listings
 *
 * All active listings are fetched ONCE from Supabase and cached.
 * Filtering and sorting happen client-side (instant, no round-trip).
 */

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAllActiveListings, fetchListingById, fetchAgentByUcId, getMaxPrice, getUniqueLocalities, getUniqueTypes } from '@/api/listingsService';
import type { ListingFilters } from '@/api/types';

// Query keys for cache management
export const listingKeys = {
    all: ['listings'] as const,
    lists: () => [...listingKeys.all, 'list'] as const,
    list: () => [...listingKeys.lists(), 'active'] as const,
    details: () => [...listingKeys.all, 'detail'] as const,
    detail: (id: string) => [...listingKeys.details(), id] as const,
};

// Category code mapping (mirrors listingsService server-side map)
const categoryCodesMap: Record<string, number[]> = {
    apartment: [4],
    house: [6, 8],
    land: [3],
    commercial: [2, 9, 7],
    cottage: [10],
    garage: [11],
};

/**
 * Single source of truth — fetches ALL active listings once, cached 5 min.
 */
export function useAllListings() {
    return useQuery({
        queryKey: listingKeys.list(),
        queryFn: fetchAllActiveListings,
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
    });
}

/**
 * Hook to get listings with client-side filtering & sorting.
 * No additional Supabase queries — instant filter changes.
 */
export function useListings(filters?: ListingFilters) {
    const { data: allListings = [], isLoading, error } = useAllListings();

    const data = useMemo(() => {
        let result = [...allListings];

        if (!filters) return result;

        // Transaction filter
        if (filters.transaction === 'sale') {
            result = result.filter(l => l.action === 1);
        } else if (filters.transaction === 'rent') {
            result = result.filter(l => l.action === 3);
        }

        // Category filter
        if (filters.category && filters.category !== 'all') {
            const codes = categoryCodesMap[filters.category];
            if (codes) {
                result = result.filter(l => codes.includes(l.category));
            }
        }

        // Locality filter
        if (filters.locality && filters.locality !== 'all') {
            const loc = filters.locality;
            result = result.filter(l =>
                l.location_city === loc || l.location_district === loc
            );
        }

        // Price range filter
        if (filters.priceRange) {
            const [min, max] = filters.priceRange;
            if (min > 0) result = result.filter(l => (l.price || 0) >= min);
            if (max > 0) result = result.filter(l => (l.price || 0) <= max);
        }

        // Sorting
        switch (filters.sort) {
            case 'price-asc':
                result.sort((a, b) => (a.price || 0) - (b.price || 0));
                break;
            case 'price-desc':
                result.sort((a, b) => (b.price || 0) - (a.price || 0));
                break;
            case 'oldest':
                result.sort((a, b) =>
                    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
                );
                break;
            case 'newest':
                result.sort((a, b) =>
                    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                );
                break;
            case 'recommended':
            default:
                result.sort((a, b) => {
                    if (a.is_top !== b.is_top) return a.is_top ? -1 : 1;
                    if (a.is_exclusive !== b.is_exclusive) return a.is_exclusive ? -1 : 1;
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                });
                break;
        }

        return result;
    }, [allListings, filters]);

    return { data, isLoading, error };
}

/**
 * Hook to fetch a single listing by ID
 */
export function useListing(id: string | undefined) {
    return useQuery({
        queryKey: listingKeys.detail(id || ''),
        queryFn: () => fetchListingById(id!),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
    });
}

/**
 * Hook to fetch an agent by UC user ID (for listing detail pages).
 */
export function useAgent(agentId: string | null | undefined) {
    return useQuery({
        queryKey: ['agent', agentId] as const,
        queryFn: () => fetchAgentByUcId(agentId!),
        enabled: !!agentId,
        staleTime: 10 * 60 * 1000,
        gcTime: 60 * 60 * 1000,
    });
}

/**
 * Hook to get filter metadata (max price, localities, types).
 * Reuses the same cached all-listings query — no extra fetch.
 */
export function useListingFilters() {
    const { data: listings = [] } = useAllListings();

    return {
        maxPrice: getMaxPrice(listings),
        localities: getUniqueLocalities(listings),
        availableTypes: getUniqueTypes(listings),
        totalCount: listings.length,
    };
}

/**
 * Hook to get featured/latest listings for homepage
 */
export function useFeaturedListings(limit: number = 4) {
    const { data: allListings = [], isLoading, error } = useAllListings();

    const data = useMemo(() => {
        return [...allListings]
            .sort((a, b) =>
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            )
            .slice(0, limit);
    }, [allListings, limit]);

    return { data, isLoading, error };
}