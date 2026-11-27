import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { NOT_FOUND_COPY } from '@/i18n/notFoundCopy';
import { DEFAULT_LANGUAGE, isLanguageCode } from '@/i18n/types';

// Any unknown path under a language (bare Slovak paths are rewritten to /sk/…) renders
// that language's 404 (app/[lang]/not-found.tsx) inside the normal layout.
// Nothing is prerendered; a path that is hit renders once and its 404 is cached.
export const generateStaticParams = () => [];

// Same metadata as not-found.tsx: the server HTML already uses that one, but after
// hydration Next applies this page's metadata, which would otherwise fall back to the
// layout's default title and "index, follow" in the browser tab.
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const localized = NOT_FOUND_COPY[isLanguageCode(lang) ? lang : DEFAULT_LANGUAGE];

  return {
    title: localized.title,
    description: localized.description,
    robots: { index: false, follow: true },
  };
}

export default function CatchAll() {
  notFound();
}
