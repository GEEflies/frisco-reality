'use client';

import { useState, useEffect, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { X, ChevronDown, SlidersHorizontal } from "lucide-react";

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
}: FilterBarProps) => {
    const [isOpen, setIsOpen] = useState(false);

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
        { value: 'all', label: 'Všetky' },
        ...localities.map(loc => ({ value: loc, label: loc })),
    ];

    // Type options from dynamic data
    const typeLabels: Record<string, string> = {
        rent: 'Prenájom',
        apartment: 'Byty',
        house: 'Domy',
        land: 'Pozemky',
        other: 'Iné',
    };
    
    const typeOptions = [
        { value: 'all', label: 'Všetky' },
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
                        <span className="uppercase tracking-widest text-[11px] font-bold text-charcoal/90">Filtrovať ponuku</span>
                    </div>
                    <ChevronDown size={16} className="text-charcoal/50" />
                </button>
            </div>

            {/* ===== MOBILE: Bottom Sheet Modal ===== */}
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[110] flex items-end md:hidden">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />

                        {/* Panel */}
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="relative bg-white shadow-2xl overflow-hidden flex flex-col will-change-transform w-full h-[85vh] rounded-t-2xl"
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
                                            Lokalita
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
                                            Typ nehnuteľnosti
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
                                            Cenové rozpätie
                                        </label>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-navy">
                                                €{tempFilters.priceRange[0].toLocaleString('sk-SK')}
                                            </span>
                                            <span className="text-sm font-medium text-navy">
                                                €{tempFilters.priceRange[1].toLocaleString('sk-SK')}
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
                                            <span>€{maxPrice.toLocaleString('sk-SK')}</span>
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
                                    Zrušiť filtre
                                </button>
                                <button
                                    onClick={applyFilters}
                                    className="w-full px-10 py-3.5 bg-navy text-white font-bold rounded-xl hover:bg-navy/90 transition-all shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-95"
                                >
                                    Zobraziť ({listingsCount})
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ===== DESKTOP: Inline Filter Bar ===== */}
            <div className="hidden md:block w-full bg-white shadow-lg border border-navy/15 rounded-2xl py-8 px-10 mb-12">
                <div className="mx-auto">
                    <div className="flex flex-col lg:flex-row gap-6 lg:items-end justify-between">
                        {/* Filters Group */}
                        <div className="flex flex-col md:flex-row gap-4 lg:gap-8 flex-1">
                            {/* Locality */}
                            <div className="w-full md:w-56 space-y-3">
                                <label className="text-xs uppercase tracking-widest text-navy/70 font-bold">Lokalita</label>
                                <Select
                                    value={filters.locality}
                                    onValueChange={(value) => setFilters({ ...filters, locality: value })}
                                >
                                    <SelectTrigger className="bg-white border-2 border-navy/20 text-charcoal focus:ring-2 focus:ring-accent-red/30 rounded-xl h-12 font-medium shadow-sm">
                                        <SelectValue placeholder="Všetky lokality" />
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
                                <label className="text-xs uppercase tracking-widest text-navy/70 font-bold">Typ nehnuteľnosti</label>
                                <Select
                                    value={filters.type}
                                    onValueChange={(value) => setFilters({ ...filters, type: value })}
                                >
                                    <SelectTrigger className="bg-white border-2 border-navy/20 text-charcoal focus:ring-2 focus:ring-accent-red/30 rounded-xl h-12 font-medium shadow-sm">
                                        <SelectValue placeholder="Všetky typy" />
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
                                    <label className="text-xs uppercase tracking-widest text-navy/70 font-bold">Cena</label>
                                    <span className="text-sm text-accent-red font-bold">
                                        €{filters.priceRange[0].toLocaleString()} - €{filters.priceRange[1].toLocaleString()}
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
                                <label className="text-xs uppercase tracking-widest text-navy/70 font-bold">Zoradiť</label>
                                <Select
                                    value={sort}
                                    onValueChange={setSort}
                                >
                                    <SelectTrigger className="bg-white border-2 border-navy/20 text-charcoal focus:ring-2 focus:ring-accent-red/30 rounded-xl h-12 font-medium shadow-sm">
                                        <SelectValue placeholder="Odporúčané" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white border-navy/10 text-charcoal">
                                        <SelectItem value="recommended">Odporúčané</SelectItem>
                                        <SelectItem value="newest">Najnovšie</SelectItem>
                                        <SelectItem value="oldest">Najstaršie</SelectItem>
                                        <SelectItem value="price-asc">Najlacnejšie</SelectItem>
                                        <SelectItem value="price-desc">Najdrahšie</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <button
                                onClick={onReset}
                                className="h-12 w-12 flex items-center justify-center rounded-xl border-2 border-navy/20 hover:bg-accent-red hover:border-accent-red text-navy hover:text-white transition-all duration-300 shadow-sm"
                                title="Zrušiť filtre"
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
