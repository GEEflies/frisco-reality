import type { Metadata } from 'next';
import { NotFoundContent } from '@/components/NotFoundContent';
import { NOT_FOUND_COPY } from '@/i18n/notFoundCopy';
import { isLanguageCode, DEFAULT_LANGUAGE } from '@/i18n/types';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const localized = NOT_FOUND_COPY[isLanguageCode(lang) ? lang : DEFAULT_LANGUAGE];

  return {
    title: localized.title,
    description: localized.description,
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default function NotFound() {
  return <NotFoundContent />;
}
