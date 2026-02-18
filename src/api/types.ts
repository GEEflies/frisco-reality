/**
 * United Classified API Types + Listing Database Types
 * For UC Platform integration with AI image enhancement
 */

// ============================================
// DATABASE TYPES (Supabase)
// ============================================

export interface Listing {
    id: string;
    uc_source_id: string;
    title: string;
    description: string | null;
    price: number;
    currency: string;
    category_id: number;
    transaction_id: number;
    usable_area: number | null;
    land_area: number | null;
    building_area: number | null;
    rooms_count: number | null;
    floor: number | null;
    year_of_construction: number | null;
    location_region: string | null;
    location_district: string | null;
    location_city: string | null;
    street: string | null;
    slug: string | null;
    geo_lat: string | null;
    geo_lon: string | null;
    status: 'active' | 'reserved' | 'sold' | 'rented';
    real_estate_state: number | null;
    ownership: number | null;
    building_type: number[] | null;
    heating_system: number[] | null;
    estate_equipment: number[] | null;
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

export interface ListingWithImages extends Listing {
    images: ListingImage[];
}

// ============================================
// UC API TYPES (United Classified)
// ============================================

export interface UCAdvertisement {
    source_id: string;
    category: number;
    transaction: number;
    title: string;
    description: string;
    price: number;
    units: number;
    price_by_agreement: boolean;
    currency: number;
    usable_area: number;
    building_area: number;
    land_area: number;
    street: string;
    street_number?: string;
    geo_point?: UCGeoPoint;
    real_estate_state?: number;
    position?: number;
    floor?: number;
    rooms_count?: number;
    year_of_construction?: number;
    year_of_last_reconstruction?: number;
    building_energy_rating_certificate?: number;
    ownership?: number;
    building_type?: number[];
    equip_type?: number;
    estate_equipment?: number[];
    utility_lines?: number[];
    heating_system?: number[];
    orientation?: number[];
    ground_type?: number;
    type_of_house?: number;
    availability?: number;
    video_url?: string[];
    extra?: UCExtra;
    multi_extra?: UCMultiExtra;
    location: UCLocation;
    images: UCImage[];
    client_created_at?: string;
    client_updated_at?: string;
}

export interface UCGeoPoint {
    lat: string;
    lon: string;
}

export interface UCLocation {
    state_id: number;
    county_id: number;
    district_id: number;
    region_id: number;
    citypart_id?: number;
    street_id: number;
}

export interface UCImage {
    url: string;
}

export interface UCExtra {
    garage_count?: number;
    terraces_count?: number;
    balcony_area?: number;
    terrace_area?: number;
    cellar_area?: number;
    garage_area?: number;
    loggia_area?: number;
    number_of_balconies?: number;
    number_of_loggies?: number;
    outdoor_parking_space_count?: number;
    land_width?: number;
    land_length?: number;
    water?: number[];
    electric?: number[];
    gas?: number[];
    sewage?: number[];
}

export interface UCMultiExtra {
    balcony_area?: number[];
    loggia_area?: number[];
    terrace_area?: number[];
    cellar_area?: number[];
    garage_area?: number[];
}

export interface UCUser {
    source_id: string;
    first_name?: string;
    last_name: string;
    phone: string;
    email: string;
    degree_before?: string;
    degree_after?: string;
}

export interface UCOffice {
    source_id: string;
    name: string;
    phone: string;
    email: string;
    city: string;
    zip: string;
    street: string;
    street_number: number | string;
    contact_person?: string;
}

export interface UCUserData {
    user: UCUser;
    advertisements: UCAdvertisement[];
}

export interface UCOfficeData {
    office: UCOffice;
    user_data: UCUserData[];
}

// ============================================
// FILTER TYPES
// ============================================

export interface ListingFilters {
    category?: string;
    transaction?: 'sale' | 'rent' | 'all';
    locality?: string;
    priceRange?: [number, number];
    sort?: 'recommended' | 'price-asc' | 'price-desc' | 'newest' | 'oldest';
}

// ============================================
// ENUMS (UC API Codes)
// ============================================

export enum UCCategory {
    GARAGES = 8,
    STUDIO = 9,
    DOUBLE_STUDIO = 10,
    ONE_ROOM = 11,
    TWO_ROOM = 12,
    THREE_ROOM = 13,
    FOUR_ROOM = 14,
    FIVE_PLUS_ROOM = 15,
    HOLIDAY_APT = 16,
    LOFT = 17,
    MAISONETTE = 18,
    FAMILY_HOUSE = 20,
    COUNTRY_HOUSE = 21,
    FARM = 22,
    MOBILE_HOUSE = 23,
    HOUSEBOAT = 24,
    CABIN = 26,
    COTTAGE = 27,
    GARDEN_HUT = 28,
    LAND_FAMILY_HOUSE = 30,
    RECREATIONAL_LAND = 31,
    LAND_HOUSING = 32,
    LAND_CIVIC = 33,
    COMMERCIAL_ZONE = 34,
    INDUSTRIAL_ZONE = 35,
    MIXED_ZONE = 36,
    GARDEN = 37,
    OFFICES = 46,
    BUSINESS_SPACES = 47,
    RESTAURANT_SPACES = 48,
    STORAGE = 49,
    PRODUCTION = 50,
    APARTMENT_HOUSE = 55,
    HOTEL = 65,
}

export enum UCTransaction {
    PURCHASE = 122,
    HIREOUT = 123,
    RENT = 124,
    EXCHANGE = 125,
    AUCTION = 126,
    SALE = 127,
}

export enum UCAvailability {
    SOLD = 241,
    RESERVED = 242,
    ACTIVE = 30822,
    CANCELED = 30823,
    IN_RENT = 30824,
}

export enum UCCurrency {
    EUR = 167,
    CZK = 168,
    GBP = 169,
    USD = 170,
}
