'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from 'framer-motion';
import { MessageCircle, Search, Eye, Key, MapPin, Flag } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageProvider';
import { PROCESS_COPY } from '@/i18n/copy';

const steps = [
  {
    number: '01',
    icon: MessageCircle,
  },
  {
    number: '02',
    icon: Search,
  },
  {
    number: '03',
    icon: Eye,
  },
  {
    number: '04',
    icon: Key,
  }
];


import confetti from 'canvas-confetti';

const S_CURVE_PATH = "M 25 0 C 25 0, 25 18, 50 18 C 75 18, 75 32, 75 32 C 75 32, 75 46, 50 46 C 25 46, 25 60, 32.5 80";

export const ProcessSection = () => {
  const { language } = useLanguage();
  const copy = PROCESS_COPY[language];
  const localizedSteps = steps.map((step, index) => ({ ...step, ...copy.steps[index] }));
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 60%", "center 60%"] // Finishes drawing much sooner
  });

  // Optimized spring configuration for "butter smooth" no-overshoot tracking
  const smoothProgress = useSpring(scrollYProgress, {
    mass: 0.1,       // Very low mass -> highly responsive
    stiffness: 30,   // Soft stiffness -> smooth
    damping: 10,     // Over-damped to prevent jitter/overshoot
    restDelta: 0.001
  });

  const pathLength = useTransform(smoothProgress, [0, 1], [0, 1]);

  // Create derived values for the icon animation based on path completion
  // The icon will fade in and scale up only when the path is nearly finished (98% to 100%)
  const iconOpacity = useTransform(pathLength, [0.98, 1], [0, 1]);
  const iconScale = useTransform(pathLength, [0.98, 1], [0, 1]);

  const handleConfetti = () => {
    // Classic party confetti colors
    const colors = ['#ff0000', '#0066ff', '#00cc44', '#ffcc00', '#ff69b4', '#ff6600', '#9933ff'];

    // Single subtle burst from bottom-right
    confetti({
      particleCount: 40,
      angle: 120,
      spread: 60,
      origin: { x: 0.3, y: 0.8 },
      colors,
      disableForReducedMotion: true,
      zIndex: 100,
      gravity: 1.5,
      scalar: 0.8,
      startVelocity: 35,
      ticks: 150,
    });
  };

  // Guard to fire confetti only once
  const hasFiredConfetti = useRef(false);

  // Trigger confetti when the path is fully drawn
  useMotionValueEvent(pathLength, "change", (latest: number) => {
    if (latest >= 1 && !hasFiredConfetti.current) {
      hasFiredConfetti.current = true;
      handleConfetti();
    }
  });

  /* ── Mobile: cards visible immediately, no GSAP scroll-lock ── */

  return (
    <section ref={containerRef} className="reveal relative pt-16 md:pt-24 pb-12 md:pb-0 mb-0 md:-mb-32 bg-cream overflow-hidden">
      {/* Background Noise & ambient light */}
      <div className="absolute inset-0 bg-noise opacity-5 mix-blend-soft-light pointer-events-none" />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 70%)'
        }}
      />

      {/* S-Curve SVG Line (Desktop Only) */}
      <div
        className="hidden md:block absolute top-[120px] left-0 right-0 bottom-10 pointer-events-none z-0"
        style={{
          transform: 'translate3d(0,0,0)', // Force GPU layer
          willChange: 'transform' // Hint browser
        }}
      >
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Solid line that draws itself - better performance than masking */}
          <motion.path
            d={S_CURVE_PATH}
            stroke="#D92323"
            strokeWidth="1"
            fill="none"
            className="opacity-70"
            style={{
              pathLength,
              willChange: 'stroke-dashoffset' // Optimize paint
            }}
          />
        </svg>

        {/* Start Icon (Pin) */}
        <div className="absolute top-[2%] left-[25%] -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="relative">
            <div className="absolute inset-0 bg-accent-red blur-xl opacity-30 animate-pulse" />
            <div className="relative w-16 h-16 bg-white rounded-full border-4 border-accent-red flex items-center justify-center shadow-lg transform -rotate-12">
              <MapPin className="text-accent-red w-8 h-8 fill-current" />
            </div>
          </div>
        </div>

        {/* End Icon (Flag) - synchronized with path completion */}
        <motion.div
          className="absolute bottom-[20%] left-[30%] -translate-x-1/2 translate-y-1/2"
          style={{
            opacity: iconOpacity,
            scale: iconScale,
            rotate: 12 // Fixed rotation since we're not animating it from -20 anymore
          }}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-accent-red blur-xl opacity-30 animate-pulse" />
            <div className="relative w-20 h-20 bg-white rounded-full border-4 border-accent-red flex items-center justify-center shadow-lg transform rotate-12">
              <Flag className="text-accent-red w-10 h-10 fill-current" />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <span
            className="rv-child block text-accent-red font-bold text-sm tracking-[0.2em] uppercase mb-4"
          >
            {copy.badge}
          </span>
          <h2
            className="rv-child text-5xl md:text-7xl font-serif font-bold text-navy"
          >
            {copy.titleStart} <span className="italic relative inline-block">
              {copy.titleAccent}
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-accent-red opacity-80" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" />
              </svg>
            </span>
          </h2>
        </div>

        {/* Adjust vertical spacing with transforms instead of margins for smoothness */}
        <div className="flex flex-col space-y-8 md:space-y-0 relative max-w-[85rem] mx-auto pb-12">
          {localizedSteps.map((step, index) => {
            // Apply staggering using Tailwind translate classes
            // These correspond roughly to the previous margin values but use GPU-accelerated transforms
            // Previous margins: 0, -128/-260, -128/-24, -64/-48
            let translateClass = "";
            if (index === 1) translateClass = "md:-translate-y-32 lg:-translate-y-40";
            if (index === 2) translateClass = "md:-translate-y-44 lg:-translate-y-36";
            if (index === 3) translateClass = "md:-translate-y-36 lg:-translate-y-[13.5rem]";

            return (
              <div
                key={step.number}
                data-process-step
                className={`rv-child process-step relative md:w-[48%] ${index % 2 === 0
                  ? 'md:mr-auto' // Left Column
                  : 'md:ml-auto' // Right Column
                  } ${translateClass}
              `}
              >
                {/* Redesigned Card */}
                <div className="group relative bg-white border border-navy/10 rounded-2xl p-8 md:p-10 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
                  {/* Large Background Number */}
                  <span className="hidden md:block absolute -top-2 right-4 text-[5rem] md:text-[7rem] font-serif font-bold text-accent-red/[0.08] leading-none pointer-events-none select-none group-hover:text-accent-red/[0.12] transition-colors duration-500">
                    {step.number}
                  </span>

                  <div className="relative z-10">
                    {/* Icon and Step Number Row */}
                    <div className="mb-5 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-accent-red/10 flex items-center justify-center text-accent-red group-hover:bg-accent-red group-hover:text-white transition-all duration-300">
                        <step.icon className="w-6 h-6" strokeWidth={2} />
                      </div>
                      <span className="text-sm font-poppins font-semibold text-navy/40 tracking-widest uppercase">{step.number}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl md:text-3xl font-poppins font-bold text-navy mb-3 group-hover:text-accent-red transition-colors duration-300">
                      {step.title}
                    </h3>
                    {/* Description */}
                    <p className="text-charcoal/70 leading-relaxed text-base md:text-lg">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  );
};
