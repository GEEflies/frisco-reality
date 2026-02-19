import PredajAPrenajomContent from '@/components/PredajAPrenajomContent';
import type { Metadata } from 'next';
import { SITE_URL, getBreadcrumbSchema } from '@/config/seo';

export const metadata: Metadata = {
  title: 'Predaj a prenájom nehnuteľností na Slovensku',
  description: 'Komplexné služby predaja a prenájmu nehnuteľností s Frisco Reality. Byty, domy, pozemky a komerčné priestory na Slovensku. Profesionálny prístup a výsledky.',
  alternates: {
    canonical: `${SITE_URL}/predaj-a-prenajom`,
  },
  openGraph: {
    title: 'Predaj a prenájom nehnuteľností | Frisco Reality',
    description: 'Komplexné služby predaja a prenájmu nehnuteľností na Slovensku.',
    url: `${SITE_URL}/predaj-a-prenajom`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Predaj a prenájom | Frisco Reality',
    description: 'Predaj a prenájom nehnuteľností na Slovensku s prémiovým servisom.',
  },
};

export default function PredajAPrenajomPage() {
  const breadcrumbJsonLd = getBreadcrumbSchema([
    { name: 'Domov', url: SITE_URL },
    { name: 'Predaj a prenájom', url: `${SITE_URL}/predaj-a-prenajom` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <PredajAPrenajomContent />
    </>
  );
}
