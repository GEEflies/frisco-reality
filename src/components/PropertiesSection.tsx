'use client';

import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect, useMemo } from 'react';
import { Bed, Bath, Square, Building2, Home, Map, Key, Warehouse, Maximize, Trees, Loader2, ArrowUpDown, Check, SlidersHorizontal, SearchX, Phone, Mail, LayoutGrid } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FilterBar } from './FilterBar';
import { ListingCard } from './ListingCard';
import { useListings, useListingFilters } from '@/hooks/useListings';
import { categoryLabels, transactionLabels, formatPrice, formatArea, getCategoryType, getStatusColor, statusLabels, getLocalizedTitle, getLocalizedDescription } from '@/api/mappings';
import { getPrimaryImage, shouldShowOverlay } from '@/api/listingsService';
import type { ListingFilters } from '@/api/types';
import { useLanguage } from '@/i18n/LanguageProvider';
import { localePath } from '@/i18n/types';

export const PropertiesSection = () => {
  const { language } = useLanguage();
  const ref = useRef(null);
  const filterWrapperRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const router = useRouter();
  const searchParams = useSearchParams();

  // Filter State
  const [filters, setFilters] = useState<ListingFilters>({
    category: 'all',
    transaction: 'all',
    locality: 'all',
    priceRange: [0, 10000000],
    sort: 'recommended',
  });

  // Sort dropdown state (mobile)
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  
  // Floating filter button state (desktop)
  const [showFloatingFilter, setShowFloatingFilter] = useState(false);

  const copy = {
    sk: {
      headingLabel: 'Aktuálna ponuka',
      categoryNames: { apartment: 'Byty', house: 'Domy', land: 'Pozemky', commercial: 'Komerčné', cottage: 'Chaty', garage: 'Garáže', other: 'Iné' },
      rent: 'Prenájom',
      featuredStart: 'Vybrané',
      featuredAccent: 'nehnuteľnosti',
      filters: { all: 'Všetky', rent: 'Prenájom', apartment: 'Byty', house: 'Domy', land: 'Pozemky', commercial: 'Komerčné', cottage: 'Chaty', garage: 'Garáže', other: 'Iné' },
      sortTitle: 'Zoradiť',
      sortBy: 'Zoradiť podľa',
      sortOptions: {
        newest: 'Najnovšie',
        oldest: 'Najstaršie',
        'price-asc': 'Najlacnejšie',
        'price-desc': 'Najdrahšie',
        recommended: 'Odporúčané',
      },
      loading: 'Načítavam...',
      found: (count: number) => `Nájdených ${count} nehnuteľností`,
      error: 'Nastala chyba pri načítaní nehnuteľností.',
      retry: 'Skúsiť znova',
      emptyTitleStart: 'Nenašli ste, čo',
      emptyTitleAccent: 'hľadáte?',
      emptyDescription: 'Nič sa nedeje. Ozvite sa nám a spoločne nájdeme niečo podobné.',
      resetFilters: 'Zrušiť filter a zobraziť všetko',
      showFilters: 'Zobraziť filtre',
      statuses: {
        reserved: 'Rezervované',
        sold: 'Predané',
        newBuild: 'Novostavba',
        rent: 'Prenájom',
        sale: 'Na predaj',
      },
      roomsUnit: 'izby',
    },
    en: {
      headingLabel: 'Current offer',
      categoryNames: { apartment: 'Apartments', house: 'Houses', land: 'Land', commercial: 'Commercial', cottage: 'Cottages', garage: 'Garages', other: 'Other' },
      rent: 'Rent',
      featuredStart: 'Featured',
      featuredAccent: 'properties',
      filters: { all: 'All', rent: 'Rent', apartment: 'Apartments', house: 'Houses', land: 'Land', commercial: 'Commercial', cottage: 'Cottages', garage: 'Garages', other: 'Other' },
      sortTitle: 'Sort',
      sortBy: 'Sort by',
      sortOptions: {
        newest: 'Newest',
        oldest: 'Oldest',
        'price-asc': 'Lowest price',
        'price-desc': 'Highest price',
        recommended: 'Recommended',
      },
      loading: 'Loading...',
      found: (count: number) => `${count} properties found`,
      error: 'An error occurred while loading properties.',
      retry: 'Try again',
      emptyTitleStart: "Couldn\'t find what",
      emptyTitleAccent: 'you are looking for?',
      emptyDescription: 'No worries. Reach out and we will find something similar together.',
      resetFilters: 'Clear filters and show all',
      showFilters: 'Show filters',
      statuses: {
        reserved: 'Reserved',
        sold: 'Sold',
        newBuild: 'New build',
        rent: 'Rent',
        sale: 'For sale',
      },
      roomsUnit: 'rooms',
    },
    de: {
      headingLabel: 'Aktuelle Angebote',
      categoryNames: { apartment: 'Wohnungen', house: 'Häuser', land: 'Grundstücke', commercial: 'Gewerbe', cottage: 'Ferienhäuser', garage: 'Garagen', other: 'Sonstiges' },
      rent: 'Miete',
      featuredStart: 'Ausgewählte',
      featuredAccent: 'Immobilien',
      filters: { all: 'Alle', rent: 'Miete', apartment: 'Wohnungen', house: 'Häuser', land: 'Grundstücke', commercial: 'Gewerbe', cottage: 'Ferienhäuser', garage: 'Garagen', other: 'Sonstiges' },
      sortTitle: 'Sortieren',
      sortBy: 'Sortieren nach',
      sortOptions: {
        newest: 'Neueste',
        oldest: 'Älteste',
        'price-asc': 'Niedrigster Preis',
        'price-desc': 'Höchster Preis',
        recommended: 'Empfohlen',
      },
      loading: 'Lädt...',
      found: (count: number) => `${count} Immobilien gefunden`,
      error: 'Beim Laden der Immobilien ist ein Fehler aufgetreten.',
      retry: 'Erneut versuchen',
      emptyTitleStart: 'Nichts gefunden, was Sie',
      emptyTitleAccent: 'suchen?',
      emptyDescription: 'Kein Problem. Kontaktieren Sie uns und wir finden gemeinsam etwas Ähnliches.',
      resetFilters: 'Filter zurücksetzen und alles anzeigen',
      showFilters: 'Filter anzeigen',
      statuses: {
        reserved: 'Reserviert',
        sold: 'Verkauft',
        newBuild: 'Neubau',
        rent: 'Miete',
        sale: 'Zu verkaufen',
      },
      roomsUnit: 'Zimmer',
    },
  }[language];

  // Fetch listings with filters
  const { data: listings = [], isLoading, error } = useListings(filters);
  const { maxPrice, localities, availableTypes } = useListingFilters();

  // Initialize from URL params
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const typeParam = searchParams.get('type');

    if (categoryParam) {
      setFilters(prev => ({ ...prev, category: categoryParam }));
    } else if (typeParam === 'rent') {
      setFilters(prev => ({ ...prev, transaction: 'rent' }));
    }
  }, [searchParams]);

  // Close sort dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Track filter bar visibility for floating button
  useEffect(() => {
    const handleScroll = () => {
      if (filterWrapperRef.current) {
        const rect = filterWrapperRef.current.getBoundingClientRect();
        // Show floating button when filter wrapper top is above viewport
        // This means: as soon as you scroll past the filter section, the button appears
        const isMobile = window.innerWidth < 768;
        const triggerOffset = isMobile ? 100 : 60;
        setShowFloatingFilter(rect.top < -triggerOffset);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update price range when max changes
  useEffect(() => {
    if (maxPrice > 0) {
      setFilters(prev => ({
        ...prev,
        priceRange: [0, maxPrice],
      }));
    }
  }, [maxPrice]);

  const resetFilters = () => {
    setFilters({
      category: 'all',
      transaction: 'all',
      locality: 'all',
      priceRange: [0, maxPrice],
      sort: 'recommended',
    });
  };

  // Scroll to filter bar
  const scrollToFilters = () => {
    if (filterWrapperRef.current) {
      const yOffset = -100; // Offset from top
      const y = filterWrapperRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Get status badge info
  const getListingStatus = (listing: typeof listings[0]) => {
    if (listing.status === 3) return { label: copy.statuses.reserved, color: 'bg-amber-500' };
    if (listing.status === 4) return { label: copy.statuses.sold, color: 'bg-red-500' };
    if (listing.condition === 6 && listing.age && listing.age >= new Date().getFullYear() - 10) return { label: copy.statuses.newBuild, color: 'bg-emerald-500' };
    if (listing.action === 3) return { label: copy.statuses.rent, color: 'bg-sky-500' };
    return { label: copy.statuses.sale, color: 'bg-navy' };
  };

  // Get features for listing card
  const getFeatures = (listing: typeof listings[0]) => {
    const features = [];

    if (listing.usable_area) {
      features.push({ icon: Maximize, label: formatArea(listing.usable_area) });
    }

    if (listing.rooms_count) {
      features.push({ icon: Home, label: `${listing.rooms_count} ${copy.roomsUnit}` });
    }

    if (listing.plot_area) {
      features.push({ icon: Trees, label: formatArea(listing.plot_area) });
    }

    // Fallback if no features
    if (features.length === 0 && listing.building_area) {
      features.push({ icon: Square, label: formatArea(listing.building_area) });
    }

    return features;
  };

  // Handle listing click
  const handleListingClick = (listing: any) => {
    const identifier = listing.slug || listing.id;
    router.push(localePath(`/nehnutelnost/${identifier}`, language));
  };

  // Sort options for mobile dropdown
  const sortOptions = [
    { value: 'newest', label: copy.sortOptions.newest },
    { value: 'oldest', label: copy.sortOptions.oldest },
    { value: 'price-asc', label: copy.sortOptions['price-asc'] },
    { value: 'price-desc', label: copy.sortOptions['price-desc'] },
    { value: 'recommended', label: copy.sortOptions.recommended },
  ] as const;

  return (
    <>
    <section id="ponuka" className="reveal relative pt-20 pb-32 bg-cream overflow-hidden min-h-screen" ref={ref}>
      <div className="container mx-auto px-4 md:px-8 relative z-10">

        {/* Header */}
        <div className="mb-12" ref={filterWrapperRef}>
          <motion.div
            className="text-navy font-mono text-sm tracking-[0.2em] uppercase mb-4"
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            {copy.headingLabel}
          </motion.div>
          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-navy mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {filters.category && filters.category !== 'all' ? (
              <span className="uppercase">{
                (copy.categoryNames as Record<string, string>)[filters.category] || filters.category
              }</span>
            ) : filters.transaction === 'rent' ? (
              <span className="uppercase">{copy.rent}</span>
            ) : (
              <>{copy.featuredStart} <span className="text-accent-red italic">{copy.featuredAccent}</span></>
            )}
          </motion.h2>

          {/* Quick Category Filters */}
          <motion.div
            className="flex flex-wrap gap-3 mb-6 md:mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            {/* Mobile grid: 3 on top, 3 on bottom */}
            <div className="w-full grid grid-cols-3 gap-3 md:hidden">
              {[
                { id: 'all', label: copy.filters.all, icon: LayoutGrid, isAll: true },
                { id: 'rent', label: copy.filters.rent, icon: Key, isTransaction: true },
                { id: 'apartment', label: copy.filters.apartment, icon: Building2 },
              ].map((cat) => {
                const isActive = cat.isAll
                  ? filters.category === 'all' && filters.transaction === 'all'
                  : cat.isTransaction
                    ? filters.transaction === 'rent'
                    : filters.category === cat.id;

                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      if (cat.isAll) {
                        setFilters(prev => ({
                          ...prev,
                          category: 'all',
                          transaction: 'all',
                        }));
                      } else if (cat.isTransaction) {
                        setFilters(prev => ({
                          ...prev,
                          transaction: prev.transaction === 'rent' ? 'all' : 'rent',
                          category: 'all',
                        }));
                      } else {
                        setFilters(prev => ({
                          ...prev,
                          category: prev.category === cat.id ? 'all' : cat.id,
                          transaction: 'all',
                        }));
                      }
                    }}
                    className={`
                      flex items-center justify-center gap-2.5 py-3 rounded-full border transition-all duration-300
                      ${isActive
                        ? 'bg-navy text-white border-navy shadow-md'
                        : 'bg-white text-charcoal/70 border-charcoal/15 hover:border-charcoal/30'}
                    `}
                  >
                    <cat.icon size={16} strokeWidth={1.8} />
                    <span className="text-xs font-semibold tracking-wider uppercase">{cat.label}</span>
                  </button>
                );
              })}
            </div>
            <div className="w-full grid grid-cols-3 gap-3 md:hidden">
              {[
                { id: 'house', label: copy.filters.house, icon: Home },
                { id: 'land', label: copy.filters.land, icon: Map },
                { id: 'other', label: copy.filters.other, icon: Warehouse },
              ].map((cat) => {
                const isActive = filters.category === cat.id;

                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setFilters(prev => ({
                        ...prev,
                        category: prev.category === cat.id ? 'all' : cat.id,
                        transaction: 'all',
                      }));
                    }}
                    className={`
                      flex items-center justify-center gap-2.5 py-3 rounded-full border transition-all duration-300
                      ${isActive
                        ? 'bg-navy text-white border-navy shadow-md'
                        : 'bg-white text-charcoal/70 border-charcoal/15 hover:border-charcoal/30'}
                    `}
                  >
                    <cat.icon size={16} strokeWidth={1.8} />
                    <span className="text-xs font-semibold tracking-wider uppercase">{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Desktop: original horizontal wrap */}
            <div className="hidden md:flex flex-wrap gap-3">
              {[
                { id: 'all', label: copy.filters.all, icon: LayoutGrid, isAll: true },
                { id: 'rent', label: copy.filters.rent, icon: Key, isTransaction: true },
                { id: 'apartment', label: copy.filters.apartment, icon: Building2 },
                { id: 'house', label: copy.filters.house, icon: Home },
                { id: 'land', label: copy.filters.land, icon: Map },
                { id: 'other', label: copy.filters.other, icon: Warehouse },
              ].map((cat) => {
                const isActive = cat.isAll
                  ? filters.category === 'all' && filters.transaction === 'all'
                  : cat.isTransaction
                    ? filters.transaction === 'rent'
                    : filters.category === cat.id;

                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      if (cat.isAll) {
                        setFilters(prev => ({
                          ...prev,
                          category: 'all',
                          transaction: 'all',
                        }));
                      } else if (cat.isTransaction) {
                        setFilters(prev => ({
                          ...prev,
                          transaction: prev.transaction === 'rent' ? 'all' : 'rent',
                          category: 'all',
                        }));
                      } else {
                        setFilters(prev => ({
                          ...prev,
                          category: prev.category === cat.id ? 'all' : cat.id,
                          transaction: 'all',
                        }));
                      }
                    }}
                    className={`
                      flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all duration-300
                      ${isActive
                        ? 'bg-navy text-white border-navy shadow-md transform scale-105'
                        : 'bg-white text-navy/70 border-navy/10 hover:border-navy/30 hover:bg-navy/5'}
                    `}
                  >
                    <cat.icon size={16} strokeWidth={2} />
                    <span className="text-xs font-bold tracking-widest uppercase">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Mobile: Filter + Sort Row */}
          <motion.div
            className="flex md:hidden gap-3 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Filter Bar wrapper - takes most space */}
            <div className="flex-1">
              <FilterBar
                filters={{
                  locality: filters.locality || 'all',
                  type: filters.category || 'all',
                  priceRange: filters.priceRange || [0, maxPrice],
                }}
                setFilters={(newFilters) => setFilters(prev => ({
                  ...prev,
                  locality: newFilters.locality,
                  category: newFilters.type,
                  priceRange: newFilters.priceRange,
                }))}
                sort={filters.sort || 'recommended'}
                setSort={(sort) => setFilters(prev => ({ ...prev, sort: sort as ListingFilters['sort'] }))}
                onReset={resetFilters}
                maxPrice={maxPrice}
                localities={localities}
                availableTypes={availableTypes}
                listingsCount={listings.length}
              />
            </div>

            {/* Sort Button */}
            <div className="relative" ref={sortRef}>
              <button
                onClick={() => setSortOpen(!sortOpen)}
                className={`h-[52px] w-[52px] flex items-center justify-center rounded-xl border transition-all duration-300 shadow-sm ${
                  sortOpen || (filters.sort && filters.sort !== 'recommended')
                    ? 'bg-navy text-white border-navy shadow-md'
                    : 'bg-white text-navy border-navy/10 hover:border-navy/30'
                }`}
                title={copy.sortTitle}
              >
                <ArrowUpDown size={18} strokeWidth={2.5} />
              </button>

              {/* Sort Dropdown */}
              <AnimatePresence>
                {sortOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-[60px] z-50 w-52 bg-white rounded-2xl border border-navy/10 shadow-xl overflow-hidden"
                  >
                    <div className="py-2">
                      <div className="px-4 py-2 text-[10px] font-bold tracking-widest uppercase text-charcoal/40">
                        {copy.sortBy}
                      </div>
                      {sortOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setFilters(prev => ({ ...prev, sort: option.value }));
                            setSortOpen(false);
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
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Desktop Filter Bar */}
          <motion.div
            className="hidden md:block"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <FilterBar
              filters={{
                locality: filters.locality || 'all',
                type: filters.category || 'all',
                priceRange: filters.priceRange || [0, maxPrice],
              }}
              setFilters={(newFilters) => setFilters(prev => ({
                ...prev,
                locality: newFilters.locality,
                category: newFilters.type,
                priceRange: newFilters.priceRange,
              }))}
              sort={filters.sort || 'recommended'}
              setSort={(sort) => setFilters(prev => ({ ...prev, sort: sort as ListingFilters['sort'] }))}
              onReset={resetFilters}
              maxPrice={maxPrice}
              localities={localities}
              availableTypes={availableTypes}
              listingsCount={listings.length}
            />
          </motion.div>
        </div>

        {/* Results Info */}
        <div className={`mb-6 text-charcoal/50 text-sm tracking-widest uppercase ${listings.length === 0 && !isLoading ? 'hidden' : ''}`}>
          {isLoading ? copy.loading : copy.found(listings.length)}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-navy" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-24 border border-dashed border-red-200 rounded-3xl bg-red-50">
            <p className="text-xl text-red-600 font-serif mb-4">{copy.error}</p>
            <button onClick={() => window.location.reload()} className="text-accent-red hover:underline underline-offset-4">
              {copy.retry}
            </button>
          </div>
        )}

        {/* Properties Grid */}
        {!isLoading && !error && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {listings.map((listing, idx) => {
                const status = getListingStatus(listing);
                const features = getFeatures(listing);
                const image = getPrimaryImage(listing);
                const primaryImg = listing.images?.sort((a, b) => a.sort_order - b.sort_order)[0];
                const priceLabel = listing.action === 3
                  ? `${formatPrice(listing.price)}/mes.`
                  : formatPrice(listing.price);

                return (
                  <motion.div
                    key={listing.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: Math.min(idx * 0.05, 0.3) }}
                  >
                    <ListingCard
                      title={getLocalizedTitle(listing, language)}
                      price={priceLabel}
                      location={[listing.location_city, listing.location_district].filter(Boolean).join(', ') || listing.street || 'Slovensko'}
                      description={getLocalizedDescription(listing, language) || undefined}
                      image={image ?? undefined}
                      showOverlay={primaryImg ? shouldShowOverlay(primaryImg) : false}
                      status={status.label}
                      statusColor={status.color}
                      features={features}
                      onClick={() => handleListingClick(listing)}
                    />
                  </motion.div>
                );
              })}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && listings.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center pt-8 pb-20 px-6 text-center"
          >
            <div className="w-20 h-20 bg-navy/5 rounded-full flex items-center justify-center mb-8">
              <SearchX size={32} className="text-navy/60" strokeWidth={1.5} />
            </div>
            
            <h3 className="text-3xl md:text-5xl font-serif font-bold text-navy mb-6 tracking-tight">
              {copy.emptyTitleStart} <span className="italic text-accent-red">{copy.emptyTitleAccent}</span>
            </h3>
            
            <p className="text-lg text-charcoal/60 mb-10 max-w-2xl mx-auto leading-relaxed">
              {copy.emptyDescription}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-10">
              <a
                href="tel:+421905447220"
                className="group flex items-center gap-3 px-8 py-4 bg-navy text-white rounded-xl font-bold tracking-widest uppercase text-sm hover:bg-accent-red transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 w-full sm:w-auto justify-center"
              >
                <Phone size={18} className="text-white/70 group-hover:text-white transition-colors" />
                <span>0905 447 220</span>
              </a>
              <a
                href="mailto:info@frisco.sk"
                className="group flex items-center gap-3 px-8 py-4 bg-white text-navy border border-navy/10 rounded-xl font-bold tracking-widest uppercase text-sm hover:border-accent-red hover:text-accent-red transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 w-full sm:w-auto justify-center"
              >
                <Mail size={18} className="text-navy/40 group-hover:text-accent-red transition-colors" />
                <span>info@frisco.sk</span>
              </a>
            </div>
            
            <button 
              onClick={resetFilters} 
              className="text-sm font-medium text-charcoal/40 hover:text-navy uppercase tracking-widest border-b border-transparent hover:border-navy transition-all pb-1"
            >
              {copy.resetFilters}
            </button>
          </motion.div>
        )}

      </div>

    </section>

    {/* Floating Filter Button — outside overflow-hidden section so fixed positioning works */}
    <AnimatePresence>
      {showFloatingFilter && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3 }}
          onClick={scrollToFilters}
          className="fixed bottom-8 right-8 z-50 flex w-14 h-14 md:w-16 md:h-16 items-center justify-center bg-accent-red text-white rounded-full shadow-2xl hover:scale-110 hover:shadow-accent-red/40 transition-all duration-300"
          aria-label={copy.showFilters}
        >
          <SlidersHorizontal size={22} strokeWidth={2.5} />
        </motion.button>
      )}
    </AnimatePresence>
    </>
  );
};
