import { Suspense } from 'react';
import { Footer } from '@/components/Footer';
import { PropertiesSection } from '@/components/PropertiesSection';
import { Loader2 } from 'lucide-react';
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
    title: 'Ponuka nehnuteľností na predaj a prenájom',
    description: 'Aktuálna ponuka prémiových nehnuteľností na Slovensku – byty, domy, pozemky a komerčné priestory na predaj aj prenájom. Filtrujte podľa lokality, ceny a typu.',
    ogTitle: 'Ponuka nehnuteľností | Frisco Reality',
    ogDescription: 'Prezrite si aktuálnu ponuku prémiových nehnuteľností na predaj a prenájom na Slovensku.',
    breadcrumbHome: 'Domov',
    breadcrumbPage: 'Ponuka',
  },
  en: {
    title: 'Property listings for sale and rent',
    description: 'Current portfolio of premium properties in Slovakia – apartments, houses, land, and commercial spaces for sale and rent.',
    ogTitle: 'Property listings | Frisco Reality',
    ogDescription: 'Browse current premium properties for sale and rent in Slovakia.',
    breadcrumbHome: 'Home',
    breadcrumbPage: 'Listings',
  },
  de: {
    title: 'Immobilienangebote zum Kauf und zur Miete',
    description: 'Aktuelles Angebot an Premium-Immobilien in der Slowakei – Wohnungen, Häuser, Grundstücke und Gewerbeobjekte zum Kauf und zur Miete.',
    ogTitle: 'Immobilienangebote | Frisco Reality',
    ogDescription: 'Entdecken Sie aktuelle Premium-Immobilien zum Kauf und zur Miete in der Slowakei.',
    breadcrumbHome: 'Startseite',
    breadcrumbPage: 'Angebot',
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const language = await resolveServerLanguage();
  const copy = COPY[language];
  const path = '/ponuka';

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

export default async function Ponuka() {
  const language = await resolveServerLanguage();
  const copy = COPY[language];
  const breadcrumbJsonLd = JSON.stringify(
    getBreadcrumbSchema([
      { name: copy.breadcrumbHome, url: SITE_URL },
      { name: copy.breadcrumbPage, url: `${SITE_URL}/ponuka` },
    ])
  );

  return (
    <main className="min-h-screen bg-cream">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbJsonLd }} />
      <div className="pt-20">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-navy/20" />
          </div>
        }>
          <PropertiesSection />
        </Suspense>
      </div>
      <Footer />
    </main>
  );
}
