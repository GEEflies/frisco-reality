'use client';

import { motion } from 'framer-motion';
// Note: Added Import for ChartPie or similar if needed for 'Price/Strategy' icon, but can reuse existing or import specifically.
import { ArrowUpRight, Home, Camera, Megaphone, ShieldCheck, MessageCircle, TrendingUp } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { ContactSection } from '@/components/ContactSection';

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

const benefits = [
    {
        icon: TrendingUp,
        title: 'Nastavenie ceny a stratégie',
        text: 'Pozrieme sa na trh, konkurenciu aj reálny dopyt. Cenu neurčujeme „podľa pocitu“, ale podľa dát a skúseností.',
        bg: 'bg-navy/5', // Special highlight
        offset: false,
    },
    {
        icon: Home,
        title: 'Príprava nehnuteľnosti',
        text: 'Poradíme, čo upraviť pred predajom. Často stačia malé zmeny, ktoré pomôžu dosiahnuť lepšiu cenu.',
        bg: 'bg-cream',
        offset: true,
    },
    {
        icon: Camera,
        title: 'Fotografie a prezentácia',
        text: 'Profesionálne fotografie a kvalitný popis sú základ. Prvý dojem rozhoduje o tom, či príde obhliadka.',
        bg: 'bg-white',
        offset: false,
    },
    {
        icon: Megaphone,
        title: 'Marketing',
        text: 'Realitné portály, sociálne siete, vlastná databáza záujemcov. Vašu nehnuteľnosť ukážeme tam, kde má byť.',
        bg: 'bg-cream',
        offset: true,
    },
    {
        icon: ShieldCheck,
        title: 'Právny servis',
        text: 'Zmluvy, úschova peňazí, kataster. Všetko zabezpečíme a dohliadneme na bezpečný priebeh.',
        bg: 'bg-white',
        offset: false,
    },
];

const ChcemPredat = () => {
    return (
        <div className="min-h-screen bg-white">
            <div>

                {/* Hero Section */}
                <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-navy/5 -skew-x-12 transform origin-top-right z-0" />
                    <div className="container mx-auto px-6 relative z-10">
                        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                            <div className="w-full lg:w-[45%]">
                                <div className="flex items-center gap-4 mb-8 story-soft stagger-1">
                                    <div className="h-px w-12 bg-navy/20" />
                                    <span className="text-navy/60 font-mono text-xs tracking-[0.3em] uppercase">
                                        Predajte za cenu, ktorá dáva zmysel.
                                    </span>
                                </div>
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold tracking-tight leading-[1.1] mb-8 text-navy story-rise stagger-2">
                                    Vy riešite svoj život, <br />
                                    my riešime <span className="text-accent-red italic">predaj</span>.
                                </h1>
                                <p className="text-lg text-charcoal/70 max-w-lg font-light leading-relaxed mb-10 story-soft stagger-3">
                                    Predaj nie je len o inzeráte. Je to o správnej cene, prezentácii a vyjednávaní. My nastavíme proces tak, aby ste predali dobre a bez zbytočných chýb.
                                </p>

                                {/* Mobile Video */}
                                <div className="block lg:hidden mb-8 relative px-2 story-media stagger-4">
                                    <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden shadow-2xl shadow-navy/10 bg-gray-100">
                                        <div className="absolute inset-0 bg-navy/5 z-10 pointer-events-none" />
                                        <img
                                            src="/frisco-logo.svg"
                                            alt="FRISCO"
                                            className="absolute bottom-2 right-4 z-30 w-16 opacity-80 pointer-events-none drop-shadow-lg"
                                        />
                                        <video autoPlay loop muted playsInline preload="auto" className="w-full h-full object-cover">
                                            <source src="https://fcvswlurtchqorgnwclw.supabase.co/storage/v1/object/public/videos/predaj_optimized.mp4" type="video/mp4" />
                                        </video>
                                    </div>
                                </div>

                                <div className="story-soft stagger-5">
                                    <a
                                        href="#kontaktny-formular"
                                        className="inline-flex items-center gap-3 px-8 py-4 bg-navy text-white rounded-full font-bold tracking-wide hover:bg-navy/90 transition-all shadow-lg shadow-navy/20 group"
                                    >
                                        <Home className="w-5 h-5" />
                                        <span>Chcem predať nehnuteľnosť</span>
                                        <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                                    </a>
                                </div>
                            </div>

                            <div className="hidden lg:block w-full lg:w-[55%] relative story-media stagger-5">
                                <div className="relative aspect-[16/10] w-full rounded-[2rem] overflow-hidden shadow-2xl shadow-navy/10 transform transition-transform hover:scale-[1.01] duration-700 bg-gray-100">
                                    <div className="absolute inset-0 bg-navy/5 z-10 pointer-events-none" />
                                    <img
                                        src="/frisco-logo.svg"
                                        alt="FRISCO"
                                        className="absolute bottom-2 right-4 z-30 w-24 opacity-80 pointer-events-none drop-shadow-lg"
                                    />
                                    <video autoPlay loop muted playsInline preload="auto" className="w-full h-full object-cover">
                                        <source src="https://fcvswlurtchqorgnwclw.supabase.co/storage/v1/object/public/videos/predaj_optimized.mp4" type="video/mp4" />
                                    </video>
                                </div>
                                <div className="absolute -z-10 -bottom-8 -left-8 w-2/3 h-2/3 bg-accent-red/5 rounded-full blur-3xl" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* ─── SECTION 1: Čo pre vás urobíme — staggered cards ───────────────── */}
                <section className="py-20 md:py-32 bg-cream overflow-hidden">
                    <div className="container mx-auto px-6">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={fadeInUp}
                            className="mb-16"
                        >
                            <span className="text-accent-red font-mono text-xs tracking-[0.3em] uppercase mb-4 block">
                                Čo pre vás zabezpečíme
                            </span>
                            <h2 className="text-4xl md:text-5xl font-serif font-bold text-navy leading-tight max-w-xl">
                                Predaj, ktorý{' '}
                                <span className="text-accent-red italic">má systém</span>
                            </h2>
                            <p className="text-charcoal/60 mt-6 max-w-lg text-lg font-light leading-relaxed">
                                Nerobíme veci náhodne. Každý krok má svoj dôvod – od stanovenia ceny až po podpis zmluvy.
                            </p>
                        </motion.div>

                        {/* Staggered 2-column grid */}
                        <motion.div
                            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={staggerContainer}
                        >
                            {benefits.map((b, i) => (
                                <motion.div
                                    key={i}
                                    variants={fadeInUp}
                                    className={`group rounded-[2rem] border border-navy/8 p-6 md:p-10 flex flex-col gap-6 hover:shadow-xl hover:shadow-navy/8 transition-all duration-500 hover:-translate-y-1 ${b.bg} ${b.offset ? 'sm:mt-10' : ''}`}
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-navy/5 group-hover:bg-accent-red flex items-center justify-center transition-colors duration-400 flex-shrink-0">
                                        <b.icon className="w-7 h-7 text-navy group-hover:text-white transition-colors duration-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-serif font-bold text-navy mb-3">{b.title}</h3>
                                        <p className="text-charcoal/60 text-base leading-relaxed">{b.text}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* ─── SECTION 2: Vaša nehnuteľnosť si zaslúži viac — editorial ─────── */}
                <section className="py-20 md:py-32 bg-white overflow-hidden">
                    <div className="container mx-auto px-6">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch min-h-[480px]">
                            {/* Image — spans 7 columns */}
                            <motion.div
                                initial={{ opacity: 0, x: -50, scale: 0.95 }}
                                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] as const }}
                                className="lg:col-span-7 relative rounded-[2rem] overflow-hidden min-h-[360px] lg:min-h-0"
                            >
                                <img
                                    src="/frisco-reality-sered.jpg"
                                    alt="Predaj nehnuteľnosti"
                                    className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-navy/20 to-transparent" />
                            </motion.div>

                            {/* Text card — overlaps image on desktop */}
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] as const }}
                                className="lg:col-span-5 lg:-ml-16 relative z-10 flex items-center"
                            >
                                <div className="bg-white rounded-[2rem] shadow-2xl shadow-navy/10 border border-navy/8 p-10 md:p-12 w-full">
                                    <span className="text-navy/40 font-mono text-xs tracking-[0.3em] uppercase mb-6 block">
                                        Náš prístup
                                    </span>
                                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-navy leading-tight mb-6">
                                        Každú nehnuteľnosť berieme <span className="text-accent-red italic">osobne</span>.
                                    </h2>
                                    <p className="text-charcoal/65 text-base leading-relaxed mb-6 font-light">
                                        Nie je to „ďalší inzerát“. Je to konkrétny byt alebo dom s konkrétnym cieľom – predať ho čo najlepšie.
                                    </p>
                                    <p className="text-charcoal/50 text-sm leading-relaxed font-light">
                                        Sme pri obhliadkach, rokujeme o cene a zastupujeme vaše záujmy. Od prvého stretnutia až po odovzdanie kľúčov.
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* ─── SECTION 3: Ako to prebieha — Dark Process Steps ───────────────── */}
                <section className="py-20 md:py-32 bg-navy text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent-red/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    <div className="container mx-auto px-6 relative z-10">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 md:mb-24">
                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeInUp}
                                className="max-w-3xl"
                            >
                                <span className="text-accent-red font-mono text-xs tracking-[0.3em] uppercase mb-6 block">
                                    Ako prebieha spolupráca
                                </span>
                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold leading-tight">
                                    Predaj bez chaosu a bez <span className="text-accent-red italic">zbytočných kompromisov</span>.
                                </h2>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="flex-shrink-0"
                            >
                                <a
                                    href="#kontaktny-formular"
                                    className="inline-flex items-center gap-3 px-8 py-4 bg-accent-red text-white rounded-full font-bold tracking-wide hover:bg-accent-red/90 transition-all shadow-lg shadow-accent-red/20 group whitespace-nowrap"
                                >
                                    <span>Chcem predať nehnuteľnosť</span>
                                    <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                                </a>
                            </motion.div>
                        </div>

                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={staggerContainer}
                        >
                            {/* Step 1 */}
                            <motion.div
                                variants={fadeInUp}
                                className="group p-8 rounded-[2rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-300"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-accent-red/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                                    <MessageCircle className="w-7 h-7 text-accent-red" />
                                </div>
                                <h3 className="text-xl font-serif font-bold mb-4 text-white">1. Stretnutie a plán</h3>
                                <p className="text-white/60 leading-relaxed font-light">
                                    Prejdeme si vaše očakávania, analyzujeme trh a nastavíme cenu aj postup.
                                </p>
                            </motion.div>

                            {/* Step 2 */}
                            <motion.div
                                variants={fadeInUp}
                                className="group p-6 md:p-8 rounded-[2rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-300"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-accent-red/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                                    <Megaphone className="w-7 h-7 text-accent-red" />
                                </div>
                                <h3 className="text-xl font-serif font-bold mb-4 text-white">2. Spustenie predaja</h3>
                                <p className="text-white/60 leading-relaxed font-light">
                                    Pripravíme prezentáciu a spustíme inzerciu. Organizujeme obhliadky a komunikujeme so záujemcami.
                                </p>
                            </motion.div>

                            {/* Step 3 */}
                            <motion.div
                                variants={fadeInUp}
                                className="group p-8 rounded-[2rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-300"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-accent-red/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                                    <ShieldCheck className="w-7 h-7 text-accent-red" />
                                </div>
                                <h3 className="text-xl font-serif font-bold mb-4 text-white">3. Dohoda a odovzdanie</h3>
                                <p className="text-white/60 leading-relaxed font-light">
                                    Keď nájdeme kupujúceho, pripravíme zmluvy a dohliadneme na bezpečný prevod peňazí. Po zápise na katastri odovzdáme kľúče.
                                </p>
                            </motion.div>
                        </motion.div>
                    </div>
                </section>

                {/* Contact */}
                <div id="kontaktny-formular">
                    <ContactSection />
                </div>

                <Footer />
            </div >
        </div >
    );
};

export default ChcemPredat;
