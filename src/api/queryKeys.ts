/**
 * React Query keys for the listings caches.
 *
 * Extracted from useListings.ts (a 'use client' module) so that SERVER
 * components can import the keys to prefetch/dehydrate the same cache the
 * client hooks read — without pulling client-only code across the boundary.
 */
export const listingKeys = {
    all: ['listings'] as const,
    lists: () => [...listingKeys.all, 'list'] as const,
    list: () => [...listingKeys.lists(), 'active'] as const,
    details: () => [...listingKeys.all, 'detail'] as const,
    detail: (id: string) => [...listingKeys.details(), id] as const,
};
