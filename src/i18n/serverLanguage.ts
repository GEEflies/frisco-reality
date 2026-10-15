import { cookies, headers } from 'next/headers';
import type { Metadata } from 'next';
import { SITE_URL, DEFAULT_OG_IMAGE } from '@/config/seo';
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

const OG_LOCALE: Record<LanguageCode, string> = { sk: 'sk_SK', en: 'en_US', de: 'de_DE' };
const OG_IMAGE_ALT: Record<LanguageCode, string> = {
  sk: 'FRISCO Reality – Exkluzívne nehnuteľnosti',
  en: 'FRISCO Reality – Premium real estate',
  de: 'FRISCO Reality – Premium-Immobilien',
};

/**
 * Builds alternates + openGraph + twitter for a page so that og:url always
 * matches the language-aware canonical and og:image/twitter:image are present
 * (a page-level openGraph object replaces the layout's, so they must be repeated).
 */
export const buildPageSocialMetadata = ({
  title,
  description,
  path,
  language,
  image,
  type = 'website',
}: {
  title: string;
  description: string;
  path: string;
  language: LanguageCode;
  image?: { url: string; width?: number; height?: number; alt?: string } | null;
  type?: 'website' | 'article';
}): Pick<Metadata, 'alternates' | 'openGraph' | 'twitter'> => {
  const alternates = buildLanguageAlternates(path, language);
  const img = image ?? { url: DEFAULT_OG_IMAGE, width: 2048, height: 1365 };
  const images = [{ url: img.url, width: img.width ?? 1200, height: img.height ?? 630, alt: img.alt ?? OG_IMAGE_ALT[language] }];

  return {
    alternates,
    openGraph: {
      type,
      locale: OG_LOCALE[language],
      siteName: 'FRISCO Reality',
      url: alternates.canonical,
      title,
      description,
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: images.map((i) => i.url),
    },
  };
};
