'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  DEFAULT_LANGUAGE,
  isLanguageCode,
  LANGUAGE_COOKIE_KEY,
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

  useEffect(() => {
    const searchLanguage = new URLSearchParams(window.location.search).get('lang');
    const storedLanguage = window.localStorage.getItem(STORAGE_KEY);
    const resolvedLanguage = isLanguageCode(searchLanguage)
      ? searchLanguage
      : isLanguageCode(storedLanguage)
        ? storedLanguage
        : initialLanguage;

    setLanguageState(resolvedLanguage);
    window.localStorage.setItem(STORAGE_KEY, resolvedLanguage);
    persistLanguageCookie(resolvedLanguage);
  }, [initialLanguage]);

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
