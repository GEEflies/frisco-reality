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
import { getCategoryType } from '@/api/mappings';
import type { ListingFilters } from '@/api/types';

// Query keys live in a server-safe module so server components can prefetch the
// same cache these hooks read. Re-exported here to preserve the existing API.
export { listingKeys } from '@/api/queryKeys';
import { listingKeys } from '@/api/queryKeys';

type FilterExclusions = {
    transaction?: boolean;
    category?: boolean;
    locality?: boolean;
    price?: boolean;
};

function applyListingFilters(
    listings: ReturnType<typeof fetchAllActiveListings> extends Promise<infer T> ? T : never,
    filters?: ListingFilters,
    exclude: FilterExclusions = {},
) {
    if (!filters) return [...listings];

    let result = [...listings];

    if (!exclude.transaction) {
        if (filters.transaction === 'sale') {
            result = result.filter(l => l.action === 1);
        } else if (filters.transaction === 'rent') {
            result = result.filter(l => l.action === 3);
        }
    }

    if (!exclude.category && filters.category && filters.category !== 'all') {
        result = result.filter(l => getCategoryType(l.category) === filters.category);
    }

    if (!exclude.locality && filters.locality && filters.locality !== 'all') {
        const loc = filters.locality;
        result = result.filter(l => l.location_city === loc || l.location_district === loc);
    }

    if (!exclude.price && filters.priceRange) {
        const [min, max] = filters.priceRange;
        if (min > 0) result = result.filter(l => (l.price || 0) >= min);
        if (max > 0) result = result.filter(l => (l.price || 0) <= max);
    }

    return result;
}

function sortListings(
    listings: ReturnType<typeof fetchAllActiveListings> extends Promise<infer T> ? T : never,
    sort: ListingFilters['sort'],
) {
    const result = [...listings];

    switch (sort) {
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
}

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
        const filtered = applyListingFilters(allListings, filters);
        return sortListings(filtered, filters?.sort);
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
export function useListingFilters(filters?: ListingFilters) {
    const { data: listings = [] } = useAllListings();

    const absoluteMaxPrice = getMaxPrice(listings);
    const pricePool = applyListingFilters(listings, filters, { price: true });
    const localitiesPool = applyListingFilters(listings, filters, { locality: true });
    const typesPool = applyListingFilters(listings, filters, { category: true });
    const categoryPool = applyListingFilters(listings, filters, { category: true });
    const transactionPool = applyListingFilters(listings, filters, { transaction: true });
    const filteredListings = applyListingFilters(listings, filters);

    const categoryCounts = {
        apartment: 0,
        house: 0,
        land: 0,
        commercial: 0,
        cottage: 0,
        garage: 0,
        other: 0,
    };

    for (const listing of categoryPool) {
        const type = getCategoryType(listing.category);
        categoryCounts[type] += 1;
    }

    const transactionCounts = {
        all: transactionPool.length,
        sale: 0,
        rent: 0,
    };

    for (const listing of transactionPool) {
        if (listing.action === 1) transactionCounts.sale += 1;
        if (listing.action === 3) transactionCounts.rent += 1;
    }

    return {
        maxPrice: getMaxPrice(pricePool),
        absoluteMaxPrice,
        localities: getUniqueLocalities(localitiesPool),
        availableTypes: getUniqueTypes(typesPool),
        categoryCounts,
        transactionCounts,
        totalCount: filteredListings.length,
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