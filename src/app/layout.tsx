import { Suspense } from "react";
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/Navbar";
import { ScrollToTop } from "@/components/ScrollToTop";
import { ScrollToHash } from "@/components/ScrollToHash";


const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Frisco Reality | Prémiové nehnuteľnosti na Slovensku",
  description: "Špecializujeme sa na predaj a prenájom luxusných nehnuteľností na Slovensku. Nájdite svoj vysnívaný domov s Frisco Reality.",
  keywords: ["reality", "nehnuteľnosti", "predaj", "prenájom", "Slovensko", "luxusné byty", "domy"],
  openGraph: {
    title: "Frisco Reality | Prémiové nehnuteľnosti na Slovensku",
    description: "Špecializujeme sa na predaj a prenájom luxusných nehnuteľností na Slovensku.",
    locale: "sk_SK",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sk" suppressHydrationWarning>
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
