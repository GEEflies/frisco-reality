import { Suspense } from "react";
import type { Metadata, ResolvingMetadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "../globals.css";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/Navbar";
import { ScrollToTop } from "@/components/ScrollToTop";
import { ScrollToHash } from "@/components/ScrollToHash";
import { SITE_URL, SITE_NAME, SITE_LOCALE, DEFAULT_OG_IMAGE, COMPANY_INFO, getOrganizationSchema, getWebSiteSchema } from "@/config/seo";
import { buildLanguageAlternates, languageFromParams, type LangPageProps } from '@/i18n/serverLanguage';
import { SUPPORTED_LANGUAGES, type LanguageCode } from '@/i18n/types';
import { manifestPath } from '@/config/manifest';
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  variable: "--font-playfair",
  display: "swap",
});

// Every page is prerendered for sk/en/de (bare Slovak URLs are rewritten to /sk/… in
// next.config.ts). Pages without listings refresh once a day (footer year); listing
// pages set their own, shorter revalidate.
export const generateStaticParams = () => SUPPORTED_LANGUAGES.map((lang) => ({ lang }));
export const revalidate = 86400;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#FFFFFF" },
  ],
};

const LAYOUT_SEO: Record<LanguageCode, {
  defaultTitle: string;
  description: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  ogAlt: string;
  locale: string;
}> = {
  sk: {
    defaultTitle: 'FRISCO Reality | Exkluzívne nehnuteľnosti v Seredi a okolí',
    description: 'Exkluzívna realitná kancelária špecializujúca sa na predaj a prenájom nehnuteľností. Rodinná firma s osobným prístupom.',
    keywords: [
      'reality Slovensko', 'nehnuteľnosti predaj', 'nehnuteľnosti prenájom', 'luxusné byty Slovensko', 'domy na predaj', 'realitná kancelária',
      'FRISCO Reality', 'prémiové nehnuteľnosti', 'predaj bytov', 'prenájom bytov', 'Sereď', 'rodinné domy', 'pozemky', 'komerčné priestory',
    ],
    ogTitle: 'FRISCO Reality | Exkluzívne nehnuteľnosti v Seredi a okolí',
    ogDescription: 'Exkluzívna realitná kancelária špecializujúca sa na predaj a prenájom nehnuteľností. Rodinná firma s osobným prístupom.',
    ogAlt: 'FRISCO Reality – Exkluzívne nehnuteľnosti v Seredi a okolí',
    locale: SITE_LOCALE,
  },
  en: {
    defaultTitle: 'FRISCO Reality | Premium Real Estate in Slovakia',
    description: 'Premium real estate agency focused on selling and renting high-end properties in Slovakia. Family business with a personal approach, free valuation and professional presentation.',
    keywords: [
      'real estate Slovakia', 'property for sale Slovakia', 'property for rent Slovakia', 'luxury apartments Slovakia', 'houses for sale Slovakia',
      'FRISCO Reality', 'premium properties', 'property valuation', 'home staging', 'Sered real estate',
    ],
    ogTitle: 'FRISCO Reality | Premium Real Estate in Slovakia',
    ogDescription: 'Premium agency for property sales and rentals in Slovakia. Find your next home with FRISCO Reality.',
    ogAlt: 'FRISCO Reality – Premium real estate in Slovakia',
    locale: 'en_US',
  },
  de: {
    defaultTitle: 'FRISCO Reality | Premium-Immobilien in der Slowakei',
    description: 'Premium-Immobilienagentur für Verkauf und Vermietung hochwertiger Immobilien in der Slowakei. Familienunternehmen mit persönlichem Ansatz, kostenloser Bewertung und professioneller Präsentation.',
    keywords: [
      'Immobilien Slowakei', 'Immobilienverkauf Slowakei', 'Immobilienvermietung Slowakei', 'Luxuswohnungen Slowakei', 'Häuser zu verkaufen Slowakei',
      'FRISCO Reality', 'Premium Immobilien', 'Immobilienbewertung', 'Home Staging', 'Sered Immobilien',
    ],
    ogTitle: 'FRISCO Reality | Premium-Immobilien in der Slowakei',
    ogDescription: 'Premium-Agentur für Verkauf und Vermietung von Immobilien in der Slowakei. Finden Sie Ihr neues Zuhause mit FRISCO Reality.',
    ogAlt: 'FRISCO Reality – Premium-Immobilien in der Slowakei',
    locale: 'de_DE',
  },
};

export async function generateMetadata({ params }: LangPageProps, parent: ResolvingMetadata): Promise<Metadata> {
  const language = await languageFromParams(params);
  const localized = LAYOUT_SEO[language];
  const alternates = buildLanguageAlternates('/', language);
  // app/opengraph-image.png belongs to the (pass-through) root segment; this openGraph
  // object replaces the parent's, so carry its image over for pages that don't set one
  // (privacy page, 404s), exactly as when this was the root layout.
  const parentImages = (await parent).openGraph?.images;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: localized.defaultTitle,
      template: '%s | FRISCO Reality',
    },
    description: localized.description,
    keywords: localized.keywords,
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      type: 'website',
      locale: localized.locale,
      url: alternates.canonical,
      siteName: SITE_NAME,
      title: localized.ogTitle,
      description: localized.ogDescription,
      ...(parentImages?.length ? { images: parentImages } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: localized.ogTitle,
      description: localized.ogDescription,

    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates,
    icons: {
      icon: [
        { url: '/frisco-favicon.png', type: 'image/png' },
      ],
      apple: [
        { url: '/frisco-favicon.png', sizes: '180x180', type: 'image/png' },
      ],
    },
    manifest: manifestPath(language),
    category: 'real estate',
    other: {
      'geo.region': 'SK',
      'geo.placename': COMPANY_INFO.address.city,
      'geo.position': `${COMPANY_INFO.geo.lat};${COMPANY_INFO.geo.lng}`,
      ICBM: `${COMPANY_INFO.geo.lat}, ${COMPANY_INFO.geo.lng}`,
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: LangPageProps['params'];
}>) {
  const language = await languageFromParams(params);

  return (
    <html lang={language} suppressHydrationWarning>
      <head>
        <link rel="dns-prefetch" href="//fcvswlurtchqorgnwclw.supabase.co" />
        <link rel="preconnect" href="https://fcvswlurtchqorgnwclw.supabase.co" crossOrigin="" />
        {/* Preload the hero poster (LCP element) so it paints before the
            video element + its metadata load. Scoped by viewport so each
            device only fetches the poster it will actually display. */}
        <link
          rel="preload"
          as="image"
          href="/hero-poster-desktop.webp"
          media="(min-width: 1024px)"
          fetchPriority="high"
        />
        <link
          rel="preload"
          as="image"
          href="/hero-poster-mobile.webp"
          media="(max-width: 1023px)"
          fetchPriority="high"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getOrganizationSchema(language)),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getWebSiteSchema(language)),
          }}
        />
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <Providers initialLanguage={language}>
          <Suspense fallback={null}>
            <ScrollToHash />
          </Suspense>
          <ScrollToTop />
          <Navbar />
          <div id="app-wrapper">
            {children}
          </div>
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
