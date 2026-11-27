import type { Metadata } from 'next';
import { SITE_URL } from '@/config/seo';

// Pass-through root layout. The real root layout (<html lang>, fonts, navbar) is
// app/[lang]/layout.tsx, so the language comes from the URL and pages can be static.
// Only app/not-found.tsx (paths outside [lang], e.g. a missing /_next file) renders
// without it, so it brings its own <html>.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
