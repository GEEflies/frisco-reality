/**
 * UC Export API Types + Database Types
 * Built for United Classifieds EXPORT Documentation
 * https://plt.unitedclassifieds.sk/import/docs/v1/realsoft/docs/export/intro
 *
 * KEY DIFFERENCE: Export API uses completely different field names and code values
 * than the Import/Validation API. This file uses EXPORT codes exclusively.
 */

// ============================================
// DATABASE TYPES (Supabase)
// ============================================

export interface Listing {
    id: string;
    uc_object_id: number;
    agency_id: string | null;
    title: string;
    description: string | null;
    lang_data: Record<string, { title: string; description: string }> | null;

    // Transaction & Category — Export API codes
    action: number;         // 1=Predaj, 2=Kúpa, 3=Prenájom, 4=Hľadám prenájom, 5=Výmena, 6=Dražba
    category: number;       // 1-11 (Export categories, NOT the Import 8-72 codes)
    subcategory: number | null;

    // Pricing
    price: number;
    price_unit: number;     // 1=celkom, 2=m², 3=mesiac, 4=m²/mesiac, 5=rok, 6=m²/rok, 7=deň
    price_currency: number; // 1=EUR, 3=CZK, 4=GBP, 5=USD, 6=PLN, 7=HUF, 8=RON, 9=RSD
    price_by_agreement: boolean;
    price_energy: number | null;
    price_note: string | null;
    unit_price: number | null;
    guarantee: number | null;

    // Location
    state_id: number | null;
    county_id: number | null;
    district_id: number | null;
    region_id: number | null;
    citypart_id: number | null;
    street_id: number | null;
    street: string | null;
    street_number: string | null;
    geo_lat: number | null;
    geo_lon: number | null;
    // Derived location text (populated by webhook)
    location_city: string | null;
    location_district: string | null;
    location_region: string | null;

    // Areas
    usable_area: number | null;
    building_area: number | null;
    plot_area: number | null;
    total_area: number | null;

    // Property details
    rooms_count: number | null;
    bathrooms_count: number | null;
    floor: number | null;
    floors: number | null;
    floors_under: number | null;
    placement: number | null;
    equip_type: number | null;

    // Condition & construction
    condition: number | null;       // 4=vo výstavbe, 5=projekt, 6=novostavba, 7=demolácia, 8=čiastočná rekon, 9=kompletná rekon, 10=pôvodný stav
    age: number | null;             // Year of construction
    year_of_last_reconstruction: number | null;
    year_of_building_approval: number | null;
    building_type: number | null;   // 1=drevená, 2=tehlová, 3=kamenná, etc.
    ownership: number | null;       // 1=osobné, 2=družstevné, 3=iné, 4=firemné, etc.
    energy_cert: number | null;     // 1=A, 2=B, ..., 7=G, 99=Nemá
    energy_rating: number | null;
    orientation: number | null;
    house_type: number | null;

    // Status
    status: number;                 // 1=Aktívna, 3=Rezervované, 4=Predané, 5=Zrušené, 8=Prenajatá, 9=Zrealizovaná

    // Agent
    agent_id: string | null;
    agent_name: string | null;
    agent_email: string | null;
    agent_phone: string | null;

    // SEO
    slug: string | null;

    // Flags
    is_top: boolean;
    is_exclusive: boolean;
    is_luxury: boolean;
    is_deleted: boolean;

    // Extra boolean fields (heating, equipment, etc.) stored as JSONB
    extra_data: Record<string, any>;

    // Videos & virtual tours: {"youtube":["url"],"matterport":["url"]}
    medias: Record<string, string[]>;

    // Timestamps
    created_at: string;
    updated_at: string;
}

export interface ListingImage {
    id: string;
    listing_id: string;
    original_url: string;
    enhanced_url: string | null;
    upscaled_url: string | null;
    enhancement_status: 'pending' | 'processing' | 'completed' | 'failed';
    sort_order: number;
    created_at: string;
}

export interface Agent {
    id: string;
    uc_user_id: string;
    full_name: string;
    phone: string | null;
    email: string | null;
    photo_url: string | null;
    is_sora: boolean;
    is_nark: boolean;
    is_deleted: boolean;
    created_at: string;
    updated_at: string;
}

export interface ListingWithImages extends Listing {
    images: ListingImage[];
}

// ============================================
// UC EXPORT API TYPES
// (What United Classifieds sends TO our webhook)
// ============================================

/**
 * The POST body UC sends to our webhook endpoint.
 * Content-Type: application/json or application/x-www-form-urlencoded
 */
export interface UCWebhookBody {
    user: string;       // Login username
    pass: string;       // Login password
    action: number;     // 1 = listing (zákazka), 2 = agent (maklér)
    data: string;       // JSON string containing the listing or agent data
}

/**
 * Listing data from UC Export API (action=1).
 * FLAT structure — completely different from the nested Import API.
 */
export interface UCExportListing {
    // Identifiers
    object_id: number;          // UC's unique ID (never changes)
    extern_id?: number;         // Our ID — sent back by us after first import
    id: string;                 // Agency's internal reference
    deleted: number;            // 0 or 1

    // Core
    action: number;             // 1=Predaj, 2=Kúpa, 3=Prenájom, 4=Hľadám prenájom, 5=Výmena, 6=Dražba
    category: number;           // 1-11
    subcategory?: number;
    title: string;
    description: string;
    langData?: Record<string, { title: string; description: string }>;

    // Location
    state_id: number;
    county_id: number;
    district_id: number;
    region_id: number;
    citypart_id?: number;
    citypart_string?: string;
    street_id: number;
    street: string;
    street_number?: string;
    street_show?: number;
    gps_x?: number;             // Latitude
    gps_y?: number;             // Longitude

    // Pricing
    price: number;
    price_unit: number;         // 1=celkom, 2=m², 3=mesiac, 4=m²/mesiac, 5=rok, 6=m²/rok, 7=deň
    price_currency: number;     // 1=EUR, 3=CZK, 4=GBP, 5=USD, 6=PLN, 7=HUF, 8=RON, 9=RSD
    price_by_agreement?: number;
    price_energy?: number;
    price_note_public?: string;
    price_realized?: number;
    price_down?: number;
    unit_price?: number;
    guarantee?: number;
    energy?: number;            // Energie v cene (bool as 0/1)
    price_commission_in_price?: number;

    // Areas
    usable_area?: number;
    usable_area_to?: number;
    building_area?: number;
    building_area_to?: number;
    plot_area?: number;         // Note: Export uses plot_area, Import uses land_area
    plot_area_to?: number;
    total_area?: number;
    total_area_to?: number;
    store_area?: number;
    office_area?: number;
    front_garden_area?: number;

    // Rooms & counts
    rooms_count?: number;
    bathrooms_count?: number;
    kitchens_count?: number;
    toilets_count?: number;
    pantries_count?: number;
    wardrobes_count?: number;
    balconies_count?: number;
    loggies_count?: number;
    terraces_count?: number;
    cellars_count?: number;
    garages_count?: number;
    garage_place_count?: number;
    outdoor_parking_count?: number;
    public_parking_count?: number;

    // Floors & placement
    floor?: number;
    floor_to?: number;
    floors?: number;
    floors_under?: number;
    placement?: number;         // 1=podkrovie, 2=vyššie podlažie, 3=vyvýšené prízemie, 4=prízemie, 5=posledné podlažie, 6=nadstavba, 7=suterén

    // Condition & construction
    condition?: number;         // 4=vo výstavbe, 5=projekt, 6=novostavba, ...
    condition_export?: number;
    age?: number;               // Year of construction (Export uses "age", Import uses "year_of_construction")
    year_of_last_reconstruction?: number;
    year_of_building_approval?: number;
    building_type?: number;     // 1=drevená, 2=tehlová, 3=kamenná, ...
    ownership?: number;         // 1=osobné, 2=družstevné, 3=iné, 4=firemné, ...
    energy_cert?: number;       // 1=A, 2=B, ..., 7=G, 99=Nemá
    energy_rating?: number;     // 1=klasické mat, 2=úsporný, 3=nízkoenergetický, 4=pasívny, 5=nulový
    orientation?: number;       // 1=južná, 2=západná, ...
    house_type?: number;        // 1=klasický, 2=vila, 3=bungalov, ...
    type_of_parking?: number;
    equip_type?: number;        // 0=nezáleží, 1=nezariadený, 2=čiastočne, 3=zariadený, 4=holopriestor
    lift?: number;              // 0=nie, 1=áno, -1=neuvedené
    transition_room?: number;
    ready_to_build?: number;
    terrain?: number;
    plot_exploitation?: number;
    plot_location?: number;
    road?: number;
    roof?: number;
    roof_loft?: number;
    roofing?: number;
    cellar?: number;
    cellar_type?: number;
    cellar_ratio?: string;
    construction_begin?: string;
    construction_end?: string;

    // Status
    status: number;             // 1=Aktívna, 2=Kontaktovanie, 3=Rezervované, 4=Predané, 5=Zrušené, 6=Inkognito, 7=Korekcia, 8=Prenajatá, 9=Zrealizovaná

    // Feature booleans
    balcony?: number;
    loggia?: number;
    terrace?: number;
    cellar_place?: number;
    storage_place?: number;
    front_garden?: number;
    garage?: number;
    garage_place?: number;
    outdoor_parking?: number;
    public_parking?: number;
    top?: number;
    exclusive?: number;
    adv_luxury?: number;
    adv_sunny?: number;
    adv_nice_view?: number;
    adv_silence?: number;
    adv_pool?: number;
    adv_sauna?: number;
    adv_fire?: number;
    adv_insulated_house?: number;

    // Heating booleans
    heating_central?: number;
    heating_floor?: number;
    heating_local?: number;
    heating_fire?: number;
    heating_emitters?: number;
    heating_others?: number;
    heating?: number;
    heating_heat?: number;
    heating_cold_to?: string;
    access_klima?: number;

    // Equipment booleans
    equip_wardrobe?: number;
    technical_room?: number;
    store_room?: number;
    kitchen_sideboard?: number;
    kitchen_cooker?: number;
    kitchen_dishwasher?: number;
    kitchen_fridge?: number;
    kitchen_microwave?: number;
    kitchenette?: number;
    kitchen_pantry?: number;

    // Floor types
    floor_floating?: number;
    floor_parquet?: number;
    floor_paving?: number;
    floor_coverings?: number;
    floor_pvc?: number;
    floor_concrete?: number;

    // Walls & windows
    wall_spatula?: number;
    wall_plaster?: number;
    wall_wallpapers?: number;
    window_plastic?: number;
    window_wood?: number;
    window_euro?: number;
    window_al?: number;

    // Bathroom
    bath_clasic?: number;
    bath_corner?: number;
    bath_shower?: number;
    bath_separe_toilet?: number;

    // Security
    security_door?: number;
    security_alarm?: number;
    security_sbs?: number;
    security_cctv?: number;

    // Connectivity
    access_tv?: number;
    access_satelite_tv?: number;
    access_phone?: number;
    access_skt?: number;
    access_internet?: number;
    access_optical_internet?: number;
    access_others?: number;

    // Utilities
    water_source?: number;
    water?: number;
    water_supply?: number;
    water_well?: number;
    electricity_source?: number;
    electricity?: number;
    electricity_230?: number;
    electricity_400?: number;
    electricity_trafo?: number;
    gas_source?: number;
    gas?: number;
    canalization_source?: number;
    canalization?: number;
    canalization_oilcatcher?: number;
    canalization_sink?: number;
    canalization_septic?: number;
    canalization_cov?: number;
    data_connection?: number;

    // Logistics / disposal
    disposal_ramp?: number;
    disposal_lift?: number;
    disposal_hydraulic_ramp?: number;
    disposal_forklift?: number;
    disposal_crane?: number;
    disposal_crane_load?: string;

    // Transport availability
    availability_highway?: number;
    availability_railway?: number;
    availability_way?: number;
    availability_airport?: number;
    availability_port?: number;

    // Surroundings
    adv_shopping?: number;
    adv_school?: number;
    adv_hospital?: number;
    adv_bus?: number;
    adv_workshop?: number;
    adv_outfire?: number;
    adv_fishing?: number;
    adv_tourism?: number;
    adv_cycling?: number;
    adv_muscle?: number;
    adv_winter_garden?: number;
    adv_alcove?: number;

    // Agent
    agent_id: string;
    agent?: string;
    agent_email?: string;
    agent_phone?: string;
    agent_nark?: number;
    agent_sora?: number;
    agency_name?: string;

    // Media
    images?: UCExportImage[];
    medias?: Record<string, string[]>;
    streetview?: string;
    groundplan_id?: string;
    momento?: string;

    // Extended
    extended_herrys_projekt_developer?: string;
    extended_herrys_projekt_aktualne?: string;
    dimension_width?: number;
    dimension_height?: number;
    dimension_length?: number;

    // Voluntary auction
    voluntary_auction?: number;
    disclosure_date?: string;
    execution_date?: string;
    place?: string;
    first_inspection_date?: string;
    second_inspection_date?: string;

    // Allow additional fields we haven't explicitly typed
    [key: string]: any;
}

/** Image in UC Export format — includes `changed` flag */
export interface UCExportImage {
    url: string;
    changed: boolean;
}

/** Agent data from UC Export API (action=2) */
export interface UCExportAgent {
    user_id?: string;       // UC docs say user_id
    import_id?: string;     // Example data uses import_id
    deleted: number;        // 0 or 1
    full_name: string;
    phone_work: string;
    email_work: string;
    sora?: number;
    nark?: number;
    image?: { url: string; changed: boolean };
}

/**
 * Response format required by UC Export API (Section 2: Návratová hodnota)
 *
 * code: 1=added, 2=edited, 3=deleted, 4=not found, 10=wrong login, 11=missing data, 12=wrong data, 13=custom
 * importId: Our UUID after add/edit
 * message: Status text
 * url: Public URL of the listing on our website (not required for agents)
 */
export interface UCWebhookResponse {
    code: number;
    importId?: string;
    message: string | Record<string, string>;
    url?: string;
}

// ============================================
// FILTER TYPES (for frontend)
// ============================================

export interface ListingFilters {
    category?: string;
    transaction?: 'sale' | 'rent' | 'all';
    locality?: string;
    priceRange?: [number, number];
    sort?: 'recommended' | 'price-asc' | 'price-desc' | 'newest' | 'oldest';
}

// ============================================
// EXPORT API ENUMS
// ============================================

/** Export API action (transaction) codes */
export enum ExportAction {
    SALE = 1,           // Predaj
    PURCHASE = 2,       // Kúpa
    RENT = 3,           // Prenájom
    SEEKING_RENT = 4,   // Hľadám prenájom / podnájom
    EXCHANGE = 5,       // Výmena
    AUCTION = 6,        // Dražba
}

/** Export API category codes */
export enum ExportCategory {
    AGRICULTURAL = 1,       // Poľnohospodárske objekty
    COMMERCIAL_OBJ = 2,     // Komerčné objekty
    LAND = 3,               // Pozemky
    APARTMENTS = 4,         // Byty
    HISTORICAL = 5,         // Historické objekty
    HOUSES = 6,             // Domy a vily
    HOTELS = 7,             // Hotely a reštaurácie
    RENTAL_HOUSES = 8,      // Nájomné domy
    COMMERCIAL_SPACES = 9,  // Komerčné a prevádzkové priestory
    COTTAGES = 10,          // Chaty a rekreačné objekty
    GARAGES = 11,           // Malé objekty, garáže
}

/** Export API listing status codes */
export enum ExportStatus {
    ACTIVE = 1,
    CONTACTING = 2,
    RESERVED = 3,
    SOLD = 4,
    CANCELLED = 5,
    INCOGNITO = 6,
    CORRECTION = 7,
    RENTED = 8,
    REALIZED = 9,
}

/** Export API currency codes */
export enum ExportCurrency {
    EUR = 1,
    CZK = 3,
    GBP = 4,
    USD = 5,
    PLN = 6,
    HUF = 7,
    RON = 8,
    RSD = 9,
}

/** UC Webhook response codes */
export enum UCResponseCode {
    ADDED = 1,
    EDITED = 2,
    DELETED = 3,
    NOT_FOUND = 4,
    WRONG_LOGIN = 10,
    MISSING_DATA = 11,
    WRONG_DATA = 12,
    CUSTOM = 13,
}
