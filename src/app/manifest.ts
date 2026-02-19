import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Frisco Reality – Prémiové nehnuteľnosti na Slovensku',
    short_name: 'Frisco Reality',
    description: 'Prémiová realitná kancelária špecializujúca sa na predaj a prenájom luxusných nehnuteľností na Slovensku.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FDF8F0',
    theme_color: '#1B3A5F',
    orientation: 'portrait-primary',
    lang: 'sk',
    categories: ['real estate', 'business'],
    icons: [
      {
        src: '/frisco-favicon.png',
        sizes: '768x768',
        type: 'image/png',
      },
      {
        src: '/frisco-favicon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/frisco-favicon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
