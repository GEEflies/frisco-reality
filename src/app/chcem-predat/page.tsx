import ChcemPredatContent from '@/components/ChcemPredatContent';
import type { Metadata } from 'next';
import { SITE_URL, getServiceSchema, getBreadcrumbSchema, getFAQSchema } from '@/config/seo';

export const metadata: Metadata = {
  title: 'Chcem predať nehnuteľnosť – bezplatné ohodnotenie a predaj',
  description: 'Predajte svoju nehnuteľnosť rýchlo a za najlepšiu cenu s Frisco Reality. Bezplatné ohodnotenie, profesionálny home staging, prémiová prezentácia a kompletný právny servis. Bez starostí od A po Z.',
  alternates: {
    canonical: `${SITE_URL}/chcem-predat`,
  },
  openGraph: {
    title: 'Chcem predať nehnuteľnosť | Frisco Reality',
    description: 'Predajte nehnuteľnosť za najlepšiu cenu. Bezplatné ohodnotenie a kompletný servis.',
    url: `${SITE_URL}/chcem-predat`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chcem predať nehnuteľnosť | Frisco Reality',
    description: 'Bezplatné ohodnotenie a kompletný servis pri predaji nehnuteľnosti.',
  },
};

export default function ChcemPredatPage() {
  const serviceJsonLd = getServiceSchema({
    name: 'Predaj nehnuteľností',
    description: 'Kompletný servis pri predaji nehnuteľnosti – od bezplatného ohodnotenia cez home staging, profesionálnu foto a video prezentáciu až po právny servis a odovzdanie.',
    url: `${SITE_URL}/chcem-predat`,
  });
  const breadcrumbJsonLd = getBreadcrumbSchema([
    { name: 'Domov', url: SITE_URL },
    { name: 'Chcem predať', url: `${SITE_URL}/chcem-predat` },
  ]);
  const faqJsonLd = getFAQSchema([
    { question: 'Ako prebieha predaj nehnuteľnosti s Frisco Reality?', answer: 'Proces predaja začína bezplatným ohodnotením, nasleduje profesionálna príprava nehnuteľnosti (home staging, fotenie), aktívny marketing, obhliadky s potenciálnymi kupujúcimi a kompletný právny servis až do odovzdania kľúčov.' },
    { question: 'Koľko stojí predaj nehnuteľnosti cez Frisco Reality?', answer: 'Ohodnotenie nehnuteľnosti je úplne bezplatné. Provízne podmienky sú transparentné a dohodnuté vopred, bez skrytých poplatkov.' },
    { question: 'Ako dlho trvá predaj nehnuteľnosti?', answer: 'Doba predaja závisí od typu nehnuteľnosti a lokality. Vďaka našej prémiovej prezentácii a aktívnemu marketingu dosahujeme výrazne kratšie časy predaja než priemer trhu.' },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <ChcemPredatContent />
    </>
  );
}
