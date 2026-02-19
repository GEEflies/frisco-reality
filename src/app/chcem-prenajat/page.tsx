import ChcemPrenajatContent from '@/components/ChcemPrenajatContent';
import type { Metadata } from 'next';
import { SITE_URL, getServiceSchema, getBreadcrumbSchema, getFAQSchema } from '@/config/seo';

export const metadata: Metadata = {
  title: 'Chcem prenajať nehnuteľnosť – správa a prenájom',
  description: 'Prenajmite svoju nehnuteľnosť s istotou cez Frisco Reality. Nájdeme vám spoľahlivého nájomcu, pripravíme nájomnú zmluvu a postaráme sa o celý proces prenájmu od A po Z.',
  alternates: {
    canonical: `${SITE_URL}/chcem-prenajat`,
  },
  openGraph: {
    title: 'Chcem prenajať nehnuteľnosť | Frisco Reality',
    description: 'Nájdeme vám ideálneho nájomcu. Kompletný servis pri prenájme nehnuteľností.',
    url: `${SITE_URL}/chcem-prenajat`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chcem prenajať nehnuteľnosť | Frisco Reality',
    description: 'Spoľahlivý prenájom nehnuteľností s kompletným servisom.',
  },
};

export default function ChcemPrenajatPage() {
  const serviceJsonLd = getServiceSchema({
    name: 'Prenájom nehnuteľností',
    description: 'Kompletný servis pri prenájme – nájdenie spoľahlivého nájomcu, príprava nájomnej zmluvy, foto prezentácia a správa prenájmu.',
    url: `${SITE_URL}/chcem-prenajat`,
  });
  const breadcrumbJsonLd = getBreadcrumbSchema([
    { name: 'Domov', url: SITE_URL },
    { name: 'Chcem prenajať', url: `${SITE_URL}/chcem-prenajat` },
  ]);
  const faqJsonLd = getFAQSchema([
    { question: 'Ako nájsť spoľahlivého nájomcu?', answer: 'Frisco Reality overuje každého nájomcu, kontroluje bonitu a referencie. Postaráme sa o kvalitný výber, aby ste mali istotu spoľahlivého prenájmu.' },
    { question: 'Čo zahŕňa servis pri prenájme?', answer: 'Náš servis zahŕňa profesionálnu prezentáciu nehnuteľnosti, vyhľadanie a overenie nájomcov, prípravu nájomnej zmluvy a odovzdanie nehnuteľnosti.' },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <ChcemPrenajatContent />
    </>
  );
}
