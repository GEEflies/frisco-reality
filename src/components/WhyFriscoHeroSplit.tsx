'use client';

import { motion, useAnimation, useInView } from 'framer-motion';
import { Home, Search, Camera, Megaphone, HandshakeIcon, Users, Building, Receipt, CreditCard, ShieldCheck, FileSignature, HeadphonesIcon, ArrowUpRight, Tag, KeyRound, Banknote, DoorOpen } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/i18n/LanguageProvider';
import { WHY_FRISCO_COPY } from '@/i18n/copy';

/* ═══════════════════ DATA ═══════════════════ */
const ownerTabs = {
    sell: {
        label: 'Predať',
        tabIcon: <Tag className="w-4 h-4" />,
        headline: 'Predáme Vašu nehnuteľnosť za cenu, ktorú si zaslúži',
        subtitle: 'Postaráme sa o celý proces od A po Z. Vy sa nemusíte stresovať.',
        cta: { text: 'MÁM ZÁUJEM', href: '/chcem-predat' },
        benefits: [
            {
                icon: <Camera className="w-5 h-5 lg:w-6 lg:h-6" />,
                title: 'Kvalitná prezentácia',
                description: 'Profesionálne fotky. Ukážeme Vašu nehnuteľnosť tak, aby zaujala na prvý pohľad.',
            },
            {
                icon: <Megaphone className="w-5 h-5 lg:w-6 lg:h-6" />,
                title: 'Efektívny marketing',
                description: 'Inzerujeme tam, kde ľudia reálne hľadajú. Portály, sociálne siete aj naša databáza kontaktov.',
            },
            {
                icon: <HandshakeIcon className="w-5 h-5 lg:w-6 lg:h-6" />,
                title: 'Vyjednáme pre Vás maximum',
                description: 'Poznáme ceny v okolí a vieme, kde je priestor na vyjednávanie. Naším cieľom je čo najlepší výsledok pre Vás.',
            },
        ]
    },
    rent: {
        label: 'Prenajať',
        tabIcon: <KeyRound className="w-4 h-4" />,
        headline: 'Prenájom bez zbytočných komplikácií',
        subtitle: 'Nájdeme spoľahlivého nájomníka a vybavíme všetko potrebné.',
        cta: { text: 'MÁM ZÁUJEM', href: '/chcem-prenajat' },
        benefits: [
            {
                icon: <Users className="w-5 h-5 lg:w-6 lg:h-6" />,
                title: 'Starostlivý výber nájomníkov',
                description: 'Záujemcov preverujeme. Zaujíma nás spoľahlivosť aj dlhodobý záujem o bývanie.',
            },
            {
                icon: <Building className="w-5 h-5 lg:w-6 lg:h-6" />,
                title: 'Administratívu riešime za Vás',
                description: 'Zmluvy, odovzdanie bytu, komunikácia aj riešenie bežných situácií. Nemusíte behať po úradoch.',
            },
            {
                icon: <Receipt className="w-5 h-5 lg:w-6 lg:h-6" />,
                title: 'Prehľad o príjme',
                description: 'Máte jasno v tom, čo a kedy prišlo. Všetko prehľadne a bez chaosu.',
            },
        ]
    }
};

const seekerTabs = {
    buy: {
        label: 'Kúpiť',
        tabIcon: <Banknote className="w-4 h-4" />,
        headline: 'Nájdeme Vám domov presne podľa Vašich predstáv',
        subtitle: 'Bezpečná kúpa a kompletný servis. Od prvej obhliadky až po odovzdanie kľúčov.',
        cta: { text: 'MÁM ZÁUJEM', href: '/ponuka' },
        benefits: [
            {
                icon: <CreditCard className="w-5 h-5 lg:w-6 lg:h-6" />,
                title: 'Pomoc s financovaním',
                description: 'Porovnáme možnosti hypotéky a vysvetlíme vám rozdiely tak, aby ste sa vedeli rozhodnúť pokojne.',
            },
            {
                icon: <ShieldCheck className="w-5 h-5 lg:w-6 lg:h-6" />,
                title: 'Kontrola dokumentov',
                description: 'Prejdeme list vlastníctva aj zmluvy, aby ste kupovali bez nepríjemných prekvapení.',
            },
            {
                icon: <HandshakeIcon className="w-5 h-5 lg:w-6 lg:h-6" />,
                title: 'Zastupujeme Vaše záujmy',
                description: 'Pri vyjednávaní stojíme na Vašej strane. Hľadáme riešenie, ktoré je férové a rozumné.',
            },
        ]
    },
    rent: {
        label: 'Prenajať',
        tabIcon: <DoorOpen className="w-4 h-4" />,
        headline: 'Nájdeme bývanie, kde sa budete cítiť dobre',
        subtitle: 'Overené ponuky a jasné podmienky.',
        cta: { text: 'MÁM ZÁUJEM', href: '/ponuka' },
        benefits: [
            {
                icon: <ShieldCheck className="w-5 h-5 lg:w-6 lg:h-6" />,
                title: 'Preverené nehnuteľnosti',
                description: 'Obhliadneme stav aj detaily, aby ste vedeli, čo presne si prenajímate.',
            },
            {
                icon: <FileSignature className="w-5 h-5 lg:w-6 lg:h-6" />,
                title: 'Zrozumiteľná zmluva',
                description: 'Vysvetlíme podmienky jednoducho a bez právnických kľučiek.',
            },
            {
                icon: <HeadphonesIcon className="w-5 h-5 lg:w-6 lg:h-6" />,
                title: 'Sme tu aj po podpise',
                description: 'Ak sa objaví problém alebo otázka, môžete sa na nás obrátiť.',
            },
        ]
    }
};

/* ═══════════════════ MAIN COMPONENT ═══════════════════ */
const WhyFriscoHeroSplit = () => {
    const { language } = useLanguage();
    const copy = WHY_FRISCO_COPY[language];

    const tabText = {
        sk: {
            owner: {
                sell: {
                    headline: 'Predáme Vašu nehnuteľnosť za cenu, ktorú si zaslúži',
                    subtitle: 'Postaráme sa o celý proces od A po Z. Vy sa nemusíte stresovať.',
                    cta: 'MÁM ZÁUJEM',
                    benefits: [
                        { title: 'Kvalitná prezentácia', description: 'Profesionálne fotky. Ukážeme Vašu nehnuteľnosť tak, aby zaujala na prvý pohľad.' },
                        { title: 'Efektívny marketing', description: 'Inzerujeme tam, kde ľudia reálne hľadajú. Portály, sociálne siete aj naša databáza kontaktov.' },
                        { title: 'Vyjednáme pre Vás maximum', description: 'Poznáme ceny v okolí a vieme, kde je priestor na vyjednávanie. Naším cieľom je čo najlepší výsledok pre Vás.' },
                    ],
                },
                rent: {
                    headline: 'Prenájom bez zbytočných komplikácií',
                    subtitle: 'Nájdeme spoľahlivého nájomníka a vybavíme všetko potrebné.',
                    cta: 'MÁM ZÁUJEM',
                    benefits: [
                        { title: 'Starostlivý výber nájomníkov', description: 'Záujemcov preverujeme. Zaujíma nás spoľahlivosť aj dlhodobý záujem o bývanie.' },
                        { title: 'Administratívu riešime za Vás', description: 'Zmluvy, odovzdanie bytu, komunikácia aj riešenie bežných situácií. Nemusíte behať po úradoch.' },
                        { title: 'Prehľad o príjme', description: 'Máte jasno v tom, čo a kedy prišlo. Všetko prehľadne a bez chaosu.' },
                    ],
                },
            },
            seeker: {
                buy: {
                    headline: 'Nájdeme Vám domov presne podľa Vašich predstáv',
                    subtitle: 'Bezpečná kúpa a kompletný servis. Od prvej obhliadky až po odovzdanie kľúčov.',
                    cta: 'MÁM ZÁUJEM',
                    benefits: [
                        { title: 'Pomoc s financovaním', description: 'Porovnáme možnosti hypotéky a vysvetlíme vám rozdiely tak, aby ste sa vedeli rozhodnúť pokojne.' },
                        { title: 'Kontrola dokumentov', description: 'Prejdeme list vlastníctva aj zmluvy, aby ste kupovali bez nepríjemných prekvapení.' },
                        { title: 'Zastupujeme Vaše záujmy', description: 'Pri vyjednávaní stojíme na Vašej strane. Hľadáme riešenie, ktoré je férové a rozumné.' },
                    ],
                },
                rent: {
                    headline: 'Nájdeme bývanie, kde sa budete cítiť dobre',
                    subtitle: 'Overené ponuky a jasné podmienky.',
                    cta: 'MÁM ZÁUJEM',
                    benefits: [
                        { title: 'Preverené nehnuteľnosti', description: 'Obhliadneme stav aj detaily, aby ste vedeli, čo presne si prenajímate.' },
                        { title: 'Zrozumiteľná zmluva', description: 'Vysvetlíme podmienky jednoducho a bez právnických kľučiek.' },
                        { title: 'Sme tu aj po podpise', description: 'Ak sa objaví problém alebo otázka, môžete sa na nás obrátiť.' },
                    ],
                },
            },
        },
        en: {
            owner: {
                sell: {
                    headline: 'We sell your property for the price it deserves',
                    subtitle: 'We handle the entire process from A to Z, so you do not have to stress.',
                    cta: 'I AM INTERESTED',
                    benefits: [
                        { title: 'Premium presentation', description: 'Professional photos that make your property stand out at first glance.' },
                        { title: 'Effective marketing', description: 'We advertise where buyers are actually searching: portals, social media, and our own database.' },
                        { title: 'Maximum negotiation value', description: 'We know local pricing and where to negotiate. Our goal is the best result for you.' },
                    ],
                },
                rent: {
                    headline: 'Rent out without unnecessary complications',
                    subtitle: 'We find a reliable tenant and handle everything needed.',
                    cta: 'I AM INTERESTED',
                    benefits: [
                        { title: 'Careful tenant selection', description: 'We screen applicants with a focus on reliability and long-term intent.' },
                        { title: 'Administration handled for you', description: 'Contracts, handover, communication, and routine situations—without running around offices.' },
                        { title: 'Clear income overview', description: 'You always know what was paid and when, clearly and without chaos.' },
                    ],
                },
            },
            seeker: {
                buy: {
                    headline: 'We find a home that matches your needs',
                    subtitle: 'Safe purchase with full service, from first viewing to key handover.',
                    cta: 'I AM INTERESTED',
                    benefits: [
                        { title: 'Financing support', description: 'We compare mortgage options and explain differences so you can decide calmly.' },
                        { title: 'Document review', description: 'We check ownership records and contracts so you buy without unpleasant surprises.' },
                        { title: 'We represent your interests', description: 'We stand on your side in negotiations and seek fair, practical outcomes.' },
                    ],
                },
                rent: {
                    headline: 'We find a rental where you feel at home',
                    subtitle: 'Verified offers and clear terms.',
                    cta: 'I AM INTERESTED',
                    benefits: [
                        { title: 'Verified properties', description: 'We check condition and details so you know exactly what you are renting.' },
                        { title: 'Clear contract terms', description: 'We explain terms simply, without legal jargon.' },
                        { title: 'Support after signing', description: 'If any issue appears, you can still rely on us.' },
                    ],
                },
            },
        },
        de: {
            owner: {
                sell: {
                    headline: 'Wir verkaufen Ihre Immobilie zum Preis, den sie verdient',
                    subtitle: 'Wir übernehmen den gesamten Prozess von A bis Z, damit Sie keinen Stress haben.',
                    cta: 'ICH HABE INTERESSE',
                    benefits: [
                        { title: 'Hochwertige Präsentation', description: 'Professionelle Fotos zeigen Ihre Immobilie so, dass sie sofort überzeugt.' },
                        { title: 'Effektives Marketing', description: 'Wir werben dort, wo Interessenten wirklich suchen: Portale, Social Media und unsere Datenbank.' },
                        { title: 'Maximum in der Verhandlung', description: 'Wir kennen die lokalen Preise und Verhandlungsspielräume. Ziel ist das beste Ergebnis für Sie.' },
                    ],
                },
                rent: {
                    headline: 'Vermieten ohne unnötige Komplikationen',
                    subtitle: 'Wir finden einen zuverlässigen Mieter und erledigen alles Notwendige.',
                    cta: 'ICH HABE INTERESSE',
                    benefits: [
                        { title: 'Sorgfältige Mieterauswahl', description: 'Wir prüfen Interessenten auf Zuverlässigkeit und langfristiges Interesse.' },
                        { title: 'Verwaltung übernehmen wir', description: 'Verträge, Übergabe, Kommunikation und laufende Themen – ohne Behördenstress für Sie.' },
                        { title: 'Klare Einnahmenübersicht', description: 'Sie wissen jederzeit, was und wann eingegangen ist – übersichtlich und ohne Chaos.' },
                    ],
                },
            },
            seeker: {
                buy: {
                    headline: 'Wir finden ein Zuhause nach Ihren Vorstellungen',
                    subtitle: 'Sicherer Kauf mit Komplettservice von der ersten Besichtigung bis zur Schlüsselübergabe.',
                    cta: 'ICH HABE INTERESSE',
                    benefits: [
                        { title: 'Hilfe bei der Finanzierung', description: 'Wir vergleichen Hypothekenoptionen und erklären Unterschiede verständlich.' },
                        { title: 'Prüfung der Unterlagen', description: 'Wir prüfen Eigentumsnachweise und Verträge, damit Sie ohne Überraschungen kaufen.' },
                        { title: 'Wir vertreten Ihre Interessen', description: 'In Verhandlungen stehen wir auf Ihrer Seite und suchen faire, sinnvolle Lösungen.' },
                    ],
                },
                rent: {
                    headline: 'Wir finden ein Zuhause zur Miete, in dem Sie sich wohlfühlen',
                    subtitle: 'Geprüfte Angebote und klare Bedingungen.',
                    cta: 'ICH HABE INTERESSE',
                    benefits: [
                        { title: 'Geprüfte Immobilien', description: 'Wir prüfen Zustand und Details, damit Sie genau wissen, was Sie mieten.' },
                        { title: 'Verständlicher Vertrag', description: 'Wir erklären Bedingungen einfach und ohne juristische Hürden.' },
                        { title: 'Auch nach Unterschrift erreichbar', description: 'Wenn Fragen oder Probleme auftreten, sind wir weiterhin für Sie da.' },
                    ],
                },
            },
        },
    }[language];
    const containerRef = useRef(null);
    const isInView = useInView(containerRef, { once: true, margin: "-15% 0px -15% 0px" });
    const controls = useAnimation();
    const [cardsRevealed, setCardsRevealed] = useState(false);

    const localizedOwnerTabs = {
        sell: {
            ...ownerTabs.sell,
            label: copy.ownerSellLabel,
            headline: tabText.owner.sell.headline,
            subtitle: tabText.owner.sell.subtitle,
            cta: { ...ownerTabs.sell.cta, text: tabText.owner.sell.cta },
            benefits: ownerTabs.sell.benefits.map((benefit, index) => ({
                ...benefit,
                title: tabText.owner.sell.benefits[index].title,
                description: tabText.owner.sell.benefits[index].description,
            })),
        },
        rent: {
            ...ownerTabs.rent,
            label: copy.ownerRentLabel,
            headline: tabText.owner.rent.headline,
            subtitle: tabText.owner.rent.subtitle,
            cta: { ...ownerTabs.rent.cta, text: tabText.owner.rent.cta },
            benefits: ownerTabs.rent.benefits.map((benefit, index) => ({
                ...benefit,
                title: tabText.owner.rent.benefits[index].title,
                description: tabText.owner.rent.benefits[index].description,
            })),
        },
    };

    const localizedSeekerTabs = {
        buy: {
            ...seekerTabs.buy,
            label: copy.seekerBuyLabel,
            headline: tabText.seeker.buy.headline,
            subtitle: tabText.seeker.buy.subtitle,
            cta: { ...seekerTabs.buy.cta, text: tabText.seeker.buy.cta },
            benefits: seekerTabs.buy.benefits.map((benefit, index) => ({
                ...benefit,
                title: tabText.seeker.buy.benefits[index].title,
                description: tabText.seeker.buy.benefits[index].description,
            })),
        },
        rent: {
            ...seekerTabs.rent,
            label: copy.seekerRentLabel,
            headline: tabText.seeker.rent.headline,
            subtitle: tabText.seeker.rent.subtitle,
            cta: { ...seekerTabs.rent.cta, text: tabText.seeker.rent.cta },
            benefits: seekerTabs.rent.benefits.map((benefit, index) => ({
                ...benefit,
                title: tabText.seeker.rent.benefits[index].title,
                description: tabText.seeker.rent.benefits[index].description,
            })),
        },
    };

    useEffect(() => {
        if (isInView) {
            const isDesktop = window.innerWidth >= 1024;

            if (!isDesktop) {
                setCardsRevealed(true);
                return;
            }

            const sequence = async () => {
                await controls.start('verticalDraw');
                await controls.start('dotDown');
                await Promise.all([
                    controls.start('horizontalDraw'),
                    controls.start('dotsOut')
                ]);
                setCardsRevealed(true);
            };
            sequence();
        }
    }, [isInView, controls]);

    return (
        <div ref={containerRef} className="relative bg-cream flex flex-col items-center overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(235,77,75,0.03),transparent_60%)] pointer-events-none" />

            {/* HERO HEADING */}
            <section className="relative w-full pt-32 pb-4 px-6 flex flex-col items-center justify-center z-10 text-center">
                <div
                    className="mb-8 story-rise stagger-1"
                >
                    <span className="inline-block px-4 py-1.5 rounded-full border border-navy/10 bg-white/60 text-xs font-mono tracking-[0.2em] text-navy uppercase mb-6 backdrop-blur-sm shadow-sm">
                        {copy.badge}
                    </span>
                    <h1 className="text-4xl md:text-7xl lg:text-8xl font-serif font-bold text-navy tracking-tight leading-snug md:leading-none">
                        {copy.title} <br className="lg:hidden" />
                        <span className="text-accent-red italic pb-2">{copy.accent}</span>
                    </h1>
                </div>
                <p
                    className="text-charcoal/70 text-lg md:text-xl max-w-2xl font-light leading-relaxed story-soft stagger-2"
                >
                    <span className="hidden lg:inline">{copy.subtitleDesktop}</span>
                    <span className="lg:hidden">{copy.subtitleMobile}</span>
                </p>
            </section>

            {/* ═══════════════════ TRACING BEAM ═══════════════════ */}
            <div className="relative w-full max-w-[1400px] h-[160px] shrink-0 hidden lg:block">
                <svg className="w-full h-full visible overflow-visible" viewBox="0 0 1400 160" preserveAspectRatio="none">
                    <defs>
                        <filter id="red-glow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                            <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                        </filter>
                    </defs>

                    {/* Vertical */}
                    <line x1="700" y1="0" x2="700" y2="80" stroke="rgba(235,77,75,0.08)" strokeWidth="1" />
                    <motion.line x1="700" y1="0" x2="700" y2="80" stroke="#EB4D4B" strokeWidth="6" strokeLinecap="round" filter="url(#red-glow)" opacity={0.5}
                        initial={{ pathLength: 0 }} variants={{ verticalDraw: { pathLength: 1, transition: { duration: 0.8, ease: "easeInOut" } } }} animate={controls} />
                    <motion.line x1="700" y1="0" x2="700" y2="80" stroke="#EB4D4B" strokeWidth="3" strokeLinecap="round"
                        initial={{ pathLength: 0 }} variants={{ verticalDraw: { pathLength: 1, transition: { duration: 0.8, ease: "easeInOut" } } }} animate={controls} />

                    {/* Vertical Dot */}
                    <motion.circle cx="700" cy="0" r="3" fill="#EB4D4B" filter="url(#red-glow)"
                        initial={{ cy: 0, opacity: 0 }}
                        variants={{ verticalDraw: { opacity: 1 }, dotDown: { cy: 80, transition: { duration: 0.6, ease: "linear" } } }}
                        animate={controls} />

                    {/* Horizontal Paths */}
                    <path d="M700 80 L350 80 L350 160" fill="none" stroke="rgba(235,77,75,0.08)" strokeWidth="1" />
                    <path d="M700 80 L1050 80 L1050 160" fill="none" stroke="rgba(235,77,75,0.08)" strokeWidth="1" />
                    <motion.path d="M700 80 L350 80 L350 160" fill="none" stroke="#EB4D4B" strokeWidth="2" filter="url(#red-glow)"
                        initial={{ pathLength: 0 }} variants={{ horizontalDraw: { pathLength: 1, transition: { duration: 0.8, ease: "easeInOut" } } }} animate={controls} />
                    <motion.path d="M700 80 L1050 80 L1050 160" fill="none" stroke="#EB4D4B" strokeWidth="2" filter="url(#red-glow)"
                        initial={{ pathLength: 0 }} variants={{ horizontalDraw: { pathLength: 1, transition: { duration: 0.8, ease: "easeInOut" } } }} animate={controls} />

                    {/* Traveling Dots */}
                    <motion.circle r="3" fill="#EB4D4B" filter="url(#red-glow)" initial={{ cx: 700, cy: 80, opacity: 0 }}
                        variants={{ dotsOut: { cx: 350, transition: { duration: 0.8, ease: "easeInOut" }, opacity: 1 } }} animate={controls} />
                    <motion.circle r="3" fill="#EB4D4B" filter="url(#red-glow)" initial={{ cx: 350, cy: 80, opacity: 0 }}
                        variants={{ dotsOut: { cy: 160, transition: { duration: 0.4, delay: 0.8, ease: "easeOut" }, scale: [1, 1.2, 0], opacity: [0, 1, 0] } }} animate={controls} />
                    <motion.circle r="3" fill="#EB4D4B" filter="url(#red-glow)" initial={{ cx: 700, cy: 80, opacity: 0 }}
                        variants={{ dotsOut: { cx: 1050, transition: { duration: 0.8, ease: "easeInOut" }, opacity: 1 } }} animate={controls} />
                    <motion.circle r="3" fill="#EB4D4B" filter="url(#red-glow)" initial={{ cx: 1050, cy: 80, opacity: 0 }}
                        variants={{ dotsOut: { cy: 160, transition: { duration: 0.4, delay: 0.8, ease: "easeOut" }, scale: [1, 1.2, 0], opacity: [0, 1, 0] } }} animate={controls} />
                </svg>
            </div>

            {/* ═══════════════════ CONTENT: TAB TOGGLE CARDS ═══════════════════ */}
            <div className="container mx-auto px-6 pb-16 relative z-10 w-full mt-4 lg:mt-0">
                {/* Mobile bridge text */}
                <p className="text-center text-sm text-charcoal/40 font-medium tracking-wide uppercase mb-6 lg:hidden story-soft stagger-3">{copy.bridge}</p>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 relative">

                    {/* LEFT CARD — OWNERS */}
                    <div
                        className={`story-rise stagger-4 lg:transition-all lg:duration-700 lg:ease-[cubic-bezier(0.22,1,0.36,1)] ${cardsRevealed
                            ? 'lg:opacity-100 lg:translate-y-0 lg:pointer-events-auto'
                            : 'lg:opacity-0 lg:translate-y-8 lg:pointer-events-none'
                            }`}
                    >
                        <div className="relative rounded-2xl border border-charcoal/[0.08] bg-white shadow-lg shadow-charcoal/[0.04] overflow-hidden">
                            <TabCardContent
                                tabs={localizedOwnerTabs}
                                defaultTab="sell"
                                headerIcon={<Home className="w-5 h-5" />}
                                headerLabel={copy.ownerHeader}
                            />
                        </div>
                    </div>

                    {/* RIGHT CARD — SEEKERS */}
                    <div
                        className={`story-rise stagger-5 lg:transition-all lg:duration-700 lg:ease-[cubic-bezier(0.22,1,0.36,1)] ${cardsRevealed
                            ? 'lg:opacity-100 lg:translate-y-0 lg:pointer-events-auto'
                            : 'lg:opacity-0 lg:translate-y-8 lg:pointer-events-none'
                            }`}
                    >
                        <div className="relative rounded-2xl border border-charcoal/[0.08] bg-white shadow-lg shadow-charcoal/[0.04] overflow-hidden">
                            <TabCardContent
                                tabs={localizedSeekerTabs}
                                defaultTab="buy"
                                headerIcon={<Search className="w-5 h-5" />}
                                headerLabel={copy.seekerHeader}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ═══════════════════ TAB CARD CONTENT ═══════════════════ */
type TabData = {
    label: string;
    tabIcon: React.ReactNode;
    headline: string;
    subtitle: string;
    cta: { text: string; href: string };
    benefits: { icon: React.ReactNode; title: string; description: string }[];
};

type TabCardProps = {
    tabs: Record<string, TabData>;
    defaultTab: string;
    headerIcon: React.ReactNode;
    headerLabel: string;
};

const TabCardContent = ({ tabs, defaultTab, headerIcon, headerLabel }: TabCardProps) => {
    const [activeTab, setActiveTab] = useState(defaultTab);
    const tabKeys = Object.keys(tabs);
    const current = tabs[activeTab];

    /* ── Mobile: no scroll-lock, benefits visible immediately ── */

    return (
        <div>
            {/* HEADER ROW: Label (Left) + Tabs (Right) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 lg:px-8 pt-6 lg:pt-8 pb-3 lg:pb-4 border-b border-charcoal/[0.04]">
                {/* Left: Icon + Label */}
                <div className="flex items-center gap-3 lg:gap-4">
                    <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-xl bg-accent-red flex items-center justify-center text-white shadow-sm shrink-0">
                        {headerIcon}
                    </div>
                    <span className="text-sm lg:text-base font-bold text-navy tracking-[0.08em] uppercase whitespace-nowrap">
                        {headerLabel}
                    </span>
                </div>

                {/* Right: Tab Switcher */}
                <div className="flex items-center gap-1 p-0.5 rounded-full bg-charcoal/[0.04] self-start sm:self-auto">
                    {tabKeys.map((key) => (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key)}
                            className={`
                                relative py-2.5 px-5 rounded-full text-sm font-medium tracking-wide
                                transition-all duration-300 ease-out
                                flex items-center justify-center gap-2
                                whitespace-nowrap
                                ${activeTab === key
                                    ? 'border border-accent-red text-accent-red bg-white shadow-sm'
                                    : 'text-charcoal/40 hover:text-charcoal/70'
                                }
                            `}
                        >
                            <span className="scale-110">{tabs[key].tabIcon}</span>
                            {tabs[key].label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── MOBILE: scroll-locked benefit reveal ── */}
            <div className="lg:hidden px-6 py-6">
                <div className="space-y-5">
                    {current.benefits.map((b, i) => (
                        <div key={`${activeTab}-${i}`} className="mobile-benefit flex gap-4 group/row">
                            <div className="w-11 h-11 rounded-xl bg-charcoal/[0.04] flex items-center justify-center shrink-0 text-charcoal/30 transition-colors duration-200 group-hover/row:bg-accent-red/10 group-hover/row:text-accent-red mt-0.5">
                                {b.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-base font-semibold text-navy mb-1 leading-snug">{b.title}</h4>
                                <p className="text-sm text-charcoal/50 leading-relaxed">{b.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mobile-cta mt-7 pt-4 border-t border-charcoal/[0.06]">
                    <a href={current.cta.href} className="group/btn inline-flex items-center gap-2 text-sm font-bold text-navy tracking-wide uppercase hover:text-accent-red transition-colors">
                        {current.cta.text}
                        <ArrowUpRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                    </a>
                </div>
            </div>

            {/* ── DESKTOP: tab-enter animation (unchanged) ── */}
            <div className="hidden lg:block">
                <div key={activeTab} className="px-8 py-7 tab-enter">
                    <div className="space-y-6">
                        {current.benefits.map((b, i) => (
                            <div
                                key={i}
                                className="flex gap-5 group/row tab-item-enter"
                                style={{ animationDelay: `${i * 100}ms` }}
                            >
                                <div className="w-12 h-12 rounded-xl bg-charcoal/[0.04] flex items-center justify-center shrink-0 text-charcoal/30 transition-colors duration-200 group-hover/row:bg-accent-red/10 group-hover/row:text-accent-red mt-0.5">
                                    {b.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-lg font-semibold text-navy mb-1 leading-snug">{b.title}</h4>
                                    <p className="text-[15px] text-charcoal/50 leading-relaxed">{b.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-8 pt-4 border-t border-charcoal/[0.06]">
                        <a href={current.cta.href} className="group/btn inline-flex items-center gap-2 text-base font-bold text-navy tracking-wide uppercase hover:text-accent-red transition-colors">
                            {current.cta.text}
                            <ArrowUpRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WhyFriscoHeroSplit;
