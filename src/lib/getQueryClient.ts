import { QueryClient, defaultShouldDehydrateQuery } from '@tanstack/react-query';
import { cache } from 'react';

/**
 * Per-request QueryClient for server components.
 *
 * React's cache() gives one instance per request, so multiple prefetch calls
 * in the same render share a cache and a single dehydrate() captures them all.
 * Used to seed React Query data into the SSR HTML (see app/page.tsx).
 */
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { staleTime: 60 * 1000 },
      dehydrate: {
        // Also ship still-pending queries so streamed prefetches hydrate cleanly.
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
      },
    },
  });
}

export const getQueryClient = cache(makeQueryClient);
