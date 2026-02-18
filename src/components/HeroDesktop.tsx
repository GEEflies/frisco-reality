'use client';

import { motion } from "framer-motion";
import { Search, Home, Key } from "lucide-react";
import Link from "next/link";

import RotatingWord from "./RotatingWord";

const HeroDesktop = () => {
  return (
    <div className="relative min-h-screen bg-white overflow-hidden flex flex-col">
      {/* Solid Background - Clean White */}
      <div className="absolute inset-0 bg-white" />

      <div className="container mx-auto px-8 relative z-10 flex-grow flex flex-col justify-start pt-32 lg:pt-36">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">

          {/* Left Column: Text & Search */}
          <div className="w-full lg:w-[42%] flex flex-col items-start text-left z-20">

            {/* Top Label */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-4 mb-8"
            >
              <div className="h-px w-12 bg-navy/20" />
              <span className="text-navy/80 font-mono text-xs tracking-[0.3em] uppercase">
                Exkluzívna realitná kancelária v Seredi
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-navy tracking-tight leading-[1.1] mb-8 whitespace-nowrap"
            >
              Vašu nehnuteľnosť
              <br />
              <span className="text-navy/90 flex items-center gap-4">
                <RotatingWord
                  words={["nájdeme", "nafotíme", "odprezentujeme", "prenajmeme", "predáme", "alebo odkúpime"]}
                  interval={3000}
                  className="text-accent-red text-left min-w-[200px]" // Red color + styling fix
                />
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg text-charcoal/80 font-normal max-w-xl leading-relaxed mb-12"
            >
              Už 18 rokov pomáhame majiteľom predať a prenajať ich nehnuteľnosti za najlepších podmienok a záujemcom nájsť miesto, ktoré môžu nazývať domovom.
            </motion.p>


            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col gap-3 w-full max-w-[600px]"
            >
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <Link
                  href="/ponuka"
                  className="group relative px-6 py-4 bg-navy text-white font-sans font-medium text-base tracking-wide overflow-hidden text-center rounded-md shadow-lg shadow-navy/10 hover:shadow-navy/20 transition-all duration-300 flex-1 flex items-center justify-center gap-2.5 whitespace-nowrap"
                >
                  <div className="absolute inset-0 w-full h-full bg-accent-red/10 group-hover:bg-accent-red transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
                  <Search size={16} strokeWidth={2} className="relative z-10" />
                  <span className="relative z-10 hidden xl:inline">
                    Pozrieť aktuálnu ponuku
                  </span>
                  <span className="relative z-10 inline xl:hidden">
                    Ponuka
                  </span>
                </Link>

                <Link
                  href="/chcem-predat"
                  className="group px-6 py-4 border border-navy/20 text-navy font-sans font-medium text-base tracking-wide hover:border-accent-red hover:text-accent-red transition-all duration-300 text-center rounded-md flex-1 flex items-center justify-center gap-2.5 whitespace-nowrap"
                >
                  <Home size={16} strokeWidth={2} className="shrink-0" />
                  <span className="hidden xl:inline">Chcem predať nehnuteľnosť</span>
                  <span className="inline xl:hidden">Chcem predať</span>
                </Link>
              </div>

              <Link
                href="/chcem-prenajat"
                className="group px-6 py-4 border border-navy/20 text-navy font-sans font-medium text-base tracking-wide hover:border-accent-red hover:text-accent-red transition-all duration-300 text-center rounded-md w-full flex items-center justify-center gap-2.5 whitespace-nowrap"
              >
                <Key size={16} strokeWidth={2} className="shrink-0" />
                <span className="hidden xl:inline">Chcem prenajať svoju nehnuteľnosť</span>
                <span className="inline xl:hidden">Chcem prenajať</span>
              </Link>
            </motion.div>

            {/* Closing Left Column */}
          </div>

          {/* Right Column: Contained Video */}
          <motion.div
            className="w-full lg:w-[58%] relative hidden lg:block -mt-8 lg:mt-12 lg:-mr-16" // Pushed to right and down
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
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
                className="w-full h-full object-cover"
              >
                <source src="/hero-video.mp4" type="video/mp4" />
              </video>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default HeroDesktop;
