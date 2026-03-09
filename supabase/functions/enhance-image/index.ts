// @ts-nocheck — This is a Deno/Supabase Edge Function, not part of the Next.js build.
// VS Code may show errors for Deno APIs and URL imports — they work correctly when deployed.

/**
 * Image Enhancement Edge Function
 *
 * Uses Google Gemini to enhance real estate photos.
 * Called by process-images for each pending image.
 *
 * Flow per image:
 * 1. Download the original image
 * 2. ASSESS quality with Gemini vision — is enhancement worth doing?
 * 3. If yes, Gemini returns a tailored enhancement prompt for THIS specific image
 * 4. Apply the enhancement with the image generation model
 * 5. Upload the result to Supabase Storage
 *
 * The AI decides per-image whether to enhance or skip based on:
 *   - Current quality (lighting, exposure, noise, sharpness, colors)
 *   - Whether enhancement would improve or ruin the image
 *   - Whether it's a photograph at all (floorplans, logos → skip)
 *   - Whether it's already high quality (don't fix what isn't broken)
 *   - Whether it's so poor that no enhancement can save it
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { GoogleGenerativeAI } from 'https://esm.sh/@google/generative-ai@0.21.0';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')!;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ---- Gemini setup ----
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Image generation / editing models — these are the native image generation models.
// gemini-3.1-flash-image-preview = "Nano Banana 2": high-efficiency, speed-optimized, Feb 2026
// gemini-3-pro-image-preview     = "Nano Banana Pro": state-of-the-art quality, latest
// GEMINI_IMAGE_MODEL secret takes priority.
const configuredGeminiModel = Deno.env.get('GEMINI_IMAGE_MODEL')?.trim();
const IMAGE_MODEL_CANDIDATES = [
    configuredGeminiModel,
    'gemini-3.1-flash-image-preview',
    'gemini-3-pro-image-preview',
].filter((value, index, arr) => Boolean(value) && arr.indexOf(value) === index) as string[];

// gemini-3-flash-preview: "best model in the world for multimodal understanding"
// Used for quality assessment (text-only output). Dec 2025, latest Gemini 3 generation.
const ASSESS_MODEL = 'gemini-3-flash-preview';

// ============================================================
// QUALITY ASSESSMENT — decides per-image whether to enhance
// ============================================================

interface AssessmentResult {
    enhance: boolean;       // true = worth enhancing, false = skip
    reason: string;         // human-readable reason (logged)
    prompt: string | null;  // tailored enhancement prompt if enhance=true
}

const ASSESS_PROMPT = `You are an expert real estate photo editor evaluating whether this image would benefit from AI enhancement.

Analyze the image and return a JSON object with exactly these fields:
{
  "enhance": true or false,
  "reason": "one short sentence explaining your decision",
  "prompt": "specific enhancement instructions" or null
}

DECIDE "enhance": false (SKIP) ONLY if:
- It is NOT a photograph (floorplan, map, logo, 3D render, diagram, certificate, text overlay, infographic)
- It's a screenshot, scan, or document
- The image is so severely damaged, blurry, tiny, or corrupted that enhancement would make it worse

DECIDE "enhance": true for ALL real photographs, even high-quality ones. Reasons include:
- The image contains any watermark, logo, or text overlay that should be removed
- Dark rooms that need brighter, more balanced lighting
- Blown-out windows where the exterior is invisible
- Poor white balance (too blue, too yellow, too green)
- Dull, flat colors that need gentle vibrance
- Visible noise or grain that should be reduced
- Overcast exterior where sky and colors look lifeless
- Shadows that are too harsh or too dark
- Overall underexposure or overexposure
- Even if the photo is already high quality, enhance=true if it has a watermark/logo to remove

When "enhance" is true, write a "prompt" that is SPECIFIC to THIS image. Do NOT use generic instructions.
Describe exactly what adjustments this particular photo needs.
IMPORTANT: If the image contains any watermark, logo, or branded text overlay, ALWAYS include "Remove any watermarks, logos, or text overlays baked into the image." as the FIRST instruction in the prompt.
Always end the prompt with: "Do NOT add, remove, or move any objects. Do NOT add any new text or watermarks. Keep it photorealistic. Return ONLY the enhanced image."

When "enhance" is false, set "prompt" to null.

Return ONLY the JSON object, no markdown, no explanation outside of it.`;

async function assessImage(imageBase64: string, mimeType: string): Promise<AssessmentResult> {
    try {
        const model = genAI.getGenerativeModel({ model: ASSESS_MODEL });
        const result = await model.generateContent([
            ASSESS_PROMPT,
            { inlineData: { mimeType, data: imageBase64 } },
        ]);

        let text = result.response.text().trim();

        // Strip markdown code fences if present
        text = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '');

        const parsed = JSON.parse(text);

        return {
            enhance: parsed.enhance === true,
            reason: String(parsed.reason || 'No reason given'),
            prompt: parsed.enhance ? String(parsed.prompt || '') : null,
        };
    } catch (error) {
        // If assessment fails, default to enhancing with a safe generic prompt.
        // Better to try and fail than to skip a potentially improvable image.
        const errMsg = (error as Error).message || String(error);
        console.error(`[assess] Assessment failed, defaulting to enhance:`, errMsg);
        return {
            enhance: true,
            reason: `Assessment failed (${errMsg}) — defaulting to safe enhancement`,
            prompt: `Enhance this real estate photo. Remove any watermarks, logos, or text overlays baked into the image. Improve lighting and exposure for a balanced, well-lit result. Correct white balance for natural colors. Reduce noise. Sharpen details slightly. Do NOT add, remove, or move any objects. Do NOT add any new text or watermarks. Keep it photorealistic. Return ONLY the enhanced image.`,
        };
    }
}

// FIX #2: Chunked base64 conversion to avoid stack overflow on large images
function arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    const chunkSize = 8192;
    for (let i = 0; i < bytes.length; i += chunkSize) {
        const chunk = bytes.subarray(i, Math.min(i + chunkSize, bytes.length));
        binary += String.fromCharCode(...chunk);
    }
    return btoa(binary);
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
}

async function generateEnhancedImage(
    imageBase64: string,
    mimeType: string,
    prompt: string,
): Promise<{ enhancedImageData: string; enhancedMimeType: string; modelUsed: string }> {
    const errors: string[] = [];

    for (const modelName of IMAGE_MODEL_CANDIDATES) {
        const modelConfigs = [
            {
                model: modelName,
                generationConfig: {
                    // @ts-ignore — responseModalities and imageConfig are valid but not in all SDK type versions
                    responseModalities: ['IMAGE', 'TEXT'],
                    imageConfig: { imageSize: '2K' },
                },
            },
            {
                model: modelName,
                generationConfig: {
                    // @ts-ignore
                    imageConfig: { imageSize: '2K' },
                },
            },
            { model: modelName },
        ];

        for (const config of modelConfigs) {
            try {
                const model = genAI.getGenerativeModel(config as any);
                const result = await model.generateContent([
                    prompt,
                    {
                        inlineData: {
                            mimeType,
                            data: imageBase64,
                        },
                    },
                ]);

                const responseData = result.response;
                const candidates = responseData.candidates;
                if (!candidates || candidates.length === 0) {
                    throw new Error('No candidates in Gemini response');
                }

                const parts = candidates[0].content?.parts || [];
                for (const part of parts) {
                    if (part.inlineData?.data) {
                        return {
                            enhancedImageData: part.inlineData.data,
                            enhancedMimeType: part.inlineData.mimeType || 'image/jpeg',
                            modelUsed: modelName,
                        };
                    }
                }

                throw new Error('No image data in Gemini response');
            } catch (error) {
                const variant = 'generationConfig' in config ? 'modalities' : 'default';
                errors.push(`${modelName} (${variant}): ${(error as Error).message}`);
            }
        }
    }

    throw new Error(`All Gemini model attempts failed: ${errors.join(' | ')}`);
}

// ---- Detect MIME type from URL or default to JPEG ----
function getMimeType(url: string): string {
    const lower = url.toLowerCase();
    if (lower.includes('.png')) return 'image/png';
    if (lower.includes('.webp')) return 'image/webp';
    if (lower.includes('.gif')) return 'image/gif';
    return 'image/jpeg';
}

// Default prompt for force mode — focuses on watermark removal + gentle quality improvement.
// Uses generic wording (not "photo") so it works on floorplans, diagrams, and all image types.
const FORCE_ENHANCE_PROMPT = `Edit this image: remove any watermarks, logos, or semi-transparent text overlays that are stamped on it. Reconstruct the underlying image content where the watermark was. Make no other changes — keep everything else pixel-identical. Return ONLY the cleaned image.`;

// ---- Main enhancement logic ----
// force=true: skip AI quality assessment, always enhance (used to re-process skipped images)
async function enhanceImage(imageId: string, originalUrl: string, force = false): Promise<{ success: boolean; error?: string }> {
    try {
        // Download original image
        const response = await fetch(originalUrl);
        if (!response.ok) {
            throw new Error(`Failed to download image: ${response.status} ${response.statusText}`);
        }

        const imageBuffer = await response.arrayBuffer();
        const mimeType = getMimeType(originalUrl);

        // Check image size — skip if > 10MB (Gemini limit)
        if (imageBuffer.byteLength > 10 * 1024 * 1024) {
            console.warn(`Image ${imageId} too large (${(imageBuffer.byteLength / 1024 / 1024).toFixed(1)}MB), skipping enhancement`);
            // Mark as completed with original URL as enhanced (no enhancement needed)
            await supabase
                .from('listing_images')
                .update({
                    enhanced_url: originalUrl,
                    enhancement_status: 'completed',
                })
                .eq('id', imageId);
            return { success: true };
        }

        // Convert to base64
        const imageBase64 = arrayBufferToBase64(imageBuffer);

        let enhancementPrompt: string;

        if (force) {
            // Force mode: skip assessment, use watermark-removal prompt
            console.log(`[enhance-image] ${imageId} FORCE mode — skipping assessment, using watermark-removal prompt`);
            enhancementPrompt = FORCE_ENHANCE_PROMPT;
        } else {
            // ---- STEP 1: AI quality assessment — should we enhance this image? ----
            const assessment = await assessImage(imageBase64, mimeType);
            console.log(`[enhance-image] ${imageId} assessment: enhance=${assessment.enhance}, reason="${assessment.reason}"`);

            // ---- STEP 2: Skip if AI decided enhancement won't help ----
            if (!assessment.enhance) {
                console.log(`[enhance-image] ${imageId} SKIPPED — ${assessment.reason}`);
                await supabase
                    .from('listing_images')
                    .update({
                        enhanced_url: originalUrl,
                        enhancement_status: 'completed',
                    })
                    .eq('id', imageId);
                return { success: true };
            }

            enhancementPrompt = assessment.prompt!;
        }

        // ---- STEP 3: Enhance with the prompt ----
        const { enhancedImageData, enhancedMimeType, modelUsed } = await generateEnhancedImage(imageBase64, mimeType, enhancementPrompt);
        console.log(`[enhance-image] ${imageId} enhanced with ${modelUsed}${force ? ' (FORCE)' : ''}`);

        // Upload enhanced image to Supabase Storage
        const extension = enhancedMimeType.split('/')[1] || 'jpeg';
        const storagePath = `enhanced/${imageId}.${extension}`;
        const enhancedBuffer = base64ToArrayBuffer(enhancedImageData);

        // Auto-create bucket if it doesn't exist (first run)
        const { data: buckets } = await supabase.storage.listBuckets();
        if (!buckets?.find(b => b.name === 'enhanced-images')) {
            await supabase.storage.createBucket('enhanced-images', { public: true });
            console.log('[enhance-image] Created enhanced-images bucket');
        }

        const { error: uploadError } = await supabase.storage
            .from('enhanced-images')
            .upload(storagePath, enhancedBuffer, {
                contentType: enhancedMimeType,
                upsert: true,
            });

        if (uploadError) {
            throw new Error(`Storage upload failed: ${uploadError.message}`);
        }

        // Get public URL
        const { data: publicUrlData } = supabase.storage
            .from('enhanced-images')
            .getPublicUrl(storagePath);

        const enhancedUrl = publicUrlData.publicUrl;

        // Update DB
        await supabase
            .from('listing_images')
            .update({
                enhanced_url: enhancedUrl,
                enhancement_status: 'completed',
            })
            .eq('id', imageId);

        console.log(`Enhanced image ${imageId} with ${modelUsed} → ${enhancedUrl}`);
        return { success: true };

    } catch (error) {
        const errorMessage = (error as Error).message;
        console.error(`Enhancement failed for ${imageId}:`, errorMessage);

        // In force mode, if Gemini refuses to process (e.g. floorplans, diagrams),
        // accept the original URL as-is so the image doesn't stay stuck in failed state.
        if (force) {
            console.log(`[enhance-image] ${imageId} FORCE fallback — Gemini can't process, accepting original URL`);
            await supabase
                .from('listing_images')
                .update({
                    enhanced_url: originalUrl,
                    enhancement_status: 'completed',
                })
                .eq('id', imageId);
            return { success: true, fallback: true, reason: errorMessage };
        }

        // Increment retry_count so process-images knows how many attempts were made.
        // After 3 failures the image stays failed permanently and we fall back to
        // original_url on the frontend. Temporary failures (Gemini overload,
        // network blip) will be retried automatically on the next cron run.
        const { data: current } = await supabase
            .from('listing_images')
            .select('retry_count')
            .eq('id', imageId)
            .single();
        const retryCount = (current?.retry_count ?? 0) + 1;

        await supabase
            .from('listing_images')
            .update({ enhancement_status: 'failed', retry_count: retryCount })
            .eq('id', imageId);

        console.log(`[enhance-image] ${imageId} marked failed (attempt ${retryCount}/3)`);
        return { success: false, error: errorMessage };
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
        const url = new URL(req.url);
        const assessOnly = url.searchParams.get('assess-only') === '1';

        const { imageId, originalUrl, force } = await req.json();

        if (!imageId || !originalUrl) {
            return new Response(
                JSON.stringify({ error: 'Missing imageId or originalUrl' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } },
            );
        }

        // ---- Assess-only mode: return the AI assessment without enhancing ----
        if (assessOnly) {
            const response = await fetch(originalUrl);
            if (!response.ok) {
                return new Response(
                    JSON.stringify({ error: `Failed to download: ${response.status}` }),
                    { status: 400, headers: { 'Content-Type': 'application/json' } },
                );
            }
            const buf = await response.arrayBuffer();
            const mimeType = getMimeType(originalUrl);
            const base64 = arrayBufferToBase64(buf);
            const assessment = await assessImage(base64, mimeType);
            return new Response(
                JSON.stringify({ imageId, assessment }),
                { headers: { 'Content-Type': 'application/json' } },
            );
        }

        // Mark as processing
        await supabase
            .from('listing_images')
            .update({ enhancement_status: 'processing' })
            .eq('id', imageId);

        const result = await enhanceImage(imageId, originalUrl, force === true);

        return new Response(
            JSON.stringify(result),
            { status: result.success ? 200 : 500, headers: { 'Content-Type': 'application/json' } },
        );
    } catch (error) {
        console.error('enhance-image error:', error);
        return new Response(
            JSON.stringify({ error: (error as Error).message }),
            { status: 500, headers: { 'Content-Type': 'application/json' } },
        );
    }
});
