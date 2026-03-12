'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

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

    const mobileSheet = isMounted ? createPortal(
        <div
            className={`fixed inset-0 z-[250] flex items-end md:hidden transition-opacity duration-300 ${
                isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
            }`}
            aria-hidden={!isOpen}
        >
            <div
                onClick={() => setIsOpen(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />

            <div
                className={`relative z-[251] flex w-full max-h-[88svh] min-h-[70svh] flex-col overflow-hidden rounded-t-[28px] border-t border-white/60 bg-white shadow-[0_-24px_80px_rgba(0,0,0,0.28)] transition-transform duration-300 ease-out ${
                    isOpen ? 'translate-y-0' : 'translate-y-full'
                }`}
            >
                <div className="relative border-b border-navy/8 bg-white px-6 pb-4 pt-6">
                    <div className="absolute left-1/2 top-2 h-1.5 w-12 -translate-x-1/2 rounded-full bg-navy/10" />
                    <div className="pr-12">
                        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-charcoal/45">{copy.filterOffer}</p>
                        <h3 className="mt-2 text-2xl font-serif font-bold text-navy">{listingsCount} results</h3>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="absolute right-4 top-4 rounded-full p-2 transition-colors hover:bg-navy/5"
                        aria-label="Close filters"
                    >
                        <X className="h-6 w-6 text-charcoal" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 pb-6 pt-5">
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <label className="text-sm font-semibold uppercase tracking-wider text-charcoal/60">
                                {copy.locality}
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {locationOptions.map((loc) => (
                                    <button
                                        key={loc.value}
                                        onClick={() => setTempFilters({ ...tempFilters, locality: loc.value })}
                                        className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${
                                            tempFilters.locality === loc.value
                                                ? 'border-navy bg-navy text-white shadow-lg shadow-navy/20'
                                                : 'border-navy/10 bg-white text-charcoal/80 hover:border-navy/30 hover:bg-cream'
                                        }`}
                                    >
                                        {loc.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-sm font-semibold uppercase tracking-wider text-charcoal/60">
                                {copy.propertyType}
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {typeOptions.map((type) => (
                                    <button
                                        key={type.value}
                                        onClick={() => setTempFilters({ ...tempFilters, type: type.value })}
                                        className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${
                                            tempFilters.type === type.value
                                                ? 'border-navy bg-navy text-white shadow-lg shadow-navy/20'
                                                : 'border-navy/10 bg-white text-charcoal/80 hover:border-navy/30 hover:bg-cream'
                                        }`}
                                    >
                                        {type.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-5">
                            <label className="text-sm font-semibold uppercase tracking-wider text-charcoal/60">
                                {copy.priceRange}
                            </label>
                            <div className="flex items-center justify-between rounded-2xl bg-cream px-4 py-3">
                                <span className="text-sm font-semibold text-navy">
                                    €{tempFilters.priceRange[0].toLocaleString(locale)}
                                </span>
                                <span className="text-sm font-semibold text-navy">
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
                            <div className="flex items-center justify-between text-xs text-charcoal/40">
                                <span>€0</span>
                                <span>€{maxPrice.toLocaleString(locale)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="sticky bottom-0 z-10 flex flex-col gap-4 border-t border-navy/10 bg-white/95 p-6 backdrop-blur-xl [padding-bottom:calc(env(safe-area-inset-bottom)+1.5rem)]">
                    <button
                        onClick={applyFilters}
                        className="w-full rounded-xl bg-navy py-4 text-sm font-semibold uppercase tracking-widest text-white shadow-lg transition-all duration-300 hover:bg-accent-red hover:shadow-xl"
                    >
                        {copy.show} ({listingsCount})
                    </button>
                    <button
                        onClick={resetAll}
                        className="text-sm font-medium text-charcoal/50 transition-colors hover:text-charcoal hover:underline underline-offset-4"
                    >
                        {copy.clearFilters}
                    </button>
                </div>
            </div>
        </div>,
        document.body,
    ) : null;

    return (
        <>
            {mobileSheet}

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
