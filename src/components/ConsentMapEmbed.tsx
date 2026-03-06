'use client';

import { useState, useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageProvider';

const CONSENT_KEY = 'frisco-maps-consent';

const COPY = {
  sk: {
    label: 'Interaktívna mapa',
    description: 'Kliknutím načítate Google Maps.',
    button: 'Zobraziť mapu',
    note: 'Používa cookies od Google.',
  },
  en: {
    label: 'Interactive map',
    description: 'Click to load Google Maps.',
    button: 'Show map',
    note: 'Uses cookies from Google.',
  },
  de: {
    label: 'Interaktive Karte',
    description: 'Klicken Sie, um Google Maps zu laden.',
    button: 'Karte anzeigen',
    note: 'Verwendet Google-Cookies.',
  },
};

interface ConsentMapEmbedProps {
  src: string;
  className?: string;
  /** Extra classes on the inner iframe / placeholder wrapper */
  innerClassName?: string;
  lat?: number;
  lon?: number;
  /** Render a footer below the map (e.g. address + directions button) */
  footer?: React.ReactNode;
}

export default function ConsentMapEmbed({
  src,
  className = '',
  innerClassName = '',
  lat = 48.2864,
  lon = 17.7375,
  footer,
}: ConsentMapEmbedProps) {
  const { language } = useLanguage();
  const copy = COPY[language];
  const [consented, setConsented] = useState<boolean | null>(null); // null = loading
  const [iframeReady, setIframeReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check localStorage once on mount
  useEffect(() => {
    try {
      setConsented(localStorage.getItem(CONSENT_KEY) === '1');
    } catch {
      setConsented(false);
    }
  }, []);

  const handleConsent = () => {
    try {
      localStorage.setItem(CONSENT_KEY, '1');
    } catch { /* noop */ }
    setConsented(true);
  };

  // Static tile URL from OpenStreetMap for the blurred background preview
  const tileZ = 15;
  const tileX = Math.floor(((lon + 180) / 360) * Math.pow(2, tileZ));
  const latRad = (lat * Math.PI) / 180;
  const tileY = Math.floor(
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) *
      Math.pow(2, tileZ),
  );
  const staticTile = `https://tile.openstreetmap.org/${tileZ}/${tileX}/${tileY}.png`;

  // Don't render anything until we know consent status (prevents flash)
  if (consented === null) {
    return (
      <div className={`${className}`}>
        <div className={`relative w-full h-full bg-navy/5 animate-pulse rounded-2xl ${innerClassName}`} />
        {footer}
      </div>
    );
  }

  if (consented) {
    return (
      <div className={`${className}`}>
        <div className={`relative w-full h-full ${innerClassName}`}>
          {/* Shimmer while iframe loads */}
          {!iframeReady && (
            <div className="absolute inset-0 bg-navy/5 animate-pulse z-10" />
          )}
          <iframe
            src={src}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className={`absolute inset-0 w-full h-full transition-opacity duration-700 ${
              iframeReady ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setIframeReady(true)}
          />
        </div>
        {footer}
      </div>
    );
  }

  // Placeholder state — beautiful, non-intrusive
  return (
    <div className={`${className}`}>
      <div
        ref={containerRef}
        className={`relative w-full h-full overflow-hidden cursor-pointer group ${innerClassName}`}
        onClick={handleConsent}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleConsent();
          }
        }}
        aria-label={copy.button}
      >
        {/* Blurred OSM tile mosaic background */}
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 opacity-60">
          {Array.from({ length: 6 }).map((_, i) => {
            const ox = (i % 3) - 1;
            const oy = Math.floor(i / 3) - 0;
            return (
              <img
                key={i}
                src={`https://tile.openstreetmap.org/${tileZ}/${tileX + ox}/${tileY + oy}.png`}
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
                draggable={false}
              />
            );
          })}
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-navy/30 via-navy/50 to-navy/70 group-hover:from-navy/20 group-hover:via-navy/40 group-hover:to-navy/60 transition-all duration-500" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 px-4">
          {/* Pin icon with pulse */}
          <div className="relative mb-4">
            <div className="absolute inset-0 w-12 h-12 rounded-full bg-white/20 animate-ping" />
            <div className="relative w-12 h-12 rounded-full bg-white/25 backdrop-blur-sm flex items-center justify-center border border-white/30">
              <MapPin className="w-5 h-5 text-white" />
            </div>
          </div>

          <p className="text-sm font-semibold tracking-wide uppercase mb-1.5 opacity-90">
            {copy.label}
          </p>

          {/* Button */}
          <button
            className="mt-2 px-6 py-2.5 bg-white text-navy text-sm font-bold rounded-full shadow-lg
                       hover:shadow-xl hover:scale-105 active:scale-100
                       transition-all duration-300 ease-out"
          >
            {copy.button}
          </button>

          <p className="mt-3 text-[11px] opacity-60 tracking-wide">
            {copy.note}
          </p>
        </div>
      </div>
      {footer}
    </div>
  );
}
