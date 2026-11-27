import { NextRequest } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { LISTINGS_TAG } from '@/api/listingsServer';

const DEFAULT_SUPABASE_WEBHOOK_URL = 'https://fcvswlurtchqorgnwclw.supabase.co/functions/v1/import-listings';

/** Max request body size: 2 MB — UC payloads with images metadata are typically < 100 KB */
const MAX_BODY_BYTES = 2 * 1024 * 1024;

function getWebhookUrl(): string {
  return process.env.UC_WEBHOOK_FUNCTION_URL || DEFAULT_SUPABASE_WEBHOOK_URL;
}

function getSupabaseAnonKey(): string {
  return process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
}

// UC sends server-to-server POST — no browser CORS needed.
// Only expose a minimal POST endpoint.

/** Import function answer codes that changed a listing: 1 added, 2 edited, 3 deleted. */
const CHANGED_CODES = new Set([1, 2, 3]);

/**
 * Pages are cached (ISR). After a successful import, expire the listings data and every
 * page tagged with it (home, /ponuka, listing details, all languages) plus the sitemap,
 * so the change shows on the next visit instead of within 5 minutes.
 * EN/DE texts are translated by the import function after it answers; the pages pick
 * them up at the next 5-minute regeneration.
 */
function revalidateListings(responseBody: string) {
  let code: number;
  try {
    code = Number((JSON.parse(responseBody) as { code?: unknown })?.code);
  } catch {
    return; // not a JSON answer: nothing was imported
  }
  if (!CHANGED_CODES.has(code)) return;
  try {
    revalidateTag(LISTINGS_TAG, { expire: 0 });
    revalidatePath('/sitemap.xml');
  } catch (err) {
    console.error('uc-import proxy: revalidation skipped:', err);
  }
}

export async function POST(req: NextRequest) {
  const targetUrl = getWebhookUrl();
  const anonKey = getSupabaseAnonKey();
  const contentType = req.headers.get('content-type') || 'application/json';

  if (!anonKey) {
    console.error('uc-import proxy: SUPABASE_ANON_KEY is not set');
    return Response.json(
      { code: 12, message: 'Proxy misconfigured' },
      { status: 500 },
    );
  }

  // ---- Body size guard ----
  const contentLength = req.headers.get('content-length');
  if (contentLength && Number(contentLength) > MAX_BODY_BYTES) {
    return Response.json(
      { code: 12, message: 'Payload too large' },
      { status: 413 },
    );
  }

  // Read body as raw bytes — preserves multipart boundaries and binary data
  // without UTF-8 re-encoding that req.text() would do.
  let bodyBuffer: ArrayBuffer;
  try {
    bodyBuffer = await req.arrayBuffer();
  } catch {
    return Response.json(
      { code: 12, message: 'Invalid request body' },
      { status: 400 },
    );
  }

  if (bodyBuffer.byteLength > MAX_BODY_BYTES) {
    return Response.json(
      { code: 12, message: 'Payload too large' },
      { status: 413 },
    );
  }

  try {
    const upstream = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': contentType,
        'Authorization': `Bearer ${anonKey}`,
      },
      body: bodyBuffer,
      cache: 'no-store',
    });

    const responseBody = await upstream.text();
    if (upstream.ok) revalidateListings(responseBody);

    return new Response(responseBody, {
      status: upstream.status,
      headers: {
        'Content-Type': upstream.headers.get('content-type') || 'application/json',
      },
    });
  } catch {
    return Response.json(
      { code: 12, message: 'Upstream webhook unavailable' },
      { status: 502 },
    );
  }
}
