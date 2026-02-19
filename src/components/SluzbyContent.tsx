'use client';

import { motion } from 'framer-motion';
import { Home, Key, Briefcase, Building2, ArrowUpRight, Check, Phone, TrendingUp, Camera, FileText, Shield, Users, BarChart3, Landmark, Wrench, Receipt, MapPin, Target, Megaphone, ShoppingBag, Headphones, Award, Heart } from 'lucide-react';
import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Footer } from '@/components/Footer';
import WhyFriscoHeroSplit from './WhyFriscoHeroSplit';
import { FamilyBusinessSection } from '@/components/FamilyBusinessSection';


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
  return (
    <div className="min-h-screen bg-cream">
      <div className="animate-in fade-in duration-700">
        <WhyFriscoHeroSplit />

        <FamilyBusinessSection />

        {/* Values Section */}
        <section className="py-16 md:py-20 bg-gradient-to-b from-cream to-white relative overflow-hidden">
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
                  Naše hodnoty
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl lg:text-[3.5rem] font-serif font-bold text-navy tracking-tight mb-5">
                Na čom si <span className="text-accent-red italic">zakladáme</span>
              </h2>
              <p className="text-charcoal/60 text-base md:text-lg lg:text-xl leading-relaxed max-w-xl mx-auto">
                Princípy, ktoré nás vedú pri každom obchode. Aby ste presne vedeli, čo od nás môžete očakávať.
              </p>
            </motion.div>

            <div className="max-w-7xl mx-auto">
              {/* Three core values in a row */}
              <ValuesSection values={values} fadeInUp={fadeInUp} staggerContainer={staggerContainer} />


            </div>
          </div>
        </section>



        {/* CTA Section */}
        <section className="py-16 md:py-20 bg-cream">
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
                    Ozvite sa nám
                  </span>
                  <h2 className="text-3xl md:text-5xl font-serif font-bold text-navy tracking-tight mb-4">
                    Radi Vám <span className="text-accent-red italic">poradíme</span>
                  </h2>
                  <p className="text-charcoal/60 text-lg max-w-xl">
                    Máte otázku o predaji, kúpe alebo prenájme? Zavolajte nám alebo napíšte — odpovieme do 24 hodín.
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
                    <span>Napíšte nám</span>
                    <ArrowUpRight className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
};

const ValuesSection = ({ values, fadeInUp, staggerContainer }: { values: any[], fadeInUp: any, staggerContainer: any }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Only run GSAP context on mobile/tablet
    const ctx = gsap.context(() => {
      ScrollTrigger.matchMedia({
        // Mobile only (up to 768px for safety, matching md breakpoint)
        "(max-width: 767px)": function () {
          if (!containerRef.current || !sectionRef.current) return;

          const container = containerRef.current;
          const totalWidth = container.scrollWidth;
          const viewportWidth = container.offsetWidth;

          gsap.to(container, {
            x: () => -(totalWidth - viewportWidth + 48), // 48px padding buffer
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              pin: true,
              scrub: 1,
              start: "center center",
              end: () => "+=" + (totalWidth),
              invalidateOnRefresh: true,
            }
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="max-w-7xl mx-auto overflow-hidden md:overflow-visible py-10 md:py-0">
      <motion.div
        ref={containerRef}
        className="flex md:grid md:grid-cols-3 gap-6 lg:gap-8 w-max md:w-auto px-4 md:px-0"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "0px" }}
        variants={staggerContainer}
      >
        {/* We map specific items like in the original code: [0,1,2] */}
        {[values[0], values[1], values[2]].map((value, index) => (
          <motion.div
            key={value.id}
            variants={fadeInUp}
            className="flex-shrink-0 w-[85vw] md:w-auto h-auto group relative bg-white rounded-[2rem] p-6 md:p-10 border border-navy/[0.06] shadow-[0_4px_24px_-6px_rgba(30,58,95,0.08)] hover:shadow-[0_12px_48px_-12px_rgba(30,58,95,0.15)] transition-all duration-500"
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
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Sluzby;
