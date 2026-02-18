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
