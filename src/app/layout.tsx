import { Suspense } from "react";
import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/Navbar";
import { ScrollToTop } from "@/components/ScrollToTop";
import { ScrollToHash } from "@/components/ScrollToHash";
import { SITE_URL, SITE_NAME, SITE_LOCALE, DEFAULT_OG_IMAGE, COMPANY_INFO, getOrganizationSchema, getWebSiteSchema } from "@/config/seo";

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

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Frisco Reality | Prémiové nehnuteľnosti na Slovensku",
    template: "%s | Frisco Reality",
  },
  description: "Prémiová realitná kancelária špecializujúca sa na predaj a prenájom luxusných nehnuteľností na Slovensku. Rodinná firma s osobným prístupom, bezplatné ohodnotenie, profesionálny home staging a prezentácia.",
  keywords: [
    "reality Slovensko", "nehnuteľnosti predaj", "nehnuteľnosti prenájom",
    "luxusné byty Slovensko", "domy na predaj", "realitná kancelária",
    "Frisco Reality", "prémiové nehnuteľnosti", "predaj bytov",
    "prenájom bytov", "Sereď", "rodinné domy", "pozemky",
    "komerčné priestory", "home staging", "ohodnotenie nehnuteľností",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: SITE_LOCALE,
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "Frisco Reality | Prémiové nehnuteľnosti na Slovensku",
    description: "Prémiová realitná kancelária špecializujúca sa na predaj a prenájom luxusných nehnuteľností na Slovensku. Nájdite svoj vysnívaný domov.",
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Frisco Reality – Prémiové nehnuteľnosti na Slovensku",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Frisco Reality | Prémiové nehnuteľnosti na Slovensku",
    description: "Prémiová realitná kancelária špecializujúca sa na predaj a prenájom luxusných nehnuteľností na Slovensku.",
    images: [DEFAULT_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: [
      { url: "/frisco-favicon.png", type: "image/png" },
    ],
    apple: [
      { url: "/frisco-favicon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.webmanifest",
  category: "real estate",
  other: {
    "geo.region": "SK",
    "geo.placename": COMPANY_INFO.address.city,
    "geo.position": `${COMPANY_INFO.geo.lat};${COMPANY_INFO.geo.lng}`,
    "ICBM": `${COMPANY_INFO.geo.lat}, ${COMPANY_INFO.geo.lng}`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sk" suppressHydrationWarning>
      <head>
        <link rel="dns-prefetch" href="//fcvswlurtchqorgnwclw.supabase.co" />
        <link rel="preconnect" href="https://fcvswlurtchqorgnwclw.supabase.co" crossOrigin="" />
        <link
          rel="preload"
          as="video"
          href="https://fcvswlurtchqorgnwclw.supabase.co/storage/v1/object/public/videos/hero-video.mp4"
          type="video/mp4"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getOrganizationSchema()),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getWebSiteSchema()),
          }}
        />
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <Providers>
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
