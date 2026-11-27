import Link from 'next/link';
import type { Metadata } from 'next';
import './globals.css';
import { NOT_FOUND_COPY } from '@/i18n/notFoundCopy';

// Fallback 404 for paths outside app/[lang] (the root layout is a pass-through, so this
// renders its own <html>). Every page path is rewritten into [lang] and gets the
// localized 404 from app/[lang]/not-found.tsx instead.
const localized = NOT_FOUND_COPY.sk;

export const metadata: Metadata = {
  title: localized.title,
  description: localized.description,
  robots: { index: false, follow: true },
};

export default function GlobalNotFound() {
  return (
    <html lang="sk">
      <body className="font-sans antialiased">
        <div className="flex min-h-screen items-center justify-center bg-muted">
          <div className="text-center">
            <h1 className="mb-4 text-4xl font-bold">404</h1>
            <p className="mb-4 text-xl text-muted-foreground">{localized.heading}</p>
            <Link href="/" className="text-primary underline hover:text-primary/90">
              {localized.back}
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
