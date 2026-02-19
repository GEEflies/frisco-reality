import ChcemPredatContent from '@/components/ChcemPredatContent';
import type { Metadata } from 'next';
import { SITE_URL, getServiceSchema, getBreadcrumbSchema, getFAQSchema } from '@/config/seo';
import { buildLanguageAlternates, resolveServerLanguage } from '@/i18n/serverLanguage';
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
    metaTitle: 'Chcem predať nehnuteľnosť – bezplatné ohodnotenie a predaj',
    metaDescription: 'Predajte svoju nehnuteľnosť rýchlo a za najlepšiu cenu s Frisco Reality. Bezplatné ohodnotenie, profesionálny home staging, prémiová prezentácia a kompletný právny servis.',
    ogTitle: 'Chcem predať nehnuteľnosť | Frisco Reality',
    ogDescription: 'Predajte nehnuteľnosť za najlepšiu cenu. Bezplatné ohodnotenie a kompletný servis.',
    serviceName: 'Predaj nehnuteľností',
    serviceDescription: 'Kompletný servis pri predaji nehnuteľnosti – od bezplatného ohodnotenia cez home staging, profesionálnu foto a video prezentáciu až po právny servis a odovzdanie.',
    breadcrumbHome: 'Domov',
    breadcrumbPage: 'Chcem predať',
    faqs: [
      { question: 'Ako prebieha predaj nehnuteľnosti s Frisco Reality?', answer: 'Proces predaja začína bezplatným ohodnotením, nasleduje profesionálna príprava nehnuteľnosti (home staging, fotenie), aktívny marketing, obhliadky a kompletný právny servis až do odovzdania kľúčov.' },
      { question: 'Koľko stojí predaj nehnuteľnosti cez Frisco Reality?', answer: 'Ohodnotenie nehnuteľnosti je bezplatné. Provízne podmienky sú transparentné a dohodnuté vopred, bez skrytých poplatkov.' },
      { question: 'Ako dlho trvá predaj nehnuteľnosti?', answer: 'Doba predaja závisí od typu nehnuteľnosti a lokality. Vďaka prémiovej prezentácii a aktívnemu marketingu dosahujeme spravidla kratší čas predaja než trhový priemer.' },
    ],
  },
  en: {
    metaTitle: 'I want to sell a property – free valuation and sales service',
    metaDescription: 'Sell your property faster and at the right price with Frisco Reality. Free valuation, home staging, premium presentation, and complete legal support.',
    ogTitle: 'Sell a property | Frisco Reality',
    ogDescription: 'Sell your property at the best achievable price with full support.',
    serviceName: 'Property sales service',
    serviceDescription: 'End-to-end support for property sales: free valuation, home staging, premium photos and video, legal service, and handover.',
    breadcrumbHome: 'Home',
    breadcrumbPage: 'I want to sell',
    faqs: [
      { question: 'How does selling with Frisco Reality work?', answer: 'We start with a free valuation, then prepare the property for market, run active marketing, manage viewings, and complete legal closing and handover.' },
      { question: 'How much does the service cost?', answer: 'Valuation is free. Commission terms are transparent and agreed in advance with no hidden fees.' },
      { question: 'How long does a sale usually take?', answer: 'Timing depends on property type and location. Our premium presentation and active marketing typically reduce time on market.' },
    ],
  },
  de: {
    metaTitle: 'Ich möchte eine Immobilie verkaufen – kostenlose Bewertung und Verkauf',
    metaDescription: 'Verkaufen Sie Ihre Immobilie schneller und zum passenden Preis mit Frisco Reality. Kostenlose Bewertung, Home Staging, Premium-Präsentation und kompletter Rechtsservice.',
    ogTitle: 'Immobilie verkaufen | Frisco Reality',
    ogDescription: 'Verkaufen Sie Ihre Immobilie zum bestmöglichen Preis mit Komplettservice.',
    serviceName: 'Immobilienverkauf',
    serviceDescription: 'Komplettservice für den Verkauf: kostenlose Bewertung, Home Staging, Premium-Foto- und Videopräsentation, Rechtsservice und Übergabe.',
    breadcrumbHome: 'Startseite',
    breadcrumbPage: 'Ich möchte verkaufen',
    faqs: [
      { question: 'Wie läuft der Verkauf mit Frisco Reality ab?', answer: 'Wir starten mit einer kostenlosen Bewertung, bereiten die Immobilie professionell vor, vermarkten aktiv, organisieren Besichtigungen und begleiten den rechtlichen Abschluss.' },
      { question: 'Was kostet der Verkauf über Frisco Reality?', answer: 'Die Bewertung ist kostenlos. Provisionsbedingungen sind transparent, vorab vereinbart und ohne versteckte Gebühren.' },
      { question: 'Wie lange dauert ein Verkauf?', answer: 'Die Dauer hängt von Immobilientyp und Lage ab. Durch Premium-Präsentation und aktives Marketing wird die Vermarktungszeit meist verkürzt.' },
    ],
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const language = await resolveServerLanguage();
  const copy = COPY[language];
  const path = '/chcem-predat';

  return {
    title: copy.metaTitle,
    description: copy.metaDescription,
    alternates: buildLanguageAlternates(path),
    openGraph: {
      title: copy.ogTitle,
      description: copy.ogDescription,
      url: `${SITE_URL}${path}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: copy.ogTitle,
      description: copy.ogDescription,
    },
  };
}

export default async function ChcemPredatPage() {
  const language = await resolveServerLanguage();
  const copy = COPY[language];

  const serviceJsonLd = getServiceSchema({
    name: copy.serviceName,
    description: copy.serviceDescription,
    url: `${SITE_URL}/chcem-predat`,
  }, language);
  const breadcrumbJsonLd = getBreadcrumbSchema([
    { name: copy.breadcrumbHome, url: SITE_URL },
    { name: copy.breadcrumbPage, url: `${SITE_URL}/chcem-predat` },
  ]);
  const faqJsonLd = getFAQSchema(copy.faqs);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <ChcemPredatContent />
    </>
  );
}
