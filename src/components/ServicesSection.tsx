'use client';

import { Home, Key, Briefcase, Building2, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageProvider';
const property1 = '/property-1.jpg';
const property3 = '/property-3.jpg';
const heroProperty = '/hero-property.jpg';

const services = [
  {
    id: '01',
    title: 'Predaj',
    subtitle: 'Exkluzívne Nehnuteľnosti',
    description: 'Kompletný servis pre predaj vašej nehnuteľnosti. Profesionálna prezentácia, marketing na svetovej úrovni a vyjednávanie najvyššej možnej ceny.',
    icon: Home,
    image: property1
  },
  {
    id: '02',
    title: 'Prenájom',
    subtitle: 'Bezstarostný Manažment',
    description: 'Nájdeme pre vás ideálneho nájomníka a postaráme sa o všetku administratívu. Garantujeme bezpečnosť a pravidelný výnos.',
    icon: Key,
    image: property3
  },
  {
    id: '03',
    title: 'Investície',
    subtitle: 'Rast & Dividendy',
    description: 'Investičné poradenstvo pre náročných. Analýza trhu, ROI kalkulácie a správa investičného portfólia pre maximálnu návratnosť.',
    icon: Briefcase,
    image: heroProperty
  },
  {
    id: '04',
    title: 'Development',
    subtitle: 'Projekty Budúcnosti',
    description: 'Spolupráca s developermi od akvizície pozemkov až po marketing a predaj koncovým klientom.',
    icon: Building2,
    image: property1
  }
];

export const ServicesSection = () => {
  const { language } = useLanguage();
  const copy = {
    sk: {
      headingLabel: 'Naše Služby',
      headingStart: 'Komplexné riešenia pre',
      headingAccent: 'vašu nehnuteľnosť',
      serviceLabel: 'Služba',
      moreInfo: 'Viac informácií',
      services: [
        { title: 'Predaj', subtitle: 'Exkluzívne Nehnuteľnosti', description: 'Kompletný servis pre predaj vašej nehnuteľnosti. Profesionálna prezentácia, marketing na svetovej úrovni a vyjednávanie najvyššej možnej ceny.' },
        { title: 'Prenájom', subtitle: 'Bezstarostný Manažment', description: 'Nájdeme pre vás ideálneho nájomníka a postaráme sa o všetku administratívu. Garantujeme bezpečnosť a pravidelný výnos.' },
        { title: 'Investície', subtitle: 'Rast & Dividendy', description: 'Investičné poradenstvo pre náročných. Analýza trhu, ROI kalkulácie a správa investičného portfólia pre maximálnu návratnosť.' },
        { title: 'Development', subtitle: 'Projekty Budúcnosti', description: 'Spolupráca s developermi od akvizície pozemkov až po marketing a predaj koncovým klientom.' },
      ],
    },
    en: {
      headingLabel: 'Our Services',
      headingStart: 'Comprehensive solutions for',
      headingAccent: 'your property',
      serviceLabel: 'Service',
      moreInfo: 'More information',
      services: [
        { title: 'Sales', subtitle: 'Exclusive Properties', description: 'Complete service for selling your property. Professional presentation, world-class marketing, and negotiation of the best possible price.' },
        { title: 'Rentals', subtitle: 'Hassle-Free Management', description: 'We find the right tenant and handle all administration. We ensure security and stable returns.' },
        { title: 'Investments', subtitle: 'Growth & Returns', description: 'Investment advisory for demanding clients. Market analysis, ROI calculations, and portfolio management for maximum return.' },
        { title: 'Development', subtitle: 'Future Projects', description: 'Cooperation with developers from land acquisition to marketing and final sales.' },
      ],
    },
    de: {
      headingLabel: 'Unsere Leistungen',
      headingStart: 'Umfassende Lösungen für',
      headingAccent: 'Ihre Immobilie',
      serviceLabel: 'Leistung',
      moreInfo: 'Mehr Informationen',
      services: [
        { title: 'Verkauf', subtitle: 'Exklusive Immobilien', description: 'Komplettservice für den Verkauf Ihrer Immobilie. Professionelle Präsentation, erstklassiges Marketing und Verhandlung des bestmöglichen Preises.' },
        { title: 'Vermietung', subtitle: 'Sorgloses Management', description: 'Wir finden den idealen Mieter und übernehmen die gesamte Administration. Wir garantieren Sicherheit und stabile Einnahmen.' },
        { title: 'Investitionen', subtitle: 'Wachstum & Rendite', description: 'Investmentberatung für anspruchsvolle Kunden. Marktanalyse, ROI-Berechnungen und Portfoliomanagement für maximale Rendite.' },
        { title: 'Development', subtitle: 'Projekte der Zukunft', description: 'Zusammenarbeit mit Entwicklern von der Grundstücksakquise bis zu Marketing und Endverkauf.' },
      ],
    },
  }[language];

  const localizedServices = services.map((service, index) => ({
    ...service,
    title: copy.services[index]?.title ?? service.title,
    subtitle: copy.services[index]?.subtitle ?? service.subtitle,
    description: copy.services[index]?.description ?? service.description,
  }));

  return (
    <section id="services-section" className="bg-cream py-24 overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-20 max-w-2xl mx-auto">
          <span className="block text-navy font-mono text-xs tracking-[0.2em] mb-4 uppercase">
            {copy.headingLabel}
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-navy mb-6">
            {copy.headingStart} <br />
            <span className="text-accent-red italic font-light">{copy.headingAccent}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-8 md:gap-12">
          {localizedServices.map((service, index) => (
            <div key={service.id} className={`flex flex-col ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} bg-white border border-navy/5 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300`}>
              {/* Text Side */}
              <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-6 text-navy/40">
                  <span className="text-xs font-mono tracking-widest uppercase">{copy.serviceLabel}</span>
                  <div className="h-px w-8 bg-navy/10" />
                  <span className="text-xs font-mono">{service.id}</span>
                </div>

                <h3 className="text-3xl md:text-4xl font-serif font-bold text-navy mb-2">
                  {service.title}
                </h3>
                <p className="text-lg text-accent-red font-light italic mb-6">
                  {service.subtitle}
                </p>

                <p className="text-charcoal/70 leading-relaxed mb-8 max-w-md">
                  {service.description}
                </p>

                <button className="group flex items-center gap-3 text-navy border-b border-navy/20 pb-2 hover:border-navy transition-all duration-300 w-fit">
                  <span className="uppercase tracking-widest text-xs font-medium">{copy.moreInfo}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>

              {/* Image Side */}
              <div className="w-full md:w-1/2 min-h-[300px] md:min-h-[400px] relative">
                <img
                  src={service.image}
                  alt={service.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-navy/10" />

                {/* Icon Badge */}
                <div className="absolute top-6 right-6 w-14 h-14 bg-white/90 backdrop-blur-sm border border-navy/10 flex items-center justify-center text-navy rounded-full shadow-lg">
                  <service.icon className="w-6 h-6" strokeWidth={1.5} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
