'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  DEFAULT_LANGUAGE,
  isLanguageCode,
  LANGUAGE_COOKIE_KEY,
  SUPPORTED_LANGUAGES,
  type LanguageCode,
} from '@/i18n/types';

type LanguageContextType = {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
};

const LanguageContext = createContext<LanguageContextType | null>(null);

const STORAGE_KEY = LANGUAGE_COOKIE_KEY;

const persistLanguageCookie = (language: LanguageCode) => {
  document.cookie = `${LANGUAGE_COOKIE_KEY}=${language}; path=/; max-age=31536000; samesite=lax`;
};

export const LanguageProvider = ({
  children,
  initialLanguage = DEFAULT_LANGUAGE,
}: {
  children: React.ReactNode;
  initialLanguage?: LanguageCode;
}) => {
  const [language, setLanguageState] = useState<LanguageCode>(initialLanguage);
  const pathname = usePathname();

  useEffect(() => {
    // Check if URL path starts with a non-default language prefix like /en or /de
    const NON_DEFAULT_LANGS = SUPPORTED_LANGUAGES.filter((l) => l !== DEFAULT_LANGUAGE);
    const langRegex = new RegExp(`^\\/(${NON_DEFAULT_LANGS.join('|')})(?=\\/|$)`);
    const fromPath = window.location.pathname.match(langRegex)?.[1] ?? null;

    // If no language prefix found in URL, the page is SK (default) — bare paths = SK
    const resolvedLanguage: LanguageCode = isLanguageCode(fromPath)
      ? fromPath
      : DEFAULT_LANGUAGE;

    setLanguageState(resolvedLanguage);
    window.localStorage.setItem(STORAGE_KEY, resolvedLanguage);
    persistLanguageCookie(resolvedLanguage);
  }, [pathname]);

  const setLanguage = (nextLanguage: LanguageCode) => {
    setLanguageState(nextLanguage);
    window.localStorage.setItem(STORAGE_KEY, nextLanguage);
    persistLanguageCookie(nextLanguage);
  };

  const value = useMemo(() => ({ language, setLanguage }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }

  return context;
};
