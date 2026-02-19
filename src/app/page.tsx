import dynamic from 'next/dynamic';
import type { Metadata } from 'next';
import { HeroSection } from '@/components/HeroSection';
import { SITE_URL, getBreadcrumbSchema } from '@/config/seo';
import { buildLanguageAlternates, resolveServerLanguage } from '@/i18n/serverLanguage';
import type { LanguageCode } from '@/i18n/types';

const HOME_SEO: Record<LanguageCode, { title: string; description: string; ogTitle: string; ogDescription: string; breadcrumbHome: string }> = {
  sk: {
    title: 'Frisco Reality | Exkluzívne nehnuteľnosti v Seredi a okolí',
    description: 'Exkluzívna realitná kancelária špecializujúca sa na predaj a prenájom nehnuteľností. Rodinná firma s osobným prístupom.',
    ogTitle: 'Frisco Reality | Exkluzívne nehnuteľnosti v Seredi a okolí',
    ogDescription: 'Exkluzívna realitná kancelária špecializujúca sa na predaj a prenájom nehnuteľností. Rodinná firma s osobným prístupom.',
    breadcrumbHome: 'Domov',
  },
  en: {
    title: 'Frisco Reality | Premium Real Estate in Slovakia – Sales & Rentals',
    description: 'Looking for premium property in Slovakia? Frisco Reality is a family real estate agency for apartments, houses, land, and commercial spaces with professional presentation and free valuation.',
    ogTitle: 'Frisco Reality | Premium Real Estate in Slovakia',
    ogDescription: 'Premium real estate agency focused on sales and rentals with a personal family approach.',
    breadcrumbHome: 'Home',
  },
  de: {
    title: 'Frisco Reality | Premium-Immobilien in der Slowakei – Verkauf & Vermietung',
    description: 'Suchen Sie Premium-Immobilien in der Slowakei? Frisco Reality ist eine familiengeführte Immobilienagentur für Wohnungen, Häuser, Grundstücke und Gewerbeobjekte mit professioneller Präsentation und kostenloser Bewertung.',
    ogTitle: 'Frisco Reality | Premium-Immobilien in der Slowakei',
    ogDescription: 'Premium-Immobilienagentur für Verkauf und Vermietung mit persönlichem Familienansatz.',
    breadcrumbHome: 'Startseite',
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const language = await resolveServerLanguage();
  const localized = HOME_SEO[language];

  return {
    title: localized.title,
    description: localized.description,
    alternates: buildLanguageAlternates('/', language),
    openGraph: {
      title: localized.ogTitle,
      description: localized.ogDescription,
      url: SITE_URL,
    },
  };
}

const MainListings = dynamic(() => import('@/components/MainListings').then(mod => mod.MainListings));
const AboutSection = dynamic(() => import('@/components/AboutSection').then(mod => mod.AboutSection));
const ProcessSection = dynamic(() => import('@/components/ProcessSection').then(mod => mod.ProcessSection));
const ContactSection = dynamic(() => import('@/components/ContactSection').then(mod => mod.ContactSection));
const Footer = dynamic(() => import('@/components/Footer').then(mod => mod.Footer));

export default async function Home() {
  const language = await resolveServerLanguage();
  const localized = HOME_SEO[language];
  const breadcrumbJsonLd = getBreadcrumbSchema([
    { name: localized.breadcrumbHome, url: SITE_URL },
  ]);



  return (
    <main className="overflow-x-clip">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <HeroSection />
      <MainListings />
      <AboutSection />
      <ProcessSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
