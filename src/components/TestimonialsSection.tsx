'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Quote, ArrowLeft, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageProvider';
import type { LanguageCode } from '@/i18n/types';

const testimonials: Record<LanguageCode, Array<{ name: string; location: string; text: string; role: string }>> = {
  sk: [
    {
      name: 'Mária Kováčová',
      location: 'Nitra',
      text: 'Profesionálny prístup, ktorý prekonal moje očakávania. Môj byt sa predal za 3 týždne za výbornú cenu! Peter a Mária ma sprevádzali celým procesom.',
      role: 'Predávajúci',
    },
  ],
  en: [
    {
      name: 'Mária Kováčová',
      location: 'Nitra',
      text: 'A professional approach that exceeded my expectations. My apartment sold in 3 weeks at an excellent price! Peter and Mária guided me through the entire process.',
      role: 'Seller',
    },
  ],
  de: [
    {
      name: 'Mária Kováčová',
      location: 'Nitra',
      text: 'Ein professioneller Ansatz, der meine Erwartungen übertroffen hat. Meine Wohnung wurde in 3 Wochen zu einem hervorragenden Preis verkauft! Peter und Mária haben mich durch den gesamten Prozess begleitet.',
      role: 'Verkäufer',
    },
  ],
};

export const TestimonialsSection = () => {
  const { language } = useLanguage();
  const items = testimonials[language];
  const [current, setCurrent] = useState(0);

  const paginate = (newDirection: number) => {
    setCurrent((prev) => (prev + newDirection + items.length) % items.length);
  };

  useEffect(() => {
    const timer = setInterval(() => paginate(1), 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative py-40 bg-cream overflow-hidden contain-layout">

      {/* Spotlight Effect - navy tint */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-full bg-gradient-to-b from-navy/5 to-transparent blur-[80px] pointer-events-none will-change-auto" />

      <div className="container mx-auto px-6 relative z-10">

        <div className="max-w-4xl mx-auto text-center">
          <Quote className="w-16 h-16 text-navy mx-auto mb-12 opacity-30" />

          <div className="min-h-[400px] flex items-center justify-center relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="absolute inset-0 flex flex-col items-center justify-center will-change-transform"
              >
                <p className="text-3xl md:text-5xl font-serif text-navy leading-tight mb-12">
                  "{items[current].text}"
                </p>

                <div className="space-y-2">
                  <h4 className="text-xl font-bold text-navy uppercase tracking-widest">{items[current].name}</h4>
                  <p className="text-accent-red font-mono text-sm">{items[current].role}, {items[current].location}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-12 mt-12">
            <button
              onClick={() => paginate(-1)}
              className="p-4 rounded-full border border-navy/10 text-navy hover:bg-navy hover:text-white transition-all duration-300 group"
            >
              <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
            </button>

            <div className="h-px w-32 bg-navy/10 overflow-hidden">
              <motion.div
                key={current}
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 6, ease: "linear" }}
                className="h-full w-full bg-navy"
              />
            </div>

            <button
              onClick={() => paginate(1)}
              className="p-4 rounded-full border border-navy/10 text-navy hover:bg-navy hover:text-white transition-all duration-300 group"
            >
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
