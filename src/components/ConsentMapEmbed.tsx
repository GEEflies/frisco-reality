'use client';

import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageProvider';

const CONSENT_KEY = 'frisco-maps-consent';

// Google Maps domains — preconnecting to these warms TCP/TLS before consent,
// which removes the bulk of the ~5s delay without setting any cookies.
const GOOGLE_MAPS_ORIGINS = [
  'https://maps.googleapis.com',
  'https://maps.gstatic.com',
  'https://fonts.gstatic.com',
];

const COPY = {
  sk: {
    label: 'Interaktívna mapa',
    button: 'Zobraziť mapu',
    note: 'Používa cookies od Google.',
  },
  en: {
    label: 'Interactive map',
    button: 'Show map',
    note: 'Uses cookies from Google.',
  },
  de: {
    label: 'Interaktive Karte',
    button: 'Karte anzeigen',
    note: 'Verwendet Google-Cookies.',
  },
};

interface ConsentMapEmbedProps {
  src: string;
  className?: string;
  innerClassName?: string;
  lat?: number;
  lon?: number;
  footer?: React.ReactNode;
}

/** Inject <link rel="preconnect"> tags for Google Maps origins to warm TCP/TLS. */
function injectPreconnects() {
  if (typeof document === 'undefined') return;
  GOOGLE_MAPS_ORIGINS.forEach((origin) => {
    const id = `preconnect-${origin.replace(/[^a-z]/gi, '')}`;
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'preconnect';
    link.href = origin;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
}

/** Calculate where exactly within a 3×2 OSM tile grid a lat/lon falls. */
function tileInfo(lat: number, lon: number, zoom: number) {
  const n = Math.pow(2, zoom);
  const xExact = ((lon + 180) / 360) * n;
  const latRad = (lat * Math.PI) / 180;
  const yExact = ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n;
  const tileX = Math.floor(xExact);
  const tileY = Math.floor(yExact);
  const fracX = xExact - tileX; // 0–1 within the centre tile
  const fracY = yExact - tileY; // 0–1 within the centre tile
  // In the 3-col grid the centre tile occupies columns 33.33%–66.67%
  // In the 2-row grid the centre tile occupies rows 0%–50%
  const pinLeft = ((1 + fracX) / 3) * 100;
  const pinTop  = ((0 + fracY) / 2) * 100;
  return { tileX, tileY, pinLeft, pinTop };
}

export default function ConsentMapEmbed({
  src,
  className = '',
  innerClassName = '',
  lat = 48.2864,
  lon = 17.7401,
  footer,
}: ConsentMapEmbedProps) {
  const { language } = useLanguage();
  const copy = COPY[language];
  const [consented, setConsented] = useState<boolean | null>(null);
  const [iframeReady, setIframeReady] = useState(false);

  const tileZ = 15;
  const { tileX, tileY, pinLeft, pinTop } = tileInfo(lat, lon, tileZ);

  // Check localStorage on mount and start warming Google connections immediately
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CONSENT_KEY) === '1';
      setConsented(stored);
      // Always warm the connections so the map is fast regardless of consent state
      injectPreconnects();
    } catch {
      setConsented(false);
    }
  }, []);

  const handleConsent = () => {
    try { localStorage.setItem(CONSENT_KEY, '1'); } catch { /* noop */ }
    setConsented(true);
  };

  // SSR / hydration shimmer
  if (consented === null) {
    return (
      <div className={className}>
        <div className={`relative w-full h-full bg-navy/5 animate-pulse ${innerClassName}`} />
        {footer}
      </div>
    );
  }

  if (consented) {
    return (
      <div className={className}>
        <div className={`relative w-full h-full ${innerClassName}`}>
          {!iframeReady && (
            <div className="absolute inset-0 bg-navy/5 animate-pulse z-10" />
          )}
          <iframe
            src={src}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="eager"
            referrerPolicy="no-referrer-when-downgrade"
            className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${
              iframeReady ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setIframeReady(true)}
          />
        </div>
        {footer}
      </div>
    );
  }

  // — Placeholder —
  return (
    <div className={className}>
      <div
        className={`relative w-full h-full overflow-hidden cursor-pointer group ${innerClassName}`}
        onClick={handleConsent}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleConsent(); }
        }}
        aria-label={copy.button}
      >
        {/* OSM tile mosaic — 3 columns × 2 rows centred on the location.
            Each tile is absolutely positioned with 1 px overlap to prevent
            sub-pixel seams across browsers / DPR ratios. */}
        <div className="absolute inset-0">
          {Array.from({ length: 6 }).map((_, i) => {
            const col = i % 3;              // 0, 1, 2
            const row = Math.floor(i / 3);  // 0, 1
            const ox = col - 1;             // -1 / 0 / +1
            const oy = row;                 //  0 / 1
            return (
              <img
                key={i}
                src={`https://tile.openstreetmap.org/${tileZ}/${tileX + ox}/${tileY + oy}.png`}
                alt=""
                className="absolute block opacity-60"
                style={{
                  left: `calc(${(col * 100) / 3}% - 1px)`,
                  top: `calc(${(row * 100) / 2}% - 1px)`,
                  width: `calc(${100 / 3}% + 2px)`,
                  height: `calc(50% + 2px)`,
                }}
                loading="eager"
                draggable={false}
              />
            );
          })}
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-navy/20 via-navy/40 to-navy/70 group-hover:from-navy/10 group-hover:via-navy/30 group-hover:to-navy/60 transition-all duration-500" />

        {/* Precise location pin — pulse ring wraps the circle so it stays centered */}
        <div
          className="absolute z-10 -translate-x-1/2 -translate-y-full pointer-events-none"
          style={{ left: `${pinLeft}%`, top: `${pinTop}%` }}
        >
          <div className="flex flex-col items-center">
            {/* Circle with pulse contained inside */}
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 rounded-full bg-accent-red/50 animate-ping" />
              <div className="relative z-10 w-10 h-10 rounded-full bg-accent-red shadow-lg shadow-accent-red/50 flex items-center justify-center border-2 border-white">
                <MapPin className="w-5 h-5 text-white" />
              </div>
            </div>
            {/* Stem */}
            <div className="w-[2px] h-3 bg-accent-red" />
            {/* Dot */}
            <div className="w-2 h-2 rounded-full bg-accent-red/70" />
          </div>
        </div>

        {/* Location label */}
        <div className="absolute z-10 inset-x-0 flex flex-col items-center top-1/2 -translate-y-1/2 px-4 pointer-events-none">
          <p className="text-white text-2xl sm:text-3xl font-light tracking-[0.15em] uppercase text-center"
             style={{ textShadow: '0 2px 12px rgba(0,0,0,0.5)' }}>
            FRISCO Reality
          </p>
          <div className="w-10 h-px bg-white/40 mt-3 mb-2" />
          <p className="text-white/70 text-xs sm:text-sm font-light tracking-[0.08em] text-center"
             style={{ textShadow: '0 1px 6px rgba(0,0,0,0.4)' }}>
            Námestie Slobody 1185/30, Sereď
          </p>
        </div>

        {/* Consent prompt — bottom-centre */}
        <div className="absolute bottom-0 inset-x-0 flex flex-col items-center pb-6 z-10">
          <button
            className="px-7 py-2.5 bg-white text-navy text-sm font-bold rounded-full shadow-xl
                       hover:shadow-2xl hover:scale-105 active:scale-100
                       transition-all duration-200 ease-out"
          >
            {copy.button}
          </button>
          <p className="mt-2 text-[11px] text-white/60 tracking-wide">{copy.note}</p>
        </div>
      </div>
      {footer}
    </div>
  );
}
