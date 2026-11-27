import { buildManifest } from '@/config/manifest';
import { isLanguageCode } from '@/i18n/types';

// /en/manifest.webmanifest and /de/manifest.webmanifest, built once at build time.
// Slovak is /manifest.webmanifest (app/manifest.ts); /sk/… redirects to bare paths.
export const dynamic = 'force-static';
export const dynamicParams = false;
export const generateStaticParams = () => [{ lang: 'en' }, { lang: 'de' }];

export async function GET(_request: Request, { params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLanguageCode(lang)) return new Response('Not found', { status: 404 });

  return new Response(JSON.stringify(buildManifest(lang)), {
    headers: { 'Content-Type': 'application/manifest+json' },
  });
}
