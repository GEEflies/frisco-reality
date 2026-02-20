'use client';

import { motion } from 'framer-motion';
import { useRef } from 'react';
const teamPhoto = '/team-photo.jpg';
import { Award, Phone, Mail } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageProvider';
import { useIsDesktop } from '@/hooks/useIsDesktop';
import type { LanguageCode } from '@/i18n/types';

const teamCopy: Record<LanguageCode, {
  badge: string;
  peterRole: string;
  peterQuote: string;
  peterCta: string;
  denisaRole: string;
  denisaQuote: string;
  denisaCta: string;
}> = {
  sk: {
    badge: 'Autori',
    peterRole: 'Konateľ & Broker',
    peterQuote: 'V každom obchode hľadám nielen číslo, ale príbeh. Mojím cieľom nie je len predať, ale vytvoriť hodnotu, ktorá pretrvá generácie.',
    peterCta: 'Zavolať Petrovi',
    denisaRole: 'Senior Agent',
    denisaQuote: 'Detail robí dizajn. A v realitách je to rovnaké. Každá zmluva, každá obhliadka, každý úsmev musí byť dokonalý.',
    denisaCta: 'Zavolať Denise',
  },
  en: {
    badge: 'The team',
    peterRole: 'CEO & Broker',
    peterQuote: 'In every deal I look not only for a number, but for a story. My goal is not just to sell, but to create value that lasts for generations.',
    peterCta: 'Call Peter',
    denisaRole: 'Senior Agent',
    denisaQuote: 'The detail makes the design. And in real estate it is exactly the same. Every contract, every viewing, every smile must be flawless.',
    denisaCta: 'Call Denisa',
  },
  de: {
    badge: 'Das Team',
    peterRole: 'Geschäftsführer & Makler',
    peterQuote: 'Bei jedem Geschäft suche ich nicht nur eine Zahl, sondern eine Geschichte. Mein Ziel ist es nicht nur zu verkaufen, sondern einen Wert zu schaffen, der Generationen überdauert.',
    peterCta: 'Peter anrufen',
    denisaRole: 'Senior-Maklerin',
    denisaQuote: 'Das Detail macht das Design. Und in der Immobilienbranche ist es genauso. Jeder Vertrag, jede Besichtigung, jedes Lächeln muss perfekt sein.',
    denisaCta: 'Denisa anrufen',
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay,
      ease: "easeOut" as const
    }
  })
};

export const TeamSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();
  const t = teamCopy[language];
  const isDesktop = useIsDesktop();

  return (
    <section ref={containerRef} id="tim" className="reveal relative min-h-[90vh] md:min-h-[120vh] bg-white flex items-center overflow-hidden">

      {/* Background Image - static for performance */}
      <div className="absolute inset-0 z-0 h-[60vh] md:h-full">
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/30 to-white z-10" />
        <div className="absolute inset-0 bg-white/40 z-10" />
        <img
          src={teamPhoto}
          alt="Frisco Team"
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover object-top opacity-40"
          style={{ transform: 'translateZ(0)' }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-20 py-24">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="mb-24 text-center md:text-left">
            <motion.span
              {...(isDesktop ? {
                initial: { opacity: 0, y: 20 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true, margin: "-100px" },
                transition: { duration: 0.5, ease: "easeOut" },
              } : {})}
              className={`inline-block text-navy font-mono text-sm tracking-[0.3em] uppercase mb-4 border-b border-navy/30 pb-2 ${!isDesktop ? 'rv-child' : ''}`}
            >
              {t.badge}
            </motion.span>
            <motion.h2
              {...(isDesktop ? {
                initial: { opacity: 0, y: 30 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true, margin: "-100px" },
                transition: { duration: 0.5, delay: 0.1, ease: "easeOut" },
              } : {})}
              className={`text-7xl md:text-9xl font-serif font-bold text-navy tracking-tighter ${!isDesktop ? 'rv-child' : ''}`}
            >
              Peter & Denisa
            </motion.h2>
          </div>

          {/* Interactive Cards Layout */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-32">

            {/* Peter's Card */}
            <motion.div
              {...(isDesktop ? {
                variants: cardVariants,
                initial: "hidden",
                whileInView: "visible",
                viewport: { once: true, margin: "-50px" },
                custom: 0.15,
                style: { willChange: 'transform, opacity' },
              } : {})}
              className={`bg-white border border-navy/10 p-8 md:p-12 rounded-lg shadow-xl ${!isDesktop ? 'rv-child' : ''}`}
            >
              <div className="flex items-start justify-between mb-8">
                <span className="text-4xl font-serif text-navy italic">01</span>
                <Award className="text-accent-red w-6 h-6" />
              </div>

              <h3 className="text-3xl font-serif font-bold text-navy mb-2">Bc. Peter Križo</h3>
              <p className="text-accent-red text-sm uppercase tracking-widest mb-6">{t.peterRole}</p>

              <p className="text-charcoal/70 mb-8 leading-relaxed">
                "{t.peterQuote}"
              </p>

              <div className="flex items-center gap-6">
                <SocialLink icon={Phone} href="tel:+421905740700" label={t.peterCta} />
                <SocialLink icon={Mail} href="mailto:info@frisco.sk" label="Email" />
              </div>
            </motion.div>

            {/* Denisa's Card - Offset */}
            <motion.div
              {...(isDesktop ? {
                variants: cardVariants,
                initial: "hidden",
                whileInView: "visible",
                viewport: { once: true, margin: "-50px" },
                custom: 0.3,
                style: { willChange: 'transform, opacity' },
              } : {})}
              className={`md:mt-32 bg-white border border-navy/10 p-8 md:p-12 rounded-lg shadow-xl ${!isDesktop ? 'rv-child' : ''}`}
            >
              <div className="flex items-start justify-between mb-8">
                <span className="text-4xl font-serif text-navy italic">02</span>
                <Award className="text-accent-red w-6 h-6" />
              </div>

              <h3 className="text-3xl font-serif font-bold text-navy mb-2">Denisa Križová</h3>
              <p className="text-accent-red text-sm uppercase tracking-widest mb-6">{t.denisaRole}</p>

              <p className="text-charcoal/70 mb-8 leading-relaxed">
                "{t.denisaQuote}"
              </p>

              <div className="flex items-center gap-6">
                <SocialLink icon={Phone} href="tel:+421905447220" label={t.denisaCta} />
                <SocialLink icon={Mail} href="mailto:krizovadenka@gmail.com" label="Email" />
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

const SocialLink = ({ icon: Icon, href, label }: { icon: any, href: string, label: string }) => (
  <a href={href} className="group/link flex items-center gap-2 text-charcoal/50 hover:text-navy transition-colors">
    <div className="p-2 rounded-full border border-navy/10 group-hover/link:border-navy group-hover/link:bg-navy/5 transition-all">
      <Icon className="w-4 h-4" />
    </div>
    <span className="text-xs font-medium uppercase tracking-wider opacity-0 group-hover/link:opacity-100 transition-opacity -translate-x-2 group-hover/link:translate-x-0">
      {label}
    </span>
  </a>
);
