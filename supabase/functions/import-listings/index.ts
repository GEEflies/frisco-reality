// @ts-nocheck — This is a Deno/Supabase Edge Function, not part of the Next.js build.
// VS Code may show errors for Deno APIs and URL imports — they work correctly when deployed.

/**
 * UC Export API Webhook — Supabase Edge Function
 *
 * Receives POST from United Classifieds with listing/agent data.
 * Implements the Export API specification:
 * https://plt.unitedclassifieds.sk/import/docs/v1/realsoft/docs/export/intro
 *
 * POST body: { user, pass, action, data }
 *   action=1 → listing data (zákazka)
 *   action=2 → agent data (maklér)
 *   data     → JSON string with the actual payload
 *
 * Response: { code, importId, message, url }
 *   code=1  → added
 *   code=2  → edited
 *   code=3  → deleted
 *   code=10 → wrong login
 *   code=11 → missing data
 *   code=12 → wrong data
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// ---- Env ----
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const UC_WEBHOOK_USER = Deno.env.get('UC_WEBHOOK_USER')!;
const UC_WEBHOOK_PASS = Deno.env.get('UC_WEBHOOK_PASS')!;
const SITE_URL = Deno.env.get('SITE_URL') || 'https://frisco.sk';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ---- Response helpers ----
function jsonResponse(body: Record<string, any>, status = 200) {
    return new Response(JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json' },
    });
}

function errorResponse(code: number, message: string) {
    return jsonResponse({ code, message });
}

// ---- Slug generation ----
function sluggify(text: string): string {
    const diacriticsMap: Record<string, string> = {
        á: 'a', ä: 'a', č: 'c', ď: 'd', é: 'e', í: 'i', ĺ: 'l', ľ: 'l',
        ň: 'n', ó: 'o', ô: 'o', ŕ: 'r', š: 's', ť: 't', ú: 'u', ý: 'y',
        ž: 'z', Á: 'a', Ä: 'a', Č: 'c', Ď: 'd', É: 'e', Í: 'i', Ĺ: 'l',
        Ľ: 'l', Ň: 'n', Ó: 'o', Ô: 'o', Ŕ: 'r', Š: 's', Ť: 't', Ú: 'u',
        Ý: 'y', Ž: 'z', ö: 'o', ü: 'u', ß: 'ss',
    };
    return text
        .split('')
        .map(c => diacriticsMap[c] || c)
        .join('')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 120);
}

// ---- Parse request body ----
async function parseBody(req: Request): Promise<Record<string, any>> {
    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
        return await req.json();
    }

    if (contentType.includes('application/x-www-form-urlencoded')) {
        const text = await req.text();
        const params = new URLSearchParams(text);
        const body: Record<string, any> = {};
        for (const [key, value] of params.entries()) {
            body[key] = value;
        }
        // action may come as string from form data
        if (body.action) body.action = Number(body.action);
        return body;
    }

    // Try JSON as fallback
    try {
        return await req.json();
    } catch {
        const text = await req.text();
        const params = new URLSearchParams(text);
        const body: Record<string, any> = {};
        for (const [key, value] of params.entries()) {
            body[key] = value;
        }
        if (body.action) body.action = Number(body.action);
        return body;
    }
}

// ---- Extract boolean and extra fields from UC listing data ----
const EXTRA_DATA_KEYS = [
    // Features
    'balcony', 'loggia', 'terrace', 'cellar_place', 'storage_place', 'front_garden',
    'garage', 'garage_place', 'outdoor_parking', 'public_parking',
    'adv_sunny', 'adv_nice_view', 'adv_silence', 'adv_pool', 'adv_sauna', 'adv_fire',
    'adv_insulated_house', 'adv_winter_garden', 'adv_alcove',
    // Heating
    'heating_central', 'heating_floor', 'heating_local', 'heating_fire',
    'heating_emitters', 'heating_others', 'heating', 'heating_heat', 'access_klima',
    // Counts
    'balconies_count', 'loggies_count', 'terraces_count', 'cellars_count',
    'garages_count', 'garage_place_count', 'outdoor_parking_count', 'public_parking_count',
    'kitchens_count', 'toilets_count', 'pantries_count', 'wardrobes_count',
    // Equipment
    'equip_wardrobe', 'technical_room', 'store_room',
    'kitchen_sideboard', 'kitchen_cooker', 'kitchen_dishwasher', 'kitchen_fridge',
    'kitchen_microwave', 'kitchenette', 'kitchen_pantry',
    // Floors
    'floor_floating', 'floor_parquet', 'floor_paving', 'floor_coverings', 'floor_pvc', 'floor_concrete',
    // Walls & windows
    'wall_spatula', 'wall_plaster', 'wall_wallpapers',
    'window_plastic', 'window_wood', 'window_euro', 'window_al',
    // Bathroom
    'bath_clasic', 'bath_corner', 'bath_shower', 'bath_separe_toilet',
    // Security
    'security_door', 'security_alarm', 'security_sbs', 'security_cctv',
    // Connectivity
    'access_tv', 'access_satelite_tv', 'access_phone', 'access_skt',
    'access_internet', 'access_optical_internet', 'access_others',
    // Utilities
    'water_source', 'water', 'water_supply', 'water_well',
    'electricity_source', 'electricity', 'electricity_230', 'electricity_400',
    'gas_source', 'gas',
    'canalization_source', 'canalization', 'canalization_sink', 'canalization_septic', 'canalization_cov',
    'data_connection',
    // Surroundings
    'adv_shopping', 'adv_school', 'adv_hospital', 'adv_bus',
    'adv_workshop', 'adv_outfire', 'adv_fishing', 'adv_tourism',
    'adv_cycling', 'adv_muscle',
    // Construction details
    'lift', 'transition_room', 'ready_to_build', 'terrain',
    'plot_exploitation', 'plot_location', 'road', 'roof', 'roof_loft', 'roofing',
    'cellar', 'cellar_type', 'cellar_ratio', 'type_of_parking',
    // Misc
    'store_area', 'office_area', 'front_garden_area',
    'voluntary_auction', 'disclosure_date', 'execution_date', 'place',
    'first_inspection_date', 'second_inspection_date',
    'streetview', 'groundplan_id', 'momento',
    'dimension_width', 'dimension_height', 'dimension_length',
    'construction_begin', 'construction_end',
    'extended_herrys_projekt_developer', 'extended_herrys_projekt_aktualne',
];

function extractExtraData(data: Record<string, any>): Record<string, any> {
    const extra: Record<string, any> = {};
    for (const key of EXTRA_DATA_KEYS) {
        if (data[key] !== undefined && data[key] !== null) {
            extra[key] = data[key];
        }
    }
    return extra;
}

// ============================================================
// LISTING HANDLER (action=1)
// ============================================================
async function handleListing(data: Record<string, any>) {
    const objectId = data.object_id;
    if (!objectId) {
        return errorResponse(11, 'Missing object_id');
    }

    // ---- DELETE ----
    if (data.deleted === 1 || data.deleted === true || data.deleted === '1') {
        const { data: existing } = await supabase
            .from('listings')
            .select('id, slug')
            .eq('uc_object_id', objectId)
            .single();

        if (!existing) {
            return jsonResponse({ code: 4, message: 'Object not found' });
        }

        await supabase
            .from('listings')
            .update({ is_deleted: true, status: 5, updated_at: new Date().toISOString() })
            .eq('id', existing.id);

        return jsonResponse({
            code: 3,
            importId: existing.id,
            message: 'Object deleted',
            url: `${SITE_URL}/nehnutelnost/${existing.slug || existing.id}`,
        });
    }

    // ---- Validate required fields ----
    if (!data.title || !data.action || !data.category) {
        return errorResponse(11, 'Missing required fields: title, action, category');
    }

    // ---- Build listing row ----
    const slug = sluggify(`${data.title}-${objectId}`);
    const extraData = extractExtraData(data);

    const listingRow = {
        uc_object_id: objectId,
        agency_id: data.id || null,
        title: data.title,
        description: data.description || null,
        lang_data: data.langData || {},

        action: Number(data.action),
        category: Number(data.category),
        subcategory: data.subcategory ? Number(data.subcategory) : null,

        price: Number(data.price) || 0,
        price_unit: Number(data.price_unit) || 1,
        price_currency: Number(data.price_currency) || 1,
        price_by_agreement: data.price_by_agreement === 1 || data.price_by_agreement === true,
        price_energy: data.price_energy ? Number(data.price_energy) : null,
        price_note: data.price_note_public || null,
        unit_price: data.unit_price ? Number(data.unit_price) : null,
        guarantee: data.guarantee ? Number(data.guarantee) : null,

        state_id: data.state_id ? Number(data.state_id) : null,
        county_id: data.county_id ? Number(data.county_id) : null,
        district_id: data.district_id ? Number(data.district_id) : null,
        region_id: data.region_id ? Number(data.region_id) : null,
        citypart_id: data.citypart_id ? Number(data.citypart_id) : null,
        street_id: data.street_id ? Number(data.street_id) : null,
        street: data.street || null,
        street_number: data.street_number || null,
        geo_lat: data.gps_x ? Number(data.gps_x) : null,
        geo_lon: data.gps_y ? Number(data.gps_y) : null,
        // Use citypart_string for location_city if available, otherwise leave null
        location_city: data.citypart_string || null,
        location_district: null,  // Will be populated from UC code list in future
        location_region: null,

        usable_area: data.usable_area ? Number(data.usable_area) : null,
        building_area: data.building_area ? Number(data.building_area) : null,
        plot_area: data.plot_area ? Number(data.plot_area) : null,
        total_area: data.total_area ? Number(data.total_area) : null,

        rooms_count: data.rooms_count ? Number(data.rooms_count) : null,
        bathrooms_count: data.bathrooms_count ? Number(data.bathrooms_count) : null,
        floor: data.floor != null ? Number(data.floor) : null,
        floors: data.floors ? Number(data.floors) : null,
        floors_under: data.floors_under ? Number(data.floors_under) : null,
        placement: data.placement ? Number(data.placement) : null,
        equip_type: data.equip_type != null ? Number(data.equip_type) : null,

        condition: data.condition ? Number(data.condition) : null,
        age: data.age ? Number(data.age) : null,
        year_of_last_reconstruction: data.year_of_last_reconstruction ? Number(data.year_of_last_reconstruction) : null,
        year_of_building_approval: data.year_of_building_approval ? Number(data.year_of_building_approval) : null,
        building_type: data.building_type ? Number(data.building_type) : null,
        ownership: data.ownership ? Number(data.ownership) : null,
        energy_cert: data.energy_cert ? Number(data.energy_cert) : null,
        energy_rating: data.energy_rating ? Number(data.energy_rating) : null,
        orientation: data.orientation ? Number(data.orientation) : null,
        house_type: data.house_type ? Number(data.house_type) : null,

        status: Number(data.status) || 1,

        agent_id: data.agent_id || null,
        agent_name: data.agent || null,
        agent_email: data.agent_email || null,
        agent_phone: data.agent_phone || null,

        slug,

        is_top: data.top === 1 || data.top === true,
        is_exclusive: data.exclusive === 1 || data.exclusive === true,
        is_luxury: data.adv_luxury === 1 || data.adv_luxury === true,
        is_deleted: false,

        extra_data: extraData,
        medias: data.medias || {},
        updated_at: new Date().toISOString(),
    };

    // ---- Check if listing exists ----
    const { data: existing } = await supabase
        .from('listings')
        .select('id')
        .eq('uc_object_id', objectId)
        .single();

    let listingId: string;
    let responseCode: number;
    let responseMessage: string;

    if (existing) {
        // ---- UPDATE ----
        listingId = existing.id;
        responseCode = 2;
        responseMessage = 'Object edited';

        const { error } = await supabase
            .from('listings')
            .update(listingRow)
            .eq('id', listingId);

        if (error) {
            console.error('Listing update error:', error);
            return errorResponse(12, `Update failed: ${error.message}`);
        }
    } else {
        // ---- INSERT ----
        responseCode = 1;
        responseMessage = 'Object added';

        const { data: inserted, error } = await supabase
            .from('listings')
            .insert(listingRow)
            .select('id')
            .single();

        if (error || !inserted) {
            console.error('Listing insert error:', error);
            return errorResponse(12, `Insert failed: ${error?.message || 'unknown'}`);
        }
        listingId = inserted.id;
    }

    // ---- HANDLE IMAGES ----
    if (data.images && Array.isArray(data.images)) {
        await handleImages(listingId, data.images, !!existing);
    }

    return jsonResponse({
        code: responseCode,
        importId: listingId,
        message: responseMessage,
        url: `${SITE_URL}/nehnutelnost/${slug}`,
    });
}

// ============================================================
// IMAGE HANDLER
// ============================================================
async function handleImages(listingId: string, images: Array<{ url: string; changed: boolean }>, isUpdate: boolean) {
    if (isUpdate) {
        // Get existing images for this listing
        const { data: existingImages } = await supabase
            .from('listing_images')
            .select('id, original_url, enhanced_url, upscaled_url, enhancement_status')
            .eq('listing_id', listingId)
            .order('sort_order', { ascending: true });

        const existingByUrl = new Map(
            (existingImages || []).map(img => [img.original_url, img])
        );

        // Collect all incoming URLs to detect removed images
        const incomingUrls = new Set(images.map(img => img.url));

        // Delete images that are no longer in the incoming set
        const toDelete = (existingImages || []).filter(img => !incomingUrls.has(img.original_url));
        if (toDelete.length > 0) {
            await supabase
                .from('listing_images')
                .delete()
                .in('id', toDelete.map(img => img.id));
        }

        // Upsert images
        for (let i = 0; i < images.length; i++) {
            const img = images[i];
            const existing = existingByUrl.get(img.url);

            if (existing) {
                if (img.changed) {
                    // Image changed — reset enhancement status so it gets re-processed
                    await supabase
                        .from('listing_images')
                        .update({
                            enhancement_status: 'pending',
                            enhanced_url: null,
                            upscaled_url: null,
                            sort_order: i,
                        })
                        .eq('id', existing.id);
                } else {
                    // Image not changed — just update sort order, keep enhanced versions
                    await supabase
                        .from('listing_images')
                        .update({ sort_order: i })
                        .eq('id', existing.id);
                }
            } else {
                // New image — insert and queue for enhancement
                await supabase
                    .from('listing_images')
                    .insert({
                        listing_id: listingId,
                        original_url: img.url,
                        enhancement_status: 'pending',
                        sort_order: i,
                    });
            }
        }
    } else {
        // New listing — insert all images
        const rows = images.map((img, i) => ({
            listing_id: listingId,
            original_url: img.url,
            enhancement_status: 'pending',
            sort_order: i,
        }));

        if (rows.length > 0) {
            await supabase
                .from('listing_images')
                .insert(rows);
        }
    }
}

// ============================================================
// AGENT HANDLER (action=2)
// ============================================================
async function handleAgent(data: Record<string, any>) {
    // UC uses user_id or import_id — handle both
    const agentUcId = data.user_id || data.import_id;
    if (!agentUcId) {
        return errorResponse(11, 'Missing user_id / import_id');
    }

    // ---- DELETE ----
    if (data.deleted === 1 || data.deleted === true || data.deleted === '1') {
        const { data: existing } = await supabase
            .from('agents')
            .select('id')
            .eq('uc_user_id', String(agentUcId))
            .single();

        if (!existing) {
            return jsonResponse({ code: 4, message: 'Agent not found' });
        }

        await supabase
            .from('agents')
            .update({ is_deleted: true, updated_at: new Date().toISOString() })
            .eq('id', existing.id);

        return jsonResponse({
            code: 3,
            importId: existing.id,
            message: 'Agent deleted',
        });
    }

    // ---- Build agent row ----
    const agentRow = {
        uc_user_id: String(agentUcId),
        full_name: data.full_name || 'Unknown',
        phone: data.phone_work || null,
        email: data.email_work || null,
        photo_url: data.image?.url || null,
        is_sora: data.sora === 1 || data.sora === true,
        is_nark: data.nark === 1 || data.nark === true,
        is_deleted: false,
        updated_at: new Date().toISOString(),
    };

    // ---- Check if agent exists ----
    const { data: existing } = await supabase
        .from('agents')
        .select('id')
        .eq('uc_user_id', String(agentUcId))
        .single();

    if (existing) {
        const { error } = await supabase
            .from('agents')
            .update(agentRow)
            .eq('id', existing.id);

        if (error) {
            return errorResponse(12, `Agent update failed: ${error.message}`);
        }

        return jsonResponse({
            code: 2,
            importId: existing.id,
            message: 'Agent edited',
        });
    } else {
        const { data: inserted, error } = await supabase
            .from('agents')
            .insert(agentRow)
            .select('id')
            .single();

        if (error || !inserted) {
            return errorResponse(12, `Agent insert failed: ${error?.message || 'unknown'}`);
        }

        return jsonResponse({
            code: 1,
            importId: inserted.id,
            message: 'Agent added',
        });
    }
}

// ============================================================
// MAIN HANDLER
// ============================================================
Deno.serve(async (req) => {
    // CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
        });
    }

    if (req.method !== 'POST') {
        return errorResponse(12, 'Only POST allowed');
    }

    try {
        // ---- Parse body ----
        const body = await parseBody(req);

        const { user, pass, action, data: dataStr } = body;

        // ---- Auth check ----
        if (!user || !pass || user !== UC_WEBHOOK_USER || pass !== UC_WEBHOOK_PASS) {
            return errorResponse(10, 'Wrong login data');
        }

        // ---- Validate action ----
        const actionNum = Number(action);
        if (!actionNum || ![1, 2].includes(actionNum)) {
            return errorResponse(11, 'Missing or invalid action (must be 1 or 2)');
        }

        // ---- Parse data JSON ----
        if (!dataStr) {
            return errorResponse(11, 'Missing data field');
        }

        let data: Record<string, any>;
        try {
            data = typeof dataStr === 'string' ? JSON.parse(dataStr) : dataStr;
        } catch (e) {
            return errorResponse(12, 'Invalid JSON in data field');
        }

        // ---- Route to handler ----
        if (actionNum === 1) {
            return await handleListing(data);
        } else if (actionNum === 2) {
            return await handleAgent(data);
        }

        return errorResponse(12, `Unknown action: ${actionNum}`);
    } catch (e) {
        console.error('Webhook error:', e);
        return errorResponse(12, `Server error: ${(e as Error).message}`);
    }
});
