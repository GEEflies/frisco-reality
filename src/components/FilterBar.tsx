'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { X, ChevronDown, SlidersHorizontal, Check, ArrowUpDown } from "lucide-react";
import { useLanguage } from '@/i18n/LanguageProvider';
import { useAllListings } from '@/hooks/useListings';
import { getCategoryType } from '@/api/mappings';
import type { ListingFilters } from '@/api/types';

const categoryCodesMap: Record<string, number[]> = {
    apartment: [4],
    house: [6, 8],
    land: [3],
    commercial: [2, 9, 7],
    cottage: [10],
    garage: [11],
};

interface FilterBarProps {
    filters: ListingFilters;
    setFilters: (newFilters: ListingFilters) => void;
    onReset: () => void;
    maxPrice: number;
    localities?: string[];
    listingsCount?: number;
    externalOpen?: boolean;
    onExternalOpenHandled?: () => void;
}

export const FilterBar = ({
    filters,
    setFilters,
    onReset,
    maxPrice,
    localities = [],
    listingsCount: _listingsCount = 0,
    externalOpen = false,
    onExternalOpenHandled,
}: FilterBarProps) => {
    const { language } = useLanguage();
    const copy = {
        sk: {
            all: 'Všetky',
            filterOffer: 'Filtrovať ponuku',
            openFilters: 'Otvoriť filtre',
            locality: 'Lokalita',
            transaction: 'Typ ponuky',
            transactionAll: 'Všetko',
            transactionSale: 'Predaj',
            transactionRent: 'Prenájom',
            priceRange: 'Cenové rozpätie',
            clearFilters: 'Zrušiť filtre',
            show: 'Zobraziť',
            results: (count: number) => `${count} nehnuteľností`,
            allLocalities: 'Všetky lokality',
            price: 'Cena',
            sort: 'Zoradiť',
            sortBy: 'Zoradiť podľa',
            recommended: 'Odporúčané',
            newest: 'Najnovšie',
            oldest: 'Najstaršie',
            priceAsc: 'Najlacnejšie',
            priceDesc: 'Najdrahšie',
            closeFilters: 'Zavrieť filtre',
        },
        en: {
            all: 'All',
            filterOffer: 'Filter listings',
            openFilters: 'Open filters',
            locality: 'Location',
            transaction: 'Listing type',
            transactionAll: 'All',
            transactionSale: 'Sale',
            transactionRent: 'Rent',
            priceRange: 'Price range',
            clearFilters: 'Clear filters',
            show: 'Show',
            results: (count: number) => `${count} results`,
            allLocalities: 'All locations',
            price: 'Price',
            sort: 'Sort',
            sortBy: 'Sort by',
            recommended: 'Recommended',
            newest: 'Newest',
            oldest: 'Oldest',
            priceAsc: 'Lowest price',
            priceDesc: 'Highest price',
            closeFilters: 'Close filters',
        },
        de: {
            all: 'Alle',
            filterOffer: 'Angebote filtern',
            openFilters: 'Filter öffnen',
            locality: 'Standort',
            transaction: 'Angebotsart',
            transactionAll: 'Alle',
            transactionSale: 'Verkauf',
            transactionRent: 'Miete',
            priceRange: 'Preisspanne',
            clearFilters: 'Filter zurücksetzen',
            show: 'Anzeigen',
            results: (count: number) => `${count} Immobilien`,
            allLocalities: 'Alle Standorte',
            price: 'Preis',
            sort: 'Sortieren',
            sortBy: 'Sortieren nach',
            recommended: 'Empfohlen',
            newest: 'Neueste',
            oldest: 'Älteste',
            priceAsc: 'Niedrigster Preis',
            priceDesc: 'Höchster Preis',
            closeFilters: 'Filter schließen',
        },
    }[language];
    const locale = language === 'sk' ? 'sk-SK' : language === 'de' ? 'de-DE' : 'en-US';

    const [isOpen, setIsOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const mobileSortRef = useRef<HTMLDivElement>(null);

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

    // Temp filter state for the mobile modal (only applied on "Show")
    const [tempFilters, setTempFilters] = useState<ListingFilters>(filters);

    // Sync temp state when modal opens
    useEffect(() => {
        if (isOpen) {
            setTempFilters(filters);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

    // Close mobile sort dropdown on click outside
    const [mobileSortOpen, setMobileSortOpen] = useState(false);
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (mobileSortRef.current && !mobileSortRef.current.contains(e.target as Node)) {
                setMobileSortOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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

    // Sort options
    const sortOptions = [
        { value: 'newest' as const, label: copy.newest },
        { value: 'oldest' as const, label: copy.oldest },
        { value: 'price-asc' as const, label: copy.priceAsc },
        { value: 'price-desc' as const, label: copy.priceDesc },
        { value: 'recommended' as const, label: copy.recommended },
    ];

    // ── Cascading counts & live preview for the mobile sheet ──
    const { data: allListings = [] } = useAllListings();

    // Live preview: compute count matching tempFilters
    const previewCount = useMemo(() => {
        let pool = allListings;

        if (tempFilters.transaction === 'sale') pool = pool.filter(l => l.action === 1);
        else if (tempFilters.transaction === 'rent') pool = pool.filter(l => l.action === 3);

        const cat = tempFilters.category;
        if (cat && cat !== 'all') {
            pool = pool.filter(l => getCategoryType(l.category) === cat);
        }

        const loc = tempFilters.locality;
        if (loc && loc !== 'all') {
            pool = pool.filter(l => l.location_city === loc || l.location_district === loc);
        }

        const [min, max] = tempFilters.priceRange || [0, 0];
        if (min > 0) pool = pool.filter(l => (l.price || 0) >= min);
        if (max > 0 && max < maxPrice) pool = pool.filter(l => (l.price || 0) <= max);

        return pool.length;
    }, [allListings, tempFilters, maxPrice]);

    // Apply transaction filter to get the base pool for cascading counts
    const baseListings = useMemo(() => {
        let result = allListings;
        if (tempFilters.transaction === 'sale') result = result.filter(l => l.action === 1);
        else if (tempFilters.transaction === 'rent') result = result.filter(l => l.action === 3);
        return result;
    }, [allListings, tempFilters.transaction]);

    // Counts per locality given the current category + price temp filters
    const locationCounts = useMemo(() => {
        let pool = baseListings;
        const cat = tempFilters.category;
        if (cat && cat !== 'all') {
            const codes = categoryCodesMap[cat];
            if (codes) pool = pool.filter(l => codes.includes(l.category));
        }
        const [min, max] = tempFilters.priceRange || [0, 0];
        if (min > 0) pool = pool.filter(l => (l.price || 0) >= min);
        if (max > 0 && max < maxPrice) pool = pool.filter(l => (l.price || 0) <= max);

        const counts: Record<string, number> = {};
        for (const l of pool) {
            const city = l.location_city;
            const district = l.location_district;
            if (city) counts[city] = (counts[city] || 0) + 1;
            if (district && district !== city) counts[district] = (counts[district] || 0) + 1;
        }
        return counts;
    }, [baseListings, tempFilters.category, tempFilters.priceRange, maxPrice]);

    // Transaction counts (given category + locality + price temp filters, excluding transaction itself)
    const transactionCounts = useMemo(() => {
        let pool = allListings;
        const cat = tempFilters.category;
        if (cat && cat !== 'all') {
            pool = pool.filter(l => getCategoryType(l.category) === cat);
        }
        const loc = tempFilters.locality;
        if (loc && loc !== 'all') {
            pool = pool.filter(l => l.location_city === loc || l.location_district === loc);
        }
        const [min, max] = tempFilters.priceRange || [0, 0];
        if (min > 0) pool = pool.filter(l => (l.price || 0) >= min);
        if (max > 0 && max < maxPrice) pool = pool.filter(l => (l.price || 0) <= max);

        return {
            all: pool.length,
            sale: pool.filter(l => l.action === 1).length,
            rent: pool.filter(l => l.action === 3).length,
        };
    }, [allListings, tempFilters.category, tempFilters.locality, tempFilters.priceRange, maxPrice]);

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
                        <h3 className="mt-2 text-2xl font-serif font-bold text-navy">{copy.results(previewCount)}</h3>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="absolute right-4 top-4 rounded-full p-2 transition-colors hover:bg-navy/5"
                        aria-label={copy.closeFilters}
                    >
                        <X className="h-6 w-6 text-charcoal" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 pb-6 pt-5">
                    <div className="space-y-8">
                        {/* Transaction toggle */}
                        <div className="space-y-4">
                            <label className="text-sm font-semibold uppercase tracking-wider text-charcoal/60">
                                {copy.transaction}
                            </label>
                            <div className="flex gap-2">
                                {([
                                    { value: 'all' as const, label: copy.transactionAll, count: transactionCounts.all },
                                    { value: 'sale' as const, label: copy.transactionSale, count: transactionCounts.sale },
                                    { value: 'rent' as const, label: copy.transactionRent, count: transactionCounts.rent },
                                ]).map((opt) => {
                                    if (opt.value !== 'all' && opt.count === 0) return null;
                                    const isSelected = (tempFilters.transaction || 'all') === opt.value;
                                    return (
                                        <button
                                            key={opt.value}
                                            onClick={() => setTempFilters(prev => ({ ...prev, transaction: opt.value }))}
                                            className={`flex-1 rounded-xl border px-4 py-3 text-sm font-semibold transition-all ${
                                                isSelected
                                                    ? 'border-navy bg-navy text-white shadow-lg shadow-navy/20'
                                                    : 'border-navy/10 bg-white text-charcoal/80 hover:border-navy/30 hover:bg-cream'
                                            }`}
                                        >
                                            {opt.label}
                                            {opt.value !== 'all' && <span className="ml-1 text-xs opacity-60">({opt.count})</span>}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Locality chips */}
                        <div className="space-y-4">
                            <label className="text-sm font-semibold uppercase tracking-wider text-charcoal/60">
                                {copy.locality}
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {locationOptions.map((loc) => {
                                    const count = loc.value === 'all' ? null : (locationCounts[loc.value] ?? 0);
                                    if (count === 0) return null;
                                    const isSelected = (tempFilters.locality || 'all') === loc.value;
                                    return (
                                        <button
                                            key={loc.value}
                                            onClick={() => setTempFilters(prev => ({ ...prev, locality: loc.value }))}
                                            className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${
                                                isSelected
                                                    ? 'border-navy bg-navy text-white shadow-lg shadow-navy/20'
                                                    : 'border-navy/10 bg-white text-charcoal/80 hover:border-navy/30 hover:bg-cream'
                                            }`}
                                        >
                                            {loc.label}{count !== null ? ` (${count})` : ''}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Price range slider */}
                        <div className="space-y-5">
                            <label className="text-sm font-semibold uppercase tracking-wider text-charcoal/60">
                                {copy.priceRange}
                            </label>
                            <div className="flex items-center justify-between rounded-2xl bg-cream px-4 py-3">
                                <span className="text-sm font-semibold text-navy">
                                    €{(tempFilters.priceRange?.[0] ?? 0).toLocaleString(locale)}
                                </span>
                                <span className="text-sm font-semibold text-navy">
                                    €{(tempFilters.priceRange?.[1] ?? maxPrice).toLocaleString(locale)}
                                </span>
                            </div>
                            <Slider
                                value={tempFilters.priceRange || [0, maxPrice]}
                                max={maxPrice}
                                min={0}
                                step={10000}
                                minStepsBetweenThumbs={1}
                                onValueChange={(value) => setTempFilters(prev => ({ ...prev, priceRange: value as [number, number] }))}
                                className="py-2"
                            />
                            <div className="flex items-center justify-between text-xs text-charcoal/40">
                                <span>€0</span>
                                <span>€{maxPrice.toLocaleString(locale)}</span>
                            </div>
                        </div>

                        {/* Sort */}
                        <div className="space-y-4">
                            <label className="text-sm font-semibold uppercase tracking-wider text-charcoal/60">
                                {copy.sortBy}
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {sortOptions.map((opt) => {
                                    const isSelected = (tempFilters.sort || 'newest') === opt.value;
                                    return (
                                        <button
                                            key={opt.value}
                                            onClick={() => setTempFilters(prev => ({ ...prev, sort: opt.value }))}
                                            className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${
                                                isSelected
                                                    ? 'border-navy bg-navy text-white shadow-lg shadow-navy/20'
                                                    : 'border-navy/10 bg-white text-charcoal/80 hover:border-navy/30 hover:bg-cream'
                                            }`}
                                        >
                                            {opt.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="sticky bottom-0 z-10 flex flex-col gap-4 border-t border-navy/10 bg-white/95 p-6 backdrop-blur-xl [padding-bottom:calc(env(safe-area-inset-bottom)+1.5rem)]">
                    <button
                        onClick={applyFilters}
                        className="w-full rounded-xl bg-navy py-4 text-sm font-semibold uppercase tracking-widest text-white shadow-lg transition-all duration-300 hover:bg-accent-red hover:shadow-xl"
                    >
                        {copy.show} ({previewCount})
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

            {/* ===== MOBILE: Trigger button + Sort ===== */}
            <div className="flex gap-3 md:hidden">
                <button
                    type="button"
                    onClick={() => setIsOpen(true)}
                    className="flex flex-1 items-center justify-between rounded-2xl border border-navy/12 bg-white px-4 py-3 text-left shadow-sm transition-all duration-300 hover:border-navy/25 hover:shadow-md"
                    aria-label={copy.openFilters}
                >
                    <div className="flex items-center gap-3">
                        <SlidersHorizontal size={20} strokeWidth={2.2} className="text-black" />
                        <span className="text-sm font-bold uppercase tracking-[0.18em] text-navy">
                            {copy.filterOffer}
                        </span>
                    </div>
                    <ChevronDown size={18} className="text-charcoal/45" />
                </button>

                {/* Mobile sort button */}
                <div className="relative" ref={mobileSortRef}>
                    <button
                        onClick={() => setMobileSortOpen(!mobileSortOpen)}
                        className={`h-[50px] w-[50px] flex items-center justify-center rounded-xl border transition-all duration-300 shadow-sm ${
                            mobileSortOpen || (filters.sort && filters.sort !== 'newest')
                                ? 'bg-navy text-white border-navy shadow-md'
                                : 'bg-white text-navy border-navy/10 hover:border-navy/30'
                        }`}
                        title={copy.sort}
                    >
                        <ArrowUpDown size={18} strokeWidth={2.5} />
                    </button>

                    {mobileSortOpen && (
                        <div className="absolute right-0 top-[60px] z-50 w-52 bg-white rounded-2xl border border-navy/10 shadow-xl overflow-hidden">
                            <div className="py-2">
                                <div className="px-4 py-2 text-[10px] font-bold tracking-widest uppercase text-charcoal/40">
                                    {copy.sortBy}
                                </div>
                                {sortOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => {
                                            setFilters({ ...filters, sort: option.value });
                                            setMobileSortOpen(false);
                                        }}
                                        className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors ${
                                            filters.sort === option.value
                                                ? 'bg-navy/5 text-navy font-semibold'
                                                : 'text-charcoal/70 hover:bg-cream'
                                        }`}
                                    >
                                        <span>{option.label}</span>
                                        {filters.sort === option.value && (
                                            <Check size={16} className="text-navy" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
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
                                    value={filters.locality || 'all'}
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

                            {/* Price Range */}
                            <div className="w-full md:flex-1 max-w-md space-y-3">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs uppercase tracking-widest text-navy/70 font-bold">{copy.price}</label>
                                    <span className="text-sm text-accent-red font-bold">
                                        €{(filters.priceRange?.[0] ?? 0).toLocaleString(locale)} - €{(filters.priceRange?.[1] ?? maxPrice).toLocaleString(locale)}
                                    </span>
                                </div>
                                <Slider
                                    value={filters.priceRange || [0, maxPrice]}
                                    max={maxPrice}
                                    step={10000}
                                    minStepsBetweenThumbs={1}
                                    onValueChange={(value) => setFilters({ ...filters, priceRange: value as [number, number] })}
                                    className="py-2"
                                />
                            </div>
                        </div>

                        {/* Sorting & Reset */}
                        <div className="flex items-end gap-3">
                            <div className="w-full md:w-56 space-y-3">
                                <label className="text-xs uppercase tracking-widest text-navy/70 font-bold">{copy.sort}</label>
                                <Select
                                    value={filters.sort || 'newest'}
                                    onValueChange={(value) => setFilters({ ...filters, sort: value as ListingFilters['sort'] })}
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
