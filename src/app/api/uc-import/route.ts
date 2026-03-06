import { NextRequest } from 'next/server';

const DEFAULT_SUPABASE_WEBHOOK_URL = 'https://fcvswlurtchqorgnwclw.supabase.co/functions/v1/import-listings';

function getWebhookUrl(): string {
  return process.env.UC_WEBHOOK_FUNCTION_URL || DEFAULT_SUPABASE_WEBHOOK_URL;
}

// The Supabase anon key is needed to call Edge Functions.
// UC sends its own user/pass credentials in the JSON body — the function handles auth internally.
function getSupabaseAnonKey(): string {
  return process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
}

function corsHeaders(origin: string | null) {
  return {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  } as const;
}

export async function OPTIONS(req: NextRequest) {
  return new Response('ok', { headers: corsHeaders(req.headers.get('origin')) });
}

export async function POST(req: NextRequest) {
  const targetUrl = getWebhookUrl();
  const anonKey = getSupabaseAnonKey();
  const contentType = req.headers.get('content-type') || 'application/json';

  if (!anonKey) {
    console.error('uc-import proxy: SUPABASE_ANON_KEY is not set');
    return Response.json(
      { code: 12, message: 'Proxy misconfigured' },
      { status: 500, headers: corsHeaders(req.headers.get('origin')) },
    );
  }

  let payload: string;
  try {
    payload = await req.text();
  } catch {
    return Response.json(
      { code: 12, message: 'Invalid request body' },
      { status: 400, headers: corsHeaders(req.headers.get('origin')) },
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
        ...corsHeaders(req.headers.get('origin')),
        'Content-Type': upstream.headers.get('content-type') || 'application/json',
      },
    });
  } catch {
    return Response.json(
      { code: 12, message: 'Upstream webhook unavailable' },
      { status: 502, headers: corsHeaders(req.headers.get('origin')) },
    );
  }
}
