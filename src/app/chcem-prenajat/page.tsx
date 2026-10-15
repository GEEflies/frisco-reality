import ChcemPrenajatContent from '@/components/ChcemPrenajatContent';
import type { Metadata } from 'next';
import { SITE_URL, getServiceSchema, getBreadcrumbSchema, getFAQSchema } from '@/config/seo';
import { buildPageSocialMetadata, resolveServerLanguage } from '@/i18n/serverLanguage';
import type { LanguageCode } from '@/i18n/types';

const COPY: Record<LanguageCode, {
  metaTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  serviceName: string;
  serviceDescription: string;
  breadcrumbHome: string;
  breadcrumbPage: string;
  faqs: { question: string; answer: string }[];
}> = {
  sk: {
    metaTitle: 'Prenájom nehnuteľnosti – nájomca a správa',
    metaDescription: 'Prenajmite svoju nehnuteľnosť s istotou cez FRISCO Reality. Nájdeme vám spoľahlivého nájomcu, pripravíme nájomnú zmluvu a postaráme sa o celý proces prenájmu od A po Z.',
    ogTitle: 'Chcem prenajať nehnuteľnosť | FRISCO Reality',
    ogDescription: 'Nájdeme vám ideálneho nájomcu. Kompletný servis pri prenájme nehnuteľností.',
    serviceName: 'Prenájom nehnuteľností',
    serviceDescription: 'Kompletný servis pri prenájme – nájdenie spoľahlivého nájomcu, príprava nájomnej zmluvy, foto prezentácia a správa prenájmu.',
    breadcrumbHome: 'Domov',
    breadcrumbPage: 'Chcem prenajať',
    faqs: [
      { question: 'Ako nájsť spoľahlivého nájomcu?', answer: 'FRISCO Reality overuje každého nájomcu, kontroluje bonitu a referencie. Postaráme sa o kvalitný výber, aby ste mali istotu spoľahlivého prenájmu.' },
      { question: 'Čo zahŕňa servis pri prenájme?', answer: 'Náš servis zahŕňa profesionálnu prezentáciu nehnuteľnosti, vyhľadanie a overenie nájomcov, prípravu nájomnej zmluvy a odovzdanie nehnuteľnosti.' },
    ],
  },
  en: {
    metaTitle: 'Rent out a property – full rental management',
    metaDescription: 'Rent out your property with confidence via FRISCO Reality. We find reliable tenants, prepare agreements, and handle the full rental process.',
    ogTitle: 'Rent out a property | FRISCO Reality',
    ogDescription: 'We find qualified tenants and manage the full rental process for you.',
    serviceName: 'Property rental management',
    serviceDescription: 'Complete rental service: tenant sourcing and screening, contract preparation, presentation, and ongoing rental support.',
    breadcrumbHome: 'Home',
    breadcrumbPage: 'I want to rent out',
    faqs: [
      { question: 'How do you find reliable tenants?', answer: 'We screen applicants, verify financial reliability and references, and select tenants with long-term rental fit.' },
      { question: 'What is included in the rental service?', answer: 'We provide property presentation, tenant sourcing and screening, contract preparation, and handover support.' },
    ],
  },
  de: {
    metaTitle: 'Immobilie vermieten – Mietersuche und Verwaltung',
    metaDescription: 'Vermieten Sie Ihre Immobilie sicher mit FRISCO Reality. Wir finden zuverlässige Mieter, erstellen den Mietvertrag und begleiten den gesamten Vermietungsprozess.',
    ogTitle: 'Immobilie vermieten | FRISCO Reality',
    ogDescription: 'Wir finden passende Mieter und übernehmen den kompletten Vermietungsservice.',
    serviceName: 'Immobilienvermietung',
    serviceDescription: 'Komplettservice bei der Vermietung: Mietersuche und Prüfung, Vertragsvorbereitung, Präsentation und laufende Betreuung.',
    breadcrumbHome: 'Startseite',
    breadcrumbPage: 'Ich möchte vermieten',
    faqs: [
      { question: 'Wie finden Sie zuverlässige Mieter?', answer: 'Wir prüfen Interessenten, Bonität und Referenzen und wählen passende Langzeitmieter aus.' },
      { question: 'Was umfasst Ihr Vermietungsservice?', answer: 'Der Service umfasst Präsentation, Mietersuche, Prüfung, Vertragserstellung und Unterstützung bei der Übergabe.' },
    ],
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const language = await resolveServerLanguage();
  const copy = COPY[language];
  const path = '/chcem-prenajat';

  return {
    title: copy.metaTitle,
    description: copy.metaDescription,
    ...buildPageSocialMetadata({ title: copy.ogTitle, description: copy.ogDescription, path, language }),
  };
}

export default async function ChcemPrenajatPage() {
  const language = await resolveServerLanguage();
  const copy = COPY[language];

  const serviceJsonLd = getServiceSchema({
    name: copy.serviceName,
    description: copy.serviceDescription,
    url: `${SITE_URL}/chcem-prenajat`,
  }, language);
  const breadcrumbJsonLd = getBreadcrumbSchema([
    { name: copy.breadcrumbHome, url: SITE_URL },
    { name: copy.breadcrumbPage, url: `${SITE_URL}/chcem-prenajat` },
  ]);
  const faqJsonLd = getFAQSchema(copy.faqs);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <ChcemPrenajatContent />
    </>
  );
}
