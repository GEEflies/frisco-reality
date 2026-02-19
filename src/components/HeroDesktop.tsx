'use client';

import { Search, Home, Key } from "lucide-react";

import RotatingWord from "./RotatingWord";
import { LocaleLink } from "./LocaleLink";
import { useLanguage } from '@/i18n/LanguageProvider';
import { HERO_DESKTOP_COPY } from '@/i18n/copy';

const HERO_VIDEO_URL = "https://fcvswlurtchqorgnwclw.supabase.co/storage/v1/object/public/videos/hero-video.mp4";

const HeroDesktop = () => {
  const { language } = useLanguage();
  const copy = HERO_DESKTOP_COPY[language];

  return (
    <div className="relative min-h-screen bg-white overflow-hidden flex flex-col">
      {/* Solid Background - Clean White */}
      <div className="absolute inset-0 bg-white" />

      <div className="container mx-auto px-8 relative z-10 flex-grow flex flex-col justify-start pt-32 lg:pt-40">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">

          {/* Left Column: Text & Search */}
          <div className="w-full lg:w-[42%] flex flex-col items-start text-left z-20">

            {/* Top Label */}
            <div
              className="flex items-center gap-4 mb-8 story-soft stagger-1"
            >
              <div className="h-px w-12 bg-navy/20" />
              <span className="text-navy/80 font-mono text-xs tracking-[0.3em] uppercase">
                {copy.label}
              </span>
            </div>

            {/* Main Headline */}
            <h1
              className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-navy tracking-tight leading-[1.1] mb-8 whitespace-nowrap story-rise stagger-2"
            >
              {copy.titleLine1}
              <br />
              <span className="text-navy/90 flex items-center gap-4">
                <RotatingWord
                  words={copy.verbs}
                  interval={3000}
                  className="text-accent-red text-left min-w-[200px]"
                />
              </span>
              {copy.titleLine3 && (
                <>
                  <span className="text-navy">{copy.titleLine3}</span>
                </>
              )}
            </h1>

            {/* Subtitle */}
            <p
              className="text-lg text-charcoal/80 font-normal max-w-xl leading-relaxed mb-12 story-soft stagger-3"
            >
              {copy.subtitle}
            </p>


            {/* Action Buttons */}
            <div
              className="flex flex-col gap-3 w-full max-w-[600px] story-soft stagger-4"
            >
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <LocaleLink
                  href="/ponuka"
                  className="group relative px-6 py-4 bg-navy text-white font-sans font-medium text-base tracking-wide overflow-hidden text-center rounded-md shadow-lg shadow-navy/10 hover:shadow-navy/20 transition-all duration-300 flex-1 flex items-center justify-center gap-2.5 whitespace-nowrap"
                >
                  <div className="absolute inset-0 w-full h-full bg-accent-red/10 group-hover:bg-accent-red transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
                  <Search size={16} strokeWidth={2} className="relative z-10" />
                  <span className="relative z-10 hidden xl:inline">
                    {copy.offerLong}
                  </span>
                  <span className="relative z-10 inline xl:hidden">
                    {copy.offerShort}
                  </span>
                </LocaleLink>

                <LocaleLink
                  href="/chcem-predat"
                  className="group px-6 py-4 border border-navy/20 text-navy font-sans font-medium text-base tracking-wide hover:border-accent-red hover:text-accent-red transition-all duration-300 text-center rounded-md flex-1 flex items-center justify-center gap-2.5 whitespace-nowrap"
                >
                  <Home size={16} strokeWidth={2} className="shrink-0" />
                  <span className="hidden xl:inline">{copy.sellLong}</span>
                  <span className="inline xl:hidden">{copy.sellShort}</span>
                </LocaleLink>
              </div>

              <LocaleLink
                href="/chcem-prenajat"
                className="group px-6 py-4 border border-navy/20 text-navy font-sans font-medium text-base tracking-wide hover:border-accent-red hover:text-accent-red transition-all duration-300 text-center rounded-md w-full flex items-center justify-center gap-2.5 whitespace-nowrap"
              >
                <Key size={16} strokeWidth={2} className="shrink-0" />
                <span className="hidden xl:inline">{copy.rentLong}</span>
                <span className="inline xl:hidden">{copy.rentShort}</span>
              </LocaleLink>
            </div>

            {/* Closing Left Column */}
          </div>

          {/* Right Column: Contained Video */}
          <div
            className="w-full lg:w-[58%] relative hidden lg:block -mt-8 lg:mt-12 lg:-mr-16 story-media stagger-4"
          >
            {/* Decorative Frame Border - Navy for light theme */}
            <div className="absolute -top-4 -right-4 w-full h-full border border-navy/10 rounded-[2rem] z-0" />

            {/* Video Container */}
            <div className="relative w-full aspect-[16/10] max-h-[75vh] overflow-hidden bg-white z-10 shadow-2xl shadow-navy/10 rounded-[2rem]">
              <div className="absolute inset-0 bg-navy/5 z-20 mix-blend-multiply pointer-events-none" /> {/* Subtle Tint */}

              {/* Corner Logo */}
              <img
                src="/frisco-logo.svg"
                alt="FRISCO"
                className="absolute bottom-2 right-4 z-30 w-24 opacity-80 pointer-events-none drop-shadow-lg"
              />

              <video
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="w-full h-full object-cover"
              >
                <source src={HERO_VIDEO_URL} type="video/mp4" />
              </video>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HeroDesktop;
