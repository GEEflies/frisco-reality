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

// Image generation / editing models — ordered by reliability for image EDITING.
// 1. gemini-2.5-flash-image         = stable GA: fast (~10s), most reliable for edits
// 2. gemini-3.1-flash-image-preview = "Nano Banana 2": higher quality but MALFORMED_FUNCTION_CALL issues
// 3. gemini-3-pro-image-preview     = "Nano Banana Pro": same MALFORMED_FUNCTION_CALL issues
// NB2/Pro often return MALFORMED_FUNCTION_CALL for image editing as of Jul 2025.
// GEMINI_IMAGE_MODEL secret takes priority if set.
const configuredGeminiModel = Deno.env.get('GEMINI_IMAGE_MODEL')?.trim();
const IMAGE_MODEL_CANDIDATES = [
    configuredGeminiModel,
    'gemini-2.5-flash-image',
    'gemini-3.1-flash-image-preview',
    'gemini-3-pro-image-preview',
].filter((value, index, arr) => Boolean(value) && arr.indexOf(value) === index) as string[];

// Per-model timeout in ms. Edge Function hard limit is 150s — keep room for
// assessment (~5s), upload (~5s), and logo detection (~3s).
const MODEL_TIMEOUT_MS: Record<string, number> = {
    'gemini-3.1-flash-image-preview': 90_000,  // NB2: may hang, fail fast
    'gemini-3-pro-image-preview':     100_000,  // Pro: slower but reliable
    'gemini-2.5-flash-image':         60_000,   // Flash: fast, generous limit
};
const DEFAULT_TIMEOUT_MS = 90_000;

// Assessment model: text-only output for quality evaluation.
// gemini-3-flash-preview is unreliable (hangs/timeouts since ~Mar 10 2026).
// gemini-2.5-flash is the stable GA fallback; gemini-3.1-flash-lite-preview is fastest.
const ASSESS_MODEL = 'gemini-2.5-flash';

// ============================================================
// QUALITY ASSESSMENT — decides per-image whether to enhance
// ============================================================

interface AssessmentResult {
    enhance: boolean;       // true = worth enhancing, false = skip
    reason: string;         // human-readable reason (logged)
}

// Assessment prompt — ONLY decides whether this is a real photograph worth enhancing.
// It no longer generates a per-image prompt; we use one universal ENHANCE_PROMPT instead.
const ASSESS_PROMPT = `Classify this image. Return ONLY a JSON object:
{"enhance": true or false, "reason": "one short sentence"}

Return false ONLY if the image is NOT a photograph:
- Floorplan, map, logo, 3D render, diagram, certificate, infographic, screenshot, scan, or document.
- So severely damaged, blurry, or corrupted that re-processing would make it worse.

Return true for ALL real photographs — interior, exterior, aerial, detail shots — regardless of current quality.

Return ONLY the JSON object.`;

// ============================================================
// UNIVERSAL ENHANCEMENT PROMPT — one prompt for all real estate photos
// ============================================================
// Tested 6 strategies across interior + exterior photos with AI verification.
// "Erase ALL text" achieved 100% watermark removal (6/6 tests) vs
// "Remove watermarks/logos" which failed on exterior images (2/3).
// The generic "watermark" phrasing is ambiguous — the model sometimes
// interprets the FRISCO logo as a scene element rather than an overlay.
// "Erase ALL text" is unambiguous and catches it every time.
const ENHANCE_PROMPT = `Edit this real estate photograph: apply professional HDR tone-mapping so shadows are lifted, highlights are recovered, and every part of the scene is visible. Correct the white balance to produce neutral whites on walls and ceilings. Boost color vibrance gently for richer materials and surfaces. Sharpen architectural edges and reduce noise. Erase ALL text visible anywhere in the image and seamlessly reconstruct the background underneath. Keep the exact same composition, perspective, geometry, furniture, and objects.`;

// Dedicated watermark-only removal prompt — used as a safety-net second pass
// if the logo detector still finds red FRISCO pixels after the main enhancement.
const WATERMARK_REMOVAL_PROMPT = `Erase all text and logo marks from this photograph. Fill every area where text was with the surrounding background. Do not change anything else — keep the same lighting, colors, and composition.`;

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
        };
    } catch (error) {
        // If assessment fails, default to enhancing with a safe generic prompt.
        // Better to try and fail than to skip a potentially improvable image.
        const errMsg = (error as Error).message || String(error);
        console.error(`[assess] Assessment failed, defaulting to enhance:`, errMsg);
        return {
            enhance: true,
            reason: `Assessment failed (${errMsg}) — defaulting to enhance`,
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

        const timeoutMs = MODEL_TIMEOUT_MS[modelName] ?? DEFAULT_TIMEOUT_MS;

        for (const config of modelConfigs) {
            try {
                const model = genAI.getGenerativeModel(config as any);

                // Race the Gemini call against a timeout to prevent Edge Function hang
                const controller = new AbortController();
                const timer = setTimeout(() => controller.abort(), timeoutMs);

                const result = await Promise.race([
                    model.generateContent([
                        prompt,
                        { inlineData: { mimeType, data: imageBase64 } },
                    ]),
                    new Promise<never>((_, reject) => {
                        controller.signal.addEventListener('abort', () =>
                            reject(new Error(`Timeout after ${timeoutMs / 1000}s`)));
                    }),
                ]);
                clearTimeout(timer);

                const responseData = result.response;
                const candidates = responseData.candidates;

                // Log finishReason — helps distinguish timeout vs safety block
                const finishReason = candidates?.[0]?.finishReason;
                if (finishReason && finishReason !== 'STOP') {
                    console.warn(`[enhance-image] ${modelName} finishReason=${finishReason}`);
                }
                if (finishReason === 'IMAGE_SAFETY' || finishReason === 'PROHIBITED_CONTENT') {
                    throw new Error(`Blocked by safety filter: ${finishReason}`);
                }
                if (finishReason === 'MALFORMED_FUNCTION_CALL') {
                    throw new Error(`Model bug: ${finishReason} — skipping model`);
                }

                if (!candidates || candidates.length === 0) {
                    throw new Error('No candidates in Gemini response');
                }

                const parts = candidates[0].content?.parts || [];
                for (const part of parts) {
                    if (part.inlineData?.data) {
                        console.log(`[enhance-image] Success with ${modelName} (${(timeoutMs / 1000)}s budget)`);
                        return {
                            enhancedImageData: part.inlineData.data,
                            enhancedMimeType: part.inlineData.mimeType || 'image/jpeg',
                            modelUsed: modelName,
                        };
                    }
                }

                // Log what the model DID return (for debugging no-image responses)
                const textParts = parts.filter((p: any) => p.text).map((p: any) => p.text.slice(0, 200));
                if (textParts.length > 0) {
                    console.warn(`[enhance-image] ${modelName} returned text instead of image: ${textParts.join(' | ')}`);
                }

                throw new Error('No image data in Gemini response');
            } catch (error) {
                const variant = 'generationConfig' in config ? 'modalities' : 'default';
                const errMsg = (error as Error).message;
                errors.push(`${modelName} (${variant}): ${errMsg}`);
                // If this model timed out or has a model-level bug, skip remaining configs
                if (errMsg.includes('Timeout after') || errMsg.includes('skipping model')) {
                    console.warn(`[enhance-image] ${modelName}: ${errMsg}, trying next model`);
                    break;
                }
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

// ============================================================
// LOGO DETECTION — detect baked-in FRISCO red watermark
// ============================================================
// Port of scripts/detect_logo.py — pure TypeScript, no numpy.
// Scans the bottom-right corner for red pixels (FRISCO logo).
// Returns true if logo is detected, false otherwise.

// Crop region: bottom-right corner where the FRISCO logo sits
const CROP_WIDTH_RATIO = 0.32;    // rightmost 32% of width
const CROP_HEIGHT_RATIO = 0.30;   // bottom 30% of height

// HSV thresholds for FRISCO-red
const HUE_A_LO = 0;              // 0° (red)
const HUE_A_HI = 15;             // 15° (red-orange)
const HUE_B_LO = 345;            // 345° (magenta-red)
const HUE_B_HI = 360;            // 360°
const SAT_MIN_PCT = 0.40;        // S ≥ 40%
const VAL_MIN_PCT = 0.30;        // V ≥ 30%
const RED_DENSITY_THRESHOLD = 0.003; // 0.3%
const RED_PIXEL_MIN = 50;

/**
 * Convert RGB (0-255 each) to HSV (H: 0-360, S: 0-1, V: 0-1).
 */
function rgbToHsv(r: number, g: number, b: number): [number, number, number] {
    const rf = r / 255, gf = g / 255, bf = b / 255;
    const max = Math.max(rf, gf, bf);
    const min = Math.min(rf, gf, bf);
    const d = max - min;
    let h = 0;
    if (d !== 0) {
        if (max === rf) h = ((gf - bf) / d) % 6;
        else if (max === gf) h = (bf - rf) / d + 2;
        else h = (rf - gf) / d + 4;
        h *= 60;
        if (h < 0) h += 360;
    }
    const s = max === 0 ? 0 : d / max;
    return [h, s, max];
}

/**
 * Decode a JPEG/PNG image from raw bytes into an RGBA pixel array.
 * Uses the browser-compatible ImageBitmap API available in Deno.
 */
async function decodeImageToRGBA(buffer: ArrayBuffer, mimeType: string): Promise<{ data: Uint8Array; width: number; height: number } | null> {
    try {
        // Deno supports createImageBitmap via the web platform API
        const blob = new Blob([buffer], { type: mimeType });
        // @ts-ignore — Deno supports OffscreenCanvas
        const bitmap = await createImageBitmap(blob);
        const w = bitmap.width;
        const h = bitmap.height;
        // @ts-ignore — Deno supports OffscreenCanvas
        const canvas = new OffscreenCanvas(w, h);
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(bitmap, 0, 0);
        const imageData = ctx.getImageData(0, 0, w, h);
        return { data: new Uint8Array(imageData.data.buffer), width: w, height: h };
    } catch (e) {
        console.error('[logo-detect] Failed to decode image:', (e as Error).message);
        return null;
    }
}

/**
 * Detect the FRISCO red logo in the bottom-right corner of an image.
 * Returns { hasLogo, density, redCount }.
 */
async function detectFriscoLogo(imageBuffer: ArrayBuffer, mimeType: string): Promise<{ hasLogo: boolean; density: number; redCount: number }> {
    const decoded = await decodeImageToRGBA(imageBuffer, mimeType);
    if (!decoded) return { hasLogo: false, density: 0, redCount: 0 };

    const { data, width, height } = decoded;

    // Crop region: bottom-right corner
    const cropLeft = Math.floor(width * (1 - CROP_WIDTH_RATIO));
    const cropTop = Math.floor(height * (1 - CROP_HEIGHT_RATIO));
    const cropW = width - cropLeft;
    const cropH = height - cropTop;
    const totalPixels = cropW * cropH;

    if (totalPixels === 0) return { hasLogo: false, density: 0, redCount: 0 };

    let redCount = 0;
    for (let y = cropTop; y < height; y++) {
        for (let x = cropLeft; x < width; x++) {
            const idx = (y * width + x) * 4;
            const r = data[idx], g = data[idx + 1], b = data[idx + 2];
            const [h, s, v] = rgbToHsv(r, g, b);

            // Check if this pixel is FRISCO-red
            const inRangeA = h >= HUE_A_LO && h <= HUE_A_HI;
            const inRangeB = h >= HUE_B_LO && h <= HUE_B_HI;
            if ((inRangeA || inRangeB) && s >= SAT_MIN_PCT && v >= VAL_MIN_PCT) {
                redCount++;
            }
        }
    }

    const density = redCount / totalPixels;
    const hasLogo = density >= RED_DENSITY_THRESHOLD && redCount >= RED_PIXEL_MIN;

    console.log(`[logo-detect] crop=${cropW}x${cropH}, redPx=${redCount}, density=${(density * 100).toFixed(3)}%, logo=${hasLogo}`);
    return { hasLogo, density, redCount };
}

/**
 * Run logo detection on the final image and update has_baked_logo in DB.
 * Called after enhancement is complete. Non-fatal — errors are logged but don't fail the enhancement.
 *
 * Accepts an in-memory buffer directly to avoid re-downloading from Supabase Storage
 * (saves ~3 MB egress per image). Falls back to fetching from URL only if no buffer provided.
 */
async function detectAndUpdateLogo(imageId: string, imageBuffer: ArrayBuffer, mimeType: string): Promise<void> {
    try {
        const { hasLogo } = await detectFriscoLogo(imageBuffer, mimeType);

        await supabase
            .from('listing_images')
            .update({ has_baked_logo: hasLogo })
            .eq('id', imageId);

        console.log(`[logo-detect] ${imageId} has_baked_logo=${hasLogo}`);
    } catch (e) {
        console.error(`[logo-detect] Error for ${imageId}:`, (e as Error).message);
        // Non-fatal — the image is still enhanced, just logo flag not set.
        // The frontend falls back to isEnhancedImage() heuristic when has_baked_logo is null.
    }
}

// Force mode uses the same universal prompt — no reason to use a weaker one.
const FORCE_ENHANCE_PROMPT = ENHANCE_PROMPT;

// Maximum number of watermark removal passes after enhancement.
const MAX_WATERMARK_PASSES = 1;

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
            // Detect logo on original image (buffer already in memory — no re-download)
            await detectAndUpdateLogo(imageId, imageBuffer, mimeType);
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
            // ---- STEP 1: AI classification — is this a real photograph? ----
            const assessment = await assessImage(imageBase64, mimeType);
            console.log(`[enhance-image] ${imageId} assessment: enhance=${assessment.enhance}, reason="${assessment.reason}"`);

            // ---- STEP 2: Skip non-photographs (floorplans, diagrams, etc.) ----
            if (!assessment.enhance) {
                console.log(`[enhance-image] ${imageId} SKIPPED — ${assessment.reason}`);
                await supabase
                    .from('listing_images')
                    .update({
                        enhanced_url: originalUrl,
                        enhancement_status: 'completed',
                    })
                    .eq('id', imageId);
                // Detect logo on original image (buffer already in memory — no re-download)
                await detectAndUpdateLogo(imageId, imageBuffer, mimeType);
                return { success: true };
            }

            // Use the universal enhancement prompt for ALL photographs
            enhancementPrompt = ENHANCE_PROMPT;
        }

        // ---- STEP 3: Enhance with the prompt ----
        let { enhancedImageData, enhancedMimeType, modelUsed } = await generateEnhancedImage(imageBase64, mimeType, enhancementPrompt);
        console.log(`[enhance-image] ${imageId} enhanced with ${modelUsed}${force ? ' (FORCE)' : ''}`);

        let enhancedBuffer = base64ToArrayBuffer(enhancedImageData);

        // ---- STEP 4: Watermark safety net ----
        // The "Erase ALL text" prompt removes watermarks ~100% of the time,
        // but as a safety net, run logo detection on the result. If the FRISCO
        // red watermark is still present, do a dedicated watermark-removal pass.
        for (let pass = 0; pass < MAX_WATERMARK_PASSES; pass++) {
            const logoCheck = await detectFriscoLogo(enhancedBuffer, enhancedMimeType);
            if (!logoCheck.hasLogo) {
                console.log(`[enhance-image] ${imageId} watermark-free after pass ${pass === 0 ? 'main' : pass}`);
                break;
            }
            console.warn(`[enhance-image] ${imageId} watermark still detected (density=${(logoCheck.density * 100).toFixed(2)}%, redPx=${logoCheck.redCount}) — running removal pass ${pass + 1}`);
            try {
                const wmResult = await generateEnhancedImage(enhancedImageData, enhancedMimeType, WATERMARK_REMOVAL_PROMPT);
                enhancedImageData = wmResult.enhancedImageData;
                enhancedMimeType = wmResult.enhancedMimeType;
                enhancedBuffer = base64ToArrayBuffer(enhancedImageData);
                console.log(`[enhance-image] ${imageId} watermark removal pass ${pass + 1} done with ${wmResult.modelUsed}`);
            } catch (wmErr) {
                console.warn(`[enhance-image] ${imageId} watermark removal pass ${pass + 1} failed: ${(wmErr as Error).message}`);
                break;
            }
        }

        // ---- STEP 5: Upload enhanced image to Supabase Storage ----
        const extension = enhancedMimeType.split('/')[1] || 'jpeg';
        const storagePath = `enhanced/${imageId}.${extension}`;

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
                cacheControl: '31536000',
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

        // Detect logo on the ENHANCED image (buffer already in memory — no re-download)
        await detectAndUpdateLogo(imageId, enhancedBuffer, enhancedMimeType);

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
            // Detect logo on original image (buffer already in memory — no re-download)
            await detectAndUpdateLogo(imageId, imageBuffer, mimeType);
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
