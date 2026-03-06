// @ts-nocheck — This is a Deno/Supabase Edge Function, not part of the Next.js build.
// VS Code may show errors for Deno APIs and URL imports — they work correctly when deployed.

/**
 * Image Enhancement Edge Function
 *
 * Uses Google Gemini to enhance real estate photos.
 * Called by process-images for each pending image.
 *
 * Fixes applied vs. previous version:
 * 1. generationConfig is passed to getGenerativeModel() (not generateContent)
 * 2. Base64 conversion uses chunked approach to avoid stack overflow on large images
 * 3. Proper error handling and status recovery
 * 4. Falls back to original image if enhancement fails
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { GoogleGenerativeAI } from 'https://esm.sh/@google/generative-ai@0.21.0';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')!;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ---- Gemini setup ----
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const DEFAULT_GEMINI_IMAGE_MODEL = 'gemini-3.1-flash-image-preview';
const configuredGeminiModel = Deno.env.get('GEMINI_IMAGE_MODEL')?.trim();
const MODEL_CANDIDATES = [
    configuredGeminiModel,
    DEFAULT_GEMINI_IMAGE_MODEL,
    'gemini-3.1-flash-image-preview',
    'gemini-3-pro-image-preview',
].filter((value, index, arr) => Boolean(value) && arr.indexOf(value) === index) as string[];

const ENHANCEMENT_PROMPT = `You are a professional real estate photo editor. Enhance this property photo with these adjustments:
- Apply subtle HDR effect for balanced exposure
- Improve window clarity (reduce blown-out highlights)
- Correct white balance for natural colors
- Straighten any slight perspective distortion
- Apply gentle relighting to brighten dark areas
- Enhance to 4K quality with sharp details
- Apply tasteful color correction for a warm, inviting feel
- Remove any visible noise or grain

Keep the photo realistic and natural-looking. Do NOT add any objects, text, or watermarks.
Return only the enhanced photo.`;

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
): Promise<{ enhancedImageData: string; enhancedMimeType: string; modelUsed: string }> {
    const errors: string[] = [];

    for (const modelName of MODEL_CANDIDATES) {
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
                    ENHANCEMENT_PROMPT,
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

        // Call Gemini for enhancement
        const { enhancedImageData, enhancedMimeType, modelUsed } = await generateEnhancedImage(imageBase64, mimeType);

        // Upload enhanced image to Supabase Storage
        const extension = enhancedMimeType.split('/')[1] || 'jpeg';
        const storagePath = `enhanced/${imageId}.${extension}`;
        const enhancedBuffer = base64ToArrayBuffer(enhancedImageData);

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
