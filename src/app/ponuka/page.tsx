import { Suspense } from 'react';
import { Footer } from '@/components/Footer';
import { PropertiesSection } from '@/components/PropertiesSection';
import { Loader2 } from 'lucide-react';
import type { Metadata } from 'next';
import { SITE_URL, getBreadcrumbSchema } from '@/config/seo';

export const metadata: Metadata = {
  title: 'Ponuka nehnuteľností na predaj a prenájom',
  description: 'Aktuálna ponuka prémiových nehnuteľností na Slovensku – byty, domy, pozemky a komerčné priestory na predaj aj prenájom. Filtrujte podľa lokality, ceny a typu.',
  alternates: {
    canonical: `${SITE_URL}/ponuka`,
  },
  openGraph: {
    title: 'Ponuka nehnuteľností | Frisco Reality',
    description: 'Prezrite si aktuálnu ponuku prémiových nehnuteľností na predaj a prenájom na Slovensku.',
    url: `${SITE_URL}/ponuka`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ponuka nehnuteľností | Frisco Reality',
    description: 'Prémiové nehnuteľnosti na predaj a prenájom na Slovensku.',
  },
};

const breadcrumbJsonLd = JSON.stringify(
  getBreadcrumbSchema([
    { name: 'Domov', url: SITE_URL },
    { name: 'Ponuka', url: `${SITE_URL}/ponuka` },
  ])
);

export default function Ponuka() {
  return (
    <main className="min-h-screen bg-cream">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbJsonLd }} />
      <div>
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
      </div>
    </main>
  );
}
