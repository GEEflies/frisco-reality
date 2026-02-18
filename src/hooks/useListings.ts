'use client';

/**
 * React Query Hooks for Listings
 * Provides data fetching with caching, error handling, and loading states
 */

import { useQuery } from '@tanstack/react-query';
import { fetchListings, fetchListingById, getMaxPrice, getUniqueLocalities, getUniqueTypes } from '@/api/listingsService';
import type { ListingFilters, ListingWithImages } from '@/api/types';

// Query keys for cache management
export const listingKeys = {
    all: ['listings'] as const,
    lists: () => [...listingKeys.all, 'list'] as const,
    list: (filters?: ListingFilters) => [...listingKeys.lists(), filters] as const,
    details: () => [...listingKeys.all, 'detail'] as const,
    detail: (id: string) => [...listingKeys.details(), id] as const,
};

/**
 * Hook to fetch all listings with optional filters
 */
export function useListings(filters?: ListingFilters) {
    return useQuery({
        queryKey: listingKeys.list(filters),
        queryFn: () => fetchListings(filters),
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 30 * 60 * 1000, // 30 minutes (formerly cacheTime)
    });
}

/**
 * Hook to fetch a single listing by ID
 */
export function useListing(id: string | undefined) {
    return useQuery({
        queryKey: listingKeys.detail(id || ''),
        queryFn: () => fetchListingById(id!),
        enabled: !!id, // Only run query if id is provided
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
    });
}

/**
 * Hook to get filter metadata (max price, localities, types)
 */
export function useListingFilters() {
    const { data: listings = [] } = useListings();

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
    const { data, isLoading, error } = useListings({ sort: 'newest' });

    return {
        data: data?.slice(0, limit) || [],
        isLoading,
        error,
    };
}