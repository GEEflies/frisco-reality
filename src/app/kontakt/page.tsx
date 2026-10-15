import KontaktContent from '@/components/KontaktContent';
import type { Metadata } from 'next';
import { SITE_URL, getLocalBusinessSchema, getBreadcrumbSchema } from '@/config/seo';
import { buildPageSocialMetadata, resolveServerLanguage } from '@/i18n/serverLanguage';
import type { LanguageCode } from '@/i18n/types';

const COPY: Record<LanguageCode, {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  breadcrumbHome: string;
  breadcrumbPage: string;
}> = {
  sk: {
    title: 'Kontakt – Realitná kancelária Sereď',
    description: 'Kontaktujte FRISCO Reality – prémiovú realitnú kanceláriu v Seredi. Adresa: Námestie Slobody 30/1185, 926 01 Sereď. Telefón: 0905 447 220. Email: info@frisco.sk.',
    ogTitle: 'Kontakt | FRISCO Reality',
    ogDescription: 'Navštívte nás v Seredi alebo nám napíšte. Sme tu pre vás každý pracovný deň.',
    breadcrumbHome: 'Domov',
    breadcrumbPage: 'Kontakt',
  },
  en: {
    title: 'Contact – Real Estate Agency in Sered',
    description: 'Contact FRISCO Reality in Sered. Address: Námestie Slobody 30/1185, 926 01 Sereď. Phone: 0905 447 220. Email: info@frisco.sk.',
    ogTitle: 'Contact | FRISCO Reality',
    ogDescription: 'Visit us in Sered or send us a message. We are here for you every business day.',
    breadcrumbHome: 'Home',
    breadcrumbPage: 'Contact',
  },
  de: {
    title: 'Kontakt – Immobilienagentur in Sered',
    description: 'Kontaktieren Sie FRISCO Reality in Sered. Adresse: Námestie Slobody 30/1185, 926 01 Sereď. Telefon: 0905 447 220. E-Mail: info@frisco.sk.',
    ogTitle: 'Kontakt | FRISCO Reality',
    ogDescription: 'Besuchen Sie uns in Sered oder schreiben Sie uns. Wir sind an jedem Werktag für Sie da.',
    breadcrumbHome: 'Startseite',
    breadcrumbPage: 'Kontakt',
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const language = await resolveServerLanguage();
  const copy = COPY[language];
  const path = '/kontakt';

  return {
    title: copy.title,
    description: copy.description,
    ...buildPageSocialMetadata({ title: copy.ogTitle, description: copy.ogDescription, path, language }),
  };
}

export default async function KontaktPage() {
  const language = await resolveServerLanguage();
  const copy = COPY[language];
  const localBusinessJsonLd = getLocalBusinessSchema(language);
  const breadcrumbJsonLd = getBreadcrumbSchema([
    { name: copy.breadcrumbHome, url: SITE_URL },
    { name: copy.breadcrumbPage, url: `${SITE_URL}/kontakt` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }} />
      <KontaktContent />
    </>
  );
}
