'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, Check, Phone, Building2, Key, TrendingUp, ShieldCheck } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { ContactSection } from '@/components/ContactSection';
import { useLanguage } from '@/i18n/LanguageProvider';
import AutoplayVideo from '@/components/AutoplayVideo';

const heroProperty = '/hero-property.jpg';

const PredajAPrenajom = () => {
    const { language } = useLanguage();

    const copy = {
        sk: {
            ownerLabel: 'Pre majiteľov nehnuteľností',
            heroTitleStart: 'Predajte alebo prenajmite',
            heroTitleAccent: 'bez starostí',
            heroText: 'Získajte profesionálne ocenenie, špičkovú prezentáciu a prístup k overeným klientom. S nami predáte rýchlejšie a výhodnejšie.',
            heroCta: 'Chcem nezáväznú konzultáciu',
            whyLabel: 'Prečo práve my?',
            whyTitleStart: 'Viac než len',
            whyTitleAccent: 'inzerát na portáli',
            whyText: 'Každej nehnuteľnosti venujeme individuálnu starostlivosť. Vytvárame príbeh, ktorý predáva. Kombinujeme moderné technológie s osobným prístupom, aby sme oslovili tú správnu cieľovú skupinu.',
            points: ['Profesionálny Home Staging v cene', 'Videoobhliadky a 3D skeny', 'Cielená reklama na sociálnych sieťach', 'Databáza aktívnych kupujúcich'],
            benefits: [
                { icon: TrendingUp, title: 'Maximálna cena', description: 'Vďaka profesionálnej prezentácii a marketingu zabezpečíme predaj vašej nehnuteľnosti za najvyššiu možnú cenu.' },
                { icon: ShieldCheck, title: 'Bezpečnosť', description: 'Kompletný právny servis a bezpečná úschova peňazí sú u nás samozrejmosťou. Vaša bezpečnosť je prvoradá.' },
                { icon: Building2, title: 'Lokálna expertíza', description: 'Sme odborníci na trh v Seredi a okolí. Poznáme reálne ceny a vieme, ako osloviť správnych záujemcov.' },
                { icon: Key, title: 'Bez starostí', description: 'Vybavíme za vás všetko od obhliadok cez kataster až po prepis energií. Vy len podpíšete zmluvy.' },
            ],
        },
        en: {
            ownerLabel: 'For property owners',
            heroTitleStart: 'Sell or rent out',
            heroTitleAccent: 'without stress',
            heroText: 'Get professional valuation, premium presentation, and access to verified clients. With us, you sell faster and under better conditions.',
            heroCta: 'I want a free consultation',
            whyLabel: 'Why us?',
            whyTitleStart: 'More than just an',
            whyTitleAccent: 'online listing',
            whyText: 'We give every property individual care. We craft a story that sells. We combine modern technology with a personal approach to reach the right audience.',
            points: ['Professional home staging included', 'Video tours and 3D scans', 'Targeted social media advertising', 'Database of active buyers'],
            benefits: [
                { icon: TrendingUp, title: 'Maximum price', description: 'With professional presentation and marketing, we secure the highest possible sale price for your property.' },
                { icon: ShieldCheck, title: 'Security', description: 'Complete legal support and secure escrow are standard with us. Your safety comes first.' },
                { icon: Building2, title: 'Local expertise', description: 'We are market experts in Sereď and the surrounding area. We know real prices and how to reach the right buyers.' },
                { icon: Key, title: 'Hassle-free', description: 'We handle everything for you—from viewings and cadastral paperwork to utility transfers. You only sign the contracts.' },
            ],
        },
        de: {
            ownerLabel: 'Für Immobilienbesitzer',
            heroTitleStart: 'Verkaufen oder vermieten',
            heroTitleAccent: 'ohne Stress',
            heroText: 'Erhalten Sie eine professionelle Bewertung, erstklassige Präsentation und Zugang zu geprüften Kunden. Mit uns verkaufen Sie schneller und zu besseren Konditionen.',
            heroCta: 'Ich möchte eine unverbindliche Beratung',
            whyLabel: 'Warum wir?',
            whyTitleStart: 'Mehr als nur ein',
            whyTitleAccent: 'Portalinserat',
            whyText: 'Jeder Immobilie widmen wir individuelle Betreuung. Wir schaffen eine Geschichte, die verkauft. Moderne Technologien verbinden wir mit persönlichem Service, um die richtige Zielgruppe zu erreichen.',
            points: ['Professionelles Home Staging inklusive', 'Videobesichtigungen und 3D-Scans', 'Gezielte Werbung in sozialen Medien', 'Datenbank aktiver Käufer'],
            benefits: [
                { icon: TrendingUp, title: 'Maximaler Preis', description: 'Dank professioneller Präsentation und Marketing erzielen wir den höchstmöglichen Verkaufspreis für Ihre Immobilie.' },
                { icon: ShieldCheck, title: 'Sicherheit', description: 'Kompletter Rechtsservice und sichere Geldverwahrung sind bei uns selbstverständlich. Ihre Sicherheit hat Priorität.' },
                { icon: Building2, title: 'Lokale Expertise', description: 'Wir sind Experten für den Markt in Sereď und Umgebung. Wir kennen reale Preise und erreichen die richtigen Interessenten.' },
                { icon: Key, title: 'Sorgenfrei', description: 'Wir übernehmen alles für Sie – von Besichtigungen und Kataster bis zur Ummeldung der Energieverträge. Sie unterschreiben nur die Verträge.' },
            ],
        },
    }[language];

    return (
        <div className="min-h-screen bg-white">
            <div>

                {/* Custom Hero Section for Sellers */}
                <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-navy text-white">
                    <div className="absolute inset-0 z-0">
                        <div className="absolute inset-0 bg-navy/80 mix-blend-multiply z-10" />
                        <img
                            src={heroProperty}
                            alt="Luxury interior"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="container mx-auto px-6 relative z-10">
                        <div className="max-w-4xl">
                            <div
                                className="flex items-center gap-4 mb-8 animate-fade-in-up stagger-1"
                            >
                                <div className="h-px w-12 bg-white/30" />
                                <span className="text-white/80 font-mono text-xs tracking-[0.3em] uppercase">
                                    {copy.ownerLabel}
                                </span>
                            </div>

                            <h1
                                className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold tracking-tight leading-[1.1] mb-8 animate-fade-in-up stagger-2"
                            >
                                {copy.heroTitleStart} <br />
                                <span className="text-accent-red italic">{copy.heroTitleAccent}</span>.
                            </h1>

                            <p
                                className="text-lg md:text-xl text-white/70 max-w-2xl font-light leading-relaxed mb-12 animate-fade-in-up stagger-3"
                            >
                                {copy.heroText}
                            </p>

                            <div
                                className="animate-fade-in-up stagger-4"
                            >
                                <a
                                    href="#kontaktny-formular"
                                    className="inline-flex items-center gap-3 px-8 py-4 bg-accent-red text-white rounded-full font-bold tracking-wide hover:bg-accent-red/90 transition-all shadow-lg shadow-accent-red/20 group"
                                >
                                    <span>{copy.heroCta}</span>
                                    <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Benefits Section */}
                <section className="py-20 md:py-32 bg-cream">
                    <div className="container mx-auto px-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {copy.benefits.map((benefit, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="bg-white p-8 rounded-3xl border border-navy/5 shadow-sm hover:shadow-md transition-all group"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-navy/5 flex items-center justify-center mb-6 group-hover:bg-accent-red group-hover:text-white transition-colors duration-300">
                                        <benefit.icon className="w-7 h-7 text-navy group-hover:text-white transition-colors duration-300" />
                                    </div>
                                    <h3 className="text-xl font-serif font-bold text-navy mb-3">{benefit.title}</h3>
                                    <p className="text-charcoal/60 text-sm leading-relaxed">{benefit.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Video / Content Section */}
                <section className="py-20 bg-white overflow-hidden">
                    <div className="container mx-auto px-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                            <div className="relative">
                                <div className="absolute -top-10 -left-10 w-40 h-40 bg-navy/5 rounded-full blur-3xl" />
                                <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-navy/10 aspect-[4/3]">
                                    <AutoplayVideo
                                        src="/hero-video.mp4"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>

                            <div>
                                <span className="text-navy font-mono text-xs tracking-[0.3em] uppercase mb-6 block">
                                    {copy.whyLabel}
                                </span>
                                <h2 className="text-4xl md:text-5xl font-serif font-bold text-navy mb-6 leading-tight">
                                    {copy.whyTitleStart} <br />
                                    <span className="text-accent-red italic">{copy.whyTitleAccent}</span>.
                                </h2>
                                <p className="text-lg text-charcoal/70 mb-8 leading-relaxed">
                                    {copy.whyText}
                                </p>

                                <ul className="space-y-4">
                                    {copy.points.map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-navy font-medium">
                                            <div className="w-6 h-6 rounded-full bg-accent-red/10 flex items-center justify-center flex-shrink-0">
                                                <Check className="w-3.5 h-3.5 text-accent-red" />
                                            </div>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA / Contact Form Anchor */}
                <div id="kontaktny-formular">
                    <ContactSection />
                </div>

                <Footer />
            </div>
        </div>
    );
};

export default PredajAPrenajom;
