'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, Home, Camera, Megaphone, ShieldCheck } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { ContactSection } from '@/components/ContactSection';

const benefits = [
    {
        icon: Home,
        title: 'Príprava nehnuteľnosti',
        text: 'Poradíme vám, ako nehnuteľnosť upraviť pred predajom, aby pôsobila čo najlepšie. Malé zmeny, veľký rozdiel v cene.',
        bg: 'bg-cream',
        offset: false,
    },
    {
        icon: Camera,
        title: 'Fotografie, ktoré predávajú',
        text: 'Profesionálne fotografie sú prvý dojem. Robíme ich tak, aby záujemca chcel prísť na obhliadku ešte ten deň.',
        bg: 'bg-white',
        offset: true,
    },
    {
        icon: Megaphone,
        title: 'Marketing na správnych miestach',
        text: 'Vašu nehnuteľnosť uvidí ten správny kupujúci. Portály, sociálne siete, naša databáza aktívnych záujemcov. Nič nenecháme na náhodu.',
        bg: 'bg-cream',
        offset: false,
    },
    {
        icon: ShieldCheck,
        title: 'Právna bezpečnosť v cene',
        text: 'Zmluvu, úschovu peňazí aj kataster vybavíme za vás. Podpíšete a máte hotovo.',
        bg: 'bg-white',
        offset: true,
    },
];

const ChcemPredat = () => {
    return (
        <div className="min-h-screen bg-white">
            <div className="animate-in fade-in duration-500">

                {/* Hero Section */}
                <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-navy/5 -skew-x-12 transform origin-top-right z-0" />
                    <div className="container mx-auto px-6 relative z-10">
                        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                            <div className="w-full lg:w-[45%]">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6 }}
                                    className="flex items-center gap-4 mb-8"
                                >
                                    <div className="h-px w-12 bg-navy/20" />
                                    <span className="text-navy/60 font-mono text-xs tracking-[0.3em] uppercase">
                                        Predaj nehnuteľnosti
                                    </span>
                                </motion.div>
                                <motion.h1
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.1 }}
                                    className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold tracking-tight leading-[1.1] mb-8 text-navy"
                                >
                                    Predajte svoju <br />
                                    nehnuteľnosť <br />
                                    <span className="text-accent-red italic">za najlepšiu cenu</span>.
                                </motion.h1>
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                    className="text-lg text-charcoal/70 max-w-lg font-light leading-relaxed mb-10"
                                >
                                    Skúsenosti, osobný prístup a overená sieť záujemcov. Vy sa sústreďte na dôležité veci, my sa postaráme o predaj.
                                </motion.p>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.3 }}
                                >
                                    <a
                                        href="#kontaktny-formular"
                                        className="inline-flex items-center gap-3 px-8 py-4 bg-navy text-white rounded-full font-bold tracking-wide hover:bg-navy/90 transition-all shadow-lg shadow-navy/20 group"
                                    >
                                        <Home className="w-5 h-5" />
                                        <span>Chcem predať nehnuteľnosť</span>
                                        <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                                    </a>
                                </motion.div>
                            </div>

                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="w-full lg:w-[55%] relative"
                            >
                                <div className="relative aspect-[16/10] w-full rounded-[2rem] overflow-hidden shadow-2xl shadow-navy/10">
                                    <div className="absolute inset-0 bg-navy/5 z-10 pointer-events-none" />
                                    <img
                                        src="/frisco-logo.svg"
                                        alt="FRISCO"
                                        className="absolute bottom-2 right-4 z-30 w-24 opacity-80 pointer-events-none drop-shadow-lg"
                                    />
                                    <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                                        <source src="https://fcvswlurtchqorgnwclw.supabase.co/storage/v1/object/public/videos/predaj_optimized.mp4" type="video/mp4" />
                                    </video>
                                </div>
                                <div className="absolute -z-10 -bottom-8 -left-8 w-2/3 h-2/3 bg-accent-red/5 rounded-full blur-3xl" />
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* ─── SECTION 1: Čo pre vás urobíme — staggered cards ───────────────── */}
                <section className="py-20 md:py-32 bg-cream overflow-hidden">
                    <div className="container mx-auto px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="mb-16"
                        >
                            <span className="text-accent-red font-mono text-xs tracking-[0.3em] uppercase mb-4 block">
                                Čo pre vás urobíme
                            </span>
                            <h2 className="text-4xl md:text-5xl font-serif font-bold text-navy leading-tight max-w-xl">
                                Predaj, ktorý{' '}
                                <span className="text-accent-red italic">má hlavu a pätu</span>
                            </h2>
                        </motion.div>

                        {/* Staggered 2-column grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {benefits.map((b, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.55, delay: i * 0.1 }}
                                    className={`group rounded-[2rem] border border-navy/8 p-10 flex flex-col gap-6 hover:shadow-xl hover:shadow-navy/8 transition-all duration-500 hover:-translate-y-1 ${b.bg} ${b.offset ? 'sm:mt-10' : ''}`}
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
                        </div>
                    </div>
                </section>

                {/* ─── SECTION 2: Vaša nehnuteľnosť si zaslúži viac — editorial ─────── */}
                <section className="py-20 md:py-32 bg-white overflow-hidden">
                    <div className="container mx-auto px-6">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch min-h-[480px]">
                            {/* Image — spans 7 columns */}
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className="lg:col-span-7 relative rounded-[2rem] overflow-hidden min-h-[360px] lg:min-h-0"
                            >
                                <img
                                    src="/frisco-reality-sered.jpg"
                                    alt="Predaj nehnuteľnosti"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-navy/20 to-transparent" />
                            </motion.div>

                            {/* Text card — overlaps image on desktop */}
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.15 }}
                                className="lg:col-span-5 lg:-ml-16 relative z-10 flex items-center"
                            >
                                <div className="bg-white rounded-[2rem] shadow-2xl shadow-navy/10 border border-navy/8 p-10 md:p-12 w-full">
                                    <span className="text-navy/40 font-mono text-xs tracking-[0.3em] uppercase mb-6 block">
                                        Náš prístup
                                    </span>
                                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-navy leading-tight mb-6">
                                        Vaša nehnuteľnosť si{' '}
                                        <span className="text-accent-red italic">zaslúži viac</span>{' '}
                                        než len inzerát.
                                    </h2>
                                    <p className="text-charcoal/65 text-base leading-relaxed mb-6 font-light">
                                        Ku každej nehnuteľnosti pristupujeme osobne. Nie je to len inzerát s fotkami. Tvoríme celý dojem, aby kupujúci pocítil, že toto je presne to, čo hľadal.
                                    </p>
                                    <p className="text-charcoal/50 text-sm leading-relaxed font-light">
                                        Sme s vami od prvej obhliadky až po odovzdanie kľúčov.
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* ─── SECTION 3: Kompletný servis — warm CTA banner ───────────────── */}
                <section className="py-16 md:py-24 bg-cream overflow-hidden">
                    <div className="container mx-auto px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7 }}
                            className="relative rounded-[2rem] overflow-hidden border border-navy/8 bg-white shadow-lg shadow-navy/5"
                        >
                            {/* Left accent bar */}
                            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-accent-red rounded-l-[2rem]" />

                            <div className="flex flex-col md:flex-row items-center justify-between gap-8 px-10 md:px-14 py-12 md:py-14">
                                <div className="max-w-xl">
                                    <span className="text-accent-red font-mono text-xs tracking-[0.3em] uppercase mb-4 block">
                                        Kompletný servis
                                    </span>
                                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-navy leading-tight mb-4">
                                        Nechajte predaj{' '}
                                        <span className="text-accent-red italic">na nás.</span>
                                    </h2>
                                    <p className="text-charcoal/60 text-base leading-relaxed font-light">
                                        Zavolajte nám alebo napíšte. Dohodneme si stretnutie a povíme vám presne, ako na to.
                                    </p>
                                </div>
                                <div className="flex-shrink-0">
                                    <a
                                        href="#kontaktny-formular"
                                        className="inline-flex items-center gap-3 px-9 py-4 bg-navy text-white rounded-full font-bold tracking-wide hover:bg-navy/90 transition-all shadow-lg shadow-navy/20 group whitespace-nowrap"
                                    >
                                        <span>Chcem nezáväznú konzultáciu</span>
                                        <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Contact */}
                <div id="kontaktny-formular">
                    <ContactSection />
                </div>

                <Footer />
            </div>
        </div>
    );
};

export default ChcemPredat;

