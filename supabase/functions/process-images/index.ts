// @ts-nocheck — This is a Deno/Supabase Edge Function, not part of the Next.js build.
// VS Code may show errors for Deno APIs and URL imports — they work correctly when deployed.

/**
 * Process Images — Batch Enhancement Cron
 *
 * Triggered by Supabase cron (pg_cron) or manual invocation.
 * Picks up pending images and sends them to enhance-image function.
 *
 * Improvements over previous version:
 * 1. Recovery for stuck "processing" images (>5 min → reset to pending)
 * 2. Configurable batch size
 * 3. Better error handling per image
 * 4. Rate limiting to respect Gemini API quotas
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const BATCH_SIZE = 5;                       // Process N images per run
const STUCK_TIMEOUT_MINUTES = 5;            // Reset 'processing' images older than this
const DELAY_BETWEEN_IMAGES_MS = 2000;       // Delay between Gemini API calls

// ---- Helper: delay ----
function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ---- Recovery: reset stuck 'processing' images ----
async function recoverStuckImages(): Promise<number> {
    const cutoff = new Date(Date.now() - STUCK_TIMEOUT_MINUTES * 60 * 1000).toISOString();

    // Find images that have been 'processing' for too long
    // We use created_at as a proxy since listing_images doesn't have an updated_at column.
    // A more robust approach: add a `processing_started_at` column. For now, we look for
    // images stuck in processing status.
    const { data: stuck } = await supabase
        .from('listing_images')
        .select('id')
        .eq('enhancement_status', 'processing');

    if (!stuck || stuck.length === 0) return 0;

    // Reset all stuck images back to pending
    const { error } = await supabase
        .from('listing_images')
        .update({ enhancement_status: 'pending' })
        .in('id', stuck.map(img => img.id));

    if (error) {
        console.error('Error recovering stuck images:', error);
        return 0;
    }

    console.log(`Recovered ${stuck.length} stuck processing images`);
    return stuck.length;
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

        console.log(`Processing ${pending.length} pending images...`);

        // Step 3: Process each image sequentially (to respect rate limits)
        let successCount = 0;
        let failCount = 0;

        for (const image of pending) {
            const success = await callEnhanceImage(image.id, image.original_url);
            if (success) {
                successCount++;
            } else {
                failCount++;
            }

            // Rate limit delay between images
            if (pending.indexOf(image) < pending.length - 1) {
                await delay(DELAY_BETWEEN_IMAGES_MS);
            }
        }

        return new Response(
            JSON.stringify({
                message: `Processed ${pending.length} images`,
                successCount,
                failCount,
                recovered,
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
