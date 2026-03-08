// @ts-nocheck — This is a Deno/Supabase Edge Function, not part of the Next.js build.
// VS Code may show errors for Deno APIs and URL imports — they work correctly when deployed.

/**
 * Process Images — Batch Enhancement Cron
 *
 * Triggered by pg_cron every 1 minute, or called immediately by import-listings
 * right after saving a new batch of images.
 *
 * Design:
 * 1. Claim the whole batch immediately (mark 'processing') BEFORE firing any calls.
 *    Overlapping cron runs cannot pick up the same images.
 * 2. Fire all images in PARALLEL (Promise.allSettled).
 *    A batch of 10 finishes in ~60s instead of ~600s sequential.
 * 3. 400-image bulk import completes in ~40 min (Gemini RPM is the bottleneck).
 *    A single new listing with 20 images: done in 2-3 minutes.
 * 4. Stuck recovery: images in 'processing' for >3 min are reset to 'pending'.
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const BATCH_SIZE = 10;               // Images to process per run (in parallel)
const STUCK_TIMEOUT_MINUTES = 3;     // Reset 'processing' images older than this

// ---- Recovery: reset stuck 'processing' images ----
async function recoverStuckImages(): Promise<number> {
    let recovered = 0;

    // 1. Recover images stuck in 'processing' for too long (Edge Function crash / timeout)
    const cutoff = new Date(Date.now() - STUCK_TIMEOUT_MINUTES * 60 * 1000).toISOString();
    const { data: stuck } = await supabase
        .from('listing_images')
        .select('id')
        .eq('enhancement_status', 'processing')
        .lt('created_at', cutoff);
    if (stuck && stuck.length > 0) {
        const { error } = await supabase
            .from('listing_images')
            .update({ enhancement_status: 'pending' })
            .in('id', stuck.map(img => img.id));
        if (!error) {
            console.log(`Recovered ${stuck.length} stuck-processing images`);
            recovered += stuck.length;
        } else {
            console.error('Error recovering stuck images:', error);
        }
    }

    // 2. Retry failed images that haven't exhausted their 3 attempts yet.
    //    Covers temporary failures: Gemini overload, network blips, UC image briefly down.
    //    Images with retry_count >= 3 stay permanently failed — site shows original_url.
    const { data: failedRetryable } = await supabase
        .from('listing_images')
        .select('id')
        .eq('enhancement_status', 'failed')
        .lt('retry_count', 3);
    if (failedRetryable && failedRetryable.length > 0) {
        const { error } = await supabase
            .from('listing_images')
            .update({ enhancement_status: 'pending' })
            .in('id', failedRetryable.map(img => img.id));
        if (!error) {
            console.log(`Re-queued ${failedRetryable.length} failed images for retry`);
            recovered += failedRetryable.length;
        } else {
            console.error('Error re-queuing failed images:', error);
        }
    }

    return recovered;
}

// ---- Claim the batch: mark all as 'processing' BEFORE firing any API calls ----
// Prevents two overlapping cron runs from grabbing the same images.
async function claimImages(ids: string[]): Promise<void> {
    const { error } = await supabase
        .from('listing_images')
        .update({ enhancement_status: 'processing' })
        .in('id', ids);
    if (error) console.error('Error claiming images:', error);
}

// ---- Fetch pending images ----
async function fetchPendingImages() {
    const { data, error } = await supabase
        .from('listing_images')
        .select('id, original_url, listing_id')
        .eq('enhancement_status', 'pending')
        .is('enhanced_url', null)
        .order('created_at', { ascending: true })
        .limit(BATCH_SIZE);

    if (error) {
        console.error('Error fetching pending images:', error);
        return [];
    }

    return data || [];
}

// ---- Call enhance-image function ----
async function callEnhanceImage(imageId: string, originalUrl: string): Promise<boolean> {
    try {
        const response = await fetch(`${SUPABASE_URL}/functions/v1/enhance-image`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SUPABASE_KEY}`,
            },
            body: JSON.stringify({ imageId, originalUrl }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`enhance-image failed for ${imageId}: ${response.status} ${errorText}`);
            return false;
        }

        const result = await response.json();
        return result.success === true;
    } catch (error) {
        console.error(`Error calling enhance-image for ${imageId}:`, error);
        return false;
    }
}

// ============================================================
// HANDLER
// ============================================================
Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
        });
    }

    try {
        // Step 1: Recover stuck images
        const recovered = await recoverStuckImages();

        // Step 2: Fetch pending images
        const pending = await fetchPendingImages();

        if (pending.length === 0) {
            return new Response(
                JSON.stringify({
                    message: 'No pending images',
                    recovered,
                }),
                { headers: { 'Content-Type': 'application/json' } },
            );
        }

        // Step 3: Claim batch immediately — prevents overlapping cron runs
        // from grabbing the same images.
        await claimImages(pending.map(img => img.id));
        console.log(`Processing ${pending.length} images in parallel...`);

        // Step 4: Fire all in parallel — one bad image won't block the rest.
        const results = await Promise.allSettled(
            pending.map(image => callEnhanceImage(image.id, image.original_url))
        );

        const successCount = results.filter(r => r.status === 'fulfilled' && (r as any).value === true).length;
        const failCount = results.length - successCount;

        // Report remaining pending count
        const { count: remaining } = await supabase
            .from('listing_images')
            .select('id', { count: 'exact', head: true })
            .eq('enhancement_status', 'pending');

        return new Response(
            JSON.stringify({
                message: `Processed ${pending.length} images`,
                successCount,
                failCount,
                recovered,
                remainingPending: remaining ?? 0,
            }),
            { headers: { 'Content-Type': 'application/json' } },
        );
    } catch (error) {
        console.error('process-images error:', error);
        return new Response(
            JSON.stringify({ error: (error as Error).message }),
            { status: 500, headers: { 'Content-Type': 'application/json' } },
        );
    }
});
