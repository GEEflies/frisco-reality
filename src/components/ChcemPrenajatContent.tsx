'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, Key, CalendarCheck, ShieldAlert, Eye, Phone } from 'lucide-react';
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

const managedItems = [
    'Nájdeme a preverujeme nájomníka',
    'Pripravíme jasnú a bezpečnú zmluvu',
    'Strážime platby a termíny',
    'Komunikujeme s nájomníkmi',
    'Zabezpečíme opravy a údržbu',
    'Posielame vám pravidelný prehľad',
];

const pillars = [
    {
        icon: Eye,
        title: 'Transparentne',
        text: 'Vždy viete, čo sa s vašou nehnuteľnosťou deje. Žiadne skryté poplatky, žiadne prekvapenia.',
    },
    {
        icon: CalendarCheck,
        title: 'Férové podmienky',
        text: 'Zmluvy píšeme zrozumiteľne. Podmienky sú jasné pre vás aj pre nájomníka.',
    },
    {
        icon: Key,
        title: 'Dlhodobá spolupráca',
        text: 'Nejde nám o jednorazový obchod. Chceme, aby prenájom fungoval roky.',
    },
];

const ChcemPrenajat = () => {
    return (
        <div className="min-h-screen bg-white">
            <div>

                {/* Hero Section */}
                <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-navy/5 -skew-x-12 transform origin-top-right z-0" />
                    <div className="container mx-auto px-6 relative z-10">
                        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                            <div
                                className="w-full lg:w-[45%]"
                            >
                                <div
                                    className="flex items-center gap-4 mb-8 story-soft stagger-1"
                                >
                                    <div className="h-px w-12 bg-navy/20" />
                                    <span className="text-navy/60 font-mono text-xs tracking-[0.3em] uppercase">
                                        Prenájom nehnuteľnosti
                                    </span>
                                </div>
                                <h1
                                    className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold tracking-tight leading-[1.1] mb-8 text-navy story-rise stagger-2"
                                >
                                    Prenajmite <br />
                                    <span className="text-accent-red italic">bez starostí.</span>
                                </h1>
                                <p
                                    className="text-lg text-charcoal/70 max-w-lg font-light leading-relaxed mb-4 story-soft stagger-3"
                                >
                                    Máte byt alebo dom na prenájom? Postaráme sa o všetko – od výberu nájomníka až po pravidelnú kontrolu platieb.
                                </p>


                                <p
                                    className="hidden lg:block text-base text-charcoal/50 max-w-lg font-light leading-relaxed mb-10"
                                >
                                    Žiadne naháňanie nájomníkov. Žiadne zbytočné telefonáty. Žiadne stratené víkendy.
                                </p>

                                {/* Mobile Video - Inserted after texts */}
                                <div className="block lg:hidden mb-8 relative px-2 story-media stagger-4">
                                    <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden shadow-2xl shadow-navy/10">
                                        <div className="absolute inset-0 bg-navy/5 z-10 pointer-events-none" />
                                        <img
                                            src="/frisco-logo.svg"
                                            alt="FRISCO"
                                            className="absolute bottom-2 right-4 z-30 w-16 opacity-80 pointer-events-none drop-shadow-lg"
                                        />
                                        <video autoPlay loop muted playsInline preload="auto" className="w-full h-full object-cover">
                                            <source src="https://fcvswlurtchqorgnwclw.supabase.co/storage/v1/object/public/videos/chcem-prenajat-frisco_optimized.mp4" type="video/mp4" />
                                        </video>
                                    </div>
                                </div>

                                {/* Mobile Only: "No chasing" text BELOW video */}
                                <p
                                    className="block lg:hidden text-base text-charcoal/50 max-w-lg font-light leading-relaxed mb-10"
                                >
                                    Žiadne naháňanie nájomníkov. Žiadne zbytočné telefonáty. Žiadne stratené víkendy.
                                </p>
                                <div className="story-soft stagger-5">
                                    <a
                                        href="#kontaktny-formular"
                                        className="inline-flex items-center gap-3 px-8 py-4 bg-navy text-white rounded-full font-bold tracking-wide hover:bg-navy/90 transition-all shadow-lg shadow-navy/20 group"
                                    >
                                        <Key className="w-5 h-5" />
                                        <span>Chcem prenajať svoju nehnuteľnosť</span>
                                        <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                                    </a>
                                </div>
                            </div>

                            <div
                                className="hidden lg:block w-full lg:w-[55%] relative story-media stagger-5"
                            >
                                <div className="relative aspect-[16/10] w-full rounded-[2rem] overflow-hidden shadow-2xl shadow-navy/10 transform transition-transform hover:scale-[1.01] duration-700">
                                    <div className="absolute inset-0 bg-navy/5 z-10 pointer-events-none" />
                                    <img
                                        src="/frisco-logo.svg"
                                        alt="FRISCO"
                                        className="absolute bottom-2 right-4 z-30 w-24 opacity-80 pointer-events-none drop-shadow-lg"
                                    />
                                    <video autoPlay loop muted playsInline preload="auto" className="w-full h-full object-cover">
                                        <source src="https://fcvswlurtchqorgnwclw.supabase.co/storage/v1/object/public/videos/chcem-prenajat-frisco_optimized.mp4" type="video/mp4" />
                                    </video>
                                </div>
                                <div className="absolute -z-10 -bottom-8 -left-8 w-2/3 h-2/3 bg-accent-red/5 rounded-full blur-3xl" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* ─── SECTION 1: Celoročná starostlivosť ─────────────────────────────── */}
                <section className="py-20 md:py-32 bg-cream overflow-hidden">
                    <div className="container mx-auto px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
                            className="rounded-[2.5rem] bg-white border border-navy/8 shadow-xl shadow-navy/5 overflow-hidden"
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-2">
                                {/* Left — text */}
                                <div className="p-8 md:p-14 lg:p-16 flex flex-col justify-center">
                                    <span className="inline-block text-accent-red font-mono text-xs tracking-[0.3em] uppercase mb-5">
                                        Celoročná starostlivosť
                                    </span>
                                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-navy leading-tight mb-6">
                                        Vy vlastníte,<br />
                                        <span className="text-accent-red italic">my sa staráme.</span>
                                    </h2>
                                    <p className="text-charcoal/65 text-lg leading-relaxed font-light max-w-md">
                                        Spolupracujeme s desiatkami majiteľov, ktorí nechcú riešiť každodenné starosti okolo prenájmu. Ich cieľ je jednoduchý: aby nájom fungoval a peniaze chodili načas.
                                    </p>
                                    <p className="text-charcoal/45 text-base leading-relaxed font-light max-w-md mt-4">
                                        To je celé.
                                    </p>
                                </div>

                                {/* Right — checklist */}
                                <div className="bg-navy/[0.03] border-l border-navy/8 p-8 md:p-14 lg:p-16 flex flex-col justify-center">
                                    <p className="text-navy/50 font-mono text-xs md:text-sm tracking-[0.25em] uppercase mb-6">
                                        Čo vybavíme za vás
                                    </p>
                                    <ul className="space-y-4">
                                        {managedItems.map((item, i) => (
                                            <motion.li
                                                key={i}
                                                initial={{ opacity: 0, y: 10 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true, margin: "0px 0px -50px 0px" }}
                                                transition={{
                                                    duration: 0.4,
                                                    delay: i * 0.05,
                                                    ease: "easeOut"
                                                }}
                                                className="flex items-center gap-4"
                                            >
                                                <span className="flex-shrink-0 w-2 h-2 rounded-full bg-accent-red" />
                                                <span className="text-navy font-medium text-base md:text-lg">{item}</span>
                                            </motion.li>
                                        ))}
                                    </ul>
                                    <p className="text-navy/40 text-sm md:text-base leading-relaxed font-light mt-8">
                                        Vy máte prehľad. Bez toho, aby ste sa museli zapájať do každého detailu.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* ─── SECTION 2: Peniaze vždy načas ─────────────────────────────────── */}
                <section className="py-20 md:py-32 bg-navy overflow-hidden relative">
                    {/* Subtle texture */}
                    <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none" />
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-accent-red" />

                    <div className="container mx-auto px-6 relative z-10">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                            {/* Left — statement */}
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
                            >
                                <div className="flex items-center gap-4 mb-8">
                                    <ShieldAlert className="w-8 h-8 text-accent-red flex-shrink-0" />
                                    <span className="text-white/50 font-mono text-xs tracking-[0.3em] uppercase">
                                        Platobná disciplína
                                    </span>
                                </div>
                                <blockquote className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white leading-[1.15]">
                                    Klient, ktorý neplatí,<br />
                                    <span className="text-accent-red italic">u nás neexistuje.</span>
                                </blockquote>
                            </motion.div>

                            {/* Right — explanation */}
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] as const }}
                                className="space-y-6"
                            >
                                <p className="text-white/75 text-lg leading-relaxed font-light">
                                    Nečakáme týždne, keď niekto mešká.
                                    Ak nájomné nepríde načas, riešime to okamžite podľa dohodnutých pravidiel.
                                </p>
                                <p className="text-white/55 text-base leading-relaxed font-light">
                                    Systematicky. Každý mesiac. Pri každom nájomníkovi.
                                </p>
                                <a
                                    href="#kontaktny-formular"
                                    className="inline-flex items-center gap-3 mt-4 px-7 py-3.5 bg-accent-red text-white rounded-full font-bold tracking-wide hover:bg-accent-red/90 transition-all shadow-lg shadow-accent-red/20 group"
                                >
                                    <Phone className="w-4 h-4" />
                                    <span>Chcem sa dozvedieť viac</span>
                                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                                </a>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* ─── SECTION 3: Transparentnosť — tri piliere ───────────────────────── */}
                <section className="py-20 md:py-32 bg-white">
                    <div className="container mx-auto px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
                            className="text-center mb-16"
                        >
                            <span className="text-navy/40 font-mono text-xs tracking-[0.3em] uppercase mb-4 block">
                                Náš prístup
                            </span>
                            <h2 className="text-4xl md:text-5xl font-serif font-bold text-navy leading-tight">
                                Máte otázky?
                            </h2>
                        </motion.div>

                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={staggerContainer}
                        >
                            {pillars.map((pillar, i) => (
                                <motion.div
                                    key={i}
                                    variants={fadeInUp}
                                    className="group relative flex flex-col items-center text-center px-6 md:px-8 py-12 rounded-[2rem] border border-navy/8 bg-cream hover:bg-navy hover:border-navy transition-all duration-500 hover:shadow-2xl hover:shadow-navy/15 hover:-translate-y-2"
                                >
                                    <div className="w-16 h-16 rounded-2xl bg-navy/5 group-hover:bg-accent-red flex items-center justify-center mb-7 transition-colors duration-500">
                                        <pillar.icon className="w-8 h-8 text-navy group-hover:text-white transition-colors duration-500" />
                                    </div>
                                    <h3 className="text-xl md:text-2xl font-poppins font-extrabold text-navy group-hover:text-white mb-4 md:mb-6 transition-colors duration-500">
                                        {pillar.title}
                                    </h3>
                                    <p className="text-charcoal/60 group-hover:text-white/70 text-sm md:text-lg leading-relaxed transition-colors duration-500">
                                        {pillar.text}
                                    </p>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Final CTA */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] as const }}
                            className="text-center"
                        >
                            <p className="text-charcoal/60 text-lg mb-6 font-light">
                                Ozvite sa nám. Všetko vám vysvetlíme osobne a nezäväzne.
                            </p>
                            <a
                                href="#kontaktny-formular"
                                className="inline-flex items-center gap-3 px-10 py-4 bg-navy text-white rounded-full font-bold tracking-wide hover:bg-navy/90 transition-all shadow-lg shadow-navy/20 group"
                            >
                                <span>Nezáväzná konzultácia</span>
                                <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                            </a>
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

export default ChcemPrenajat;
