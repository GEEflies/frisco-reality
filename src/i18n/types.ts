export const SUPPORTED_LANGUAGES = ['sk', 'en', 'de'] as const;

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number];

export const DEFAULT_LANGUAGE: LanguageCode = 'sk';

export const LANGUAGE_COOKIE_KEY = 'frisco-language';

export const isLanguageCode = (value: string | null | undefined): value is LanguageCode => {
  return value === 'sk' || value === 'en' || value === 'de';
};

/**
 * Build a locale-aware path. SK (default) uses bare paths,
 * en/de get a /{lang} prefix.
 */
export const localePath = (path: string, language: LanguageCode): string => {
  if (language === DEFAULT_LANGUAGE) return path;
  return path === '/' ? `/${language}` : `/${language}${path}`;
};
