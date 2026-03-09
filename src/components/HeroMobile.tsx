'use client';

import { Search, Home, Key } from 'lucide-react';
import AutoplayVideo from './AutoplayVideo';
import RotatingWord from "./RotatingWord";
import { LocaleLink } from "./LocaleLink";
import { useLanguage } from '@/i18n/LanguageProvider';
import { HERO_MOBILE_COPY } from '@/i18n/copy';
const friscoLogo = '/frisco-logo-hq.png';
// Mobile-optimised video: 720p, CRF 28, ~2.3 MB (vs 5.5 MB original)
const HERO_VIDEO_URL = 'https://fcvswlurtchqorgnwclw.supabase.co/storage/v1/object/public/videos/hero-mobile-720p%20(1).mp4';

const HeroMobile = () => {
    const { language } = useLanguage();
    const copy = HERO_MOBILE_COPY[language];

    return (
        <div className="relative min-h-[100svh] bg-white flex flex-col justify-start overflow-hidden pt-28 pb-8">
            {/* Solid Background */}
            <div className="absolute inset-0 bg-white" />

            <div className="container mx-auto px-6 relative z-10 flex flex-col items-start text-left">

                {/* Brand / Trust Label */}
                <div className="flex items-center gap-3 mb-5 story-soft stagger-1">
                    <div className="h-px w-8 bg-navy/20" />
                    <span className="text-navy/70 font-mono text-[10px] md:text-xs tracking-[0.2em] uppercase">
                        {copy.label}
                    </span>
                </div>

                {/* Main Headline */}
                <h1 className="text-4xl sm:text-[2.75rem] md:text-6xl font-serif font-bold text-navy tracking-tight leading-[1.1] mb-5 flex flex-col items-start story-rise stagger-2">
                    <span className="whitespace-nowrap">{copy.title}</span>
                    <span className="block h-[2.6rem] sm:h-[3.1rem] md:h-[4.2rem] overflow-hidden text-navy/90 flex items-center gap-2">
                        {copy.verbPrefix && (
                            <span className="text-charcoal">{copy.verbPrefix}</span>
                        )}
                        <RotatingWord words={copy.verbs} className="text-accent-red text-left" />
                    </span>
                </h1>

                {/* Subheadline / Value Prop */}
                <p className="text-charcoal/70 text-sm md:text-xl font-normal leading-relaxed mb-6 story-soft stagger-3">
                    {copy.subtitle}
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col w-full gap-3 mb-8 story-soft stagger-4">
                    <LocaleLink
                        href="/ponuka"
                        className="group relative px-5 py-3.5 bg-navy text-white font-sans font-medium text-sm md:text-base tracking-wide overflow-hidden text-center rounded-lg shadow-lg shadow-navy/10 transition-all duration-300 flex items-center justify-center gap-2.5"
                    >
                        <div className="absolute inset-0 w-full h-full bg-accent-red transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
                        <Search size={16} strokeWidth={2} className="relative z-10" />
                        <span className="relative z-10">{copy.offer}</span>
                    </LocaleLink>
                    <div className="flex gap-3">
                        <LocaleLink
                            href="/chcem-predat"
                            className="group flex-1 px-5 py-3.5 border border-navy/20 text-navy font-sans font-medium text-sm md:text-base tracking-wide hover:border-accent-red hover:text-accent-red transition-all duration-300 text-center rounded-lg flex items-center justify-center gap-2"
                        >
                            <Home size={16} strokeWidth={2} />
                            {copy.sell}
                        </LocaleLink>
                        <LocaleLink
                            href="/chcem-prenajat"
                            className="group flex-1 px-5 py-3.5 border border-navy/20 text-navy font-sans font-medium text-sm md:text-base tracking-wide hover:border-accent-red hover:text-accent-red transition-all duration-300 text-center rounded-lg flex items-center justify-center gap-2"
                        >
                            <Key size={16} strokeWidth={2} />
                            {copy.rent}
                        </LocaleLink>
                    </div>
                </div>

                {/* Mobile Video Container */}

                {/* Mobile Video Container */}
                <div
                    className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-xl shadow-navy/10 border border-navy/5 bg-navy/5 story-media stagger-5"
                    style={{ WebkitMaskImage: '-webkit-radial-gradient(white, white)', maskImage: 'radial-gradient(white, white)' }}
                >
                    {/* Bottom-right blur – hides third-party watermark */}
                    <div
                        className="absolute bottom-0 right-0 w-[30%] h-[32%] z-[25] pointer-events-none"
                        style={{
                            backdropFilter: 'blur(10px)',
                            WebkitBackdropFilter: 'blur(10px)',
                            maskImage:
                                'radial-gradient(ellipse at 100% 100%, black 20%, transparent 70%)',
                            WebkitMaskImage:
                                'radial-gradient(ellipse at 100% 100%, black 20%, transparent 70%)',
                        }}
                    />

                    {/* Corner Logo Watermark */}
                    <img
                        src={friscoLogo}
                        alt="FRISCO"
                        className="absolute bottom-2 right-2 z-30 w-16 opacity-70 pointer-events-none drop-shadow-md"
                    />
                    <AutoplayVideo
                        src={HERO_VIDEO_URL}
                        poster="/hero-poster-mobile.webp"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
        </div>
    );
};

export default HeroMobile;
