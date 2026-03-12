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
 * 2. Process images with limited concurrency (MAX_CONCURRENCY) to avoid
 *    hitting Edge Function worker limits (WORKER_LIMIT / 546 errors).
 * 3. 400-image bulk import completes across many cron runs (1 min each).
 *    A single new listing with 20 images: done in ~10 cron ticks.
 * 4. Stuck recovery: images in 'processing' for >3 min are reset to 'pending'.
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const BATCH_SIZE = 1;                // Images to process per cron run (sequential, ~76s each)
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
        .lt('updated_at', cutoff);
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
    //    Backoff: only re-queue images that have been in 'failed' state for >5 minutes.
    //    Prevents burning all 3 retries in 3 minutes during a Gemini outage.
    const retryCutoff = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const { data: failedRetryable } = await supabase
        .from('listing_images')
        .select('id')
        .eq('enhancement_status', 'failed')
        .lt('retry_count', 3)
        .lt('updated_at', retryCutoff);
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

// ---- Atomic claim: fetch + mark as 'processing' in one transaction ----
// Uses claim_pending_images RPC with FOR UPDATE SKIP LOCKED to prevent
// two overlapping cron runs from grabbing the same image.
async function claimPendingImages() {
    const { data, error } = await supabase
        .rpc('claim_pending_images', { batch_limit: BATCH_SIZE });

    if (error) {
        console.error('Error claiming pending images:', error);
        return [];
    }

    return data || [];
}

// ---- Call enhance-image function ----
async function callEnhanceImage(imageId: string, originalUrl: string, force = false): Promise<boolean> {
    try {
        const response = await fetch(`${SUPABASE_URL}/functions/v1/enhance-image`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SUPABASE_KEY}`,
            },
            body: JSON.stringify({ imageId, originalUrl, force }),
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
        // Check if force mode was requested (for re-processing skipped images)
        let force = false;
        if (req.method === 'POST') {
            try {
                const body = await req.json();
                force = body?.force === true;
            } catch { /* no body or not JSON — that's fine, default to false */ }
        }

        // Step 1: Recover stuck images
        const recovered = await recoverStuckImages();

        // Step 2: Atomically claim pending images (fetch + mark 'processing' in one query)
        // Uses FOR UPDATE SKIP LOCKED — concurrent cron runs cannot grab the same image.
        const pending = await claimPendingImages();

        if (pending.length === 0) {
            return new Response(
                JSON.stringify({
                    message: 'No pending images',
                    recovered,
                }),
                { headers: { 'Content-Type': 'application/json' } },
            );
        }

        console.log(`Processing ${pending.length} images sequentially...`);

        // Step 3: Process images one at a time to avoid WORKER_LIMIT errors.
        // Edge Functions have limited concurrent workers; parallel calls exhaust them.
        let successCount = 0;
        let failCount = 0;
        for (const image of pending) {
            const ok = await callEnhanceImage(image.id, image.original_url, force);
            if (ok) successCount++;
            else failCount++;
        }

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
