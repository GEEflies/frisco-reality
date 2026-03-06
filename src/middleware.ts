import { NextRequest, NextResponse } from 'next/server';
import {
  DEFAULT_LANGUAGE,
  isLanguageCode,
  LANGUAGE_COOKIE_KEY,
  SUPPORTED_LANGUAGES,
  type LanguageCode,
} from '@/i18n/types';

const PUBLIC_FILE = /\.[^/]+$/;
const LANGUAGE_REQUEST_HEADER = 'x-frisco-language';

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
    // If someone visits /sk/... redirect to the bare path (SK is the default, no prefix)
    if (languageFromPath === DEFAULT_LANGUAGE) {
      const bare = stripLanguagePrefix(pathname);
      const redirectUrl = nextUrl.clone();
      redirectUrl.pathname = bare;
      const response = NextResponse.redirect(redirectUrl, 308);
      persistLanguageCookie(response, DEFAULT_LANGUAGE);
      return response;
    }

    // For /en/... and /de/... — rewrite to the bare path and pass the language header
    const rewrittenUrl = nextUrl.clone();
    rewrittenUrl.pathname = stripLanguagePrefix(pathname);

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set(LANGUAGE_REQUEST_HEADER, languageFromPath);

    const response = NextResponse.rewrite(rewrittenUrl, {
      request: {
        headers: requestHeaders,
      },
    });
    persistLanguageCookie(response, languageFromPath);
    return response;
  }

  // No language prefix — serve as default language (SK) with no redirect
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(LANGUAGE_REQUEST_HEADER, DEFAULT_LANGUAGE);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  persistLanguageCookie(response, DEFAULT_LANGUAGE);
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
