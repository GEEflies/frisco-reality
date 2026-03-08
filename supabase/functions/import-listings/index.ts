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
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

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

function hasValue(value: any): boolean {
    return value !== undefined && value !== null && value !== '';
}

function toNumberOrNull(value: any): number | null {
    if (!hasValue(value)) return null;
    const num = Number(value);
    return Number.isFinite(num) ? num : null;
}

function toNumberOrDefault(value: any, fallback: number): number {
    const num = toNumberOrNull(value);
    return num === null ? fallback : num;
}

function toBool(value: any): boolean {
    return value === 1 || value === true || value === '1';
}

// ---- First-listing email notification ----
async function notifyFirstListing(title: string, slug: string, listingId: string) {
    if (!RESEND_API_KEY) {
        console.warn('RESEND_API_KEY not set — skipping first-listing notification');
        return;
    }
    const listingUrl = `${SITE_URL}/nehnutelnost/${slug}`;
    const dashboardUrl = 'https://supabase.com/dashboard/project/fcvswlurtchqorgnwclw/editor';
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
                to: ['billikkarol1@gmail.com'],
                subject: '🏠 UC je live — prvý inzerát práve dorazil!',
                html: `<!DOCTYPE html>
<html lang="sk">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:32px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:#0d1b2a;padding:28px 32px;">
            <p style="margin:0;font-size:22px;font-weight:bold;color:#ffffff;letter-spacing:2px;">FRISCO</p>
            <p style="margin:4px 0 0;font-size:13px;color:#ffffff;opacity:0.6;">Rodinná realitka · Sereď a okolie</p>
          </td>
        </tr>

        <!-- Status badge -->
        <tr>
          <td style="padding:24px 32px 0;">
            <span style="display:inline-block;background:#e8f5e9;color:#2e7d32;font-size:12px;font-weight:bold;padding:5px 12px;border-radius:20px;text-transform:uppercase;letter-spacing:1px;">● UC Export API · Aktívny</span>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:20px 32px 28px;">
            <h1 style="margin:0 0 8px;font-size:22px;color:#0d1b2a;">Prvý inzerát bol importovaný</h1>
            <p style="margin:0 0 20px;font-size:15px;color:#555;">United Classifieds začali odosielať inzeráty. Systém funguje správne.</p>

            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f9f9;border:1px solid #e0e0e0;border-radius:6px;margin-bottom:24px;">
              <tr>
                <td style="padding:12px 16px;border-bottom:1px solid #e0e0e0;">
                  <p style="margin:0;font-size:11px;color:#999;text-transform:uppercase;letter-spacing:1px;">Názov inzerátu</p>
                  <p style="margin:4px 0 0;font-size:15px;color:#0d1b2a;font-weight:bold;">${title}</p>
                </td>
              </tr>
              <tr>
                <td style="padding:12px 16px;border-bottom:1px solid #e0e0e0;">
                  <p style="margin:0;font-size:11px;color:#999;text-transform:uppercase;letter-spacing:1px;">Čas importu</p>
                  <p style="margin:4px 0 0;font-size:14px;color:#333;">${now}</p>
                </td>
              </tr>
              <tr>
                <td style="padding:12px 16px;">
                  <p style="margin:0;font-size:11px;color:#999;text-transform:uppercase;letter-spacing:1px;">Interné ID</p>
                  <p style="margin:4px 0 0;font-size:13px;color:#333;font-family:monospace;">${listingId}</p>
                </td>
              </tr>
            </table>

            <!-- CTA Buttons -->
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding-right:12px;">
                  <a href="${listingUrl}" style="display:inline-block;background:#0d1b2a;color:#ffffff;text-decoration:none;font-size:14px;font-weight:bold;padding:12px 22px;border-radius:6px;">Zobraziť inzerát →</a>
                </td>
                <td>
                  <a href="${dashboardUrl}" style="display:inline-block;background:#f5f5f5;color:#333;text-decoration:none;font-size:14px;padding:12px 22px;border-radius:6px;border:1px solid #ddd;">Supabase dashboard</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:16px 32px;border-top:1px solid #eee;">
            <p style="margin:0;font-size:12px;color:#aaa;">Táto notifikácia bola odoslaná automaticky pri prvom importe z UC Export API.</p>
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
            console.error('First-listing notification failed:', await res.text());
        } else {
            console.log('First-listing notification sent to billikkarol1@gmail.com');
        }
    } catch (e) {
        console.error('First-listing notification error:', e);
    }
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
// In Deno, a Request body can only be consumed once.
// For multipart/form-data we MUST use req.formData() (it handles boundaries).
// For everything else we read req.text() once, then parse from the string.
async function parseBody(req: Request): Promise<Record<string, any>> {
    const contentType = req.headers.get('content-type') || '';

    // --- multipart/form-data (UC sends form fields this way) ---
    if (contentType.includes('multipart/form-data')) {
        // Clone first so we have a fallback if formData() fails
        const cloned = req.clone();
        try {
            const formData = await req.formData();
            const body: Record<string, any> = {};
            for (const [key, value] of formData.entries()) {
                // File parts → read as text (UC sends data as text parts, not file uploads)
                if (typeof value === 'string') {
                    body[key] = value;
                } else if (value instanceof File || (value && typeof value.text === 'function')) {
                    body[key] = await value.text();
                } else {
                    body[key] = String(value);
                }
            }
            if (body.action) body.action = Number(body.action);
            console.log(`[UC] multipart parsed keys: ${Object.keys(body).join(', ')}`);
            return body;
        } catch (e) {
            // Fallback: if formData() fails, try reading raw text from the clone
            console.warn(`[UC] formData() failed: ${(e as Error).message}, trying text fallback`);
            const text = await cloned.text().catch(() => '');
            if (!text) return {};
            try { return JSON.parse(text); } catch { return parseFormData(text); }
        }
    }

    // --- all other content types: read as text first ---
    const text = await req.text();

    if (contentType.includes('application/json')) {
        return JSON.parse(text);
    }

    if (contentType.includes('application/x-www-form-urlencoded')) {
        return parseFormData(text);
    }

    // Unknown content-type — try JSON first, then form-urlencoded fallback
    try {
        return JSON.parse(text);
    } catch {
        return parseFormData(text);
    }
}

function parseFormData(text: string): Record<string, any> {
    const params = new URLSearchParams(text);
    const body: Record<string, any> = {};
    for (const [key, value] of params.entries()) {
        body[key] = value;
    }
    // action may come as string from form data
    if (body.action) body.action = Number(body.action);
    return body;
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
    'electricity_source', 'electricity', 'electricity_230', 'electricity_400', 'electricity_trafo',
    'gas_source', 'gas',
    'canalization_source', 'canalization', 'canalization_oilcatcher', 'canalization_sink', 'canalization_septic', 'canalization_cov',
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
    'street_show', 'heating_cold_to',
    'disposal_ramp', 'disposal_lift', 'disposal_hydraulic_ramp', 'disposal_forklift', 'disposal_crane', 'disposal_crane_load',
    'availability_highway', 'availability_railway', 'availability_way', 'availability_airport', 'availability_port',
    'price_commission_in_price', 'price_realized', 'price_down', 'condition_export', 'agency_name',
    'usable_area_to', 'building_area_to', 'plot_area_to', 'total_area_to', 'floor_to',
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
    if (!hasValue(objectId)) {
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

    // ---- Validate required fields (fields marked ✔ for ALL category×action combos in UC Export spec) ----
    // Per EXPORT spec: object_id, id, state_id, county_id, district_id, region_id, street_id, street,
    // action, category, agent_id, title, description, status, price, price_unit, price_currency
    // are all required (✔) for every single category and action combination.
    const requiredFields = [
        'id',
        'state_id',
        'county_id',
        'district_id',
        'region_id',
        'street_id',
        'street',
        'action',
        'category',
        'agent_id',
        'title',
        'description',
        'status',
        'price',
        'price_unit',
        'price_currency',
    ];

    const missing: Record<string, string> = {};
    for (const field of requiredFields) {
        if (!hasValue(data[field])) {
            missing[field] = 'Item is required.';
        }
    }

    if (Object.keys(missing).length > 0) {
        return jsonResponse({ code: 12, message: missing });
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

        action: toNumberOrDefault(data.action, 1),
        category: toNumberOrDefault(data.category, 1),
        subcategory: toNumberOrNull(data.subcategory),

        price: toNumberOrDefault(data.price, 0),
        price_unit: toNumberOrDefault(data.price_unit, 1),
        price_currency: toNumberOrDefault(data.price_currency, 1),
        price_by_agreement: toBool(data.price_by_agreement),
        price_energy: toNumberOrNull(data.price_energy),
        price_note: data.price_note_public || null,
        unit_price: toNumberOrNull(data.unit_price),
        guarantee: toNumberOrNull(data.guarantee),

        state_id: toNumberOrNull(data.state_id),
        county_id: toNumberOrNull(data.county_id),
        district_id: toNumberOrNull(data.district_id),
        region_id: toNumberOrNull(data.region_id),
        citypart_id: toNumberOrNull(data.citypart_id),
        street_id: toNumberOrNull(data.street_id),
        street: data.street || null,
        street_number: data.street_number || null,
        geo_lat: toNumberOrNull(data.gps_x),
        geo_lon: toNumberOrNull(data.gps_y),
        // Use citypart_string for location_city if available, otherwise leave null
        location_city: data.citypart_string || null,
        location_district: null,  // Will be populated from UC code list in future
        location_region: null,

        usable_area: toNumberOrNull(data.usable_area),
        building_area: toNumberOrNull(data.building_area),
        plot_area: toNumberOrNull(data.plot_area),
        total_area: toNumberOrNull(data.total_area),

        rooms_count: toNumberOrNull(data.rooms_count),
        bathrooms_count: toNumberOrNull(data.bathrooms_count),
        floor: toNumberOrNull(data.floor),
        floors: toNumberOrNull(data.floors),
        floors_under: toNumberOrNull(data.floors_under),
        placement: toNumberOrNull(data.placement),
        equip_type: toNumberOrNull(data.equip_type),

        // UC spec types condition as 'string' — handle both numeric and text values
        condition: typeof data.condition === 'string' && isNaN(Number(data.condition)) ? null : toNumberOrNull(data.condition),
        age: toNumberOrNull(data.age),
        year_of_last_reconstruction: toNumberOrNull(data.year_of_last_reconstruction),
        year_of_building_approval: toNumberOrNull(data.year_of_building_approval),
        building_type: toNumberOrNull(data.building_type),
        ownership: toNumberOrNull(data.ownership),
        energy_cert: toNumberOrNull(data.energy_cert),
        energy_rating: toNumberOrNull(data.energy_rating),
        orientation: toNumberOrNull(data.orientation),
        house_type: toNumberOrNull(data.house_type),

        status: toNumberOrDefault(data.status, 1),

        agent_id: data.agent_id || null,
        agent_name: data.agent || null,
        agent_email: data.agent_email || null,
        agent_phone: data.agent_phone || null,

        slug,

        is_top: toBool(data.top),
        is_exclusive: toBool(data.exclusive),
        is_luxury: toBool(data.adv_luxury),
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
        console.log(`[UC] UPDATED listing ${listingId} (uc_object_id=${objectId}) title="${data.title}"`);
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
        console.log(`[UC] INSERTED listing ${listingId} (uc_object_id=${objectId}) title="${data.title}"`);
    }

    // ---- HANDLE IMAGES ----
    if (data.images && Array.isArray(data.images)) {
        await handleImages(listingId, data.images, !!existing);
    }

    // ---- FIRST-LISTING NOTIFICATION ----
    // If this was an INSERT, check total count — send email on the very first listing
    if (responseCode === 1) {
        const { count } = await supabase
            .from('listings')
            .select('id', { count: 'exact', head: true })
            .eq('is_deleted', false);
        if (count === 1) {
            await notifyFirstListing(data.title, slug, listingId);
        }
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

        // Detailed request logging (no credentials — just diagnostics)
        const ct = req.headers.get('content-type') || 'none';
        console.log(`[UC] action=${action} (type=${typeof action}) content-type=${ct}`);
        console.log(`[UC] parsed_keys=[${Object.keys(body).join(',')}] has_user=${!!user} has_pass=${!!pass} has_data=${!!dataStr} data_type=${typeof dataStr} data_len=${typeof dataStr === 'string' ? dataStr.length : 'N/A'}`);

        // ---- Auth check ----
        if (!user || !pass || user !== UC_WEBHOOK_USER || pass !== UC_WEBHOOK_PASS) {
            console.warn(`[UC] Auth failed — user_match=${user === UC_WEBHOOK_USER} pass_match=${pass === UC_WEBHOOK_PASS} user_provided=${!!user} pass_provided=${!!pass}`);
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
