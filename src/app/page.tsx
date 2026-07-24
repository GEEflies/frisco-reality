import dynamic from 'next/dynamic';
import type { Metadata } from 'next';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { HeroSection } from '@/components/HeroSection';
import { SITE_URL, getBreadcrumbSchema } from '@/config/seo';
import { buildLanguageAlternates, resolveServerLanguage } from '@/i18n/serverLanguage';
import type { LanguageCode } from '@/i18n/types';
import { getQueryClient } from '@/lib/getQueryClient';
import { fetchAllActiveListings } from '@/api/listingsService';
import { listingKeys } from '@/api/queryKeys';

const HOME_SEO: Record<LanguageCode, { title: string; description: string; ogTitle: string; ogDescription: string; breadcrumbHome: string }> = {
  sk: {
    title: 'FRISCO Reality | Exkluzívne nehnuteľnosti v Seredi a okolí',
    description: 'Exkluzívna realitná kancelária špecializujúca sa na predaj a prenájom nehnuteľností. Rodinná firma s osobným prístupom.',
    ogTitle: 'FRISCO Reality | Exkluzívne nehnuteľnosti v Seredi a okolí',
    ogDescription: 'Exkluzívna realitná kancelária špecializujúca sa na predaj a prenájom nehnuteľností. Rodinná firma s osobným prístupom.',
    breadcrumbHome: 'Domov',
  },
  en: {
    title: 'FRISCO Reality | Premium Real Estate in Slovakia – Sales & Rentals',
    description: 'Looking for premium property in Slovakia? FRISCO Reality is a family real estate agency for apartments, houses, land, and commercial spaces with professional presentation and free valuation.',
    ogTitle: 'FRISCO Reality | Premium Real Estate in Slovakia',
    ogDescription: 'Premium real estate agency focused on sales and rentals with a personal family approach.',
    breadcrumbHome: 'Home',
  },
  de: {
    title: 'FRISCO Reality | Premium-Immobilien in der Slowakei – Verkauf & Vermietung',
    description: 'Suchen Sie Premium-Immobilien in der Slowakei? FRISCO Reality ist eine familiengeführte Immobilienagentur für Wohnungen, Häuser, Grundstücke und Gewerbeobjekte mit professioneller Präsentation und kostenloser Bewertung.',
    ogTitle: 'FRISCO Reality | Premium-Immobilien in der Slowakei',
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

const MainListings = dynamic(
  () => import('@/components/MainListings').then(mod => mod.MainListings),
  { loading: () => <div className="min-h-[60vh] lg:min-h-0 bg-cream" /> }
);
const AboutSection = dynamic(
  () => import('@/components/AboutSection').then(mod => mod.AboutSection),
  { loading: () => <div className="min-h-[50vh] lg:min-h-0 bg-white" /> }
);
const ProcessSection = dynamic(
  () => import('@/components/ProcessSection').then(mod => mod.ProcessSection),
  { loading: () => <div className="min-h-[70vh] lg:min-h-0 bg-cream" /> }
);
const ContactSection = dynamic(
  () => import('@/components/ContactSection').then(mod => mod.ContactSection),
  { loading: () => <div className="min-h-[60vh] lg:min-h-0 bg-white" /> }
);
const Footer = dynamic(
  () => import('@/components/Footer').then(mod => mod.Footer),
  { loading: () => <div className="min-h-[20vh] lg:min-h-0 bg-cream" /> }
);

export default async function Home() {
  const language = await resolveServerLanguage();
  const localized = HOME_SEO[language];
  const breadcrumbJsonLd = getBreadcrumbSchema([
    { name: localized.breadcrumbHome, url: SITE_URL },
  ]);

  // Prefetch listings on the server so the featured cards are baked into the
  // initial HTML (crawlable content + no client-fetch flash) rather than
  // appearing only after React Query runs on the client. Seeds the exact same
  // ['listings','list','active'] cache the homepage hooks already read, so the
  // client hydrates instantly and won't refetch (5-min staleTime).
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: listingKeys.list(),
    queryFn: fetchAllActiveListings,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="homepage-motion overflow-x-clip">
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
    </HydrationBoundary>
  );
}
