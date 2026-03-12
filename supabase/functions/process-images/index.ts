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
const SITE_URL = Deno.env.get('SITE_URL') || 'https://frisco.sk';
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const NOTIFY_EMAIL = Deno.env.get('NOTIFY_EMAIL') || 'billikkarol1@gmail.com';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const BATCH_SIZE = 1;                // Images to process per cron run (sequential, ~76s each)
const STUCK_TIMEOUT_MINUTES = 3;     // Reset 'processing' images older than this
const NOTIFY_FLAG_BUCKET = 'original-images';
const NOTIFY_FLAG_PATH = '_system/reenhancement_complete_notified.txt';

async function hasCompletionNotificationBeenSent(): Promise<boolean> {
        try {
                const { data, error } = await supabase.storage
                        .from(NOTIFY_FLAG_BUCKET)
                        .download(NOTIFY_FLAG_PATH);
                return !!data && !error;
        } catch {
                return false;
        }
}

async function markCompletionNotificationSent(): Promise<void> {
        try {
                await supabase.storage.createBucket(NOTIFY_FLAG_BUCKET, { public: false }).catch(() => {});
                await supabase.storage
                        .from(NOTIFY_FLAG_BUCKET)
                        .upload(NOTIFY_FLAG_PATH, new Blob(['1'], { type: 'text/plain' }), { upsert: true });
        } catch (error) {
                console.warn('Could not write completion notification flag:', (error as Error).message);
        }
}

async function resetCompletionNotificationFlag(): Promise<void> {
        try {
                await supabase.storage
                        .from(NOTIFY_FLAG_BUCKET)
                        .remove([NOTIFY_FLAG_PATH]);
        } catch {
                // Ignore missing file or storage issues; next completion check will still work.
        }
}

async function notifyEnhancementComplete(completedCount: number, failedCount: number): Promise<void> {
        if (!RESEND_API_KEY) {
                console.warn('RESEND_API_KEY not set — skipping completion notification');
                return;
        }

        const alreadySent = await hasCompletionNotificationBeenSent();
        if (alreadySent) return;

        const now = new Date().toLocaleString('sk-SK', { timeZone: 'Europe/Bratislava' });

        try {
                const res = await fetch('https://api.resend.com/emails', {
                        method: 'POST',
                        headers: {
                                'Authorization': `Bearer ${RESEND_API_KEY}`,
                                'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                                from: 'FRISCO Reality <frisco@karchi.xyz>',
                                to: [NOTIFY_EMAIL],
                                subject: 'FRISCO: re-enhancement is finished',
                                html: `<!DOCTYPE html>
<html lang="sk">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:32px 0;">
        <tr><td align="center">
            <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
                <tr>
                    <td style="background:#0d1b2a;padding:28px 32px;">
                        <p style="margin:0;font-size:22px;font-weight:bold;color:#ffffff;letter-spacing:2px;">FRISCO</p>
                        <p style="margin:4px 0 0;font-size:13px;color:#ffffff;opacity:0.6;">Rodinná realitka · Sereď a okolie</p>
                    </td>
                </tr>
                <tr>
                    <td style="padding:24px 32px 0;">
                        <span style="display:inline-block;background:#e8f5e9;color:#2e7d32;font-size:12px;font-weight:bold;padding:5px 12px;border-radius:20px;text-transform:uppercase;letter-spacing:1px;">● Batch finished</span>
                    </td>
                </tr>
                <tr>
                    <td style="padding:20px 32px 28px;">
                        <h1 style="margin:0 0 8px;font-size:22px;color:#0d1b2a;">Re-enhancement is complete</h1>
                        <p style="margin:0 0 20px;font-size:15px;color:#555;">All queued listing images have finished processing. You can review the live site now.</p>
                        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f9f9;border:1px solid #e0e0e0;border-radius:6px;margin-bottom:24px;">
                            <tr>
                                <td style="padding:12px 16px;border-bottom:1px solid #e0e0e0;">
                                    <p style="margin:0;font-size:11px;color:#999;text-transform:uppercase;letter-spacing:1px;">Completed images</p>
                                    <p style="margin:4px 0 0;font-size:15px;color:#0d1b2a;font-weight:bold;">${completedCount}</p>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding:12px 16px;border-bottom:1px solid #e0e0e0;">
                                    <p style="margin:0;font-size:11px;color:#999;text-transform:uppercase;letter-spacing:1px;">Failed images</p>
                                    <p style="margin:4px 0 0;font-size:14px;color:#333;">${failedCount}</p>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding:12px 16px;">
                                    <p style="margin:0;font-size:11px;color:#999;text-transform:uppercase;letter-spacing:1px;">Finished at</p>
                                    <p style="margin:4px 0 0;font-size:14px;color:#333;">${now}</p>
                                </td>
                            </tr>
                        </table>
                        <a href="${SITE_URL}/ponuka" style="display:inline-block;background:#0d1b2a;color:#ffffff;text-decoration:none;font-size:14px;font-weight:bold;padding:12px 22px;border-radius:6px;">Open live listings →</a>
                    </td>
                </tr>
            </table>
        </td></tr>
    </table>
</body>
</html>`,
                        }),
                });

                if (!res.ok) {
                        console.error('Completion notification failed:', await res.text());
                        return;
                }

                await markCompletionNotificationSent();
                console.log(`Completion notification sent to ${NOTIFY_EMAIL}`);
        } catch (error) {
                console.error('Completion notification error:', error);
        }
}

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

        // Report remaining work and send one-shot email when the whole queue is finished.
        const { count: remainingPending } = await supabase
            .from('listing_images')
            .select('id', { count: 'exact', head: true })
            .eq('enhancement_status', 'pending');

        const { count: remainingProcessing } = await supabase
            .from('listing_images')
            .select('id', { count: 'exact', head: true })
            .eq('enhancement_status', 'processing');

        const { count: totalCompleted } = await supabase
            .from('listing_images')
            .select('id', { count: 'exact', head: true })
            .eq('enhancement_status', 'completed');

        const { count: totalFailed } = await supabase
            .from('listing_images')
            .select('id', { count: 'exact', head: true })
            .eq('enhancement_status', 'failed');

        const pendingCount = remainingPending ?? 0;
        const processingCount = remainingProcessing ?? 0;

        if (pendingCount === 0 && processingCount === 0) {
            await notifyEnhancementComplete(totalCompleted ?? 0, totalFailed ?? 0);
        } else {
            await resetCompletionNotificationFlag();
        }

        return new Response(
            JSON.stringify({
                message: `Processed ${pending.length} images`,
                successCount,
                failCount,
                recovered,
                remainingPending: pendingCount,
                remainingProcessing: processingCount,
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
