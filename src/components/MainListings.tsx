'use client';

import { ChevronRight, Maximize, Home, MapPin, Trees } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/i18n/LanguageProvider';
import { localePath } from '@/i18n/types';
import { LocaleLink } from '@/components/LocaleLink';
import { MAIN_LISTINGS_COPY } from '@/i18n/copy';
import { useFeaturedListings } from '@/hooks/useListings';
import { getPrimaryImage, shouldShowOverlay } from '@/api/listingsService';
import { formatArea, formatPriceWithUnit, getLocalizedTitle } from '@/api/mappings';
import { buildWeservUrl } from '@/lib/imageLoader';
import { useNavLoading } from '@/components/RouteLoadingIndicator';
import type { ListingWithImages } from '@/api/types';

function getStatusMeta(listing: ListingWithImages, language: 'sk' | 'en' | 'de') {
  if (listing.status === 3) {
    return {
      label: language === 'sk' ? 'Rezervované' : language === 'de' ? 'Reserviert' : 'Reserved',
      color: 'bg-amber-500',
    };
  }
  if (listing.status === 4) {
    return {
      label: language === 'sk' ? 'Predané' : language === 'de' ? 'Verkauft' : 'Sold',
      color: 'bg-red-500',
    };
  }
  if (listing.condition === 6 && listing.age && listing.age >= new Date().getFullYear() - 10) {
    return {
      label: language === 'sk' ? 'Novostavba' : language === 'de' ? 'Neubau' : 'New build',
      color: 'bg-emerald-500',
    };
  }
  if (listing.action === 3) {
    return {
      label: language === 'sk' ? 'Prenájom' : language === 'de' ? 'Miete' : 'Rent',
      color: 'bg-sky-500',
    };
  }
  return {
    label: language === 'sk' ? 'Na predaj' : language === 'de' ? 'Zu verkaufen' : 'For sale',
    color: 'bg-navy',
  };
}

function getLocation(listing: ListingWithImages): string {
  return [listing.location_city, listing.location_district].filter(Boolean).join(', ') || listing.street || 'Slovensko';
}

function getFeatureData(listing: ListingWithImages, language: 'sk' | 'en' | 'de') {
  const roomsUnit = language === 'sk' ? 'izby' : language === 'de' ? 'Zimmer' : 'rooms';
  const features: Array<{ icon: typeof Maximize; label: string }> = [];

  if (listing.usable_area) {
    features.push({ icon: Maximize, label: formatArea(listing.usable_area) });
  }

  if (listing.rooms_count) {
    features.push({ icon: Home, label: `${listing.rooms_count} ${roomsUnit}` });
  }

  if (features.length < 2 && listing.plot_area) {
    features.push({ icon: Trees, label: formatArea(listing.plot_area) });
  }

  return features.slice(0, 2);
}

function ListingCard({ listing, language, onClick }: { listing: ListingWithImages; language: 'sk' | 'en' | 'de'; onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void }) {
  const href = localePath(`/nehnutelnost/${listing.slug || listing.id}`, language);
  const image = getPrimaryImage(listing);
  const primaryImg = listing.images?.sort((a, b) => a.sort_order - b.sort_order)[0];
  const showOverlay = primaryImg ? shouldShowOverlay(primaryImg) : false;
  const status = getStatusMeta(listing, language);
  const features = getFeatureData(listing, language);
  const localizedTitle = getLocalizedTitle(listing, language);
  const detailLabel = language === 'sk' ? 'Zobraziť detail' : language === 'en' ? 'View detail' : 'Details ansehen';
  const price = formatPriceWithUnit(
    listing.price,
    listing.price_currency,
    listing.price_unit,
    listing.price_by_agreement,
    language,
  );

  return (
    <Link href={href} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-black/5 flex flex-col h-full relative group cursor-pointer" onClick={onClick}>
      <div className="relative h-[250px] overflow-hidden bg-gray-100 flex items-center justify-center">
        {image ? (
          <>
            <img
              src={buildWeservUrl(image, 600, 75)}
              alt={localizedTitle}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover will-change-transform transition-transform duration-700 ease-out group-hover:scale-105"
            />
            {/* FRISCO watermark — only on enhanced images */}
            {showOverlay && (
              <img
                src="/frisco-logo-hq.webp"
                alt=""
                className="absolute bottom-0 right-0 w-[20%] min-w-[70px] h-auto pointer-events-none drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)] z-10 select-none"
                draggable={false}
              />
            )}
          </>
        ) : (
          <div className="w-full h-full bg-cream-dark flex items-center justify-center">
            <span className="text-black/10 font-serif text-4xl italic tracking-tighter">FRISCO</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-center justify-center">
          <span className="text-white font-medium text-lg tracking-wide transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            {detailLabel}
          </span>
        </div>
        <span className={`absolute top-4 left-4 ${status.color} text-white px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm z-20`}>
          {status.label}
        </span>
      </div>

      <div className="p-6 flex flex-col flex-grow text-left">
        <h4 className="text-2xl font-poppins font-bold text-black mb-1 leading-tight line-clamp-2">{localizedTitle}</h4>
        <h3 className="text-lg font-bold text-accent-red mb-4">{price}</h3>
        <div className="flex items-center gap-2 text-charcoal/60 text-sm mb-4">
          <MapPin className="w-4 h-4 text-accent-red" />
          {getLocation(listing)}
        </div>
        <div className="mt-auto pt-6 border-t border-black/5 flex items-center justify-between text-black/70 text-sm">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2">
              <feature.icon className="w-4 h-4 text-black/40" />
              {feature.label}
            </div>
          ))}
        </div>
      </div>
    </Link>
  );
}

export const MainListings = () => {
  const { language } = useLanguage();
  const copy = MAIN_LISTINGS_COPY[language];
  const { startNavLoading } = useNavLoading();
  const { data: listings, isLoading } = useFeaturedListings(3);

  const showLiveCards = !isLoading && listings.length > 0;

  return (
    <section className="reveal pt-12 lg:pt-24 pb-12 bg-cream relative z-10 border-b border-black/5 min-h-[800px] lg:min-h-[600px]">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-end mb-12 rv-child">
          <div>
            <span className="text-accent-red font-bold text-sm tracking-[0.2em] uppercase mb-4 block">{copy.badge}</span>
            <h2 className="text-4xl md:text-5xl font-serif font-extrabold text-black leading-tight tracking-tight">{copy.title}</h2>
          </div>
        </div>

        <div className="hidden lg:grid grid-cols-3 gap-8">
          {showLiveCards
            ? listings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  language={language}
                  onClick={(e) => { if (!(e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0)) startNavLoading(); }}
                />
              ))
            : copy.cards.map((card, index) => (
                <div key={index} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-black/5 p-6 min-h-[380px] flex flex-col justify-end">
                  <span className="inline-block bg-navy text-white px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider mb-4 w-fit">{card.badge}</span>
                  <h4 className="text-2xl font-poppins font-bold text-black mb-1 leading-tight">{card.title}</h4>
                  <h3 className="text-lg font-bold text-accent-red mb-4">{card.price}</h3>
                  <div className="flex items-center gap-2 text-charcoal/60 text-sm mb-4">
                    <MapPin className="w-4 h-4 text-accent-red" />
                    {card.location}
                  </div>
                </div>
              ))}
        </div>

        <div className="hidden lg:flex justify-center mt-12 rv-child">
          <LocaleLink
            href="/ponuka"
            className="group relative px-8 py-4 bg-navy text-white font-sans font-medium tracking-wide overflow-hidden rounded-full shadow-lg shadow-navy/10 hover:shadow-navy/20 transition-all duration-300 flex items-center gap-3"
          >
            <div className="absolute inset-0 w-full h-full bg-accent-red/10 group-hover:bg-accent-red transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
            <span className="relative z-10 uppercase tracking-widest text-sm font-bold">{copy.cta}</span>
            <ChevronRight className="relative z-10 w-4 h-4" />
          </LocaleLink>
        </div>

        <div className="lg:hidden flex flex-col gap-6">
          {showLiveCards
            ? listings.slice(0, 2).map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  language={language}
                  onClick={(e) => { if (!(e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0)) startNavLoading(); }}
                />
              ))
            : copy.cards.slice(0, 2).map((card, index) => (
                <div key={index} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-black/5 p-6 min-h-[300px] flex flex-col justify-end">
                  <span className="inline-block bg-navy text-white px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider mb-4 w-fit">{card.badge}</span>
                  <h4 className="text-xl font-poppins font-bold text-black mb-1 leading-tight">{card.title}</h4>
                  <h3 className="text-lg font-bold text-accent-red mb-4">{card.price}</h3>
                  <div className="flex items-center gap-2 text-charcoal/60 text-sm mb-4">
                    <MapPin className="w-4 h-4 text-accent-red" />
                    {card.location}
                  </div>
                </div>
              ))}

          <LocaleLink
            href="/ponuka"
            className="w-full py-4 mt-4 bg-navy rounded-full text-white font-bold hover:bg-navy/90 transition-colors duration-300 uppercase tracking-widest text-sm text-center block shadow-lg shadow-navy/20"
          >
            {copy.cta}
          </LocaleLink>
        </div>
      </div>
    </section>
  );
};
