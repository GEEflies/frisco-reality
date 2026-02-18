'use client';

import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect, useMemo } from 'react';
import { Bed, Bath, Square, Building2, Home, Map, Key, Warehouse, Maximize, Trees, Loader2, ArrowUpDown, Check, SlidersHorizontal, SearchX, Phone, Mail } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FilterBar } from './FilterBar';
import { ListingCard } from './ListingCard';
import { useListings, useListingFilters } from '@/hooks/useListings';
import { categoryLabels, transactionLabels, formatPrice, formatArea, getCategoryType, getStatusColor, statusLabels } from '@/api/mappings';
import { getPrimaryImage } from '@/api/listingsService';
import type { ListingFilters } from '@/api/types';

export const PropertiesSection = () => {
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
        // Show floating button when filter wrapper is above viewport
        // On mobile, show it sooner (offset by 250px) because the filter section is very tall
        const isMobile = window.innerWidth < 768;
        const triggerOffset = isMobile ? 250 : 0;
        setShowFloatingFilter(rect.bottom < triggerOffset);
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
    if (listing.status === 'reserved') return { label: 'Rezervované', color: 'bg-amber-500' };
    if (listing.status === 'sold') return { label: 'Predané', color: 'bg-red-500' };
    if (listing.real_estate_state === 136) return { label: 'Novostavba', color: 'bg-emerald-500' };
    if (listing.transaction_id === 123 || listing.transaction_id === 124) return { label: 'Prenájom', color: 'bg-sky-500' };
    return { label: 'Na predaj', color: 'bg-navy' };
  };

  // Get features for listing card
  const getFeatures = (listing: typeof listings[0]) => {
    const features = [];

    if (listing.usable_area) {
      features.push({ icon: Maximize, label: formatArea(listing.usable_area) });
    }

    if (listing.rooms_count) {
      features.push({ icon: Home, label: `${listing.rooms_count} izby` });
    }

    if (listing.land_area) {
      features.push({ icon: Trees, label: formatArea(listing.land_area) });
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
    router.push(`/nehnutelnost/${identifier}`);
  };

  // Sort options for mobile dropdown
  const sortOptions = [
    { value: 'newest', label: 'Najnovšie' },
    { value: 'oldest', label: 'Najstaršie' },
    { value: 'price-asc', label: 'Najlacnejšie' },
    { value: 'price-desc', label: 'Najdrahšie' },
    { value: 'recommended', label: 'Odporúčané' },
  ] as const;

  return (
    <section id="ponuka" className="relative pt-20 pb-32 bg-cream overflow-hidden min-h-screen" ref={ref}>
      <div className="container mx-auto px-4 md:px-8 relative z-10">

        {/* Header */}
        <div className="mb-12" ref={filterWrapperRef}>
          <motion.div
            className="text-navy font-mono text-sm tracking-[0.2em] uppercase mb-4"
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            Aktuálna ponuka
          </motion.div>
          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-navy mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {filters.category !== 'all' ? (
              <span className="uppercase">{
                filters.category === 'apartment' ? 'Byty' :
                  filters.category === 'house' ? 'Domy' :
                    filters.category === 'land' ? 'Pozemky' :
                      filters.category === 'other' ? 'Iné' :
                        filters.category
              }</span>
            ) : filters.transaction === 'rent' ? (
              <span className="uppercase">Prenájom</span>
            ) : (
              <>Vybrané <span className="text-accent-red italic">nehnuteľnosti</span></>
            )}
          </motion.h2>

          {/* Quick Category Filters */}
          <motion.div
            className="flex flex-wrap gap-3 mb-6 md:mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            {/* Mobile grid: 3 on top, 2 on bottom — matching reference */}
            <div className="w-full grid grid-cols-3 gap-3 md:hidden">
              {[
                { id: 'rent', label: 'Prenájom', icon: Key, isTransaction: true },
                { id: 'apartment', label: 'Byty', icon: Building2 },
                { id: 'house', label: 'Domy', icon: Home },
              ].map((cat) => {
                const isActive = cat.isTransaction
                  ? filters.transaction === 'rent'
                  : filters.category === cat.id;

                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      if (cat.isTransaction) {
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
            <div className="w-full grid grid-cols-2 gap-3 md:hidden">
              {[
                { id: 'land', label: 'Pozemky', icon: Map },
                { id: 'other', label: 'Iné', icon: Warehouse },
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
                { id: 'rent', label: 'Prenájom', icon: Key, isTransaction: true },
                { id: 'apartment', label: 'Byty', icon: Building2 },
                { id: 'house', label: 'Domy', icon: Home },
                { id: 'land', label: 'Pozemky', icon: Map },
                { id: 'other', label: 'Iné', icon: Warehouse },
              ].map((cat) => {
                const isActive = cat.isTransaction
                  ? filters.transaction === 'rent'
                  : filters.category === cat.id;

                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      if (cat.isTransaction) {
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
                title="Zoradiť"
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
                        Zoradiť podľa
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
          {isLoading ? 'Načítavam...' : `Nájdených ${listings.length} nehnuteľností`}
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
            <p className="text-xl text-red-600 font-serif mb-4">Nastala chyba pri načítaní nehnuteľností.</p>
            <button onClick={() => window.location.reload()} className="text-accent-red hover:underline underline-offset-4">
              Skúsiť znova
            </button>
          </div>
        )}

        {/* Properties Grid */}
        {!isLoading && !error && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <AnimatePresence mode='popLayout'>
              {listings.map((listing) => {
                const status = getListingStatus(listing);
                const features = getFeatures(listing);
                const image = getPrimaryImage(listing);
                const priceLabel = listing.transaction_id === 123 || listing.transaction_id === 124
                  ? `${formatPrice(listing.price)}/mes.`
                  : formatPrice(listing.price);

                return (
                  <motion.div
                    key={listing.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                  >
                    <ListingCard
                      title={listing.title}
                      price={priceLabel}
                      location={[listing.location_city, listing.location_district].filter(Boolean).join(', ')}
                      description={listing.description || undefined}
                      image={image}
                      status={status.label}
                      statusColor={status.color}
                      features={features}
                      onClick={() => handleListingClick(listing)}
                    />
                  </motion.div>
                );
              })}
            </AnimatePresence>
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
              Nenašli ste, čo <span className="italic text-accent-red">hľadáte?</span>
            </h3>
            
            <p className="text-lg text-charcoal/60 mb-10 max-w-2xl mx-auto leading-relaxed">
              Nič sa nedeje. Ozvite sa nám a spoločne nájdeme niečo podobné.
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
              Zrušiť filter a zobraziť všetko
            </button>
          </motion.div>
        )}

      </div>

      {/* Floating Filter Button (Desktop only) */}
      <AnimatePresence>
        {showFloatingFilter && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
            onClick={scrollToFilters}
            className="flex fixed bottom-8 right-8 z-50 w-16 h-16 items-center justify-center bg-accent-red text-white rounded-full shadow-2xl hover:scale-110 hover:shadow-accent-red/40 transition-all duration-300"
            aria-label="Zobraziť filtre"
          >
            <SlidersHorizontal size={24} strokeWidth={2.5} />
          </motion.button>
        )}
      </AnimatePresence>
    </section>
  );
};
