import { NextRequest, NextResponse } from 'next/server';
import {
  DEFAULT_LANGUAGE,
  isLanguageCode,
  LANGUAGE_COOKIE_KEY,
  SUPPORTED_LANGUAGES,
  type LanguageCode,
} from '@/i18n/types';

const PUBLIC_FILE = /\.[^/]+$/;

const shouldSkipMiddleware = (pathname: string) => {
  if (pathname.startsWith('/_next')) return true;
  if (pathname.startsWith('/api')) return true;
  if (pathname === '/robots.txt') return true;
  if (pathname === '/sitemap.xml') return true;
  if (pathname === '/manifest.webmanifest') return true;
  if (PUBLIC_FILE.test(pathname)) return true;
  return false;
};

const getLanguageFromPath = (pathname: string): LanguageCode | null => {
  const [, firstSegment] = pathname.split('/');
  if (isLanguageCode(firstSegment)) return firstSegment;
  return null;
};

const stripLanguagePrefix = (pathname: string): string => {
  const language = getLanguageFromPath(pathname);
  if (!language) return pathname;

  const stripped = pathname.replace(new RegExp(`^/${language}`), '');
  return stripped.length > 0 ? stripped : '/';
};

const persistLanguageCookie = (response: NextResponse, language: LanguageCode) => {
  response.cookies.set(LANGUAGE_COOKIE_KEY, language, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  });
};

export function middleware(request: NextRequest) {
  const { nextUrl } = request;
  const { pathname } = nextUrl;

  if (shouldSkipMiddleware(pathname)) {
    return NextResponse.next();
  }

  const languageFromPath = getLanguageFromPath(pathname);

  if (languageFromPath) {
    const rewrittenUrl = nextUrl.clone();
    rewrittenUrl.pathname = stripLanguagePrefix(pathname);

    const response = NextResponse.rewrite(rewrittenUrl);
    persistLanguageCookie(response, languageFromPath);
    return response;
  }

  const preferredLanguage: LanguageCode = DEFAULT_LANGUAGE;
  const redirectUrl = nextUrl.clone();
  redirectUrl.pathname = `/${preferredLanguage}${pathname === '/' ? '' : pathname}`;

  const response = NextResponse.redirect(redirectUrl);
  persistLanguageCookie(response, preferredLanguage);
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
