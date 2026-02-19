import dynamic from 'next/dynamic';
import type { Metadata } from 'next';
import { HeroSection } from '@/components/HeroSection';
import { SITE_URL, getBreadcrumbSchema } from '@/config/seo';

export const metadata: Metadata = {
  title: 'Frisco Reality | Prémiové nehnuteľnosti na Slovensku – Predaj & Prenájom',
  description: 'Hľadáte luxusnú nehnuteľnosť na Slovensku? Frisco Reality je prémiová rodinná realitná kancelária – predaj bytov, domov, pozemkov a komerčných priestorov. Bezplatné ohodnotenie, home staging, profesionálna prezentácia.',
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: 'Frisco Reality | Prémiové nehnuteľnosti na Slovensku',
    description: 'Prémiová realitná kancelária špecializujúca sa na predaj a prenájom luxusných nehnuteľností. Rodinná firma s osobným prístupom.',
    url: SITE_URL,
  },
};

const MainListings = dynamic(() => import('@/components/MainListings').then(mod => mod.MainListings));
const AboutSection = dynamic(() => import('@/components/AboutSection').then(mod => mod.AboutSection));
const ProcessSection = dynamic(() => import('@/components/ProcessSection').then(mod => mod.ProcessSection));
const ContactSection = dynamic(() => import('@/components/ContactSection').then(mod => mod.ContactSection));
const Footer = dynamic(() => import('@/components/Footer').then(mod => mod.Footer));

export default function Home() {
  const breadcrumbJsonLd = getBreadcrumbSchema([
    { name: 'Domov', url: SITE_URL },
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
