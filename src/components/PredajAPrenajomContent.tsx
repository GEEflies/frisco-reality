'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, Check, Phone, Building2, Key, TrendingUp, ShieldCheck } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { ContactSection } from '@/components/ContactSection';

const heroProperty = '/hero-property.jpg';

const benefits = [
    {
        icon: TrendingUp,
        title: 'Maximálna cena',
        description: 'Vďaka profesionálnej prezentácii a marketingu zabezpečíme predaj vašej nehnuteľnosti za najvyššiu možnú cenu.'
    },
    {
        icon: ShieldCheck,
        title: 'Bezpečnosť',
        description: 'Kompletný právny servis a bezpečná úschova peňazí sú u nás samozrejmosťou. Vaša bezpečnosť je prvoradá.'
    },
    {
        icon: Building2,
        title: 'Lokálna expertíza',
        description: 'Sme odborníci na trh v Seredi a okolí. Poznáme reálne ceny a vieme, ako osloviť správnych záujemcov.'
    },
    {
        icon: Key,
        title: 'Bez starostí',
        description: 'Vybavíme za vás všetko od obhliadok cez kataster až po prepis energií. Vy len podpíšete zmluvy.'
    }
];

const PredajAPrenajom = () => {
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
                                className="flex items-center gap-4 mb-8"
                            >
                                <div className="h-px w-12 bg-white/30" />
                                <span className="text-white/80 font-mono text-xs tracking-[0.3em] uppercase">
                                    Pre majiteľov nehnuteľností
                                </span>
                            </div>

                            <h1
                                className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold tracking-tight leading-[1.1] mb-8"
                            >
                                Predajte alebo prenajmite <br />
                                <span className="text-accent-red italic">bez starostí</span>.
                            </h1>

                            <p
                                className="text-lg md:text-xl text-white/70 max-w-2xl font-light leading-relaxed mb-12"
                            >
                                Získajte profesionálne ocenenie, špičkovú prezentáciu a prístup k overeným klientom.
                                S nami predáte rýchlejšie a výhodnejšie.
                            </p>

                            <div
                            >
                                <a
                                    href="#kontaktny-formular"
                                    className="inline-flex items-center gap-3 px-8 py-4 bg-accent-red text-white rounded-full font-bold tracking-wide hover:bg-accent-red/90 transition-all shadow-lg shadow-accent-red/20 group"
                                >
                                    <span>Chcem nezáväznú konzultáciu</span>
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
                            {benefits.map((benefit, index) => (
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
                                    <video
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                        className="w-full h-full object-cover"
                                    >
                                        <source src="/hero-video.mp4" type="video/mp4" />
                                    </video>
                                </div>
                            </div>

                            <div>
                                <span className="text-navy font-mono text-xs tracking-[0.3em] uppercase mb-6 block">
                                    Prečo práve my?
                                </span>
                                <h2 className="text-4xl md:text-5xl font-serif font-bold text-navy mb-6 leading-tight">
                                    Viac než len <br />
                                    <span className="text-accent-red italic">inzerát na portáli</span>.
                                </h2>
                                <p className="text-lg text-charcoal/70 mb-8 leading-relaxed">
                                    Každej nehnuteľnosti venujeme individuálnu starostlivosť. Vytvárame príbeh, ktorý predáva.
                                    Kombinujeme moderné technológie s osobným prístupom, aby sme oslovili tú správnu cieľovú skupinu.
                                </p>

                                <ul className="space-y-4">
                                    {[
                                        "Profesionálny Home Staging v cene",
                                        "Videoobhliadky a 3D skeny",
                                        "Cielená reklama na sociálnych sieťach",
                                        "Databáza aktívnych kupujúcich"
                                    ].map((item, i) => (
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
