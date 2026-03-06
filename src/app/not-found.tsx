import Link from "next/link";
import type { Metadata } from 'next';
import { resolveServerLanguage } from '@/i18n/serverLanguage';
import { localePath, type LanguageCode } from '@/i18n/types';

const NOT_FOUND_COPY: Record<LanguageCode, {
  title: string;
  description: string;
  heading: string;
  back: string;
}> = {
  sk: {
    title: 'Stránka nenájdená (404)',
    description: 'Požadovaná stránka nebola nájdená. Vráťte sa na úvodnú stránku FRISCO Reality.',
    heading: 'Ups! Stránka nebola nájdená',
    back: 'Späť na úvodnú stránku',
  },
  en: {
    title: 'Page not found (404)',
    description: 'The requested page could not be found. Return to the FRISCO Reality homepage.',
    heading: 'Oops! Page not found',
    back: 'Back to homepage',
  },
  de: {
    title: 'Seite nicht gefunden (404)',
    description: 'Die angeforderte Seite wurde nicht gefunden. Zurück zur Startseite von FRISCO Reality.',
    heading: 'Ups! Seite nicht gefunden',
    back: 'Zurück zur Startseite',
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const language = await resolveServerLanguage();
  const localized = NOT_FOUND_COPY[language];

  return {
    title: localized.title,
    description: localized.description,
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function NotFound() {
  const language = await resolveServerLanguage();
  const localized = NOT_FOUND_COPY[language];

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">
          {localized.heading}
        </p>
        <Link
          href={localePath('/', language)}
          className="text-primary underline hover:text-primary/90"
        >
          {localized.back}
        </Link>
      </div>
    </div>
  );
}
