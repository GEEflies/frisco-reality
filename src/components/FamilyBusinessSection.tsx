'use client';

import { motion } from 'framer-motion';
import { Heart, Clock, ShieldCheck, Award } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageProvider';
import { useIsDesktop } from '@/hooks/useIsDesktop';
import type { LanguageCode } from '@/i18n/types';

const copy: Record<LanguageCode, {
    badgeMobile: string;
    badgeDesktop: string;
    headlineDesktopPrefix: string;
    headlineWhich: string;
    headlineYears: string;
    headlineSuffix: string;
    subtitle: string;
    benefits: Array<{ label: string; sublabel: string }>;
}> = {
    sk: {
        badgeMobile: 'Sme rodinná firma,',
        badgeDesktop: 'Rodinná firma',
        headlineDesktopPrefix: 'Sme rodinná firma, ',
        headlineWhich: 'ktorá si už',
        headlineYears: '18 rokov',
        headlineSuffix: 'zakladá na kvalite a dôvere.',
        subtitle: 'Pomáhame klientom v Seredi a okolí nájsť ich vysnívaný domov a spravovať nehnuteľnosti bez zbytočných komplikácií.',
        benefits: [
            { label: 'Konateľ osobne', sublabel: 'pán Križo vždy dostupný' },
            { label: 'Rýchle rozhodnutia', sublabel: 'Bez čakania na "centrálu"' },
            { label: 'Miestne korene', sublabel: 'Žijeme tam, kde predávame' },
            { label: 'Dobré meno', sublabel: 'Povesť je pre nás všetko' },
        ],
    },
    en: {
        badgeMobile: 'We are a family business,',
        badgeDesktop: 'Family business',
        headlineDesktopPrefix: 'We are a family business ',
        headlineWhich: 'that for',
        headlineYears: '18 years',
        headlineSuffix: 'has been built on quality and trust.',
        subtitle: 'We help clients in Sereď and the surrounding area find their dream home and manage property without unnecessary complications.',
        benefits: [
            { label: 'CEO personally', sublabel: 'Mr. Križo always available' },
            { label: 'Fast decisions', sublabel: 'No waiting for "headquarters"' },
            { label: 'Local roots', sublabel: 'We live where we sell' },
            { label: 'Good reputation', sublabel: 'Our name means everything' },
        ],
    },
    de: {
        badgeMobile: 'Wir sind ein Familienunternehmen,',
        badgeDesktop: 'Familienunternehmen',
        headlineDesktopPrefix: 'Wir sind ein Familienunternehmen, ',
        headlineWhich: 'das seit',
        headlineYears: '18 Jahren',
        headlineSuffix: 'auf Qualität und Vertrauen setzt.',
        subtitle: 'Wir helfen Kunden in Sereď und Umgebung, ihr Traumhaus zu finden und Immobilien unkompliziert zu verwalten.',
        benefits: [
            { label: 'Geschäftsführer persönlich', sublabel: 'Herr Križo immer erreichbar' },
            { label: 'Schnelle Entscheidungen', sublabel: 'Kein Warten auf die "Zentrale"' },
            { label: 'Lokale Wurzeln', sublabel: 'Wir leben, wo wir verkaufen' },
            { label: 'Guter Ruf', sublabel: 'Unser Name ist uns alles' },
        ],
    },
};

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1] as const
        }
    }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.1
        }
    }
};

export const FamilyBusinessSection = () => {
    const { language } = useLanguage();
    const t = copy[language];
    const isDesktop = useIsDesktop();

    return (
        <section className="reveal py-10 md:py-20 bg-white overflow-hidden relative">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-navy/5 to-transparent" />

            <div className="container mx-auto px-6">
                <motion.div
                    className="flex flex-col items-center text-center max-w-4xl mx-auto"
                    {...(isDesktop ? {
                        initial: "hidden",
                        whileInView: "visible",
                        viewport: { once: true, margin: "-100px" },
                        variants: staggerContainer,
                    } : {})}
                >

                    {/* Badge */}
                    <motion.div
                        {...(isDesktop ? { variants: fadeInUp } : {})}
                        className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-red/5 border border-accent-red/10 mb-8 ${!isDesktop ? 'rv-child' : ''}`}
                    >
                        <Heart className="w-4 h-4 text-accent-red fill-current" />
                        <span className="text-xs font-bold tracking-widest text-accent-red uppercase">
                            <span className="md:hidden">{t.badgeMobile}</span>
                            <span className="hidden md:inline">{t.badgeDesktop}</span>
                        </span>
                    </motion.div>

                    {/* Headline */}
                    <motion.h2
                        {...(isDesktop ? { variants: fadeInUp } : {})}
                        className={`text-3xl md:text-5xl lg:text-5xl font-bold text-navy mb-12 md:mb-6 leading-tight lg:leading-snug max-w-5xl ${!isDesktop ? 'rv-child' : ''}`}
                    >
                        <span className="hidden md:inline">{t.headlineDesktopPrefix}</span>
                        {t.headlineWhich} <br className="hidden md:block" />
                        <span className="relative inline-block">
                            <span className="text-accent-red italic font-serif text-4xl md:text-6xl lg:text-6xl font-black relative z-10">{t.headlineYears}</span>
                            <span className="absolute bottom-1 left-0 w-full h-1.5 bg-accent-red/10 overflow-hidden rounded-full">
                                <motion.span
                                    className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-accent-red to-transparent opacity-80"
                                    animate={{ x: ['-100%', '100%'] }}
                                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                                />
                            </span>
                        </span> {t.headlineSuffix}
                    </motion.h2>

                    {/* Subtitle */}
                    <motion.p
                        {...(isDesktop ? { variants: fadeInUp } : {})}
                        className={`text-lg md:text-xl text-charcoal/70 max-w-2xl mb-8 md:mb-12 font-light ${!isDesktop ? 'rv-child' : ''}`}
                    >
                        {t.subtitle}
                    </motion.p>

                    {/* Animation Wrapper (Replacing Numbers) */}
                    <motion.div
                        {...(isDesktop ? { variants: fadeInUp } : {})}
                        className={`w-full max-w-3xl mb-10 md:mb-20 relative h-20 md:h-32 flex items-center justify-center overflow-hidden ${!isDesktop ? 'rv-child' : ''}`}
                    >
                        {/* Abstract Wave/Trust Animation */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <svg className="w-full h-full text-navy/5" viewBox="0 0 1000 200" preserveAspectRatio="none">
                                <motion.path
                                    d="M0 100 Q 250 50 500 100 T 1000 100 T 1500 100 T 2000 100"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    initial={{ pathLength: 0, opacity: 0, x: 0 }}
                                    whileInView={{ pathLength: 1, opacity: 1 }}
                                    animate={{ x: -1000 }}
                                    viewport={{ once: true }}
                                    transition={{
                                        pathLength: { duration: 2, ease: "easeInOut" },
                                        opacity: { duration: 0.5 },
                                        x: { repeat: Infinity, duration: 20, ease: "linear" }
                                    }}
                                />
                                <motion.path
                                    d="M0 100 Q 250 150 500 100 T 1000 100 T 1500 100 T 2000 100"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    initial={{ pathLength: 0, opacity: 0, x: 0 }}
                                    whileInView={{ pathLength: 1, opacity: 1 }}
                                    animate={{ x: -1000 }}
                                    viewport={{ once: true }}
                                    transition={{
                                        pathLength: { duration: 2, delay: 0.2, ease: "easeInOut" },
                                        opacity: { duration: 0.5, delay: 0.2 },
                                        x: { repeat: Infinity, duration: 25, ease: "linear" }
                                    }}
                                />
                            </svg>
                            {/* Central Frisco Logo Element or Emblem could go here if available, using a simple circle for now */}
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 20 }}
                                className="absolute w-16 h-16 md:w-20 md:h-20 bg-white rounded-full border border-navy/10 flex items-center justify-center shadow-lg"
                            >
                                <span className="font-serif font-bold text-navy text-xl md:text-2xl">18+</span>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Benefits Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 lg:gap-12 w-full px-4 md:px-0">
                        <BenefitItem
                            icon={Heart}
                            color="text-accent-red"
                            label={t.benefits[0].label}
                            sublabel={t.benefits[0].sublabel}
                            useFM={isDesktop}
                        />
                        <BenefitItem
                            icon={Clock}
                            color="text-yellow-500"
                            label={t.benefits[1].label}
                            sublabel={t.benefits[1].sublabel}
                            useFM={isDesktop}
                        />
                        <BenefitItem
                            icon={ShieldCheck}
                            color="text-blue-500"
                            label={t.benefits[2].label}
                            sublabel={t.benefits[2].sublabel}
                            useFM={isDesktop}
                        />
                        <BenefitItem
                            icon={Award}
                            color="text-purple-500"
                            label={t.benefits[3].label}
                            sublabel={t.benefits[3].sublabel}
                            useFM={isDesktop}
                        />
                    </div>

                </motion.div>
            </div>
        </section>
    );
};

const BenefitItem = ({ icon: Icon, color, label, sublabel, useFM }: { icon: any, color: string, label: string, sublabel: string, useFM: boolean }) => (
    <motion.div
        {...(useFM ? { variants: fadeInUp } : {})}
        className={`flex flex-row md:flex-col items-center group w-full ${!useFM ? 'rv-child' : ''}`}
    >
        <div className={`shrink-0 w-12 h-12 rounded-2xl bg-white border border-charcoal/5 shadow-sm flex items-center justify-center mr-4 md:mr-0 md:mb-4 group-hover:scale-110 transition-transform duration-300`}>
            <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <div className="text-left md:text-center flex-1">
            <h4 className="font-bold text-navy text-base md:text-lg mb-0.5 md:mb-1">{label}</h4>
            <p className="text-sm text-charcoal/60 leading-tight md:leading-normal">{sublabel}</p>
        </div>

        {/* Helper visual dot */}
        <div className={`hidden md:block w-1.5 h-1.5 rounded-full mt-3 opacity-0 group-hover:opacity-100 transition-opacity bg-current ${color}`} />
    </motion.div>
);
