/**
 * Server-side cached listings reads.
 *
 * The homepage, /ponuka and listing detail pages are ISR (prerendered, regenerated at
 * most every 5 min). These wrappers put the reads behind Next's data cache
 * (unstable_cache, 5 min, tag `listings`); the tag is also attached to the pages, so
 * the uc-import webhook's revalidateTag(LISTINGS_TAG) refreshes data and pages at once.
 *
 * Failure handling:
 *  - queries throw on DB error/timeout (8 s abort), so unstable_cache never stores
 *    an empty/failed result; an expired entry keeps being served (stale) while it
 *    revalidates in the background;
 *  - if there is no cache entry at all and the DB fails, we fall back to the last
 *    good value kept in this instance's memory; with none, the listings reads throw,
 *    so an ISR regeneration fails and the last good page stays cached (never an empty
 *    page cached for 5 min). The agent read still falls back to null.
 *
 * Do NOT import this from client components (next/cache is server-only). Client code
 * keeps using fetchAllActiveListings / fetchListingById from listingsService.ts.
 */

import { unstable_cache } from 'next/cache';
import { queryAgentByUcId, queryAllActiveListings, queryListingById } from './listingsService';
import type { Agent, ListingWithImages } from './types';

const REVALIDATE_SECONDS = 300;
const FETCH_TIMEOUT_MS = 8000;
export const LISTINGS_TAG = 'listings';

const timeoutSignal = () => AbortSignal.timeout(FETCH_TIMEOUT_MS);

const cachedAllActive = unstable_cache(
    () => queryAllActiveListings(timeoutSignal()),
    ['listings-all-active-v1'],
    { revalidate: REVALIDATE_SECONDS, tags: [LISTINGS_TAG] },
);

const cachedListingById = unstable_cache(
    (idOrSlug: string) => queryListingById(idOrSlug, timeoutSignal()),
    ['listing-by-id-v1'],
    { revalidate: REVALIDATE_SECONDS, tags: [LISTINGS_TAG] },
);

const cachedAgentByUcId = unstable_cache(
    (ucUserId: string) => queryAgentByUcId(ucUserId, timeoutSignal()),
    ['agent-by-uc-id-v1'],
    { revalidate: REVALIDATE_SECONDS, tags: [LISTINGS_TAG] },
);

// Last good values, per server instance (fallback when cache is cold and DB is down).
let lastGoodAll: ListingWithImages[] | null = null;
const lastGoodById = new Map<string, ListingWithImages | null>();

export async function getCachedActiveListings(): Promise<ListingWithImages[]> {
    try {
        const data = await cachedAllActive();
        lastGoodAll = data;
        return data;
    } catch (err) {
        if (lastGoodAll) {
            console.error('[listings] cached fetch failed, serving last good data:', err);
            return lastGoodAll;
        }
        throw err;
    }
}

export async function getCachedListingById(idOrSlug: string): Promise<ListingWithImages | null> {
    try {
        const data = await cachedListingById(idOrSlug);
        if (lastGoodById.size > 200) lastGoodById.clear();
        lastGoodById.set(idOrSlug, data);
        return data;
    } catch (err) {
        if (lastGoodById.has(idOrSlug)) {
            console.error(`[listings] cached fetch of ${idOrSlug} failed, serving last good data:`, err);
            return lastGoodById.get(idOrSlug) ?? null;
        }
        throw err;
    }
}

export async function getCachedAgentByUcId(ucUserId: string): Promise<Agent | null> {
    try {
        return await cachedAgentByUcId(ucUserId);
    } catch (err) {
        console.error(`[listings] cached fetch of agent ${ucUserId} failed:`, err);
        return null;
    }
}
