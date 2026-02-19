'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { useLanguage } from '@/i18n/LanguageProvider';

const stats = {
  sk: [
    { value: '300', suffix: '+', label: 'Spokojných Rodín' },
    { value: '18', suffix: '', label: 'Rokov Skúseností' },
    { value: '98', suffix: '%', label: 'Úspešnosť Predaja' },
    { value: '45', suffix: ' dní', label: 'Priemerný čas predaja' },
  ],
  en: [
    { value: '300', suffix: '+', label: 'Happy Families' },
    { value: '18', suffix: '', label: 'Years of Experience' },
    { value: '98', suffix: '%', label: 'Sales Success Rate' },
    { value: '45', suffix: ' days', label: 'Average time to sale' },
  ],
  de: [
    { value: '300', suffix: '+', label: 'Zufriedene Familien' },
    { value: '18', suffix: '', label: 'Jahre Erfahrung' },
    { value: '98', suffix: '%', label: 'Erfolgsquote beim Verkauf' },
    { value: '45', suffix: ' Tage', label: 'Durchschnittliche Verkaufszeit' },
  ],
};

export const StatsSection = () => {
  const { language } = useLanguage();
  const localizedStats = stats[language];
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <section ref={containerRef} className="relative py-32 bg-white overflow-hidden border-t border-navy/10 contain-layout">

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-0">

          {localizedStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              style={{ y: !isMobile && index % 2 === 0 ? y : 0 }}
              className="relative flex flex-col justify-between h-64 md:h-80 md:border-r border-navy/10 last:border-0 md:pl-12 will-change-transform"
            >
              <div className="overflow-hidden">
                <motion.span
                  initial={{ y: "100%" }}
                  whileInView={{ y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  viewport={{ once: true }}
                  className="block text-[8rem] md:text-[10rem] font-serif font-light leading-[0.8] tracking-tighter text-accent-red"
                >
                  {stat.value}
                </motion.span>
              </div>

              <div>
                <span className="text-xl md:text-2xl font-light italic block mb-2 text-accent-red">{stat.suffix}</span>
                <span className="text-sm font-mono tracking-widest uppercase text-charcoal/50">{stat.label}</span>
              </div>
            </motion.div>
          ))}

        </div>
      </div>
    </section>
  );
};
