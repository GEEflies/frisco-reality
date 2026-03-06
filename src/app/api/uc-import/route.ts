import { NextRequest } from 'next/server';

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

  let payload: string;
  try {
    payload = await req.text();
  } catch {
    return Response.json(
      { code: 12, message: 'Invalid request body' },
      { status: 400 },
    );
  }

  if (payload.length > MAX_BODY_BYTES) {
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
      body: payload,
      cache: 'no-store',
    });

    const responseBody = await upstream.text();

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
