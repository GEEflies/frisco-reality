import PredajAPrenajomContent from '@/components/PredajAPrenajomContent';
import type { Metadata } from 'next';
import { SITE_URL, getBreadcrumbSchema } from '@/config/seo';
import { buildLanguageAlternates, resolveServerLanguage } from '@/i18n/serverLanguage';
import type { LanguageCode } from '@/i18n/types';

const COPY: Record<LanguageCode, {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  breadcrumbHome: string;
  breadcrumbPage: string;
}> = {
  sk: {
    title: 'Predaj a prenájom nehnuteľností na Slovensku',
    description: 'Komplexné služby predaja a prenájmu nehnuteľností s Frisco Reality. Byty, domy, pozemky a komerčné priestory na Slovensku.',
    ogTitle: 'Predaj a prenájom nehnuteľností | Frisco Reality',
    ogDescription: 'Komplexné služby predaja a prenájmu nehnuteľností na Slovensku.',
    breadcrumbHome: 'Domov',
    breadcrumbPage: 'Predaj a prenájom',
  },
  en: {
    title: 'Property sales and rentals in Slovakia',
    description: 'Comprehensive services for property sales and rentals with Frisco Reality. Apartments, houses, land, and commercial spaces in Slovakia.',
    ogTitle: 'Property sales and rentals | Frisco Reality',
    ogDescription: 'Comprehensive property sales and rental services in Slovakia.',
    breadcrumbHome: 'Home',
    breadcrumbPage: 'Sales and rentals',
  },
  de: {
    title: 'Immobilienverkauf und Vermietung in der Slowakei',
    description: 'Umfassende Leistungen für Verkauf und Vermietung mit Frisco Reality. Wohnungen, Häuser, Grundstücke und Gewerbeobjekte in der Slowakei.',
    ogTitle: 'Immobilienverkauf und Vermietung | Frisco Reality',
    ogDescription: 'Umfassende Services für Verkauf und Vermietung von Immobilien in der Slowakei.',
    breadcrumbHome: 'Startseite',
    breadcrumbPage: 'Verkauf und Vermietung',
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const language = await resolveServerLanguage();
  const copy = COPY[language];
  const path = '/predaj-a-prenajom';

  return {
    title: copy.title,
    description: copy.description,
    alternates: buildLanguageAlternates(path, language),
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

export default async function PredajAPrenajomPage() {
  const language = await resolveServerLanguage();
  const copy = COPY[language];
  const breadcrumbJsonLd = getBreadcrumbSchema([
    { name: copy.breadcrumbHome, url: SITE_URL },
    { name: copy.breadcrumbPage, url: `${SITE_URL}/predaj-a-prenajom` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <PredajAPrenajomContent />
    </>
  );
}
