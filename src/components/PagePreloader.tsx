'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/i18n/LanguageProvider';
const friscoLogo = '/frisco-logo.png';

export const PagePreloader = ({ onComplete }: { onComplete: () => void }) => {
  const { language } = useLanguage();
  const subtitle = language === 'sk'
    ? 'Realitná Kancelária'
    : language === 'en'
      ? 'Real Estate Agency'
      : 'Immobilienagentur';
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        const diff = 100 - prev;
        const inc = Math.max(5, Math.floor(Math.random() * (diff / 1.2)));
        return Math.min(100, prev + inc);
      });
    }, 30);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      setTimeout(onComplete, 300);
    }
  }, [progress, onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          {/* FRISCO Logo - preserved red */}
          <img
            src={friscoLogo}
            alt="FRISCO"
            className="h-12 md:h-14 mx-auto"
          />
          <p className="text-navy text-xs tracking-[0.4em] uppercase mt-3">
            {subtitle}
          </p>
        </motion.div>

        {/* Progress Container */}
        <div className="w-48 h-[1px] bg-navy/10 relative overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 bottom-0 bg-navy"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 80, damping: 20 }}
          />
        </div>

        <motion.span
          className="text-charcoal/30 text-xs font-mono tabular-nums block mt-3"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          {progress}%
        </motion.span>
      </div>

      {/* Decorative Noise */}
      <div className="absolute inset-0 bg-noise opacity-5 pointer-events-none" />
    </motion.div>
  );
};
