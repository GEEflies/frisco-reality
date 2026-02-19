'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type LanguageCode = 'sk' | 'en' | 'de';

type LanguageContextType = {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
};

const LanguageContext = createContext<LanguageContextType | null>(null);

const STORAGE_KEY = 'frisco-language';

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguageState] = useState<LanguageCode>('sk');

  useEffect(() => {
    const storedLanguage = window.localStorage.getItem(STORAGE_KEY) as LanguageCode | null;
    if (storedLanguage === 'sk' || storedLanguage === 'en' || storedLanguage === 'de') {
      setLanguageState(storedLanguage);
    }
  }, []);

  const setLanguage = (nextLanguage: LanguageCode) => {
    setLanguageState(nextLanguage);
    window.localStorage.setItem(STORAGE_KEY, nextLanguage);
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
