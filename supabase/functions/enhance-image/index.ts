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
 * 2. CLASSIFY it with a cheap Gemini text call (interior / exterior / skip)
 * 3. Apply the matching enhancement prompt (or skip non-photo images entirely)
 * 4. Upload the enhanced result to Supabase Storage
 *
 * Image categories:
 *   INTERIOR  → lighting, exposure, window pull, warm tones
 *   EXTERIOR  → sky, color, sharpness — gentle touch, no composition changes
 *   SKIP      → floorplans, maps, logos, 3D renders, text overlays — left as-is
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { GoogleGenerativeAI } from 'https://esm.sh/@google/generative-ai@0.21.0';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')!;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ---- Gemini setup ----
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Models that support image generation / editing (as of March 2026).
// configuredGeminiModel takes priority if set as a Supabase secret.
const configuredGeminiModel = Deno.env.get('GEMINI_IMAGE_MODEL')?.trim();
const IMAGE_MODEL_CANDIDATES = [
    configuredGeminiModel,
    'gemini-2.0-flash-exp',
    'gemini-2.0-flash',
    'gemini-1.5-flash',
].filter((value, index, arr) => Boolean(value) && arr.indexOf(value) === index) as string[];

// Cheap text model for classification (no image generation needed)
const CLASSIFY_MODEL = 'gemini-2.0-flash';

// ============================================================
// CLASSIFICATION
// ============================================================
type ImageCategory = 'interior' | 'exterior' | 'skip';

const CLASSIFY_PROMPT = `You are an image classifier for a real estate website.
Look at this image and classify it into EXACTLY ONE category.
Reply with a single word — nothing else.

INTERIOR — a photo taken INSIDE a building (room, kitchen, bathroom, hallway, staircase, garage interior, etc.)
EXTERIOR — a photo taken OUTSIDE showing the building exterior, garden, terrace, balcony view, street view, neighborhood, pool, parking lot, etc.
SKIP — anything that is NOT a photograph: floorplan, map, site plan, logo, text overlay, 3D render, infographic, sketch, diagram, certificate, or any computer-generated graphic

Reply with exactly one word: INTERIOR, EXTERIOR, or SKIP`;

async function classifyImage(imageBase64: string, mimeType: string): Promise<ImageCategory> {
    try {
        const model = genAI.getGenerativeModel({ model: CLASSIFY_MODEL });
        const result = await model.generateContent([
            CLASSIFY_PROMPT,
            { inlineData: { mimeType, data: imageBase64 } },
        ]);

        const text = result.response.text().trim().toUpperCase();
        if (text.includes('INTERIOR')) return 'interior';
        if (text.includes('EXTERIOR')) return 'exterior';
        if (text.includes('SKIP')) return 'skip';

        // If the model returned something unexpected, default to interior
        // (safest — interior prompt is the most conservative)
        console.warn(`[classify] Unexpected classification: "${text}", defaulting to interior`);
        return 'interior';
    } catch (error) {
        console.error(`[classify] Classification failed, defaulting to interior:`, (error as Error).message);
        return 'interior';
    }
}

// ============================================================
// ENHANCEMENT PROMPTS
// ============================================================
const INTERIOR_PROMPT = `Enhance this interior real estate photo for a luxury property listing.

Lighting & exposure:
- Brighten dark areas with natural-looking fill light
- Recover blown-out window highlights so the exterior view is visible
- Balance indoor and outdoor exposure (window pull)

Color:
- Correct white balance for neutral, true-to-life tones
- Slight warm shift for an inviting, premium feel
- Boost saturation gently — keep it realistic, never oversaturated

Cleanup:
- Reduce visible noise and grain
- Sharpen details slightly for a crisp result

IMPORTANT CONSTRAINTS:
- Do NOT add, remove, or move any objects, furniture, or people
- Do NOT add text, logos, watermarks, or borders
- Do NOT change the composition or perspective
- Keep the result photorealistic — it must look like a real photograph
- Return ONLY the enhanced image, nothing else`;

const EXTERIOR_PROMPT = `Enhance this exterior real estate photo for a luxury property listing.

Sky & atmosphere:
- If the sky is overcast or dull, make it slightly more appealing while keeping it realistic
- Ensure the building is well-lit and clearly visible

Color:
- Correct white balance for natural, true-to-life tones
- Boost greenery and landscape colors gently — keep realistic
- Ensure the building facade colors are accurate and vibrant

Cleanup:
- Reduce visible noise and grain
- Sharpen architectural details slightly for a crisp result

IMPORTANT CONSTRAINTS:
- Do NOT add, remove, or move any objects, cars, people, or landscaping
- Do NOT add text, logos, watermarks, or borders
- Do NOT change the composition, perspective, or camera angle
- Do NOT replace the sky entirely — only enhance what's there
- Keep the result photorealistic — it must look like a real photograph
- Return ONLY the enhanced image, nothing else`;

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
                    // @ts-ignore — responseModalities is valid but not in all SDK type versions
                    responseModalities: ['IMAGE', 'TEXT'],
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

// ---- Main enhancement logic ----
async function enhanceImage(imageId: string, originalUrl: string): Promise<{ success: boolean; error?: string }> {
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

        // ---- STEP 1: Classify the image ----
        const category = await classifyImage(imageBase64, mimeType);
        console.log(`[enhance-image] ${imageId} classified as: ${category}`);

        // ---- STEP 2: Skip non-photo images ----
        if (category === 'skip') {
            console.log(`[enhance-image] ${imageId} is a floorplan/map/graphic — skipping enhancement, keeping original`);
            await supabase
                .from('listing_images')
                .update({
                    enhanced_url: originalUrl,
                    enhancement_status: 'completed',
                })
                .eq('id', imageId);
            return { success: true };
        }

        // ---- STEP 3: Pick the right prompt ----
        const enhancementPrompt = category === 'exterior' ? EXTERIOR_PROMPT : INTERIOR_PROMPT;

        // ---- STEP 4: Call Gemini for enhancement ----
        const { enhancedImageData, enhancedMimeType, modelUsed } = await generateEnhancedImage(imageBase64, mimeType, enhancementPrompt);
        console.log(`[enhance-image] ${imageId} enhanced with ${modelUsed} (${category} prompt)`);

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

        // Mark as failed
        await supabase
            .from('listing_images')
            .update({ enhancement_status: 'failed' })
            .eq('id', imageId);

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
        const { imageId, originalUrl } = await req.json();

        if (!imageId || !originalUrl) {
            return new Response(
                JSON.stringify({ error: 'Missing imageId or originalUrl' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } },
            );
        }

        // Mark as processing
        await supabase
            .from('listing_images')
            .update({ enhancement_status: 'processing' })
            .eq('id', imageId);

        const result = await enhanceImage(imageId, originalUrl);

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
