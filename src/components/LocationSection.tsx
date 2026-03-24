'use client';

import { motion } from 'framer-motion';
import { MapPin, ArrowUpRight, ChevronRight, Navigation, Clock } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageProvider';
import { useIsDesktop } from '@/hooks/useIsDesktop';

export const LocationSection = () => {
    const { language } = useLanguage();
    const isDesktop = useIsDesktop();
    const copy = {
        sk: {
            title: 'Kde nás nájdete',
            subtitle: 'Naša kancelária sa nachádza v centre Seredi, na Námestí Slobody.',
            mapTitle: 'Interaktívna mapa',
            mapAddress: 'Námestie Slobody 1185/30, Sereď',
            mapsCta: 'Navigovať v Google Maps',
            officeAddress: 'Adresa prevádzky',
            country: 'Slovenská republika',
            howToReach: 'Ako sa k nám dostanete:',
            byCar: 'Autom:',
            byCarText: 'Verejné parkovanie priamo na námestí.',
            byTransit: 'MHD:',
            byTransitText: 'Zastávka "Sereď, nám. Slobody".',
            openingHours: 'Otváracie hodiny:',
            weekdays: 'Po - Pi:',
            weekend: 'So - Ne:',
            closed: 'Zatvorené',
            startNav: 'Spustiť navigáciu',
            officeAlt: 'Naša kancelária',
        },
        en: {
            title: 'Where to find us',
            subtitle: 'Our office is located in the center of Sereď at Námestie Slobody.',
            mapTitle: 'Interactive map',
            mapAddress: 'Námestie Slobody 1185/30, Sereď',
            mapsCta: 'Navigate in Google Maps',
            officeAddress: 'Office address',
            country: 'Slovak Republic',
            howToReach: 'How to reach us:',
            byCar: 'By car:',
            byCarText: 'Public parking is available directly on the square.',
            byTransit: 'Public transport:',
            byTransitText: 'Stop "Sereď, nám. Slobody".',
            openingHours: 'Opening hours:',
            weekdays: 'Mon - Fri:',
            weekend: 'Sat - Sun:',
            closed: 'Closed',
            startNav: 'Start navigation',
            officeAlt: 'Our office',
        },
        de: {
            title: 'Wo Sie uns finden',
            subtitle: 'Unser Büro befindet sich im Zentrum von Sereď am Námestie Slobody.',
            mapTitle: 'Interaktive Karte',
            mapAddress: 'Námestie Slobody 1185/30, Sereď',
            mapsCta: 'In Google Maps navigieren',
            officeAddress: 'Büroadresse',
            country: 'Slowakische Republik',
            howToReach: 'So erreichen Sie uns:',
            byCar: 'Mit dem Auto:',
            byCarText: 'Öffentliche Parkplätze direkt am Platz verfügbar.',
            byTransit: 'ÖPNV:',
            byTransitText: 'Haltestelle "Sereď, nám. Slobody".',
            openingHours: 'Öffnungszeiten:',
            weekdays: 'Mo - Fr:',
            weekend: 'Sa - So:',
            closed: 'Geschlossen',
            startNav: 'Navigation starten',
            officeAlt: 'Unser Büro',
        },
    }[language];

    return (
        <section className="reveal py-12 md:py-20 bg-cream">
            <div className="container mx-auto px-6">
                <motion.div
                    {...(isDesktop ? {
                        initial: { opacity: 0, y: 30 },
                        whileInView: { opacity: 1, y: 0 },
                        viewport: { once: true },
                        transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
                    } : {})}
                    className={`text-center mb-8 md:mb-12 ${!isDesktop ? 'rv-child' : ''}`}
                >
                    <h2 className="text-3xl md:text-5xl font-serif font-bold text-navy mb-4">
                        {copy.title}
                    </h2>
                    <p className="text-base md:text-lg text-charcoal/70 max-w-2xl mx-auto">
                        {copy.subtitle}
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-8 items-stretch">

                    {/* Interactive Map / Image Card */}
                    <motion.div
                        {...(isDesktop ? {
                            initial: { opacity: 0, x: -30 },
                            whileInView: { opacity: 1, x: 0 },
                            viewport: { once: true },
                            transition: { duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] },
                        } : {})}
                        className={`relative rounded-[2rem] overflow-hidden border border-navy/5 shadow-xl min-h-[500px] group ${!isDesktop ? 'rv-child' : ''}`}
                    >
                        {/* Background Image & Overlay */}
                        <div className="absolute inset-0">
                            <img
                                src="/kontakt-moz2.webp"
                                alt={copy.officeAlt}
                                loading="lazy"
                                decoding="async"
                                className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-700"
                            />
                            {/* Heavier light overlay for "Interaktívna mapa" feel if desired, or keep dark. 
                                The Billik one has a light overlay. FRISCO brand is usually dark overlay. 
                                User said "Billik seems way better". Billik is Light. 
                                I will try a lighter look but ensuring text readability. 
                                Actually, sticking to the current dark overlay but cleaner might be safer for contrast, 
                                unless I switch to dark text. Let's keep the dark overlay for the Left Card 
                                as it looks premium, but clean up the text. 
                            */}
                            <div className="absolute inset-0 bg-navy/40 mix-blend-multiply transition-colors duration-500 group-hover:bg-navy/30" />
                            <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent" />
                        </div>

                        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center p-8">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-md mb-6 border border-white/30 shadow-lg group-hover:scale-110 transition-transform duration-500">
                                <MapPin className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-4xl font-bold text-white mb-4 tracking-tight drop-shadow-md">
                                {copy.mapTitle}
                            </h3>
                            <p className="text-white/90 mb-10 text-lg font-medium drop-shadow-sm">
                                {copy.mapAddress}
                            </p>
                            <a
                                href="https://maps.app.goo.gl/jBhRQr8HWckRzp5f7"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-accent-red text-white rounded-lg font-bold hover:bg-accent-red/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 w-full sm:w-auto text-base"
                            >
                                <ArrowUpRight className="w-5 h-5" />
                                <span>{copy.mapsCta}</span>
                            </a>
                        </div>
                    </motion.div>

                    {/* Right Column: Info Card */}
                    <motion.div
                        {...(isDesktop ? {
                            initial: { opacity: 0, x: 30 },
                            whileInView: { opacity: 1, x: 0 },
                            viewport: { once: true },
                            transition: { duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] },
                        } : {})}
                        className={`bg-white rounded-[2rem] shadow-xl border border-navy/5 p-8 flex flex-col h-full ${!isDesktop ? 'rv-child' : ''}`}
                    >
                        {/* Address */}
                        <div className="pb-8 border-b border-gray-100">
                            <h3 className="text-xl font-bold text-navy mb-4 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center">
                                    <MapPin className="w-5 h-5 text-accent-red" />
                                </div>
                                <span>{copy.officeAddress}</span>
                            </h3>
                            <div className="pl-[3.25rem] space-y-1.5">
                                <p className="text-lg font-bold text-navy">FRISCO, s.r.o.</p>
                                <p className="text-base text-charcoal/80">Námestie Slobody 1185/30</p>
                                <p className="text-base text-charcoal/80">926 01 Sereď</p>
                                <p className="text-base text-charcoal/80">{copy.country}</p>
                            </div>
                        </div>

                        {/* Directions */}
                        <div className="py-8 border-b border-gray-100">
                            <h3 className="text-xl font-bold text-navy mb-4 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center">
                                    <Navigation className="w-5 h-5 text-accent-red" />
                                </div>
                                <span>{copy.howToReach}</span>
                            </h3>
                            <ul className="space-y-4 pl-1">
                                <ListItem>
                                    <span className="font-bold text-navy text-sm md:text-base">{copy.byCar}</span> <span className="text-sm md:text-base text-charcoal/70">{copy.byCarText}</span>
                                </ListItem>
                                <ListItem>
                                    <span className="font-bold text-navy text-sm md:text-base">{copy.byTransit}</span> <span className="text-sm md:text-base text-charcoal/70">{copy.byTransitText}</span>
                                </ListItem>
                            </ul>
                        </div>

                        {/* Opening Hours & Button */}
                        <div className="pt-8 mt-auto flex flex-col gap-8">
                            <div>
                                <h3 className="text-xl font-bold text-navy mb-4 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center">
                                        <Clock className="w-5 h-5 text-accent-red" />
                                    </div>
                                    <span>{copy.openingHours}</span>
                                </h3>
                                <div className="space-y-3 text-sm md:text-base pl-[3.25rem]">
                                    <div className="flex items-center gap-x-3 border-b border-gray-50 pb-2">
                                        <span className="font-bold text-navy">{copy.weekdays}</span>
                                        <span className="text-charcoal/80">9-12, 13-16</span>
                                    </div>
                                </div>
                            </div>

                            <a
                                href="https://maps.app.goo.gl/jBhRQr8HWckRzp5f7"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 bg-navy text-white rounded-lg font-bold hover:bg-navy/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 text-base uppercase tracking-wider"
                            >
                                <ArrowUpRight className="w-5 h-5" />
                                <span>{copy.startNav}</span>
                            </a>
                        </div>

                    </motion.div>
                </div>
            </div >
        </section >
    );
};

const ListItem = ({ children }: { children: React.ReactNode }) => (
    <li className="flex items-start gap-3 text-base leading-relaxed group pl-2">
        <ChevronRight className="w-5 h-5 text-accent-red flex-shrink-0 mt-0.5" />
        <span>{children}</span>
    </li>
);
