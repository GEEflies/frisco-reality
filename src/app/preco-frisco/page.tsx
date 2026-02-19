import SluzbyContent from '@/components/SluzbyContent';
import type { Metadata } from 'next';
import { SITE_URL, getServiceSchema, getBreadcrumbSchema, getFAQSchema } from '@/config/seo';

export const metadata: Metadata = {
  title: 'Prečo Frisco Reality – Služby a výhody prémiovej realitky',
  description: 'Prečo si vybrať Frisco Reality? Bezplatné ohodnotenie nehnuteľnosti, profesionálny home staging, prémiová foto a video prezentácia, právny servis a osobný prístup rodinnej firmy.',
  alternates: {
    canonical: `${SITE_URL}/preco-frisco`,
  },
  openGraph: {
    title: 'Prečo Frisco Reality | Služby prémiovej realitnej kancelárie',
    description: 'Bezplatné ohodnotenie, home staging, profesionálna prezentácia a osobný prístup.',
    url: `${SITE_URL}/preco-frisco`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prečo Frisco Reality',
    description: 'Prémiová realitná kancelária s osobným prístupom a rodinnou tradíciou.',
  },
};

export default function SluzbyPage() {
  const serviceJsonLd = getServiceSchema({
    name: 'Služby Frisco Reality',
    description: 'Komplexné realitné služby – ohodnotenie, home staging, foto a video prezentácia, právny servis, sprostredkovanie predaja a prenájmu nehnuteľností na Slovensku.',
    url: `${SITE_URL}/preco-frisco`,
  });
  const breadcrumbJsonLd = getBreadcrumbSchema([
    { name: 'Domov', url: SITE_URL },
    { name: 'Prečo Frisco', url: `${SITE_URL}/preco-frisco` },
  ]);
  const faqJsonLd = getFAQSchema([
    { question: 'Aké služby ponúka Frisco Reality?', answer: 'Frisco Reality ponúka kompletné realitné služby vrátane bezplatného ohodnotenia nehnuteľnosti, profesionálneho home stagingu, prémiovej foto a video prezentácie, právneho servisu a osobnej asistencie pri celom procese predaja alebo prenájmu.' },
    { question: 'Je ohodnotenie nehnuteľnosti bezplatné?', answer: 'Áno, ohodnotenie vašej nehnuteľnosti je úplne bezplatné a nezáväzné. Náš tím odborníkov vám poskytne reálnu trhovú cenu.' },
    { question: 'Poskytujete home staging?', answer: 'Áno, Frisco Reality ponúka profesionálny home staging, ktorý zvýši atraktivitu vašej nehnuteľnosti a pomôže dosiahnuť lepšiu predajnú cenu.' },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <SluzbyContent />
    </>
  );
}
