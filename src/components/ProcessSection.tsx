'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from 'framer-motion';
import { MessageCircle, Search, Eye, Key, MapPin, Flag } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: MessageCircle,
    title: 'Prvé stretnutie',
    description: 'Začneme nezáväzným rozhovorom. Či už chcete predať, prenajať alebo hľadáte nové bývanie, najskôr si vypočujeme vaše predstavy a ciele.',
  },
  {
    number: '02',
    icon: Search,
    title: 'Dohodneme si plán',
    description: 'Navrhneme konkrétny postup podľa vašej situácie. Majiteľom nastavíme správnu cenu a stratégiu predaja/prenájmu. Záujemcom pomôžeme nájsť nehnuteľnosť, ktorá dáva zmysel ich potrebám aj rozpočtu.',
  },
  {
    number: '03',
    icon: Eye,
    title: 'O všetko sa postaráme',
    description: 'Postaráme sa o celý proces. Od profesionálnej prezentácie a komunikácie so záujemcami až po vyhľadávanie vhodných ponúk a organizovanie obhliadok. Vy sa môžete sústrediť na to podstatné.',
  },
  {
    number: '04',
    icon: Key,
    title: 'Dotiahneme to do konca',
    description: 'Zabezpečíme právny servis, zmluvy aj bezpečný prevod. Sprevádzame vás až do momentu, keď sú podpísané papiere a odovzdané kľúče.',
  }
];


import { useMediaQuery } from '@/hooks/useMediaQuery';
import confetti from 'canvas-confetti';

// Configuration for granular control of each card's vertical position (in pixels)
// Use plain numbers. Negative numbers move the card UP.
const cardMargins = [
  { md: 0, lg: 0 },            // 01: Prvý Kontakt
  { md: -128, lg: -160 },      // 02: Stratégia (Adjusted: was -224, set to -260 for visibility)
  { md: -128, lg: -24 },      // 03: Realizácia
  { md: -64, lg: -48 },        // 04: Grand Finále (moved down)
];

const S_CURVE_PATH = "M 25 0 C 25 0, 25 20, 50 20 C 75 20, 75 35, 75 35 C 75 35, 75 50, 50 50 C 25 50, 25 65, 25 65 C 25 65, 25 85, 50 85 C 75 85, 85 95, 85 95";

export const ProcessSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const isTablet = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    setMounted(true);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 65%", "end 90%"] // Finishes drawing sooner — when last card is visible
  });

  // Optimized spring configuration for "butter smooth" no-overshoot tracking
  const smoothProgress = useSpring(scrollYProgress, {
    mass: 0.2,       // Low mass = Low inertia (stops quickly when scroll stops)
    stiffness: 50,   // Responsive but loose enough to smooth out mouse wheel steps
    damping: 10,     // Over-damped (Critical ~4.5) to absolutely prevent "bouncing back"
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
      origin: { x: 0.85, y: 0.85 },
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

  return (
    <section ref={containerRef} className="relative pt-16 md:pt-24 pb-12 md:pb-60 bg-cream overflow-hidden">
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
          <defs>
            <mask id="draw-mask">
              {/* This path acts as the mask. It draws white (visible) as you scroll. */}
              <motion.path
                d={S_CURVE_PATH}
                stroke="white"
                strokeWidth="5" /* Thick enough to fully cover the underlying line */
                fill="none"
                style={{
                  pathLength,
                  willChange: 'stroke-dashoffset' // Optimize paint
                }}
              />
            </mask>
          </defs>

          {/* The visible dashed line, revealed by the mask */}
          <path
            d={S_CURVE_PATH}
            stroke="#D92323"
            strokeWidth="1"
            fill="none"
            strokeDasharray="4 4"
            className="opacity-70"
            mask="url(#draw-mask)"
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
          className="absolute bottom-[5%] left-[85%] -translate-x-1/2 translate-y-1/2"
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
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="block text-accent-red font-bold text-sm tracking-[0.2em] uppercase mb-4"
          >
            Náš Postup
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-serif font-bold text-navy"
          >
            Ako to u nás <span className="italic relative inline-block">
              funguje
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-accent-red opacity-80" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" />
              </svg>
            </span>
          </motion.h2>
        </div>

        {/* Adjust vertical spacing with extreme -margin to pull them closer */}
        <div className="flex flex-col space-y-8 md:space-y-0 relative max-w-[85rem] mx-auto pb-12">
          {steps.map((step, index) => {
            // Calculate margin based on screen size (only after mount to avoid hydration mismatch)
            let marginTop = 0;
            if (mounted && isDesktop && cardMargins[index]) {
              marginTop = cardMargins[index].lg;
            } else if (mounted && isTablet && cardMargins[index]) {
              marginTop = cardMargins[index].md;
            }

            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                viewport={{ once: true, margin: "-50px" }}
                style={mounted ? { marginTop: marginTop ? `${marginTop}px` : undefined } : undefined}
                className={`relative md:w-[48%] ${index % 2 === 0
                  ? 'md:mr-auto' // Left Column
                  : 'md:ml-auto' // Right Column
                  } 
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
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  );
};
