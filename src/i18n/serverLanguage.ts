import { cookies, headers } from 'next/headers';
import { SITE_URL } from '@/config/seo';
import { DEFAULT_LANGUAGE, isLanguageCode, LANGUAGE_COOKIE_KEY, type LanguageCode } from '@/i18n/types';

const LANGUAGE_REQUEST_HEADER = 'x-frisco-language';

const parseAcceptLanguage = (acceptLanguageHeader: string | null): LanguageCode => {
  if (!acceptLanguageHeader) return DEFAULT_LANGUAGE;

  const firstMatch = acceptLanguageHeader
    .split(',')
    .map((part) => part.trim().toLowerCase())
    .find((part) => part.length > 0);

  if (!firstMatch) return DEFAULT_LANGUAGE;

  if (firstMatch.startsWith('de')) return 'de';
  if (firstMatch.startsWith('en')) return 'en';
  if (firstMatch.startsWith('sk')) return 'sk';

  return DEFAULT_LANGUAGE;
};

export const resolveServerLanguage = async (): Promise<LanguageCode> => {
  const headersStore = await headers();
  const fromHeader = headersStore.get(LANGUAGE_REQUEST_HEADER);
  if (isLanguageCode(fromHeader)) return fromHeader;

  const cookieStore = await cookies();
  const fromCookie = cookieStore.get(LANGUAGE_COOKIE_KEY)?.value;
  if (isLanguageCode(fromCookie)) return fromCookie;

  return parseAcceptLanguage(headersStore.get('accept-language'));
};

const withLanguagePrefix = (path: string, language: LanguageCode) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  // SK (default) uses bare paths — no prefix
  if (language === DEFAULT_LANGUAGE) return normalizedPath;
  if (normalizedPath === '/') return `/${language}`;
  return `/${language}${normalizedPath}`;
};

export const buildLanguageAlternates = (path: string, currentLanguage: LanguageCode = DEFAULT_LANGUAGE) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const canonical = `${SITE_URL}${withLanguagePrefix(normalizedPath, currentLanguage)}`;

  return {
    canonical,
    languages: {
      sk: `${SITE_URL}${withLanguagePrefix(normalizedPath, 'sk')}`,
      en: `${SITE_URL}${withLanguagePrefix(normalizedPath, 'en')}`,
      de: `${SITE_URL}${withLanguagePrefix(normalizedPath, 'de')}`,
      'x-default': `${SITE_URL}${withLanguagePrefix(normalizedPath, DEFAULT_LANGUAGE)}`,
    },
  };
};
