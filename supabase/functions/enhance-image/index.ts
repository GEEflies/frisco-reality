/**
 * AI Image Enhancement Edge Function
 * 
 * Enhances real estate images using Nano Banana Pro (Gemini 3 Pro Image):
 * - HDR/color grading/lighting enhancement
 * - Native 4K upscaling (no need for external upscaling service)
 * - Professional real estate photo editing
 * 
 * Usage: POST /functions/v1/enhance-image
 * Body: { imageId: string } - ID from listing_images table
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { GoogleGenerativeAI } from 'https://esm.sh/@google/generative-ai@0.21.0';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// AI Enhancement Prompt - Natural, realistic enhancement
const ENHANCE_PROMPT = `You are an expert real estate photo editor. Apply the following professional enhancements for a NATURAL, REALISTIC result:

APPLY THESE ENHANCEMENTS (KEEP IT REALISTIC):
1. HDR MERGE: Lift shadows +3 stops, protect highlights from clipping, bright airy look
2. WINDOW CLARITY: Make windows clear and transparent to show what's outside naturally - if there's a view, show a realistic natural sky (light blue or white/gray depending on natural conditions). DO NOT add trees, fences, buildings, or any landscape elements that aren't actually visible.
3. WHITE BALANCE: Correct to 5500K neutral daylight, pure whites without color cast
4. PERSPECTIVE: Straighten all vertical and horizontal architectural lines
5. RELIGHTING: Even professional illumination, eliminate dark corners
6. RAW QUALITY: 4K ultra high definition, magazine print sharpness
7. COLOR CORRECTION: +15% saturation boost for vibrant natural colors

CRITICAL RULES - AVOID MISLEADING REAL ESTATE AGENTS:
- DO NOT add fake outdoor elements (trees, fences, gardens, buildings)
- Windows should show ONLY authentic sky - nothing more
- If there's no clear view, just show neutral sky or keep window as-is
- MAINTAIN THE EXACT ASPECT RATIO AND COMPOSITION OF THE ORIGINAL IMAGE
- DO NOT CROP OR RESIZE
- Keep the result natural and photorealistic

Output a professional real estate magazine quality image with authentic, non-misleading enhancement.`;

Deno.serve(async (req) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const { imageId } = await req.json();

        if (!imageId) {
            throw new Error('imageId is required');
        }

        // Initialize Supabase client
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Get image record
        const { data: imageRecord, error: fetchError } = await supabase
            .from('listing_images')
            .select('*')
            .eq('id', imageId)
            .single();

        if (fetchError || !imageRecord) {
            throw new Error(`Image not found: ${imageId}`);
        }

        // Update status to processing
        await supabase
            .from('listing_images')
            .update({ enhancement_status: 'processing' })
            .eq('id', imageId);

        // Fetch original image
        const imageResponse = await fetch(imageRecord.original_url);
        const imageBuffer = await imageResponse.arrayBuffer();
        const imageBase64 = btoa(String.fromCharCode(...new Uint8Array(imageBuffer)));
        const mimeType = imageResponse.headers.get('content-type') || 'image/jpeg';

        // Step 1: Enhance with Nano Banana Pro (Gemini 3 Pro Image) - outputs native 4K
        const geminiKey = Deno.env.get('GEMINI_API_KEY');
        if (!geminiKey) {
            throw new Error('GEMINI_API_KEY not configured');
        }

        const genAI = new GoogleGenerativeAI(geminiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-3-pro-image-preview' });

        const geminiResponse = await model.generateContent([
            ENHANCE_PROMPT,
            {
                inlineData: {
                    mimeType,
                    data: imageBase64,
                },
            },
        ], {
            generationConfig: {
                responseModalities: ['IMAGE'],
                imageConfig: {
                    aspectRatio: '16:9', // Adjust based on your needs
                    imageSize: '2K', // 2K output - cost optimized (~$0.13 per image vs $0.24 for 4K)
                },
            },
        });

        // Extract enhanced image from response
        const responseContent = geminiResponse.response;
        let enhancedBase64 = null;

        // Check for image in response parts
        const parts = responseContent.candidates?.[0]?.content?.parts || [];
        for (const part of parts) {
            if (part.inlineData?.data) {
                enhancedBase64 = part.inlineData.data;
                break;
            }
        }

        if (!enhancedBase64) {
            throw new Error('No enhanced image returned from Gemini');
        }

        // Upload enhanced image to storage
        const enhancedFileName = `enhanced/${imageId}.jpg`;
        const enhancedBuffer = Uint8Array.from(atob(enhancedBase64), c => c.charCodeAt(0));

        const { error: uploadError } = await supabase.storage
            .from('enhanced-images')
            .upload(enhancedFileName, enhancedBuffer, {
                contentType: 'image/jpeg',
                upsert: true,
            });

        if (uploadError) {
            throw new Error(`Upload failed: ${uploadError.message}`);
        }

        // Get public URL
        const { data: urlData } = supabase.storage
            .from('enhanced-images')
            .getPublicUrl(enhancedFileName);

        // Note: Replicate upscaling is now optional since Nano Banana Pro outputs native 4K
        // The code below is kept for backwards compatibility but can be removed
        // Step 2: Upscale with Replicate (DEPRECATED - Nano Banana Pro outputs 4K natively)
        let upscaledUrl = null;
        const replicateToken = Deno.env.get('REPLICATE_API_TOKEN');

        if (replicateToken) {
            try {
                const replicateResponse = await fetch('https://api.replicate.com/v1/predictions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Token ${replicateToken}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        version: '42fed1c4974146d4d2414e2be2c5277c7fcf05fcc3a73abf41610695738c1d7b',
                        input: {
                            image: urlData.publicUrl,
                            scale: 4,
                            face_enhance: false,
                        },
                    }),
                });

                const prediction = await replicateResponse.json();

                // Poll for completion (simplified - in production use webhooks)
                if (prediction.id) {
                    let attempts = 0;
                    while (attempts < 30) { // Max 30 seconds
                        await new Promise(resolve => setTimeout(resolve, 1000));

                        const statusResponse = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
                            headers: { 'Authorization': `Token ${replicateToken}` },
                        });
                        const status = await statusResponse.json();

                        if (status.status === 'succeeded' && status.output) {
                            upscaledUrl = status.output;
                            break;
                        } else if (status.status === 'failed') {
                            console.error('Replicate upscale failed');
                            break;
                        }
                        attempts++;
                    }
                }
            } catch (upscaleError) {
                console.error('Upscale error:', upscaleError);
                // Continue without upscaling
            }
        }

        // Update database with enhanced URLs
        const { error: updateError } = await supabase
            .from('listing_images')
            .update({
                enhanced_url: urlData.publicUrl,
                upscaled_url: upscaledUrl,
                enhancement_status: 'completed',
            })
            .eq('id', imageId);

        if (updateError) {
            throw new Error(`Database update failed: ${updateError.message}`);
        }

        return new Response(JSON.stringify({
            success: true,
            imageId,
            enhancedUrl: urlData.publicUrl,
            upscaledUrl,
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error('Enhancement error:', error);

        return new Response(JSON.stringify({
            success: false,
            error: error.message,
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
});
