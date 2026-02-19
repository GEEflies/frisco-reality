'use client';

import { Search, Home, Key } from 'lucide-react';
import Link from 'next/link';

import RotatingWord from "./RotatingWord";
const friscoLogo = '/frisco-logo.svg';
const HERO_VIDEO_URL = 'https://fcvswlurtchqorgnwclw.supabase.co/storage/v1/object/public/videos/hero-video.mp4';

const HeroMobile = () => {
    return (
        <div className="relative min-h-[100svh] bg-white flex flex-col justify-start overflow-hidden pt-28 pb-8">
            {/* Solid Background */}
            <div className="absolute inset-0 bg-white" />

            <div className="container mx-auto px-6 relative z-10 flex flex-col items-start text-left">

                {/* Brand / Trust Label */}
                <div className="flex items-center gap-3 mb-5 animate-fade-in-up stagger-1">
                    <div className="h-px w-8 bg-navy/20" />
                    <span className="text-navy/70 font-mono text-[10px] md:text-xs tracking-[0.2em] uppercase">
                        Exkluzívna realitka v Seredi
                    </span>
                </div>

                {/* Main Headline */}
                <h1 className="text-4xl sm:text-[2.75rem] md:text-6xl font-serif font-bold text-navy tracking-tight leading-[1.1] mb-5 flex flex-col items-start animate-fade-in-up stagger-2">
                    <span className="whitespace-nowrap">Vašu nehnuteľnosť</span>
                    <span className="block h-[2.6rem] sm:h-[3.1rem] md:h-[4.2rem] overflow-hidden text-navy/90">
                        <RotatingWord words={["nájdeme", "nafotíme", "odprezentujeme", "prenajmeme", "predáme", "alebo odkúpime"]} className="text-accent-red text-left" />
                    </span>
                </h1>

                {/* Subheadline / Value Prop */}
                <p className="text-charcoal/70 text-sm md:text-xl font-normal leading-relaxed mb-6 animate-fade-in-up stagger-3">
                    Už 18 rokov pomáhame majiteľom predať a prenajať ich nehnuteľnosti za najlepších podmienok a klientom nájsť miesto, ktoré môžu nazývať domovom.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col w-full gap-3 mb-8 animate-fade-in-up stagger-4">
                    <Link
                        href="/ponuka"
                        className="group relative px-5 py-3.5 bg-navy text-white font-sans font-medium text-sm md:text-base tracking-wide overflow-hidden text-center rounded-lg shadow-lg shadow-navy/10 transition-all duration-300 flex items-center justify-center gap-2.5"
                    >
                        <div className="absolute inset-0 w-full h-full bg-accent-red transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
                        <Search size={16} strokeWidth={2} className="relative z-10" />
                        <span className="relative z-10">Pozrieť aktuálnu ponuku</span>
                    </Link>
                    <div className="flex gap-3">
                        <Link
                            href="/chcem-predat"
                            className="group flex-1 px-5 py-3.5 border border-navy/20 text-navy font-sans font-medium text-sm md:text-base tracking-wide hover:border-accent-red hover:text-accent-red transition-all duration-300 text-center rounded-lg flex items-center justify-center gap-2"
                        >
                            <Home size={16} strokeWidth={2} />
                            Chcem predať
                        </Link>
                        <Link
                            href="/chcem-prenajat"
                            className="group flex-1 px-5 py-3.5 border border-navy/20 text-navy font-sans font-medium text-sm md:text-base tracking-wide hover:border-accent-red hover:text-accent-red transition-all duration-300 text-center rounded-lg flex items-center justify-center gap-2"
                        >
                            <Key size={16} strokeWidth={2} />
                            Chcem prenajať
                        </Link>
                    </div>
                </div>

                {/* Mobile Video Container */}

                {/* Mobile Video Container */}
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-xl shadow-navy/10 border border-navy/5 bg-navy/5 animate-scale-in stagger-5">
                    {/* Corner Logo Watermark */}
                    <img
                        src={friscoLogo}
                        alt="FRISCO"
                        className="absolute bottom-2 right-2 z-30 w-16 opacity-70 pointer-events-none drop-shadow-md"
                    />
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="metadata"
                        className="w-full h-full object-cover"
                    >
                        <source src={HERO_VIDEO_URL} type="video/mp4" />
                    </video>
                </div>
            </div>
        </div>
    );
};

export default HeroMobile;
