'use client';

import { motion } from 'framer-motion';
import { Home, Key, Briefcase, Building2, ArrowUpRight, Check, Phone, TrendingUp, Camera, FileText, Shield, Users, BarChart3, Landmark, Wrench, Receipt, MapPin, Target, Megaphone, ShoppingBag, Headphones, Award, Heart } from 'lucide-react';
import { Footer } from '@/components/Footer';
import WhyFriscoHeroSplit from './WhyFriscoHeroSplit';
import { FamilyBusinessSection } from '@/components/FamilyBusinessSection';
import { useLanguage } from '@/i18n/LanguageProvider';


const leftBlueprint = '/left.png';
const rightBlueprint = '/right.png';

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

const services = [
  {
    id: '01',
    title: 'Predaj nehnuteľností',
    subtitle: 'Maximálna hodnota, minimálne starosti',
    description: 'Kompletný servis pre predaj vašej nehnuteľnosti. Od profesionálnej prezentácie cez marketing na svetovej úrovni až po vyjednávanie najvyššej možnej ceny.',
    icon: Home,
    color: 'bg-accent-red',
    features: [
      { icon: Camera, text: 'Profesionálne fotografie a video' },
      { icon: Target, text: 'Virtuálna prehliadka 360°' },
      { icon: Megaphone, text: 'Marketing na prémiových portáloch' },
      { icon: FileText, text: 'Právne poradenstvo' },
      { icon: TrendingUp, text: 'Vyjednávanie najlepšej ceny' },
    ]
  },
  {
    id: '02',
    title: 'Prenájom',
    subtitle: 'Bezstarostný príjem z prenájmu',
    description: 'Nájdeme pre vás ideálneho nájomníka a postaráme sa o všetku administratívu. Garantujeme bezpečnosť a pravidelný výnos z vašej nehnuteľnosti.',
    icon: Key,
    color: 'bg-navy',
    features: [
      { icon: Users, text: 'Výber spoľahlivých nájomníkov' },
      { icon: FileText, text: 'Príprava nájomných zmlúv' },
      { icon: Shield, text: 'Správa nehnuteľnosti' },
      { icon: Wrench, text: 'Riešenie opráv a údržby' },
      { icon: Receipt, text: 'Inkaso nájomného' },
    ]
  },
  {
    id: '03',
    title: 'Investičné poradenstvo',
    subtitle: 'Zhodnoťte svoje peniaze',
    description: 'Investičné poradenstvo pre náročných. Analýza trhu, ROI kalkulácie a správa investičného portfólia pre maximálnu návratnosť vašich investícií.',
    icon: Briefcase,
    color: 'bg-accent-red',
    features: [
      { icon: BarChart3, text: 'Analýza investičných príležitostí' },
      { icon: TrendingUp, text: 'Kalkulácia návratnosti investície' },
      { icon: Landmark, text: 'Správa portfólia nehnuteľností' },
      { icon: Receipt, text: 'Daňové poradenstvo' },
      { icon: Shield, text: 'Financovanie a hypotéky' },
    ]
  },
  {
    id: '04',
    title: 'Development',
    subtitle: 'Projekty budúcnosti',
    description: 'Spolupráca s developermi od akvizície pozemkov až po marketing a predaj koncovým klientom. Komplexné riešenia pre developerské projekty.',
    icon: Building2,
    color: 'bg-navy',
    features: [
      { icon: MapPin, text: 'Akvizícia pozemkov' },
      { icon: Target, text: 'Analýza lokality' },
      { icon: Megaphone, text: 'Marketingová stratégia' },
      { icon: ShoppingBag, text: 'Predaj off-plan' },
      { icon: Headphones, text: 'Popredajný servis' },
    ]
  }
];

const processSteps = [
  { step: '01', title: 'Konzultácia', description: 'Stretneme sa a prediskutujeme vaše potreby a ciele.' },
  { step: '02', title: 'Analýza', description: 'Pripravíme detailnú analýzu trhu a odporúčania.' },
  { step: '03', title: 'Realizácia', description: 'Implementujeme dohodnutú stratégiu s maximálnou efektivitou.' },
  { step: '04', title: 'Úspech', description: 'Dosiahneme váš cieľ a zabezpečíme bezproblémový priebeh.' }
];

const values = [
  {
    id: '01',
    icon: Shield,
    title: 'Transparentnosť',
    description: 'Žiadne skryté poplatky, žiadne nepríjemné prekvapenia. Vždy viete, čo sa deje a aké sú ďalšie kroky. Otvorená komunikácia je pre nás samozrejmosťou.',
    color: 'bg-navy/5'
  },
  {
    id: '02',
    icon: Users,
    title: 'Osobný prístup',
    description: 'Každý klient má svojho realitného agenta, ktorý pozná jeho situáciu aj priority. Nie ste číslo v databáze, ale náš partner.',
    color: 'bg-accent-red/5'
  },
  {
    id: '03',
    icon: Award,
    title: 'Odborná expertíza',
    description: 'Dlhoročné skúsenosti na lokálnom trhu nám umožňujú správne nastaviť cenu, vyjednávať podmienky a chrániť vaše záujmy.',
    color: 'bg-navy/5'
  },
  {
    id: '04',
    icon: Heart,
    title: 'Vášeň',
    description: 'Milujeme, čo robíme. Každá nehnuteľnosť je pre nás príbeh a každý klient je náš partner.',
    color: 'bg-accent-red/5'
  }
];



const Sluzby = () => {
  const { language } = useLanguage();
  const copy = {
    sk: {
      valuesBadge: 'Naše hodnoty',
      valuesTitleStart: 'Na čom si',
      valuesTitleAccent: 'zakladáme',
      valuesSubtitle: 'Princípy, ktoré nás vedú pri každom obchode. Aby ste presne vedeli, čo od nás môžete očakávať.',
      ctaLabel: 'Ozvite sa nám',
      ctaTitleStart: 'Radi Vám',
      ctaTitleAccent: 'poradíme',
      ctaText: 'Máte otázku o predaji, kúpe alebo prenájme? Zavolajte nám alebo napíšte — odpovieme do 24 hodín.',
      ctaWrite: 'Napíšte nám',
      values: [
        { title: 'Transparentnosť', description: 'Žiadne skryté poplatky, žiadne nepríjemné prekvapenia. Vždy viete, čo sa deje a aké sú ďalšie kroky. Otvorená komunikácia je pre nás samozrejmosťou.' },
        { title: 'Osobný prístup', description: 'Každý klient má svojho realitného agenta, ktorý pozná jeho situáciu aj priority. Nie ste číslo v databáze, ale náš partner.' },
        { title: 'Odborná expertíza', description: 'Dlhoročné skúsenosti na lokálnom trhu nám umožňujú správne nastaviť cenu, vyjednávať podmienky a chrániť vaše záujmy.' },
        { title: 'Vášeň', description: 'Milujeme, čo robíme. Každá nehnuteľnosť je pre nás príbeh a každý klient je náš partner.' },
      ],
    },
    en: {
      valuesBadge: 'Our values',
      valuesTitleStart: 'What we',
      valuesTitleAccent: 'stand for',
      valuesSubtitle: 'Principles that guide us in every deal, so you always know what to expect from us.',
      ctaLabel: 'Get in touch',
      ctaTitleStart: 'We are happy to',
      ctaTitleAccent: 'advise you',
      ctaText: 'Have a question about selling, buying, or renting? Call or write to us — we reply within 24 hours.',
      ctaWrite: 'Write to us',
      values: [
        { title: 'Transparency', description: 'No hidden fees and no unpleasant surprises. You always know what is happening and what comes next. Open communication is standard for us.' },
        { title: 'Personal approach', description: 'Each client has a dedicated agent who understands their situation and priorities. You are not a database entry, but our partner.' },
        { title: 'Professional expertise', description: 'Years of local market experience help us set the right price, negotiate terms, and protect your interests.' },
        { title: 'Passion', description: 'We love what we do. Every property is a story for us, and every client is our partner.' },
      ],
    },
    de: {
      valuesBadge: 'Unsere Werte',
      valuesTitleStart: 'Worauf wir',
      valuesTitleAccent: 'bauen',
      valuesSubtitle: 'Prinzipien, die uns bei jedem Geschäft leiten, damit Sie genau wissen, was Sie von uns erwarten können.',
      ctaLabel: 'Kontaktieren Sie uns',
      ctaTitleStart: 'Wir',
      ctaTitleAccent: 'beraten Sie gerne',
      ctaText: 'Haben Sie Fragen zu Verkauf, Kauf oder Vermietung? Rufen Sie uns an oder schreiben Sie uns — wir antworten innerhalb von 24 Stunden.',
      ctaWrite: 'Schreiben Sie uns',
      values: [
        { title: 'Transparenz', description: 'Keine versteckten Gebühren, keine unangenehmen Überraschungen. Sie wissen immer, was gerade passiert und was als Nächstes kommt. Offene Kommunikation ist für uns selbstverständlich.' },
        { title: 'Persönlicher Ansatz', description: 'Jeder Kunde hat einen festen Makler, der seine Situation und Prioritäten kennt. Sie sind keine Nummer in einer Datenbank, sondern unser Partner.' },
        { title: 'Fachliche Expertise', description: 'Langjährige Erfahrung im lokalen Markt hilft uns, den richtigen Preis zu setzen, Bedingungen zu verhandeln und Ihre Interessen zu schützen.' },
        { title: 'Leidenschaft', description: 'Wir lieben, was wir tun. Jede Immobilie ist für uns eine Geschichte, und jeder Kunde ist unser Partner.' },
      ],
    },
  }[language];

  const localizedValues = values.map((value, index) => ({
    ...value,
    title: copy.values[index]?.title ?? value.title,
    description: copy.values[index]?.description ?? value.description,
  }));

  return (
    <div className="min-h-screen bg-cream">
        <WhyFriscoHeroSplit />

        <FamilyBusinessSection />

        {/* Values Section */}
        <section className="reveal py-16 md:py-20 bg-gradient-to-b from-cream to-white relative overflow-visible">
          {/* Decorative background elements */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-navy/10 to-transparent" />
          <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-accent-red/[0.03] rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-20 left-0 w-[400px] h-[400px] bg-navy/[0.03] rounded-full blur-[100px] pointer-events-none" />

          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="text-center max-w-3xl mx-auto mb-14 md:mb-20"
            >
              {/* Badge — matching FamilyBusinessSection */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-red/5 border border-accent-red/10 mb-6">
                <Shield className="w-4 h-4 text-accent-red" />
                <span className="text-xs font-bold tracking-widest text-accent-red uppercase">
                  {copy.valuesBadge}
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl lg:text-[3.5rem] font-serif font-bold text-navy tracking-tight mb-5">
                {copy.valuesTitleStart} <span className="text-accent-red italic">{copy.valuesTitleAccent}</span>
              </h2>
              <p className="text-charcoal/60 text-base md:text-lg lg:text-xl leading-relaxed max-w-xl mx-auto">
                {copy.valuesSubtitle}
              </p>
            </motion.div>

            <div className="max-w-7xl mx-auto">
              {/* Three core values in a row */}
              <ValuesSection values={localizedValues} />


            </div>
          </div>
        </section>



        {/* CTA Section */}
        <section className="reveal py-16 md:py-20 bg-cream">
          <div className="container mx-auto px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="relative rounded-3xl bg-gradient-to-br from-navy/5 via-white to-white border border-navy/10 p-8 md:p-20 overflow-hidden shadow-lg"
            >
              <div className="absolute top-0 right-0 w-96 h-96 bg-navy/5 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="text-center lg:text-left">
                  <span className="text-navy font-mono text-xs tracking-[0.3em] uppercase mb-4 block">
                    {copy.ctaLabel}
                  </span>
                  <h2 className="text-3xl md:text-5xl font-serif font-bold text-navy tracking-tight mb-4">
                    {copy.ctaTitleStart} <span className="text-accent-red italic">{copy.ctaTitleAccent}</span>
                  </h2>
                  <p className="text-charcoal/60 text-lg max-w-xl">
                    {copy.ctaText}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="tel:+421905447220"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-navy text-white rounded-full font-bold tracking-wide hover:bg-navy/90 transition-colors shadow-lg"
                  >
                    <Phone className="w-5 h-5" />
                    <span>0905 447 220</span>
                  </a>
                  <a
                    href="/kontakt"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-accent-red text-white rounded-full font-bold tracking-wide hover:bg-accent-red/90 transition-colors shadow-lg shadow-accent-red/20"
                  >
                    <span>{copy.ctaWrite}</span>
                    <ArrowUpRight className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
    </div>
  );
};

const ValuesSection = ({ values }: { values: any[], fadeInUp?: any, staggerContainer?: any }) => {
  return (
    <div className="max-w-7xl mx-auto py-10 md:py-0">
      {/* Mobile: snap-scroll carousel, Desktop: 3-col grid */}
      <div
        className="flex md:grid md:grid-cols-3 gap-6 lg:gap-8 md:w-auto px-4 md:px-0 overflow-x-auto md:overflow-visible snap-x snap-mandatory scrollbar-hide -mx-4 md:mx-0"
      >
        {[values[0], values[1], values[2]].map((value, index) => (
          <div
            key={value.id}
            className="flex-shrink-0 w-[85vw] md:w-auto snap-center h-auto group relative bg-white rounded-[2rem] p-6 md:p-10 border border-navy/[0.06] shadow-[0_4px_24px_-6px_rgba(30,58,95,0.08)] hover:shadow-[0_12px_48px_-12px_rgba(30,58,95,0.15)] transition-all duration-500"
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 ${index === 0 ? 'bg-navy/[0.06] text-navy group-hover:bg-navy/[0.1]' :
              index === 1 ? 'bg-accent-red/[0.08] text-accent-red group-hover:bg-accent-red/[0.12]' :
                'bg-navy/[0.06] text-navy group-hover:bg-navy/[0.1]'
              }`}>
              <value.icon className="w-7 h-7" strokeWidth={1.5} />
            </div>

            <h3 className="text-2xl md:text-2xl lg:text-[1.65rem] font-serif font-bold text-navy mb-3">
              {value.title}
            </h3>

            <p className="text-charcoal/60 leading-relaxed text-[15px] md:text-base lg:text-[1.05rem]">
              {value.description}
            </p>
          </div>
        ))}
      </div>
      {/* Scroll dots indicator for mobile */}
      <div className="flex justify-center gap-2 mt-4 md:hidden">
        {[0, 1, 2].map((i) => (
          <div key={i} className="w-2 h-2 rounded-full bg-navy/15" />
        ))}
      </div>
    </div>
  );
};

export default Sluzby;
