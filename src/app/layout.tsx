import { Suspense } from "react";
import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/Navbar";
import { ScrollToTop } from "@/components/ScrollToTop";
import { ScrollToHash } from "@/components/ScrollToHash";
import { SITE_URL, SITE_NAME, SITE_LOCALE, DEFAULT_OG_IMAGE, COMPANY_INFO, getOrganizationSchema, getWebSiteSchema } from "@/config/seo";
import { buildLanguageAlternates, resolveServerLanguage } from '@/i18n/serverLanguage';
import type { LanguageCode } from '@/i18n/types';

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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1B3A5F" },
    { media: "(prefers-color-scheme: dark)", color: "#1B3A5F" },
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
    defaultTitle: 'Frisco Reality | Exkluzívne nehnuteľnosti v Seredi a okolí',
    description: 'Exkluzívna realitná kancelária špecializujúca sa na predaj a prenájom nehnuteľností. Rodinná firma s osobným prístupom.',
    keywords: [
      'reality Slovensko', 'nehnuteľnosti predaj', 'nehnuteľnosti prenájom', 'luxusné byty Slovensko', 'domy na predaj', 'realitná kancelária',
      'Frisco Reality', 'prémiové nehnuteľnosti', 'predaj bytov', 'prenájom bytov', 'Sereď', 'rodinné domy', 'pozemky', 'komerčné priestory',
    ],
    ogTitle: 'Frisco Reality | Exkluzívne nehnuteľnosti v Seredi a okolí',
    ogDescription: 'Exkluzívna realitná kancelária špecializujúca sa na predaj a prenájom nehnuteľností. Rodinná firma s osobným prístupom.',
    ogAlt: 'Frisco Reality – Exkluzívne nehnuteľnosti v Seredi a okolí',
    locale: SITE_LOCALE,
  },
  en: {
    defaultTitle: 'Frisco Reality | Premium Real Estate in Slovakia',
    description: 'Premium real estate agency focused on selling and renting high-end properties in Slovakia. Family business with a personal approach, free valuation and professional presentation.',
    keywords: [
      'real estate Slovakia', 'property for sale Slovakia', 'property for rent Slovakia', 'luxury apartments Slovakia', 'houses for sale Slovakia',
      'Frisco Reality', 'premium properties', 'property valuation', 'home staging', 'Sered real estate',
    ],
    ogTitle: 'Frisco Reality | Premium Real Estate in Slovakia',
    ogDescription: 'Premium agency for property sales and rentals in Slovakia. Find your next home with Frisco Reality.',
    ogAlt: 'Frisco Reality – Premium real estate in Slovakia',
    locale: 'en_US',
  },
  de: {
    defaultTitle: 'Frisco Reality | Premium-Immobilien in der Slowakei',
    description: 'Premium-Immobilienagentur für Verkauf und Vermietung hochwertiger Immobilien in der Slowakei. Familienunternehmen mit persönlichem Ansatz, kostenloser Bewertung und professioneller Präsentation.',
    keywords: [
      'Immobilien Slowakei', 'Immobilienverkauf Slowakei', 'Immobilienvermietung Slowakei', 'Luxuswohnungen Slowakei', 'Häuser zu verkaufen Slowakei',
      'Frisco Reality', 'Premium Immobilien', 'Immobilienbewertung', 'Home Staging', 'Sered Immobilien',
    ],
    ogTitle: 'Frisco Reality | Premium-Immobilien in der Slowakei',
    ogDescription: 'Premium-Agentur für Verkauf und Vermietung von Immobilien in der Slowakei. Finden Sie Ihr neues Zuhause mit Frisco Reality.',
    ogAlt: 'Frisco Reality – Premium-Immobilien in der Slowakei',
    locale: 'de_DE',
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const language = await resolveServerLanguage();
  const localized = LAYOUT_SEO[language];
  const alternates = buildLanguageAlternates('/', language);

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: localized.defaultTitle,
      template: '%s | Frisco Reality',
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
      url: SITE_URL,
      siteName: SITE_NAME,
      title: localized.ogTitle,
      description: localized.ogDescription,

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
    manifest: '/manifest.webmanifest',
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
}: Readonly<{
  children: React.ReactNode;
}>) {
  const language = await resolveServerLanguage();

  return (
    <html lang={language} suppressHydrationWarning>
      <head>
        <link rel="dns-prefetch" href="//fcvswlurtchqorgnwclw.supabase.co" />
        <link rel="preconnect" href="https://fcvswlurtchqorgnwclw.supabase.co" crossOrigin="" />
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
        </Providers>
      </body>
    </html>
  );
}
