'use client';

import Link from 'next/link';
import { useLanguage } from '@/i18n/LanguageProvider';
import { NOT_FOUND_COPY } from '@/i18n/notFoundCopy';
import { localePath } from '@/i18n/types';

// Body of app/[lang]/not-found.tsx. not-found files get no params, so the language
// comes from the provider that app/[lang]/layout.tsx sets from the URL.
export function NotFoundContent() {
  const { language } = useLanguage();
  const localized = NOT_FOUND_COPY[language];

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">
          {localized.heading}
        </p>
        <Link
          href={localePath('/', language)}
          className="text-primary underline hover:text-primary/90"
        >
          {localized.back}
        </Link>
      </div>
    </div>
  );
}
