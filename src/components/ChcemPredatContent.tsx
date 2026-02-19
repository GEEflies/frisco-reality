'use client';

import { motion } from 'framer-motion';
// Note: Added Import for ChartPie or similar if needed for 'Price/Strategy' icon, but can reuse existing or import specifically.
import { ArrowUpRight, Home, Camera, Megaphone, ShieldCheck, MessageCircle, TrendingUp } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { ContactSection } from '@/components/ContactSection';
import { useLanguage } from '@/i18n/LanguageProvider';
import { CHCEM_PREDAT_HERO_COPY } from '@/i18n/copy';

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

const benefitsByLanguage = {
    sk: [
        { icon: TrendingUp, title: 'Nastavenie ceny a stratégie', text: 'Pozrieme sa na trh, konkurenciu aj reálny dopyt. Cenu neurčujeme „podľa pocitu“, ale podľa dát a skúseností.', bg: 'bg-navy/5', offset: false },
        { icon: Home, title: 'Príprava nehnuteľnosti', text: 'Poradíme, čo upraviť pred predajom. Často stačia malé zmeny, ktoré pomôžu dosiahnuť lepšiu cenu.', bg: 'bg-cream', offset: true },
        { icon: Camera, title: 'Fotografie a prezentácia', text: 'Profesionálne fotografie a kvalitný popis sú základ. Prvý dojem rozhoduje o tom, či príde obhliadka.', bg: 'bg-white', offset: false },
        { icon: Megaphone, title: 'Marketing', text: 'Realitné portály, sociálne siete, vlastná databáza záujemcov. Vašu nehnuteľnosť ukážeme tam, kde má byť.', bg: 'bg-cream', offset: true },
        { icon: ShieldCheck, title: 'Právny servis', text: 'Zmluvy, úschova peňazí, kataster. Všetko zabezpečíme a dohliadneme na bezpečný priebeh.', bg: 'bg-white', offset: false },
    ],
    en: [
        { icon: TrendingUp, title: 'Pricing and strategy', text: 'We evaluate market data, competition and real demand. Pricing is set by data and experience, not guesswork.', bg: 'bg-navy/5', offset: false },
        { icon: Home, title: 'Property preparation', text: 'We advise what to improve before listing. Small changes often lead to a stronger final price.', bg: 'bg-cream', offset: true },
        { icon: Camera, title: 'Photos and presentation', text: 'Professional visuals and quality listing text are essential. First impression decides if a viewing happens.', bg: 'bg-white', offset: false },
        { icon: Megaphone, title: 'Marketing', text: 'Property portals, social networks and our own buyer database. We put your property where the right people see it.', bg: 'bg-cream', offset: true },
        { icon: ShieldCheck, title: 'Legal service', text: 'Contracts, escrow and land registry. We handle the legal side and supervise a safe process.', bg: 'bg-white', offset: false },
    ],
    de: [
        { icon: TrendingUp, title: 'Preis und Strategie', text: 'Wir analysieren Markt, Konkurrenz und reale Nachfrage. Der Preis basiert auf Daten und Erfahrung, nicht auf Gefühl.', bg: 'bg-navy/5', offset: false },
        { icon: Home, title: 'Vorbereitung der Immobilie', text: 'Wir beraten Sie, was vor dem Verkauf angepasst werden sollte. Kleine Änderungen bringen oft einen besseren Preis.', bg: 'bg-cream', offset: true },
        { icon: Camera, title: 'Fotos und Präsentation', text: 'Professionelle Fotos und ein hochwertiges Exposé sind die Basis. Der erste Eindruck entscheidet über Besichtigungen.', bg: 'bg-white', offset: false },
        { icon: Megaphone, title: 'Marketing', text: 'Portale, soziale Netzwerke und unsere Interessentendatenbank. Wir platzieren Ihre Immobilie dort, wo sie gesehen wird.', bg: 'bg-cream', offset: true },
        { icon: ShieldCheck, title: 'Rechtsservice', text: 'Verträge, Treuhand und Grundbuch. Wir übernehmen die rechtliche Abwicklung und achten auf Sicherheit.', bg: 'bg-white', offset: false },
    ],
};

const pageCopyByLanguage = {
    sk: {
        section1Badge: 'Čo pre vás zabezpečíme',
        section1Title: 'Predaj, ktorý',
        section1Accent: 'má systém',
        section1Text: 'Nerobíme veci náhodne. Každý krok má svoj dôvod – od stanovenia ceny až po podpis zmluvy.',
        editorialBadge: 'Náš prístup',
        editorialTitle: 'Každú nehnuteľnosť berieme',
        editorialAccent: 'osobne',
        editorialText1: 'Nie je to „ďalší inzerát“. Je to konkrétny byt alebo dom s konkrétnym cieľom – predať ho čo najlepšie.',
        editorialText2: 'Sme pri obhliadkach, rokujeme o cene a zastupujeme vaše záujmy. Od prvého stretnutia až po odovzdanie kľúčov.',
        editorialImageAlt: 'Predaj nehnuteľnosti',
        processBadge: 'Ako prebieha spolupráca',
        processTitle: 'Predaj bez chaosu a bez',
        processAccent: 'zbytočných kompromisov',
        processCta: 'Chcem predať nehnuteľnosť',
        processSteps: [
            { title: '1. Stretnutie a plán', text: 'Prejdeme si vaše očakávania, analyzujeme trh a nastavíme cenu aj postup.' },
            { title: '2. Spustenie predaja', text: 'Pripravíme prezentáciu a spustíme inzerciu. Organizujeme obhliadky a komunikujeme so záujemcami.' },
            { title: '3. Dohoda a odovzdanie', text: 'Keď nájdeme kupujúceho, pripravíme zmluvy a dohliadneme na bezpečný prevod peňazí. Po zápise na katastri odovzdáme kľúče.' },
        ],
    },
    en: {
        section1Badge: 'What we handle for you',
        section1Title: 'A sale that',
        section1Accent: 'has a system',
        section1Text: 'We do not improvise. Every step has a purpose—from pricing to contract signing.',
        editorialBadge: 'Our approach',
        editorialTitle: 'We treat every property',
        editorialAccent: 'personally',
        editorialText1: 'This is not “just another listing.” It is a specific home with a clear goal: sell it under the best terms.',
        editorialText2: 'We attend viewings, negotiate price, and represent your interests from the first meeting to key handover.',
        editorialImageAlt: 'Property sale',
        processBadge: 'How cooperation works',
        processTitle: 'A sale without chaos and',
        processAccent: 'without needless compromises',
        processCta: 'I want to sell my property',
        processSteps: [
            { title: '1. Meeting and plan', text: 'We define your expectations, analyze the market, and set the right price and strategy.' },
            { title: '2. Launch the sale', text: 'We prepare the presentation and publish listings. We organize viewings and communicate with interested buyers.' },
            { title: '3. Agreement and handover', text: 'When we find a buyer, we prepare contracts and supervise a safe transfer. After registration, we hand over the keys.' },
        ],
    },
    de: {
        section1Badge: 'Was wir für Sie erledigen',
        section1Title: 'Ein Verkauf mit',
        section1Accent: 'klarem System',
        section1Text: 'Wir arbeiten nicht zufällig. Jeder Schritt hat einen Zweck – von der Preisfestlegung bis zur Unterschrift.',
        editorialBadge: 'Unser Ansatz',
        editorialTitle: 'Jede Immobilie behandeln wir',
        editorialAccent: 'persönlich',
        editorialText1: 'Es ist nicht „nur ein weiteres Inserat“. Es ist ein konkretes Zuhause mit einem klaren Ziel: bestmöglich verkaufen.',
        editorialText2: 'Wir sind bei Besichtigungen dabei, verhandeln den Preis und vertreten Ihre Interessen bis zur Schlüsselübergabe.',
        editorialImageAlt: 'Immobilienverkauf',
        processBadge: 'So läuft die Zusammenarbeit',
        processTitle: 'Verkauf ohne Chaos und ohne',
        processAccent: 'unnötige Kompromisse',
        processCta: 'Ich möchte meine Immobilie verkaufen',
        processSteps: [
            { title: '1. Gespräch und Plan', text: 'Wir klären Ihre Erwartungen, analysieren den Markt und setzen Preis sowie Vorgehen fest.' },
            { title: '2. Verkaufsstart', text: 'Wir erstellen die Präsentation und starten die Vermarktung. Wir organisieren Besichtigungen und kommunizieren mit Interessenten.' },
            { title: '3. Abschluss und Übergabe', text: 'Sobald wir einen Käufer finden, bereiten wir die Verträge vor und begleiten die sichere Abwicklung bis zur Übergabe.' },
        ],
    },
};

const ChcemPredat = () => {
    const { language } = useLanguage();
    const heroCopy = CHCEM_PREDAT_HERO_COPY[language];
    const pageCopy = pageCopyByLanguage[language];
    const benefits = benefitsByLanguage[language];

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
                                        {heroCopy.label}
                                    </span>
                                </div>
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold tracking-tight leading-[1.1] mb-8 text-navy story-rise stagger-2">
                                    {heroCopy.titleStart} <br />
                                    <span className="text-accent-red italic">{heroCopy.titleAccent}</span>.
                                </h1>
                                <p className="text-lg text-charcoal/70 max-w-lg font-light leading-relaxed mb-10 story-soft stagger-3">
                                    {heroCopy.subtitle}
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
                                        <span>{heroCopy.cta}</span>
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
                                {pageCopy.section1Badge}
                            </span>
                            <h2 className="text-4xl md:text-5xl font-serif font-bold text-navy leading-tight max-w-xl">
                                {pageCopy.section1Title}{' '}
                                <span className="text-accent-red italic">{pageCopy.section1Accent}</span>
                            </h2>
                            <p className="text-charcoal/60 mt-6 max-w-lg text-lg font-light leading-relaxed">
                                {pageCopy.section1Text}
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
                                    alt={pageCopy.editorialImageAlt}
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
                                        {pageCopy.editorialBadge}
                                    </span>
                                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-navy leading-tight mb-6">
                                        {pageCopy.editorialTitle} <span className="text-accent-red italic">{pageCopy.editorialAccent}</span>.
                                    </h2>
                                    <p className="text-charcoal/65 text-base leading-relaxed mb-6 font-light">
                                        {pageCopy.editorialText1}
                                    </p>
                                    <p className="text-charcoal/50 text-sm leading-relaxed font-light">
                                        {pageCopy.editorialText2}
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
                                    {pageCopy.processBadge}
                                </span>
                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold leading-tight">
                                    {pageCopy.processTitle} <span className="text-accent-red italic">{pageCopy.processAccent}</span>.
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
                                    <span>{pageCopy.processCta}</span>
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
                                <h3 className="text-xl font-serif font-bold mb-4 text-white">{pageCopy.processSteps[0].title}</h3>
                                <p className="text-white/60 leading-relaxed font-light">
                                    {pageCopy.processSteps[0].text}
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
                                <h3 className="text-xl font-serif font-bold mb-4 text-white">{pageCopy.processSteps[1].title}</h3>
                                <p className="text-white/60 leading-relaxed font-light">
                                    {pageCopy.processSteps[1].text}
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
                                <h3 className="text-xl font-serif font-bold mb-4 text-white">{pageCopy.processSteps[2].title}</h3>
                                <p className="text-white/60 leading-relaxed font-light">
                                    {pageCopy.processSteps[2].text}
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
