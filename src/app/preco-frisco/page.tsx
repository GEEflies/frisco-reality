import SluzbyContent from '@/components/SluzbyContent';
import type { Metadata } from 'next';
import { SITE_URL, getServiceSchema, getBreadcrumbSchema, getFAQSchema } from '@/config/seo';
import { buildLanguageAlternates, resolveServerLanguage } from '@/i18n/serverLanguage';
import type { LanguageCode } from '@/i18n/types';

const COPY: Record<LanguageCode, {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  serviceName: string;
  serviceDescription: string;
  breadcrumbHome: string;
  breadcrumbPage: string;
  faqs: { question: string; answer: string }[];
}> = {
  sk: {
    title: 'Prečo Frisco Reality – Služby a výhody prémiovej realitky',
    description: 'Prečo si vybrať Frisco Reality? Bezplatné ohodnotenie nehnuteľnosti, profesionálny home staging, prémiová foto a video prezentácia, právny servis a osobný prístup rodinnej firmy.',
    ogTitle: 'Prečo Frisco Reality | Služby prémiovej realitnej kancelárie',
    ogDescription: 'Bezplatné ohodnotenie, home staging, profesionálna prezentácia a osobný prístup.',
    serviceName: 'Služby Frisco Reality',
    serviceDescription: 'Komplexné realitné služby – ohodnotenie, home staging, foto a video prezentácia, právny servis, sprostredkovanie predaja a prenájmu nehnuteľností na Slovensku.',
    breadcrumbHome: 'Domov',
    breadcrumbPage: 'Prečo Frisco',
    faqs: [
      { question: 'Aké služby ponúka Frisco Reality?', answer: 'Frisco Reality ponúka kompletné realitné služby vrátane bezplatného ohodnotenia nehnuteľnosti, profesionálneho home stagingu, prémiovej foto a video prezentácie, právneho servisu a osobnej asistencie pri celom procese predaja alebo prenájmu.' },
      { question: 'Je ohodnotenie nehnuteľnosti bezplatné?', answer: 'Áno, ohodnotenie vašej nehnuteľnosti je úplne bezplatné a nezáväzné. Náš tím odborníkov vám poskytne reálnu trhovú cenu.' },
      { question: 'Poskytujete home staging?', answer: 'Áno, Frisco Reality ponúka profesionálny home staging, ktorý zvýši atraktivitu vašej nehnuteľnosti a pomôže dosiahnuť lepšiu predajnú cenu.' },
    ],
  },
  en: {
    title: 'Why Frisco Reality – Premium real estate services and value',
    description: 'Why choose Frisco Reality? Free valuation, home staging, premium photo/video presentation, legal support, and a personal family approach.',
    ogTitle: 'Why Frisco Reality | Premium real estate services',
    ogDescription: 'Free valuation, home staging, premium presentation, and personal support.',
    serviceName: 'Frisco Reality services',
    serviceDescription: 'Comprehensive real estate services: valuation, home staging, photo/video presentation, legal support, and sales/rental brokerage in Slovakia.',
    breadcrumbHome: 'Home',
    breadcrumbPage: 'Why Frisco',
    faqs: [
      { question: 'What services does Frisco Reality provide?', answer: 'Frisco Reality provides full real estate services including free valuation, professional home staging, premium photo/video presentation, legal support, and personal guidance through sales or rentals.' },
      { question: 'Is property valuation free?', answer: 'Yes. Property valuation is fully free and non-binding. Our specialists provide realistic market pricing.' },
      { question: 'Do you provide home staging?', answer: 'Yes. We provide professional home staging to increase appeal and improve achieved sale value.' },
    ],
  },
  de: {
    title: 'Warum Frisco Reality – Leistungen und Vorteile einer Premium-Agentur',
    description: 'Warum Frisco Reality? Kostenlose Immobilienbewertung, professionelles Home Staging, Premium-Foto- und Videopräsentation, Rechtsservice und persönlicher Familienansatz.',
    ogTitle: 'Warum Frisco Reality | Premium-Immobilienservices',
    ogDescription: 'Kostenlose Bewertung, Home Staging, professionelle Präsentation und persönlicher Service.',
    serviceName: 'Leistungen von Frisco Reality',
    serviceDescription: 'Umfassende Immobilienleistungen – Bewertung, Home Staging, Foto-/Videopräsentation, Rechtsservice sowie Vermittlung von Verkauf und Vermietung in der Slowakei.',
    breadcrumbHome: 'Startseite',
    breadcrumbPage: 'Warum Frisco',
    faqs: [
      { question: 'Welche Leistungen bietet Frisco Reality?', answer: 'Frisco Reality bietet komplette Immobilienleistungen inklusive kostenloser Bewertung, professionellem Home Staging, Premium-Präsentation, Rechtsservice und persönlicher Begleitung beim Verkauf oder bei der Vermietung.' },
      { question: 'Ist die Immobilienbewertung kostenlos?', answer: 'Ja. Die Bewertung ist vollständig kostenlos und unverbindlich. Unser Team liefert eine realistische Markteinschätzung.' },
      { question: 'Bieten Sie Home Staging an?', answer: 'Ja. Wir bieten professionelles Home Staging, um die Attraktivität Ihrer Immobilie zu steigern und bessere Verkaufsergebnisse zu erzielen.' },
    ],
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const language = await resolveServerLanguage();
  const copy = COPY[language];
  const path = '/preco-frisco';

  return {
    title: copy.title,
    description: copy.description,
    alternates: buildLanguageAlternates(path),
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

export default async function SluzbyPage() {
  const language = await resolveServerLanguage();
  const copy = COPY[language];

  const serviceJsonLd = getServiceSchema({
    name: copy.serviceName,
    description: copy.serviceDescription,
    url: `${SITE_URL}/preco-frisco`,
  }, language);
  const breadcrumbJsonLd = getBreadcrumbSchema([
    { name: copy.breadcrumbHome, url: SITE_URL },
    { name: copy.breadcrumbPage, url: `${SITE_URL}/preco-frisco` },
  ]);
  const faqJsonLd = getFAQSchema(copy.faqs);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <SluzbyContent />
    </>
  );
}
