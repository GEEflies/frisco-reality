'use client';

import AutoplayVideo from './AutoplayVideo';
import { ArrowUpRight, Key, CalendarCheck, ShieldAlert, Eye, Phone } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { ContactSection } from '@/components/ContactSection';
import { useLanguage } from '@/i18n/LanguageProvider';
import { CHCEM_PRENAJAT_HERO_COPY } from '@/i18n/copy';

const DESKTOP_VIDEO = 'https://fcvswlurtchqorgnwclw.supabase.co/storage/v1/object/public/videos/chcem-prenajat-frisco_optimized.mp4';
const MOBILE_VIDEO = 'https://fcvswlurtchqorgnwclw.supabase.co/storage/v1/object/public/videos/prenajat-mobile-720p.mp4';

const pageCopyByLanguage = {
    sk: {
        section1Badge: 'Celoročná starostlivosť',
        section1TitleLine1: 'Vy vlastníte,',
        section1TitleLine2: 'my sa staráme.',
        section1Text1: 'Spolupracujeme s desiatkami majiteľov, ktorí nechcú riešiť každodenné starosti okolo prenájmu. Ich cieľ je jednoduchý: aby nájom fungoval a peniaze chodili načas.',
        section1Text2: 'To je celé.',
        checklistTitle: 'Čo vybavíme za vás',
        checklistFooter: 'Vy máte prehľad. Bez toho, aby ste sa museli zapájať do každého detailu.',
        managedItems: [
            'Nájdeme a preverujeme nájomníka',
            'Pripravíme jasnú a bezpečnú zmluvu',
            'Strážime platby a termíny',
            'Komunikujeme s nájomníkmi',
            'Zabezpečíme opravy a údržbu',
            'Posielame vám pravidelný prehľad',
        ],
        paymentBadge: 'Platobná disciplína',
        paymentHeadline1: 'Klient, ktorý neplatí,',
        paymentHeadline2: 'u nás neexistuje.',
        paymentText1: 'Nečakáme týždne, keď niekto mešká. Ak nájomné nepríde načas, riešime to okamžite podľa dohodnutých pravidiel.',
        paymentText2: 'Systematicky. Každý mesiac. Pri každom nájomníkovi.',
        paymentCta: 'Chcem sa dozvedieť viac',
        approachBadge: 'Náš prístup',
        approachTitle: 'Máte otázky?',
        pillars: [
            { icon: Eye, title: 'Transparentne', text: 'Vždy viete, čo sa s vašou nehnuteľnosťou deje. Žiadne skryté poplatky, žiadne prekvapenia.' },
            { icon: CalendarCheck, title: 'Férové podmienky', text: 'Zmluvy píšeme zrozumiteľne. Podmienky sú jasné pre vás aj pre nájomníka.' },
            { icon: Key, title: 'Dlhodobá spolupráca', text: 'Nejde nám o jednorazový obchod. Chceme, aby prenájom fungoval roky.' },
        ],
        finalText: 'Ozvite sa nám. Všetko vám vysvetlíme osobne a nezäväzne.',
        finalCta: 'Nezáväzná konzultácia',
    },
    en: {
        section1Badge: 'Year-round management',
        section1TitleLine1: 'You own it,',
        section1TitleLine2: 'we manage it.',
        section1Text1: 'We work with owners who do not want daily rental hassles. Their goal is simple: stable tenancy and rent paid on time.',
        section1Text2: 'That is it.',
        checklistTitle: 'What we handle for you',
        checklistFooter: 'You stay informed without having to solve every detail yourself.',
        managedItems: [
            'We find and verify tenants',
            'We prepare clear and secure contracts',
            'We monitor payments and due dates',
            'We communicate with tenants',
            'We coordinate repairs and maintenance',
            'We send regular reports',
        ],
        paymentBadge: 'Payment discipline',
        paymentHeadline1: 'A tenant who does not pay',
        paymentHeadline2: 'does not exist in our system.',
        paymentText1: 'We do not wait for weeks when someone is late. If rent is not paid on time, we act immediately according to agreed rules.',
        paymentText2: 'Systematically. Every month. For every tenant.',
        paymentCta: 'I want to learn more',
        approachBadge: 'Our approach',
        approachTitle: 'Have questions?',
        pillars: [
            { icon: Eye, title: 'Transparency', text: 'You always know what is happening with your property. No hidden fees, no surprises.' },
            { icon: CalendarCheck, title: 'Fair conditions', text: 'Our contracts are clear and understandable. Terms are transparent for both owner and tenant.' },
            { icon: Key, title: 'Long-term partnership', text: 'We are not after one quick deal. We want your rental to work for years.' },
        ],
        finalText: 'Contact us. We will explain everything clearly and without obligation.',
        finalCta: 'Non-binding consultation',
    },
    de: {
        section1Badge: 'Rundum-Betreuung',
        section1TitleLine1: 'Sie besitzen,',
        section1TitleLine2: 'wir kümmern uns.',
        section1Text1: 'Wir arbeiten mit Eigentümern, die den täglichen Vermietungsaufwand nicht selbst tragen möchten. Ziel: stabile Vermietung und pünktliche Zahlungen.',
        section1Text2: 'Mehr braucht es nicht.',
        checklistTitle: 'Was wir für Sie erledigen',
        checklistFooter: 'Sie behalten den Überblick, ohne jedes Detail selbst lösen zu müssen.',
        managedItems: [
            'Wir finden und prüfen Mieter',
            'Wir erstellen klare und sichere Verträge',
            'Wir überwachen Zahlungen und Fristen',
            'Wir kommunizieren mit Mietern',
            'Wir organisieren Reparaturen und Wartung',
            'Wir senden regelmäßige Berichte',
        ],
        paymentBadge: 'Zahlungsdisziplin',
        paymentHeadline1: 'Ein Mieter, der nicht zahlt,',
        paymentHeadline2: 'existiert bei uns nicht.',
        paymentText1: 'Wir warten nicht wochenlang bei Zahlungsverzug. Wenn die Miete nicht pünktlich eingeht, handeln wir sofort nach klaren Regeln.',
        paymentText2: 'Systematisch. Jeden Monat. Bei jedem Mieter.',
        paymentCta: 'Ich möchte mehr erfahren',
        approachBadge: 'Unser Ansatz',
        approachTitle: 'Haben Sie Fragen?',
        pillars: [
            { icon: Eye, title: 'Transparenz', text: 'Sie wissen immer, was mit Ihrer Immobilie passiert. Keine versteckten Gebühren, keine Überraschungen.' },
            { icon: CalendarCheck, title: 'Faire Bedingungen', text: 'Unsere Verträge sind verständlich formuliert. Die Konditionen sind für beide Seiten klar.' },
            { icon: Key, title: 'Langfristige Zusammenarbeit', text: 'Uns geht es nicht um ein schnelles Geschäft. Wir wollen, dass Ihre Vermietung langfristig funktioniert.' },
        ],
        finalText: 'Melden Sie sich bei uns. Wir erklären alles persönlich und unverbindlich.',
        finalCta: 'Unverbindliche Beratung',
    },
};

const ChcemPrenajat = () => {
    const { language } = useLanguage();
    const heroCopy = CHCEM_PRENAJAT_HERO_COPY[language];
    const pageCopy = pageCopyByLanguage[language];

    return (
        <div className="sell-rent-premium-motion min-h-screen bg-white">
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
                                        {heroCopy.label}
                                    </span>
                                </div>
                                <h1
                                    className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold tracking-tight leading-[1.1] mb-8 text-navy story-rise stagger-2"
                                >
                                    <span className="inline-block">{heroCopy.titleStart}</span>
                                    <br />
                                    <span className="inline-block text-accent-red italic">{heroCopy.titleAccent}</span>
                                </h1>
                                <p
                                    className="text-lg text-charcoal/70 max-w-lg font-light leading-relaxed mb-4 story-soft stagger-3"
                                >
                                    {heroCopy.subtitle}
                                </p>


                                <p
                                    className="hidden lg:block text-base text-charcoal/50 max-w-lg font-light leading-relaxed mb-10"
                                >
                                    {heroCopy.secondary}
                                </p>

                                {/* Mobile Video - Inserted after texts */}
                                <div className="block lg:hidden mb-8 relative px-2 story-media stagger-4">
                                    <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden shadow-2xl shadow-navy/10">
                                        <div className="absolute inset-0 bg-navy/5 z-10 pointer-events-none" />
                                        <img
                                            src="/frisco-logo-hq.png"
                                            alt="FRISCO"
                                            className="absolute bottom-2 right-4 z-30 w-16 opacity-80 pointer-events-none drop-shadow-lg"
                                        />
                                        <AutoplayVideo
                                            src={MOBILE_VIDEO}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>

                                {/* Mobile Only: "No chasing" text BELOW video */}
                                <p
                                    className="block lg:hidden text-base text-charcoal/50 max-w-lg font-light leading-relaxed mb-10"
                                >
                                    {heroCopy.secondary}
                                </p>
                                <div className="story-soft stagger-5">
                                    <a
                                        href="#kontaktny-formular"
                                        className="inline-flex items-center gap-3 px-8 py-4 bg-navy text-white rounded-full font-bold tracking-wide hover:bg-navy/90 transition-all shadow-lg shadow-navy/20 group"
                                    >
                                        <Key className="w-5 h-5" />
                                        <span>{heroCopy.cta}</span>
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
                                        src="/frisco-logo-hq.png"
                                        alt="FRISCO"
                                        className="absolute bottom-2 right-4 z-30 w-24 opacity-80 pointer-events-none drop-shadow-lg"
                                    />
                                    <AutoplayVideo
                                        src={DESKTOP_VIDEO}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="absolute -z-10 -bottom-8 -left-8 w-2/3 h-2/3 bg-accent-red/5 rounded-full blur-3xl" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* ─── SECTION 1: Celoročná starostlivosť ─────────────────────────────── */}
                <section className="reveal smooth-reveal py-20 md:py-32 bg-cream overflow-hidden">
                    <div className="container mx-auto px-6">
                        <div
                            className="rv-child rounded-[2.5rem] bg-white border border-navy/8 shadow-xl shadow-navy/5 overflow-hidden"
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-2">
                                {/* Left — text */}
                                <div className="p-8 md:p-14 lg:p-16 flex flex-col justify-center">
                                    <span className="inline-block text-accent-red font-mono text-xs tracking-[0.3em] uppercase mb-5">
                                        {pageCopy.section1Badge}
                                    </span>
                                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-navy leading-tight mb-6">
                                        {pageCopy.section1TitleLine1}<br />
                                        <span className="text-accent-red italic">{pageCopy.section1TitleLine2}</span>
                                    </h2>
                                    <p className="text-charcoal/65 text-lg leading-relaxed font-light max-w-md">
                                        {pageCopy.section1Text1}
                                    </p>
                                    <p className="text-charcoal/45 text-base leading-relaxed font-light max-w-md mt-4">
                                        {pageCopy.section1Text2}
                                    </p>
                                </div>

                                {/* Right — checklist */}
                                <div className="bg-navy/[0.03] border-l border-navy/8 p-8 md:p-14 lg:p-16 flex flex-col justify-center">
                                    <p className="text-navy/50 font-mono text-xs md:text-sm tracking-[0.25em] uppercase mb-6">
                                        {pageCopy.checklistTitle}
                                    </p>
                                    <ul className="space-y-4">
                                        {pageCopy.managedItems.map((item, i) => (
                                            <li
                                                key={i}
                                                className="rv-child flex items-center gap-4"
                                            >
                                                <span className="flex-shrink-0 w-2 h-2 rounded-full bg-accent-red" />
                                                <span className="text-navy font-medium text-base md:text-lg">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <p className="text-navy/40 text-sm md:text-base leading-relaxed font-light mt-8">
                                        {pageCopy.checklistFooter}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ─── SECTION 2: Peniaze vždy načas ─────────────────────────────────── */}
                <section className="reveal smooth-reveal py-20 md:py-32 bg-navy overflow-hidden relative">
                    {/* Subtle texture */}
                    <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none" />
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-accent-red" />

                    <div className="container mx-auto px-6 relative z-10">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                            {/* Left — statement */}
                            <div className="reveal-left">
                                <div className="flex items-center gap-4 mb-8">
                                    <ShieldAlert className="w-8 h-8 text-accent-red flex-shrink-0" />
                                    <span className="text-white/50 font-mono text-xs tracking-[0.3em] uppercase">
                                        {pageCopy.paymentBadge}
                                    </span>
                                </div>
                                <blockquote className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white leading-[1.15]">
                                    {pageCopy.paymentHeadline1}<br />
                                    <span className="text-accent-red italic">{pageCopy.paymentHeadline2}</span>
                                </blockquote>
                            </div>

                            {/* Right — explanation */}
                            <div className="reveal-right space-y-6">
                                <p className="text-white/75 text-lg leading-relaxed font-light">
                                    {pageCopy.paymentText1}
                                </p>
                                <p className="text-white/55 text-base leading-relaxed font-light">
                                    {pageCopy.paymentText2}
                                </p>
                                <a
                                    href="#kontaktny-formular"
                                    className="inline-flex items-center gap-3 mt-4 px-7 py-3.5 bg-accent-red text-white rounded-full font-bold tracking-wide hover:bg-accent-red/90 transition-all shadow-lg shadow-accent-red/20 group"
                                >
                                    <Phone className="w-4 h-4" />
                                    <span>{pageCopy.paymentCta}</span>
                                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ─── SECTION 3: Transparentnosť — tri piliere ───────────────────────── */}
                <section className="reveal smooth-reveal py-20 md:py-32 bg-white">
                    <div className="container mx-auto px-6">
                        <div className="rv-child text-center mb-16">
                            <span className="text-navy/40 font-mono text-xs tracking-[0.3em] uppercase mb-4 block">
                                {pageCopy.approachBadge}
                            </span>
                            <h2 className="text-4xl md:text-5xl font-serif font-bold text-navy leading-tight">
                                {pageCopy.approachTitle}
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                            {pageCopy.pillars.map((pillar, i) => (
                                <div
                                    key={i}
                                    className="rv-child group relative flex flex-col items-center text-center px-6 md:px-8 py-12 rounded-[2rem] border border-navy/8 bg-cream hover:bg-navy hover:border-navy transition-all duration-500 hover:shadow-2xl hover:shadow-navy/15 hover:-translate-y-2"
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
                                </div>
                            ))}
                        </div>

                        {/* Final CTA */}
                        <div className="rv-child text-center">
                            <p className="text-charcoal/60 text-lg mb-6 font-light">
                                {pageCopy.finalText}
                            </p>
                            <a
                                href="#kontaktny-formular"
                                className="inline-flex items-center gap-3 px-10 py-4 bg-navy text-white rounded-full font-bold tracking-wide hover:bg-navy/90 transition-all shadow-lg shadow-navy/20 group"
                            >
                                <span>{pageCopy.finalCta}</span>
                                <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                            </a>
                        </div>
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
