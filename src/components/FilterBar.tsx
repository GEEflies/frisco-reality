'use client';

import { useState, useEffect } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { X, ChevronDown, SlidersHorizontal } from "lucide-react";
import { useLanguage } from '@/i18n/LanguageProvider';

interface FilterBarProps {
    filters: {
        locality: string;
        type: string;
        priceRange: [number, number];
    };
    setFilters: (filters: any) => void;
    sort: string;
    setSort: (sort: string) => void;
    onReset: () => void;
    maxPrice: number;
    localities?: string[];
    availableTypes?: string[];
    listingsCount?: number;
    externalOpen?: boolean;
    onExternalOpenHandled?: () => void;
}

export const FilterBar = ({
    filters,
    setFilters,
    sort,
    setSort,
    onReset,
    maxPrice,
    localities = [],
    availableTypes = [],
    listingsCount = 0,
    externalOpen = false,
    onExternalOpenHandled,
}: FilterBarProps) => {
    const { language } = useLanguage();
    const copy = {
        sk: {
            all: 'Všetky',
            labels: {
                apartment: 'Byty',
                house: 'Domy',
                land: 'Pozemky',
                commercial: 'Komerčné',
                cottage: 'Chaty',
                garage: 'Garáže',
                other: 'Iné',
            },
            filterOffer: 'Filtrovať ponuku',
            locality: 'Lokalita',
            propertyType: 'Typ nehnuteľnosti',
            priceRange: 'Cenové rozpätie',
            clearFilters: 'Zrušiť filtre',
            show: 'Zobraziť',
            allLocalities: 'Všetky lokality',
            allTypes: 'Všetky typy',
            price: 'Cena',
            sort: 'Zoradiť',
            recommended: 'Odporúčané',
            newest: 'Najnovšie',
            oldest: 'Najstaršie',
            priceAsc: 'Najlacnejšie',
            priceDesc: 'Najdrahšie',
        },
        en: {
            all: 'All',
            labels: {
                apartment: 'Apartments',
                house: 'Houses',
                land: 'Land',
                commercial: 'Commercial',
                cottage: 'Cottages',
                garage: 'Garages',
                other: 'Other',
            },
            filterOffer: 'Filter listings',
            locality: 'Location',
            propertyType: 'Property type',
            priceRange: 'Price range',
            clearFilters: 'Clear filters',
            show: 'Show',
            allLocalities: 'All locations',
            allTypes: 'All types',
            price: 'Price',
            sort: 'Sort',
            recommended: 'Recommended',
            newest: 'Newest',
            oldest: 'Oldest',
            priceAsc: 'Lowest price',
            priceDesc: 'Highest price',
        },
        de: {
            all: 'Alle',
            labels: {
                apartment: 'Wohnungen',
                house: 'Häuser',
                land: 'Grundstücke',
                commercial: 'Gewerbe',
                cottage: 'Ferienhäuser',
                garage: 'Garagen',
                other: 'Sonstiges',
            },
            filterOffer: 'Angebote filtern',
            locality: 'Standort',
            propertyType: 'Immobilientyp',
            priceRange: 'Preisspanne',
            clearFilters: 'Filter zurücksetzen',
            show: 'Anzeigen',
            allLocalities: 'Alle Standorte',
            allTypes: 'Alle Typen',
            price: 'Preis',
            sort: 'Sortieren',
            recommended: 'Empfohlen',
            newest: 'Neueste',
            oldest: 'Älteste',
            priceAsc: 'Niedrigster Preis',
            priceDesc: 'Höchster Preis',
        },
    }[language];
    const locale = language === 'sk' ? 'sk-SK' : language === 'de' ? 'de-DE' : 'en-US';

    const [isOpen, setIsOpen] = useState(false);

    // Allow parent to open the modal externally (e.g. floating filter button)
    useEffect(() => {
        if (externalOpen) {
            setIsOpen(true);
            onExternalOpenHandled?.();
        }
    }, [externalOpen, onExternalOpenHandled]);

    // Temp filter state for the modal (only applied on "Zobraziť")
    const [tempFilters, setTempFilters] = useState(filters);

    // Sync temp state when modal opens
    useEffect(() => {
        if (isOpen) {
            setTempFilters(filters);
        }
    }, [isOpen]);

    // Lock body scroll when modal is open on mobile
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    const applyFilters = () => {
        setFilters(tempFilters);
        setIsOpen(false);
    };

    const resetAll = () => {
        onReset();
        setIsOpen(false);
    };

    // Location options from dynamic data
    const locationOptions = [
        { value: 'all', label: copy.all },
        ...localities.map(loc => ({ value: loc, label: loc })),
    ];

    // Type options from dynamic data
    const typeLabels: Record<string, string> = {
        apartment: copy.labels.apartment,
        house: copy.labels.house,
        land: copy.labels.land,
        commercial: copy.labels.commercial,
        cottage: copy.labels.cottage,
        garage: copy.labels.garage,
        other: copy.labels.other,
    };
    
    const typeOptions = [
        { value: 'all', label: copy.all },
        ...availableTypes.map(type => ({ value: type, label: typeLabels[type] || type })),
    ];

    return (
        <>
            {/* ===== MOBILE: Toggle Button (just the trigger) ===== */}
            <div className="w-full md:hidden">
                <button
                    onClick={() => setIsOpen(true)}
                    className="flex items-center justify-between w-full text-charcoal h-[52px] px-5 bg-white shadow-sm rounded-xl border border-navy/10"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-navy/10 flex items-center justify-center text-navy border border-navy/10">
                            <SlidersHorizontal size={13} />
                        </div>
                        <span className="uppercase tracking-widest text-[11px] font-bold text-charcoal/90">{copy.filterOffer}</span>
                    </div>
                    <ChevronDown size={16} className="text-charcoal/50" />
                </button>
            </div>

            {/* ===== MOBILE: Bottom Sheet Modal ===== */}
            <div
                className={`fixed inset-0 z-[110] flex items-end md:hidden transition-opacity duration-300 ${
                    isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
                }`}
            >
                {/* Backdrop */}
                <div
                    onClick={() => setIsOpen(false)}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                {/* Panel */}
                <div
                    className={`relative bg-white shadow-2xl overflow-hidden flex flex-col w-full h-[85vh] rounded-t-2xl transition-transform duration-300 ease-out ${
                        isOpen ? 'translate-y-0' : 'translate-y-full'
                    }`}
                >
                            {/* Swipe indicator + Close button */}
                            <div className="relative pt-6 pb-3 px-6 bg-white">
                                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-navy/10 rounded-full" />
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="absolute top-4 right-4 p-2 hover:bg-navy/5 rounded-full transition-colors"
                                >
                                    <X className="w-6 h-6 text-charcoal" />
                                </button>
                            </div>

                            {/* Content - Scrollable */}
                            <div className="px-8 pb-8 overflow-y-auto flex-1">
                                <div className="space-y-10">

                                    {/* Location Filter */}
                                    <div className="space-y-4">
                                        <label className="text-sm font-semibold text-charcoal/60 uppercase tracking-wider">
                                            {copy.locality}
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {locationOptions.map((loc) => (
                                                <button
                                                    key={loc.value}
                                                    onClick={() => setTempFilters({ ...tempFilters, locality: loc.value })}
                                                    className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-all border ${
                                                        tempFilters.locality === loc.value
                                                            ? 'bg-navy border-navy text-white shadow-lg shadow-navy/20'
                                                            : 'bg-white border-navy/10 hover:border-navy/30 hover:bg-cream text-charcoal/80'
                                                    }`}
                                                >
                                                    {loc.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Type Filter */}
                                    <div className="space-y-4">
                                        <label className="text-sm font-semibold text-charcoal/60 uppercase tracking-wider">
                                            {copy.propertyType}
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {typeOptions.map((type) => (
                                                <button
                                                    key={type.value}
                                                    onClick={() => setTempFilters({ ...tempFilters, type: type.value })}
                                                    className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-all border ${
                                                        tempFilters.type === type.value
                                                            ? 'bg-navy border-navy text-white shadow-lg shadow-navy/20'
                                                            : 'bg-white border-navy/10 hover:border-navy/30 hover:bg-cream text-charcoal/80'
                                                    }`}
                                                >
                                                    {type.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Price Range Slider */}
                                    <div className="space-y-5">
                                        <label className="text-sm font-semibold text-charcoal/60 uppercase tracking-wider">
                                            {copy.priceRange}
                                        </label>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-navy">
                                                €{tempFilters.priceRange[0].toLocaleString(locale)}
                                            </span>
                                            <span className="text-sm font-medium text-navy">
                                                €{tempFilters.priceRange[1].toLocaleString(locale)}
                                            </span>
                                        </div>
                                        <Slider
                                            value={tempFilters.priceRange}
                                            max={maxPrice}
                                            min={0}
                                            step={10000}
                                            minStepsBetweenThumbs={1}
                                            onValueChange={(value) => setTempFilters({ ...tempFilters, priceRange: value as [number, number] })}
                                            className="py-2"
                                        />
                                        <div className="flex justify-between items-center text-xs text-charcoal/40">
                                            <span>€0</span>
                                            <span>€{maxPrice.toLocaleString(locale)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer - Sticky */}
                            <div className="p-6 border-t border-navy/10 bg-cream/30 flex flex-col gap-4 z-10 sticky bottom-0 backdrop-blur-xl">
                                <button
                                    onClick={resetAll}
                                    className="text-sm text-charcoal/50 hover:text-charcoal transition-colors font-medium underline-offset-4 hover:underline"
                                >
                                    {copy.clearFilters}
                                </button>
                                <button
                                    onClick={applyFilters}
                                    className="w-full px-10 py-3.5 bg-navy text-white font-bold rounded-xl hover:bg-navy/90 transition-all shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-95"
                                >
                                    {copy.show} ({listingsCount})
                                </button>
                            </div>
                        </div>
                    </div>

            {/* ===== DESKTOP: Inline Filter Bar ===== */}
            <div className="hidden md:block w-full bg-white shadow-lg border border-navy/15 rounded-2xl py-8 px-10 mb-12">
                <div className="mx-auto">
                    <div className="flex flex-col lg:flex-row gap-6 lg:items-end justify-between">
                        {/* Filters Group */}
                        <div className="flex flex-col md:flex-row gap-4 lg:gap-8 flex-1">
                            {/* Locality */}
                            <div className="w-full md:w-56 space-y-3">
                                <label className="text-xs uppercase tracking-widest text-navy/70 font-bold">{copy.locality}</label>
                                <Select
                                    value={filters.locality}
                                    onValueChange={(value) => setFilters({ ...filters, locality: value })}
                                >
                                    <SelectTrigger className="bg-white border-2 border-navy/20 text-charcoal focus:ring-2 focus:ring-accent-red/30 rounded-xl h-12 font-medium shadow-sm">
                                        <SelectValue placeholder={copy.allLocalities} />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white border-navy/10 text-charcoal">
                                        {locationOptions.map((loc) => (
                                            <SelectItem key={loc.value} value={loc.value}>
                                                {loc.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Type */}
                            <div className="w-full md:w-56 space-y-3">
                                <label className="text-xs uppercase tracking-widest text-navy/70 font-bold">{copy.propertyType}</label>
                                <Select
                                    value={filters.type}
                                    onValueChange={(value) => setFilters({ ...filters, type: value })}
                                >
                                    <SelectTrigger className="bg-white border-2 border-navy/20 text-charcoal focus:ring-2 focus:ring-accent-red/30 rounded-xl h-12 font-medium shadow-sm">
                                        <SelectValue placeholder={copy.allTypes} />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white border-navy/10 text-charcoal">
                                        {typeOptions.map((type) => (
                                            <SelectItem key={type.value} value={type.value}>
                                                {type.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Price Range */}
                            <div className="w-full md:flex-1 max-w-md space-y-3">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs uppercase tracking-widest text-navy/70 font-bold">{copy.price}</label>
                                    <span className="text-sm text-accent-red font-bold">
                                        €{filters.priceRange[0].toLocaleString(locale)} - €{filters.priceRange[1].toLocaleString(locale)}
                                    </span>
                                </div>
                                <Slider
                                    defaultValue={[0, maxPrice]}
                                    value={filters.priceRange}
                                    max={maxPrice}
                                    step={10000}
                                    minStepsBetweenThumbs={1}
                                    onValueChange={(value) => setFilters({ ...filters, priceRange: value })}
                                    className="py-2"
                                />
                            </div>
                        </div>

                        {/* Sorting & Reset */}
                        <div className="flex items-end gap-3">
                            <div className="w-full md:w-56 space-y-3">
                                <label className="text-xs uppercase tracking-widest text-navy/70 font-bold">{copy.sort}</label>
                                <Select
                                    value={sort}
                                    onValueChange={setSort}
                                >
                                    <SelectTrigger className="bg-white border-2 border-navy/20 text-charcoal focus:ring-2 focus:ring-accent-red/30 rounded-xl h-12 font-medium shadow-sm">
                                        <SelectValue placeholder={copy.recommended} />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white border-navy/10 text-charcoal">
                                        <SelectItem value="recommended">{copy.recommended}</SelectItem>
                                        <SelectItem value="newest">{copy.newest}</SelectItem>
                                        <SelectItem value="oldest">{copy.oldest}</SelectItem>
                                        <SelectItem value="price-asc">{copy.priceAsc}</SelectItem>
                                        <SelectItem value="price-desc">{copy.priceDesc}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <button
                                onClick={onReset}
                                className="h-12 w-12 flex items-center justify-center rounded-xl border-2 border-navy/20 hover:bg-accent-red hover:border-accent-red text-navy hover:text-white transition-all duration-300 shadow-sm"
                                title={copy.clearFilters}
                            >
                                <X size={20} strokeWidth={2.5} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
