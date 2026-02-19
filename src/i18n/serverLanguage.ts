import { cookies, headers } from 'next/headers';
import { SITE_URL } from '@/config/seo';
import { DEFAULT_LANGUAGE, isLanguageCode, LANGUAGE_COOKIE_KEY, type LanguageCode } from '@/i18n/types';

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
  const cookieStore = await cookies();
  const fromCookie = cookieStore.get(LANGUAGE_COOKIE_KEY)?.value;
  if (isLanguageCode(fromCookie)) return fromCookie;

  const headersStore = await headers();
  return parseAcceptLanguage(headersStore.get('accept-language'));
};

export const buildLanguageAlternates = (path: string) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const canonical = `${SITE_URL}${normalizedPath}`;

  return {
    canonical,
    languages: {
      sk: `${canonical}?lang=sk`,
      en: `${canonical}?lang=en`,
      de: `${canonical}?lang=de`,
      'x-default': canonical,
    },
  };
};
