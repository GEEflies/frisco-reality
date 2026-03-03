/**
 * UC Export API Code Mappings
 *
 * Maps Export API numeric codes to localized display labels.
 * ALL codes come from the Export API documentation — NOT the Import API.
 *
 * Supported locales: sk (Slovak), en (English), de (German)
 */

type LabelMap = Record<number, string>;
type LocalizedMap = Record<string, LabelMap>;

// ============================================
// ACTION (Transaction Type)
// ============================================

const actionLabels: LocalizedMap = {
    sk: {
        1: 'Predaj',
        2: 'Kúpa',
        3: 'Prenájom',
        4: 'Hľadám prenájom',
        5: 'Výmena',
        6: 'Dražba',
    },
    en: {
        1: 'Sale',
        2: 'Purchase',
        3: 'Rent',
        4: 'Seeking Rent',
        5: 'Exchange',
        6: 'Auction',
    },
    de: {
        1: 'Verkauf',
        2: 'Kauf',
        3: 'Miete',
        4: 'Mietwunsch',
        5: 'Tausch',
        6: 'Versteigerung',
    },
};

// ============================================
// CATEGORY (1–11)
// ============================================

const categoryLabels: LocalizedMap = {
    sk: {
        1: 'Poľnohospodárske objekty',
        2: 'Komerčné objekty',
        3: 'Pozemky',
        4: 'Byty',
        5: 'Historické objekty',
        6: 'Domy a vily',
        7: 'Hotely a reštaurácie',
        8: 'Nájomné domy',
        9: 'Komerčné a prevádzkové priestory',
        10: 'Chaty a rekreačné objekty',
        11: 'Malé objekty, garáže',
    },
    en: {
        1: 'Agricultural',
        2: 'Commercial Buildings',
        3: 'Land',
        4: 'Apartments',
        5: 'Historical Buildings',
        6: 'Houses & Villas',
        7: 'Hotels & Restaurants',
        8: 'Rental Houses',
        9: 'Commercial Spaces',
        10: 'Cottages & Recreation',
        11: 'Garages & Small Buildings',
    },
    de: {
        1: 'Landwirtschaft',
        2: 'Gewerbeimmobilien',
        3: 'Grundstücke',
        4: 'Wohnungen',
        5: 'Historische Gebäude',
        6: 'Häuser & Villen',
        7: 'Hotels & Restaurants',
        8: 'Mietshäuser',
        9: 'Gewerbeflächen',
        10: 'Ferienhäuser',
        11: 'Garagen & Kleinebjekte',
    },
};

// ============================================
// SUBCATEGORY (per category)
// ============================================

const subcategoryLabels: LocalizedMap = {
    sk: {
        // Category 4: Byty
        401: 'Garsónka',
        402: '1-izbový',
        403: '2-izbový',
        404: '3-izbový',
        405: '4-izbový',
        406: '5+ izbový',
        407: 'Loft / mezonet',
        408: 'Iný byt',
        // Category 6: Domy a vily
        601: 'Rodinný dom',
        602: 'Vila',
        603: 'Dvojdom',
        604: 'Radový dom',
        605: 'Záhradný dom',
        606: 'Iný dom',
        // Category 3: Pozemky
        301: 'Stavebný pozemok',
        302: 'Záhrada',
        303: 'Orná pôda',
        304: 'Les',
        305: 'Lúka / pasienok',
        306: 'Záhradkárska osada',
        307: 'Iný pozemok',
        // Category 9: Komerčné priestory
        901: 'Kancelárske priestory',
        902: 'Obchodné priestory',
        903: 'Reštauračné priestory',
        904: 'Skladové / výrobné priestory',
        905: 'Iné priestory',
        // Category 2: Komerčné objekty
        201: 'Administratívna budova',
        202: 'Obchodný objekt',
        203: 'Polyfunkčný objekt',
        204: 'Výrobný objekt',
        205: 'Skladový objekt',
        206: 'Prevádzkový objekt',
        207: 'Iný komerčný objekt',
        // Category 10: Chaty
        1001: 'Chata',
        1002: 'Chalupa',
        1003: 'Záhradná chatka',
        1004: 'Rekreačné zariadenie',
        1005: 'Iný rekreačný objekt',
        // Category 11: Garáže
        1101: 'Garáž',
        1102: 'Garážové státie',
        1103: 'Pivnica',
        1104: 'Iný objekt',
    },
    en: {
        401: 'Studio',
        402: '1-bedroom',
        403: '2-bedroom',
        404: '3-bedroom',
        405: '4-bedroom',
        406: '5+ bedroom',
        407: 'Loft / Maisonette',
        408: 'Other apartment',
        601: 'Family house',
        602: 'Villa',
        603: 'Semi-detached',
        604: 'Terraced house',
        605: 'Garden house',
        606: 'Other house',
        301: 'Building plot',
        302: 'Garden',
        303: 'Arable land',
        304: 'Forest',
        305: 'Meadow / pasture',
        306: 'Allotment',
        307: 'Other land',
        901: 'Office space',
        902: 'Retail space',
        903: 'Restaurant space',
        904: 'Warehouse / production',
        905: 'Other space',
        201: 'Administrative building',
        202: 'Commercial building',
        203: 'Mixed-use building',
        204: 'Production facility',
        205: 'Warehouse',
        206: 'Operating facility',
        207: 'Other commercial',
        1001: 'Cabin',
        1002: 'Cottage',
        1003: 'Garden shed',
        1004: 'Resort',
        1005: 'Other recreation',
        1101: 'Garage',
        1102: 'Parking space',
        1103: 'Cellar',
        1104: 'Other',
    },
    de: {
        401: 'Einzimmerwohnung',
        402: '1-Zimmer',
        403: '2-Zimmer',
        404: '3-Zimmer',
        405: '4-Zimmer',
        406: '5+ Zimmer',
        407: 'Loft / Maisonette',
        408: 'Sonstige Wohnung',
        601: 'Einfamilienhaus',
        602: 'Villa',
        603: 'Doppelhaushälfte',
        604: 'Reihenhaus',
        605: 'Gartenhaus',
        606: 'Sonstiges Haus',
        301: 'Baugrundstück',
        302: 'Garten',
        303: 'Ackerland',
        304: 'Wald',
        305: 'Wiese / Weide',
        306: 'Kleingartenanlage',
        307: 'Sonstiges Grundstück',
    },
};

// ============================================
// STATUS
// ============================================

const statusLabels: LocalizedMap = {
    sk: {
        1: 'Aktívna',
        2: 'Kontaktovanie',
        3: 'Rezervované',
        4: 'Predané',
        5: 'Zrušené',
        6: 'Inkognito',
        7: 'Korekcia',
        8: 'Prenajatá',
        9: 'Zrealizovaná',
    },
    en: {
        1: 'Active',
        2: 'Contacting',
        3: 'Reserved',
        4: 'Sold',
        5: 'Cancelled',
        6: 'Incognito',
        7: 'Correction',
        8: 'Rented',
        9: 'Realized',
    },
    de: {
        1: 'Aktiv',
        2: 'Kontaktaufnahme',
        3: 'Reserviert',
        4: 'Verkauft',
        5: 'Storniert',
        6: 'Inkognito',
        7: 'Korrektur',
        8: 'Vermietet',
        9: 'Realisiert',
    },
};

// ============================================
// CONDITION
// ============================================

const conditionLabels: LocalizedMap = {
    sk: {
        4: 'Vo výstavbe',
        5: 'Projekt',
        6: 'Novostavba',
        7: 'Určený k demolácii',
        8: 'Čiastočná rekonštrukcia',
        9: 'Kompletná rekonštrukcia',
        10: 'Pôvodný stav',
    },
    en: {
        4: 'Under construction',
        5: 'Project',
        6: 'New build',
        7: 'For demolition',
        8: 'Partial renovation',
        9: 'Complete renovation',
        10: 'Original condition',
    },
    de: {
        4: 'Im Bau',
        5: 'Projekt',
        6: 'Neubau',
        7: 'Zum Abriss',
        8: 'Teilrenoviert',
        9: 'Komplettrenoviert',
        10: 'Originalzustand',
    },
};

// ============================================
// OWNERSHIP
// ============================================

const ownershipLabels: LocalizedMap = {
    sk: {
        1: 'Osobné',
        2: 'Družstevné',
        3: 'Iné',
        4: 'Firemné',
        5: 'Štátne',
        6: 'Obecné',
        7: 'Nevysporiadané',
    },
    en: {
        1: 'Private',
        2: 'Cooperative',
        3: 'Other',
        4: 'Corporate',
        5: 'State',
        6: 'Municipal',
        7: 'Unsettled',
    },
    de: {
        1: 'Privat',
        2: 'Genossenschaft',
        3: 'Andere',
        4: 'Firma',
        5: 'Staatlich',
        6: 'Gemeinde',
        7: 'Ungeklärt',
    },
};

// ============================================
// BUILDING TYPE
// ============================================

const buildingTypeLabels: LocalizedMap = {
    sk: {
        1: 'Drevená',
        2: 'Tehlová',
        3: 'Kamenná',
        4: 'Montovaná',
        5: 'Panelová',
        6: 'Skeletová',
        7: 'Zmiešaná',
        8: 'Kvádrová',
        9: 'Nepálená tehla',
        10: 'Zateplená',
        11: 'Hlinená',
        12: 'Železobetónová',
        13: 'Plech',
        14: 'Iná',
    },
    en: {
        1: 'Wooden',
        2: 'Brick',
        3: 'Stone',
        4: 'Prefab',
        5: 'Panel',
        6: 'Skeleton',
        7: 'Mixed',
        8: 'Block',
        9: 'Unburnt brick',
        10: 'Insulated',
        11: 'Clay',
        12: 'Reinforced concrete',
        13: 'Sheet metal',
        14: 'Other',
    },
    de: {
        1: 'Holz',
        2: 'Ziegel',
        3: 'Stein',
        4: 'Fertigbau',
        5: 'Platte',
        6: 'Skelett',
        7: 'Gemischt',
        8: 'Quader',
        9: 'Lehmziegel',
        10: 'Gedämmt',
        11: 'Lehm',
        12: 'Stahlbeton',
        13: 'Blech',
        14: 'Sonstiges',
    },
};

// ============================================
// ENERGY CERTIFICATE
// ============================================

const energyCertLabels: LocalizedMap = {
    sk: {
        1: 'A',
        2: 'B',
        3: 'C',
        4: 'D',
        5: 'E',
        6: 'F',
        7: 'G',
        99: 'Nemá',
    },
    en: {
        1: 'A',
        2: 'B',
        3: 'C',
        4: 'D',
        5: 'E',
        6: 'F',
        7: 'G',
        99: 'None',
    },
    de: {
        1: 'A',
        2: 'B',
        3: 'C',
        4: 'D',
        5: 'E',
        6: 'F',
        7: 'G',
        99: 'Keines',
    },
};

// ============================================
// ENERGY RATING
// ============================================

const energyRatingLabels: LocalizedMap = {
    sk: {
        1: 'Klasické materiály',
        2: 'Úsporný',
        3: 'Nízkoenergetický',
        4: 'Pasívny',
        5: 'Nulový dom',
    },
    en: {
        1: 'Standard materials',
        2: 'Energy-saving',
        3: 'Low-energy',
        4: 'Passive',
        5: 'Zero-energy',
    },
    de: {
        1: 'Standardmaterial',
        2: 'Energiesparend',
        3: 'Niedrigenergie',
        4: 'Passiv',
        5: 'Nullenergie',
    },
};

// ============================================
// ORIENTATION
// ============================================

const orientationLabels: LocalizedMap = {
    sk: {
        1: 'Južná',
        2: 'Západná',
        3: 'Juhozápadná',
        4: 'Severná',
        5: 'Východná',
        6: 'Juhovýchodná',
        7: 'Severozápadná',
        8: 'Severovýchodná',
    },
    en: {
        1: 'South',
        2: 'West',
        3: 'Southwest',
        4: 'North',
        5: 'East',
        6: 'Southeast',
        7: 'Northwest',
        8: 'Northeast',
    },
    de: {
        1: 'Süd',
        2: 'West',
        3: 'Südwest',
        4: 'Nord',
        5: 'Ost',
        6: 'Südost',
        7: 'Nordwest',
        8: 'Nordost',
    },
};

// ============================================
// PLACEMENT
// ============================================

const placementLabels: LocalizedMap = {
    sk: {
        1: 'Podkrovie',
        2: 'Vyššie podlažie',
        3: 'Vyvýšené prízemie',
        4: 'Prízemie',
        5: 'Posledné podlažie',
        6: 'Nadstavba',
        7: 'Suterén',
    },
    en: {
        1: 'Attic',
        2: 'Upper floor',
        3: 'Raised ground floor',
        4: 'Ground floor',
        5: 'Top floor',
        6: 'Extension',
        7: 'Basement',
    },
    de: {
        1: 'Dachgeschoss',
        2: 'Obergeschoss',
        3: 'Hochparterre',
        4: 'Erdgeschoss',
        5: 'Oberstes Geschoss',
        6: 'Aufstockung',
        7: 'Souterrain',
    },
};

// ============================================
// PRICE UNIT
// ============================================

const priceUnitLabels: LocalizedMap = {
    sk: {
        1: 'celkom',
        2: 'za m²',
        3: 'mesačne',
        4: 'za m²/mesiac',
        5: 'ročne',
        6: 'za m²/rok',
        7: 'denne',
    },
    en: {
        1: 'total',
        2: 'per m²',
        3: 'monthly',
        4: 'per m²/month',
        5: 'yearly',
        6: 'per m²/year',
        7: 'daily',
    },
    de: {
        1: 'gesamt',
        2: 'pro m²',
        3: 'monatlich',
        4: 'pro m²/Monat',
        5: 'jährlich',
        6: 'pro m²/Jahr',
        7: 'täglich',
    },
};

// ============================================
// PRICE CURRENCY
// ============================================

const currencyLabels: LabelMap = {
    1: '€',
    3: 'CZK',
    4: '£',
    5: '$',
    6: 'PLN',
    7: 'HUF',
    8: 'RON',
    9: 'RSD',
};

// ============================================
// EQUIP TYPE
// ============================================

const equipTypeLabels: LocalizedMap = {
    sk: {
        0: 'Nezáleží',
        1: 'Nezariadený',
        2: 'Čiastočne zariadený',
        3: 'Zariadený',
        4: 'Holopriestor',
    },
    en: {
        0: 'Not specified',
        1: 'Unfurnished',
        2: 'Partially furnished',
        3: 'Furnished',
        4: 'Shell & core',
    },
    de: {
        0: 'Egal',
        1: 'Unmöbliert',
        2: 'Teilmöbliert',
        3: 'Möbliert',
        4: 'Rohbau',
    },
};

// ============================================
// HOUSE TYPE
// ============================================

const houseTypeLabels: LocalizedMap = {
    sk: {
        1: 'Klasický',
        2: 'Vila',
        3: 'Bungalov',
        4: 'Dvojdom',
        5: 'Radový dom',
        6: 'Iný',
    },
    en: {
        1: 'Classic',
        2: 'Villa',
        3: 'Bungalow',
        4: 'Semi-detached',
        5: 'Terraced',
        6: 'Other',
    },
    de: {
        1: 'Klassisch',
        2: 'Villa',
        3: 'Bungalow',
        4: 'Doppelhaus',
        5: 'Reihenhaus',
        6: 'Sonstiges',
    },
};

// ============================================
// ROOF
// ============================================

const roofLabels: LocalizedMap = {
    sk: {
        1: 'Plochá',
        2: 'Pultová',
        3: 'Sedlová',
        4: 'Valbová',
        5: 'Stanová',
        6: 'Mansardová',
        7: 'Iná',
    },
    en: {
        1: 'Flat',
        2: 'Lean-to',
        3: 'Gable',
        4: 'Hip',
        5: 'Tent',
        6: 'Mansard',
        7: 'Other',
    },
    de: {
        1: 'Flach',
        2: 'Pult',
        3: 'Sattel',
        4: 'Walm',
        5: 'Zelt',
        6: 'Mansard',
        7: 'Sonstiges',
    },
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Get a localized label from a mapping.
 * Falls back to Slovak, then to `'–'` if the code is not found.
 */
function getLabel(map: LocalizedMap, code: number | null | undefined, locale: string = 'sk'): string {
    if (code == null) return '–';
    const labels = map[locale] || map['sk'];
    return labels?.[code] ?? map['sk']?.[code] ?? '–';
}

// ---- Public getters ----

export function getActionLabel(code: number | null | undefined, locale: string = 'sk'): string {
    return getLabel(actionLabels, code, locale);
}

export function getCategoryLabel(code: number | null | undefined, locale: string = 'sk'): string {
    return getLabel(categoryLabels, code, locale);
}

export function getSubcategoryLabel(code: number | null | undefined, locale: string = 'sk'): string {
    return getLabel(subcategoryLabels, code, locale);
}

export function getStatusLabel(code: number | null | undefined, locale: string = 'sk'): string {
    return getLabel(statusLabels, code, locale);
}

export function getConditionLabel(code: number | null | undefined, locale: string = 'sk'): string {
    return getLabel(conditionLabels, code, locale);
}

export function getOwnershipLabel(code: number | null | undefined, locale: string = 'sk'): string {
    return getLabel(ownershipLabels, code, locale);
}

export function getBuildingTypeLabel(code: number | null | undefined, locale: string = 'sk'): string {
    return getLabel(buildingTypeLabels, code, locale);
}

export function getEnergyCertLabel(code: number | null | undefined, locale: string = 'sk'): string {
    return getLabel(energyCertLabels, code, locale);
}

export function getEnergyRatingLabel(code: number | null | undefined, locale: string = 'sk'): string {
    return getLabel(energyRatingLabels, code, locale);
}

export function getOrientationLabel(code: number | null | undefined, locale: string = 'sk'): string {
    return getLabel(orientationLabels, code, locale);
}

export function getPlacementLabel(code: number | null | undefined, locale: string = 'sk'): string {
    return getLabel(placementLabels, code, locale);
}

export function getPriceUnitLabel(code: number | null | undefined, locale: string = 'sk'): string {
    return getLabel(priceUnitLabels, code, locale);
}

export function getEquipTypeLabel(code: number | null | undefined, locale: string = 'sk'): string {
    return getLabel(equipTypeLabels, code, locale);
}

export function getHouseTypeLabel(code: number | null | undefined, locale: string = 'sk'): string {
    return getLabel(houseTypeLabels, code, locale);
}

export function getRoofLabel(code: number | null | undefined, locale: string = 'sk'): string {
    return getLabel(roofLabels, code, locale);
}

// ---- Currency (not localized — symbols are universal) ----

export function getCurrencySymbol(code: number | null | undefined): string {
    if (code == null) return '€';
    return currencyLabels[code] ?? '€';
}

// ---- Category type mapping (for frontend filter groups) ----

export type CategoryType = 'apartment' | 'house' | 'land' | 'commercial' | 'cottage' | 'garage' | 'other';

/**
 * Maps an Export API category code to a simplified category type for filtering.
 */
export function getCategoryType(categoryCode: number): CategoryType {
    switch (categoryCode) {
        case 4:
            return 'apartment';
        case 6:
        case 8: // Nájomné domy
            return 'house';
        case 3:
            return 'land';
        case 2:
        case 9: // Komerčné priestory
        case 7: // Hotely
            return 'commercial';
        case 10:
            return 'cottage';
        case 11:
            return 'garage';
        default:
            return 'other';
    }
}

// ---- Status colors ----

/**
 * Returns a Tailwind color class for a given status code.
 */
export function getStatusColor(statusCode: number): string {
    switch (statusCode) {
        case 1: return 'text-green-600';        // Active
        case 3: return 'text-amber-500';        // Reserved
        case 4: return 'text-red-500';          // Sold
        case 5: return 'text-gray-400';         // Cancelled
        case 8: return 'text-blue-500';         // Rented
        case 9: return 'text-teal-500';         // Realized
        default: return 'text-gray-500';
    }
}

// ---- Price formatting ----

/**
 * Format a price with currency symbol and locale-appropriate number formatting.
 */
export function formatPrice(
    price: number | null | undefined,
    currencyCode: number = 1,
    priceByAgreement: boolean = false,
    locale: string = 'sk',
): string {
    if (priceByAgreement) {
        return locale === 'sk' ? 'Cena dohodou' :
               locale === 'de' ? 'Preis auf Anfrage' :
               'Price on request';
    }
    if (price == null || price === 0) {
        return locale === 'sk' ? 'Na vyžiadanie' :
               locale === 'de' ? 'Auf Anfrage' :
               'On request';
    }
    const symbol = getCurrencySymbol(currencyCode);
    const formatted = new Intl.NumberFormat(locale === 'sk' ? 'sk-SK' : locale === 'de' ? 'de-DE' : 'en-US', {
        maximumFractionDigits: 0,
    }).format(price);
    return `${formatted} ${symbol}`;
}

/**
 * Format price with unit label.
 */
export function formatPriceWithUnit(
    price: number | null | undefined,
    currencyCode: number = 1,
    priceUnitCode: number = 1,
    priceByAgreement: boolean = false,
    locale: string = 'sk',
): string {
    const base = formatPrice(price, currencyCode, priceByAgreement, locale);
    if (priceByAgreement || price == null || price === 0) return base;
    if (priceUnitCode === 1) return base; // "celkom" — no suffix needed
    const unitLabel = getPriceUnitLabel(priceUnitCode, locale);
    return `${base} / ${unitLabel}`;
}

// ---- Area formatting ----

/**
 * Format area in m².
 */
export function formatArea(area: number | null | undefined): string {
    if (area == null || area === 0) return '–';
    return `${new Intl.NumberFormat('sk-SK').format(area)} m²`;
}

// ---- Feature list builder ----

/**
 * Extract truthy boolean features from extra_data and return localized labels.
 */
export function getFeatureList(extraData: Record<string, any>, locale: string = 'sk'): string[] {
    const featureLabelsMap: Record<string, Record<string, string>> = {
        balcony: { sk: 'Balkón', en: 'Balcony', de: 'Balkon' },
        loggia: { sk: 'Lodžia', en: 'Loggia', de: 'Loggia' },
        terrace: { sk: 'Terasa', en: 'Terrace', de: 'Terrasse' },
        garage: { sk: 'Garáž', en: 'Garage', de: 'Garage' },
        garage_place: { sk: 'Garážové státie', en: 'Parking space', de: 'Stellplatz' },
        cellar_place: { sk: 'Pivnica', en: 'Cellar', de: 'Keller' },
        storage_place: { sk: 'Komora', en: 'Storage', de: 'Abstellraum' },
        front_garden: { sk: 'Predzáhradka', en: 'Front garden', de: 'Vorgarten' },
        lift: { sk: 'Výťah', en: 'Elevator', de: 'Aufzug' },
        adv_pool: { sk: 'Bazén', en: 'Pool', de: 'Schwimmbad' },
        adv_sauna: { sk: 'Sauna', en: 'Sauna', de: 'Sauna' },
        adv_fire: { sk: 'Krb', en: 'Fireplace', de: 'Kamin' },
        access_klima: { sk: 'Klimatizácia', en: 'Air conditioning', de: 'Klimaanlage' },
        adv_nice_view: { sk: 'Pekný výhľad', en: 'Nice view', de: 'Schöne Aussicht' },
        adv_sunny: { sk: 'Slnečný', en: 'Sunny', de: 'Sonnig' },
        adv_silence: { sk: 'Tichá lokalita', en: 'Quiet location', de: 'Ruhige Lage' },
        security_alarm: { sk: 'Alarm', en: 'Alarm', de: 'Alarm' },
        security_cctv: { sk: 'Kamerový systém', en: 'CCTV', de: 'Videoüberwachung' },
        access_internet: { sk: 'Internet', en: 'Internet', de: 'Internet' },
        access_optical_internet: { sk: 'Optický internet', en: 'Fiber internet', de: 'Glasfaser-Internet' },
    };

    const features: string[] = [];
    for (const [key, labels] of Object.entries(featureLabelsMap)) {
        if (extraData[key] && extraData[key] !== 0) {
            features.push(labels[locale] || labels['sk']);
        }
    }
    return features;
}

// ---- Heating list builder ----

export function getHeatingList(extraData: Record<string, any>, locale: string = 'sk'): string[] {
    const heatingLabelsMap: Record<string, Record<string, string>> = {
        heating_central: { sk: 'Ústredné', en: 'Central', de: 'Zentralheizung' },
        heating_floor: { sk: 'Podlahové', en: 'Underfloor', de: 'Fußbodenheizung' },
        heating_local: { sk: 'Lokálne', en: 'Local', de: 'Lokalheizung' },
        heating_fire: { sk: 'Krbové', en: 'Fireplace', de: 'Kaminheizung' },
        heating_emitters: { sk: 'Radiátory', en: 'Radiators', de: 'Heizkörper' },
        heating_heat: { sk: 'Tepelné čerpadlo', en: 'Heat pump', de: 'Wärmepumpe' },
        heating_others: { sk: 'Iné', en: 'Other', de: 'Sonstiges' },
    };

    const list: string[] = [];
    for (const [key, labels] of Object.entries(heatingLabelsMap)) {
        if (extraData[key] && extraData[key] !== 0) {
            list.push(labels[locale] || labels['sk']);
        }
    }
    return list;
}

// ============================================
// EXPORTS for use in components
// ============================================

export {
    actionLabels,
    categoryLabels,
    subcategoryLabels,
    statusLabels,
    conditionLabels,
    ownershipLabels,
    buildingTypeLabels,
    energyCertLabels,
    energyRatingLabels,
    orientationLabels,
    placementLabels,
    priceUnitLabels,
    currencyLabels,
    equipTypeLabels,
    houseTypeLabels,
    roofLabels,
};

// ============================================
// BACKWARD-COMPATIBLE ALIASES
// These map old Import API function names → new Export API names
// so existing components don't break immediately.
// TODO: remove after all components are migrated.
// ============================================

/** @deprecated Use `actionLabels` instead */
export const transactionLabels = actionLabels;

/** @deprecated Use `getCategoryLabel` instead */
export const getLocalizedCategoryLabel = getCategoryLabel;

/** @deprecated Use `getActionLabel` instead */
export const getLocalizedTransactionLabel = getActionLabel;

/** @deprecated Use `getConditionLabel` instead */
export const getLocalizedRealEstateStateLabel = getConditionLabel;

/** @deprecated Use `getBuildingTypeLabel` instead */
export const getLocalizedBuildingTypeLabel = getBuildingTypeLabel;

/** @deprecated Use `getOwnershipLabel` instead */
export const getLocalizedOwnershipLabel = getOwnershipLabel;

/**
 * @deprecated Use `getFeatureList(extra_data, locale)` instead.
 * Old Import API stored equipment as an array of numeric codes.
 * Export API uses individual boolean fields in extra_data.
 * This stub returns a single label for backward compat — but callers
 * should migrate to getFeatureList().
 */
export function getLocalizedEquipmentLabel(code: number, locale: string = 'sk'): string {
    // Old equipment codes don't have a 1:1 mapping to Export API.
    // Return equip_type label as a rough approximation.
    return getEquipTypeLabel(code, locale);
}

/**
 * @deprecated Use `getHeatingList(extra_data, locale)` instead.
 * Old Import API stored heating as an array of numeric codes.
 * Export API uses individual boolean fields in extra_data.
 */
export function getLocalizedHeatingLabel(code: number, locale: string = 'sk'): string {
    const heatingCodeMap: Record<string, Record<number, string>> = {
        sk: { 1: 'Ústredné', 2: 'Podlahové', 3: 'Lokálne', 4: 'Krbové', 5: 'Radiátory', 6: 'Tepelné čerpadlo', 7: 'Iné' },
        en: { 1: 'Central', 2: 'Underfloor', 3: 'Local', 4: 'Fireplace', 5: 'Radiators', 6: 'Heat pump', 7: 'Other' },
        de: { 1: 'Zentral', 2: 'Fußboden', 3: 'Lokal', 4: 'Kamin', 5: 'Heizkörper', 6: 'Wärmepumpe', 7: 'Sonstiges' },
    };
    const labels = heatingCodeMap[locale] || heatingCodeMap['sk'];
    return labels[code] ?? '–';
}
