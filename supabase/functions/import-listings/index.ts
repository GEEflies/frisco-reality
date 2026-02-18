/**
 * Import Listings Edge Function
 * 
 * Imports listings from United Classified API and queues images for enhancement
 * 
 * Usage: POST /functions/v1/import-listings
 * Body: { officeData: UCOfficeData } - UC API data structure
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const categoryLabels: Record<number, string> = {
    11: '1-izbovy byt',
    12: '2-izbovy byt',
    13: '3-izbovy byt',
    14: '4-izbovy byt',
    15: '5-izbovy byt',
    20: 'rodinny dom',
    21: 'vila',
    27: 'chata',
    46: 'kancelaria',
    47: 'obchodny priestor',
};

const transactionLabels: Record<number, string> = {
    123: 'prenajom',
    124: 'prenajom',
    127: 'predaj',
};

function sluggify(text: string): string {
    const charMap: Record<string, string> = {
        'á': 'a', 'ä': 'a', 'č': 'c', 'ď': 'd', 'é': 'e', 'í': 'i', 'ĺ': 'l', 'ľ': 'l',
        'ň': 'n', 'ó': 'o', 'ô': 'o', 'ŕ': 'r', 'š': 's', 'ť': 't', 'ú': 'u', 'ý': 'y', 'ž': 'z'
    };

    return text
        .toString()
        .toLowerCase()
        .split('')
        .map(char => charMap[char] || char)
        .join('')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-');
}

function createSlug(ad: UCAdvertisement): string {
    const transaction = transactionLabels[ad.transaction] || 'detail';
    const category = categoryLabels[ad.category] || 'nehnutelnost';
    const base = `${transaction} ${category} ${ad.title}`.trim();
    return `${sluggify(base)}-${ad.source_id}`;
}

interface UCAdvertisement {
    source_id: string;
    category: number;
    transaction: number;
    title: string;
    description?: string;
    price: number;
    usable_area?: number;
    building_area?: number;
    land_area?: number;
    street?: string;
    geo_point?: { lat: string; lon: string };
    real_estate_state?: number;
    floor?: number;
    rooms_count?: number;
    year_of_construction?: number;
    ownership?: number;
    building_type?: number[];
    estate_equipment?: number[];
    heating_system?: number[];
    location?: {
        state_id: number;
        county_id: number;
        district_id: number;
        region_id: number;
    };
    images?: { url: string }[];
}

Deno.serve(async (req) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const { officeData } = await req.json();

        if (!officeData?.user_data) {
            throw new Error('Invalid data structure: officeData.user_data required');
        }

        // Initialize Supabase client
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        const supabase = createClient(supabaseUrl, supabaseKey);

        const results = {
            imported: 0,
            updated: 0,
            images_queued: 0,
            errors: [] as string[],
        };

        // Process each user's advertisements
        for (const userData of officeData.user_data) {
            for (const ad of userData.advertisements as UCAdvertisement[]) {
                try {
                    // Map UC data to our schema
                    const listingData = {
                        uc_source_id: ad.source_id,
                        title: ad.title,
                        description: ad.description || null,
                        price: ad.price || 0,
                        currency: 'EUR',
                        category_id: ad.category,
                        transaction_id: ad.transaction,
                        usable_area: ad.usable_area || null,
                        land_area: ad.land_area || null,
                        building_area: ad.building_area || null,
                        rooms_count: ad.rooms_count || null,
                        floor: ad.floor || null,
                        year_of_construction: ad.year_of_construction || null,
                        street: ad.street || null,
                        slug: createSlug(ad),
                        geo_lat: ad.geo_point?.lat || null,
                        geo_lon: ad.geo_point?.lon || null,
                        status: 'active',
                        real_estate_state: ad.real_estate_state || null,
                        ownership: ad.ownership || null,
                        building_type: ad.building_type || null,
                        heating_system: ad.heating_system || null,
                        estate_equipment: ad.estate_equipment || null,
                        // TODO: Map location IDs to region/district names
                        location_region: null,
                        location_district: null,
                        location_city: null,
                    };

                    // Upsert listing
                    const { data: listing, error: listingError } = await supabase
                        .from('listings')
                        .upsert(listingData, {
                            onConflict: 'uc_source_id',
                            ignoreDuplicates: false,
                        })
                        .select()
                        .single();

                    if (listingError) {
                        results.errors.push(`Listing ${ad.source_id}: ${listingError.message}`);
                        continue;
                    }

                    results.imported++;

                    // Import images
                    if (ad.images && ad.images.length > 0) {
                        for (let i = 0; i < ad.images.length; i++) {
                            const img = ad.images[i];

                            // Check if image already exists
                            const { data: existingImage } = await supabase
                                .from('listing_images')
                                .select('id')
                                .eq('listing_id', listing.id)
                                .eq('original_url', img.url)
                                .single();

                            if (!existingImage) {
                                const { error: imageError } = await supabase
                                    .from('listing_images')
                                    .insert({
                                        listing_id: listing.id,
                                        original_url: img.url,
                                        sort_order: i,
                                        enhancement_status: 'pending',
                                    });

                                if (!imageError) {
                                    results.images_queued++;
                                }
                            }
                        }
                    }

                } catch (adError) {
                    results.errors.push(`Ad ${ad.source_id}: ${adError.message}`);
                }
            }
        }

        return new Response(JSON.stringify({
            success: true,
            results,
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error('Import error:', error);

        return new Response(JSON.stringify({
            success: false,
            error: error.message,
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
});
