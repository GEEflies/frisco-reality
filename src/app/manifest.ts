import type { MetadataRoute } from 'next';
import { resolveServerLanguage } from '@/i18n/serverLanguage';
import type { LanguageCode } from '@/i18n/types';

export const dynamic = 'force-dynamic';

const MANIFEST_COPY: Record<LanguageCode, { name: string; shortName: string; description: string }> = {
  sk: {
    name: 'Frisco Reality – Prémiové nehnuteľnosti na Slovensku',
    shortName: 'Frisco Reality',
    description: 'Prémiová realitná kancelária špecializujúca sa na predaj a prenájom luxusných nehnuteľností na Slovensku.',
  },
  en: {
    name: 'Frisco Reality – Premium Real Estate in Slovakia',
    shortName: 'Frisco Reality',
    description: 'Premium real estate agency focused on high-end property sales and rentals in Slovakia.',
  },
  de: {
    name: 'Frisco Reality – Premium-Immobilien in der Slowakei',
    shortName: 'Frisco Reality',
    description: 'Premium-Immobilienagentur für den Verkauf und die Vermietung hochwertiger Immobilien in der Slowakei.',
  },
};

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const language = await resolveServerLanguage();
  const copy = MANIFEST_COPY[language];

  return {
    name: copy.name,
    short_name: copy.shortName,
    description: copy.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#FDF8F0',
    theme_color: '#1B3A5F',
    orientation: 'portrait-primary',
    lang: language,
    categories: ['real estate', 'business'],
    icons: [
      {
        src: '/frisco-favicon.png',
        sizes: '768x768',
        type: 'image/png',
      },
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
