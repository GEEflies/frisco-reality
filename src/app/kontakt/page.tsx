import KontaktContent from '@/components/KontaktContent';
import type { Metadata } from 'next';
import { SITE_URL, getLocalBusinessSchema, getBreadcrumbSchema } from '@/config/seo';

export const metadata: Metadata = {
  title: 'Kontakt – Realitná kancelária Sereď',
  description: 'Kontaktujte Frisco Reality – prémiovú realitnú kanceláriu v Seredi. Adresa: Námestie Slobody 30/1185, 926 01 Sereď. Telefón: 0905 447 220. Email: info@frisco.sk. Po-Pi 9:00-18:00, So 10:00-14:00.',
  alternates: {
    canonical: `${SITE_URL}/kontakt`,
  },
  openGraph: {
    title: 'Kontakt | Frisco Reality',
    description: 'Navštívte nás v Seredi alebo nám napíšte. Sme tu pre vás každý pracovný deň.',
    url: `${SITE_URL}/kontakt`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kontakt | Frisco Reality',
    description: 'Kontaktujte prémiovú realitnú kanceláriu Frisco Reality v Seredi.',
  },
};

export default function KontaktPage() {
  const localBusinessJsonLd = getLocalBusinessSchema();
  const breadcrumbJsonLd = getBreadcrumbSchema([
    { name: 'Domov', url: SITE_URL },
    { name: 'Kontakt', url: `${SITE_URL}/kontakt` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <KontaktContent />
    </>
  );
}
