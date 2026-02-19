/**
 * UC API Code Mappings to Slovak Display Labels
 * Converts numeric codes from API to human-readable Slovak text
 */

// Category ID → Slovak label
export const categoryLabels: Record<number, string> = {
    8: 'Garáže a parkovacie miesta',
    9: 'Garsónka',
    10: 'Dvojgarsónka',
    11: '1-izbový byt',
    12: '2-izbový byt',
    13: '3-izbový byt',
    14: '4-izbový byt',
    15: '5+ izbový byt',
    16: 'Apartmán',
    17: 'Podkrovie',
    18: 'Mezonet',
    20: 'Rodinný dom',
    21: 'Vidiecky dom',
    22: 'Farma',
    23: 'Mobilný dom',
    24: 'Hausbót',
    26: 'Zrub',
    27: 'Chata',
    28: 'Záhradný domček',
    30: 'Pozemok pre rodinný dom',
    31: 'Rekreačný pozemok',
    32: 'Stavebný pozemok',
    33: 'Pozemok pre občiansku vybavenosť',
    34: 'Komerčná zóna',
    35: 'Priemyselná zóna',
    36: 'Zmiešaná zóna',
    37: 'Záhrada',
    38: 'Sad',
    39: 'Vinica',
    40: 'Lúky a pasienky',
    41: 'Orná pôda',
    42: 'Les',
    43: 'Jazero',
    44: 'Reklamný pozemok',
    46: 'Kancelárie',
    47: 'Obchodné priestory',
    48: 'Reštauračné priestory',
    49: 'Skladové priestory',
    50: 'Výrobné priestory',
    51: 'Servisné priestory',
    52: 'Športové zariadenia',
    53: 'Reklamné priestory',
    55: 'Bytový dom',
    56: 'Nájomný dom',
    57: 'Administratívna budova',
    58: 'Obchodný objekt',
    59: 'Reštaurácia',
    60: 'Polyfunkčná budova',
    61: 'Sklad',
    62: 'Výrobné zariadenie',
    63: 'Servisné zariadenie',
    64: 'Objekt pre chov zvierat',
    65: 'Hotel, Penzión',
    66: 'Kúpele',
    67: 'Historický objekt',
    68: 'Prevádzkový areál',
    69: 'Športový objekt',
    70: 'Malá elektráreň',
    71: 'Pumpa',
    72: 'Unimobunky a stánky',
    30746: 'Iný pozemok na výstavbu',
    30747: 'Iná poľnohospodárska pôda',
};

// Transaction ID → Slovak label
export const transactionLabels: Record<number, string> = {
    122: 'Kúpa',
    123: 'Prenájom',
    124: 'Podnájom',
    125: 'Výmena',
    126: 'Aukcia',
    127: 'Predaj',
};

// Real estate state → Slovak label
export const realEstateStateLabels: Record<number, string> = {
    136: 'Novostavba',
    137: 'Čiastočná rekonštrukcia',
    138: 'Kompletná rekonštrukcia',
    139: 'Pôvodný stav',
    140: 'Vo výstavbe',
    141: 'Projekt',
    142: 'Na demoláciu',
    143: 'Nadstavba',
};

// Building type → Slovak label
export const buildingTypeLabels: Record<number, string> = {
    411: 'Drevo',
    412: 'Hlina',
    413: 'Kameň',
    414: 'Bloková konštrukcia',
    415: 'Montované',
    416: 'Panel',
    417: 'Skelet',
    418: 'Tehla',
    419: 'Zmiešané',
    420: 'Železobetón',
    421: 'Kov',
    422: 'Iné',
};

// Estate equipment → Slovak label
export const equipmentLabels: Record<number, string> = {
    533: 'Balkón',
    534: 'Loggia',
    535: 'Terasa',
    536: 'Predzáhradka',
    537: 'Garáž',
    538: 'Pivnica',
    539: 'Garážové miesto',
    540: 'Verejné parkovanie',
    541: 'Vonkajšie parkovanie',
    543: 'Špajza',
    544: 'Sklad',
    545: 'Technická miestnosť',
    556: 'Výťah',
};

// Heating system → Slovak label
export const heatingLabels: Record<number, string> = {
    717: 'Centrálne',
    722: 'Podlahové',
    723: 'Lokálne',
    728: 'Iné',
    729: 'Kozub',
    730: 'Klimatizácia',
    732: 'Radiátory',
    30739: 'Nedostupné',
};

// Ownership → Slovak label
export const ownershipLabels: Record<number, string> = {
    340: 'Družstevné',
    341: 'Firemné',
    342: 'Nevysporiadané',
    343: 'Obecné',
    344: 'Osobné',
    345: 'Štátne',
    346: 'Iné',
};

// Orientation → Slovak label
export const orientationLabels: Record<number, string> = {
    381: 'Juh',
    382: 'Západ',
    383: 'Juhozápad',
    384: 'Sever',
    385: 'Východ',
    386: 'Juhovýchod',
    387: 'Severozápad',
    388: 'Severovýchod',
};

// Energy rating → Label
export const energyRatingLabels: Record<number, string> = {
    305: 'A',
    306: 'B',
    307: 'C',
    308: 'D',
    309: 'E',
    310: 'F',
    20029: 'G',
    20030: 'Žiadne',
};

// Type of house → Slovak label
export const houseTypeLabels: Record<number, string> = {
    975: 'Klasický dom',
    976: 'Rodinná vila',
    977: 'Bungalov',
    978: 'Drevený dom',
    979: 'Zrub',
    980: 'Dvojgeneračný dom',
};

// Status color mapping for UI badges
export const getStatusColor = (status: string): string => {
    switch (status) {
        case 'active': return 'bg-emerald-500';
        case 'reserved': return 'bg-amber-500';
        case 'sold': return 'bg-red-500';
        case 'rented': return 'bg-sky-500';
        default: return 'bg-navy';
    }
};

// Status label in Slovak
export const statusLabels: Record<string, string> = {
    active: 'Aktívne',
    reserved: 'Rezervované',
    sold: 'Predané',
    rented: 'Prenajaté',
};

// Map category IDs to simplified filter types
export const getCategoryType = (categoryId: number): string => {
    // Apartments (9-18)
    if (categoryId >= 9 && categoryId <= 18) return 'apartment';
    // Houses (20-28)
    if (categoryId >= 20 && categoryId <= 28) return 'house';
    // Land (30-44)
    if (categoryId >= 30 && categoryId <= 44) return 'land';
    // Commercial/Other
    return 'other';
};

// Format price with currency
export const formatPrice = (price: number, currency: string = 'EUR'): string => {
    return new Intl.NumberFormat('sk-SK', {
        style: 'currency',
        currency,
        maximumFractionDigits: 0,
    }).format(price);
};

// Format area with unit
export const formatArea = (area: number | null): string => {
    if (!area) return '-';
    return `${area.toLocaleString('sk-SK')} m²`;
};

type MappingLanguage = 'sk' | 'en' | 'de';

const LOCALIZED_TRANSACTION_LABELS: Record<Exclude<MappingLanguage, 'sk'>, Record<number, string>> = {
    en: {
        122: 'Purchase',
        123: 'Rent',
        124: 'Sublease',
        125: 'Exchange',
        126: 'Auction',
        127: 'Sale',
    },
    de: {
        122: 'Kauf',
        123: 'Miete',
        124: 'Untermiete',
        125: 'Tausch',
        126: 'Auktion',
        127: 'Verkauf',
    },
};

const LOCALIZED_REAL_ESTATE_STATE_LABELS: Record<Exclude<MappingLanguage, 'sk'>, Record<number, string>> = {
    en: {
        136: 'New build',
        137: 'Partial renovation',
        138: 'Full renovation',
        139: 'Original condition',
        140: 'Under construction',
        141: 'Project',
        142: 'For demolition',
        143: 'Extension',
    },
    de: {
        136: 'Neubau',
        137: 'Teilrenoviert',
        138: 'Komplett renoviert',
        139: 'Originalzustand',
        140: 'Im Bau',
        141: 'Projekt',
        142: 'Zum Abriss',
        143: 'Aufstockung',
    },
};

const LOCALIZED_BUILDING_TYPE_LABELS: Record<Exclude<MappingLanguage, 'sk'>, Record<number, string>> = {
    en: {
        411: 'Wood',
        412: 'Clay',
        413: 'Stone',
        414: 'Block construction',
        415: 'Prefabricated',
        416: 'Panel',
        417: 'Skeletal',
        418: 'Brick',
        419: 'Mixed',
        420: 'Reinforced concrete',
        421: 'Metal',
        422: 'Other',
    },
    de: {
        411: 'Holz',
        412: 'Lehm',
        413: 'Stein',
        414: 'Blockbau',
        415: 'Fertigbau',
        416: 'Plattenbau',
        417: 'Skelettbau',
        418: 'Ziegel',
        419: 'Gemischt',
        420: 'Stahlbeton',
        421: 'Metall',
        422: 'Sonstiges',
    },
};

const LOCALIZED_EQUIPMENT_LABELS: Record<Exclude<MappingLanguage, 'sk'>, Record<number, string>> = {
    en: {
        533: 'Balcony',
        534: 'Loggia',
        535: 'Terrace',
        536: 'Front garden',
        537: 'Garage',
        538: 'Cellar',
        539: 'Garage space',
        540: 'Public parking',
        541: 'Outdoor parking',
        543: 'Pantry',
        544: 'Storage',
        545: 'Technical room',
        556: 'Elevator',
    },
    de: {
        533: 'Balkon',
        534: 'Loggia',
        535: 'Terrasse',
        536: 'Vorgarten',
        537: 'Garage',
        538: 'Keller',
        539: 'Garagenstellplatz',
        540: 'Öffentliche Parkplätze',
        541: 'Außenstellplatz',
        543: 'Speisekammer',
        544: 'Lagerraum',
        545: 'Technikraum',
        556: 'Aufzug',
    },
};

const LOCALIZED_HEATING_LABELS: Record<Exclude<MappingLanguage, 'sk'>, Record<number, string>> = {
    en: {
        717: 'Central',
        722: 'Underfloor',
        723: 'Local',
        728: 'Other',
        729: 'Fireplace',
        730: 'Air conditioning',
        732: 'Radiators',
        30739: 'Unavailable',
    },
    de: {
        717: 'Zentral',
        722: 'Fußbodenheizung',
        723: 'Lokal',
        728: 'Sonstiges',
        729: 'Kamin',
        730: 'Klimaanlage',
        732: 'Heizkörper',
        30739: 'Nicht verfügbar',
    },
};

const LOCALIZED_OWNERSHIP_LABELS: Record<Exclude<MappingLanguage, 'sk'>, Record<number, string>> = {
    en: {
        340: 'Cooperative',
        341: 'Company',
        342: 'Unsettled',
        343: 'Municipal',
        344: 'Private',
        345: 'State',
        346: 'Other',
    },
    de: {
        340: 'Genossenschaftlich',
        341: 'Firmenbesitz',
        342: 'Ungeklärt',
        343: 'Kommunal',
        344: 'Privat',
        345: 'Staatlich',
        346: 'Sonstiges',
    },
};

const LOCALIZED_CATEGORY_LABELS: Record<Exclude<MappingLanguage, 'sk'>, Record<number, string>> = {
    en: {
        11: '1-room apartment',
        12: '2-room apartment',
        13: '3-room apartment',
        14: '4-room apartment',
        15: '5+ room apartment',
        16: 'Apartment',
        20: 'Family house',
        27: 'Cottage',
        30: 'Land for family house',
        32: 'Building plot',
        37: 'Garden',
        46: 'Offices',
        47: 'Retail premises',
        49: 'Storage premises',
        65: 'Hotel, guesthouse',
    },
    de: {
        11: '1-Zimmer-Wohnung',
        12: '2-Zimmer-Wohnung',
        13: '3-Zimmer-Wohnung',
        14: '4-Zimmer-Wohnung',
        15: '5+ Zimmer Wohnung',
        16: 'Apartment',
        20: 'Einfamilienhaus',
        27: 'Ferienhaus',
        30: 'Grundstück für Einfamilienhaus',
        32: 'Baugrundstück',
        37: 'Garten',
        46: 'Büros',
        47: 'Geschäftsflächen',
        49: 'Lagerflächen',
        65: 'Hotel, Pension',
    },
};

export const getLocalizedTransactionLabel = (id: number | undefined, language: MappingLanguage): string => {
    if (!id) return '-';
    if (language === 'sk') return transactionLabels[id] || '-';
    return LOCALIZED_TRANSACTION_LABELS[language][id] || transactionLabels[id] || '-';
};

export const getLocalizedCategoryLabel = (id: number | undefined, language: MappingLanguage): string => {
    if (!id) return '-';
    if (language === 'sk') return categoryLabels[id] || '-';
    return LOCALIZED_CATEGORY_LABELS[language][id] || categoryLabels[id] || '-';
};

export const getLocalizedRealEstateStateLabel = (id: number | undefined, language: MappingLanguage): string => {
    if (!id) return '-';
    if (language === 'sk') return realEstateStateLabels[id] || '-';
    return LOCALIZED_REAL_ESTATE_STATE_LABELS[language][id] || realEstateStateLabels[id] || '-';
};

export const getLocalizedBuildingTypeLabel = (id: number | undefined, language: MappingLanguage): string => {
    if (!id) return '-';
    if (language === 'sk') return buildingTypeLabels[id] || '-';
    return LOCALIZED_BUILDING_TYPE_LABELS[language][id] || buildingTypeLabels[id] || '-';
};

export const getLocalizedEquipmentLabel = (id: number, language: MappingLanguage): string | undefined => {
    if (language === 'sk') return equipmentLabels[id];
    return LOCALIZED_EQUIPMENT_LABELS[language][id] || equipmentLabels[id];
};

export const getLocalizedHeatingLabel = (id: number, language: MappingLanguage): string | undefined => {
    if (language === 'sk') return heatingLabels[id];
    return LOCALIZED_HEATING_LABELS[language][id] || heatingLabels[id];
};

export const getLocalizedOwnershipLabel = (id: number | undefined, language: MappingLanguage): string => {
    if (!id) return '-';
    if (language === 'sk') return ownershipLabels[id] || '-';
    return LOCALIZED_OWNERSHIP_LABELS[language][id] || ownershipLabels[id] || '-';
};
