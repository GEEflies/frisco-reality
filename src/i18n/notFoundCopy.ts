import type { LanguageCode } from '@/i18n/types';

export const NOT_FOUND_COPY: Record<LanguageCode, {
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
