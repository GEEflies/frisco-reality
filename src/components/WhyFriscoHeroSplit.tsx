'use client';

import { motion, useAnimation, useInView, AnimatePresence } from 'framer-motion';
import { Home, Search, Camera, Megaphone, HandshakeIcon, Users, Building, Receipt, CreditCard, ShieldCheck, FileSignature, HeadphonesIcon, ArrowUpRight, Tag, KeyRound, Banknote, DoorOpen } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

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
    const containerRef = useRef(null);
    const isInView = useInView(containerRef, { once: true, margin: "-15% 0px -15% 0px" });
    const controls = useAnimation();
    const [cardsRevealed, setCardsRevealed] = useState(false);

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
                    className="mb-8 animate-fade-in-up stagger-1"
                >
                    <span className="inline-block px-4 py-1.5 rounded-full border border-navy/10 bg-white/60 text-xs font-mono tracking-[0.2em] text-navy uppercase mb-6 backdrop-blur-sm shadow-sm">
                        Prečo Frisco?
                    </span>
                    <h1 className="text-4xl md:text-7xl lg:text-8xl font-serif font-bold text-navy tracking-tight leading-none">
                        Komplexné <br className="lg:hidden" />
                        <span className="text-accent-red italic pb-2">riešenia</span>
                    </h1>
                </div>
                <p
                    className="text-charcoal/70 text-lg md:text-xl max-w-2xl font-light leading-relaxed animate-fade-in-up stagger-2"
                >
                    <span className="hidden lg:inline">Či predávate, kupujete alebo prenajímate — vieme, čo potrebujete. Vyberte si svoju situáciu.</span>
                    <span className="lg:hidden">Či predávate, kupujete alebo prenajímate, toto sú dôvody, prečo si vybrať FRISCO:</span>
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
                <p className="text-center text-sm text-charcoal/40 font-medium tracking-wide uppercase mb-6 lg:hidden">Vyberte si, čo riešite ↓</p>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 relative">

                    {/* LEFT CARD — OWNERS */}
                    <div
                        className={`animate-fade-in-up stagger-1 lg:transition-all lg:duration-700 lg:ease-[cubic-bezier(0.22,1,0.36,1)] ${cardsRevealed
                            ? 'lg:opacity-100 lg:translate-y-0 lg:pointer-events-auto'
                            : 'lg:opacity-0 lg:translate-y-8 lg:pointer-events-none'
                            }`}
                    >
                        <div className="relative rounded-2xl border border-charcoal/[0.08] bg-white shadow-lg shadow-charcoal/[0.04] overflow-hidden">
                            <TabCardContent
                                tabs={ownerTabs}
                                defaultTab="sell"
                                headerIcon={<Home className="w-5 h-5" />}
                                headerLabel="Chcem svoju nehnuteľnosť"
                            />
                        </div>
                    </div>

                    {/* RIGHT CARD — SEEKERS */}
                    <div
                        className={`animate-fade-in-up stagger-2 lg:transition-all lg:duration-700 lg:ease-[cubic-bezier(0.22,1,0.36,1)] ${cardsRevealed
                            ? 'lg:opacity-100 lg:translate-y-0 lg:pointer-events-auto'
                            : 'lg:opacity-0 lg:translate-y-8 lg:pointer-events-none'
                            }`}
                    >
                        <div className="relative rounded-2xl border border-charcoal/[0.08] bg-white shadow-lg shadow-charcoal/[0.04] overflow-hidden">
                            <TabCardContent
                                tabs={seekerTabs}
                                defaultTab="buy"
                                headerIcon={<Search className="w-5 h-5" />}
                                headerLabel="Chcem si nehnuteľnosť"
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

    return (
        <>
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

                {/* Right: Tab Switcher (Smaller) */}
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

            {/* ANIMATED CONTENT */}
            <div className="relative">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="px-6 lg:px-8 py-6 lg:py-7"
                    >
                        {/* Benefits */}
                        <div className="space-y-5 lg:space-y-6">
                            {current.benefits.map((b, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                    className="flex gap-4 lg:gap-5 group/row"
                                >
                                    <div className="w-11 h-11 lg:w-12 lg:h-12 rounded-xl bg-charcoal/[0.04] flex items-center justify-center shrink-0 text-charcoal/30 transition-colors duration-200 group-hover/row:bg-accent-red/10 group-hover/row:text-accent-red mt-0.5">
                                        {b.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-base lg:text-lg font-semibold text-navy mb-1 leading-snug">
                                            {b.title}
                                        </h4>
                                        <p className="text-sm lg:text-[15px] text-charcoal/50 leading-relaxed">
                                            {b.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* CTA — MÁM ZÁUJEM ↗ style */}
                        <div className="mt-7 lg:mt-8 pt-4 border-t border-charcoal/[0.06]">
                            <a href={current.cta.href} className="group/btn inline-flex items-center gap-2 text-sm lg:text-base font-bold text-navy tracking-wide uppercase hover:text-accent-red transition-colors">
                                {current.cta.text}
                                <ArrowUpRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                            </a>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </>
    );
};

export default WhyFriscoHeroSplit;
