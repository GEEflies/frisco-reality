/**
 * Process Pending Images Edge Function
 * 
 * Triggered by cron job or manually to process pending image enhancements
 * 
 * Usage: POST /functions/v1/process-images
 * Body: { limit?: number } - Optional limit (default: 5)
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const { limit = 5 } = await req.json().catch(() => ({}));

        // Initialize Supabase client
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Get pending images
        const { data: pendingImages, error: queryError } = await supabase
            .from('listing_images')
            .select('id')
            .eq('enhancement_status', 'pending')
            .order('created_at', { ascending: true })
            .limit(limit);

        if (queryError) {
            throw new Error(`Query failed: ${queryError.message}`);
        }

        if (!pendingImages || pendingImages.length === 0) {
            return new Response(JSON.stringify({
                success: true,
                message: 'No pending images to process',
                processed: 0,
            }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

        // Process each image by calling the enhance-image function
        const results = [];

        for (const image of pendingImages) {
            try {
                const enhanceResponse = await fetch(`${supabaseUrl}/functions/v1/enhance-image`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${supabaseKey}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ imageId: image.id }),
                });

                const result = await enhanceResponse.json();
                results.push({
                    imageId: image.id,
                    success: result.success,
                    error: result.error,
                });
            } catch (enhanceError) {
                results.push({
                    imageId: image.id,
                    success: false,
                    error: enhanceError.message,
                });
            }
        }

        const successCount = results.filter(r => r.success).length;

        return new Response(JSON.stringify({
            success: true,
            processed: results.length,
            successful: successCount,
            failed: results.length - successCount,
            details: results,
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error('Process images error:', error);

        return new Response(JSON.stringify({
            success: false,
            error: error.message,
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
});
