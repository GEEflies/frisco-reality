import { NextRequest, NextResponse } from 'next/server';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = 'Frisco Reality <frisco@karchi.xyz>';
// Change to 'info@frisco.sk' after testing is confirmed
const TO_EMAIL = process.env.CONTACT_EMAIL ?? 'karol.jr@billik.sk';

// Use Weserv CDN to cache and resize the imgBB image for instant loading
// Original: https://i.ibb.co/5Xf2b1jT/frisco-navbar-logo.png
const LOGO_URL = 'https://images.weserv.nl/?url=i.ibb.co/5Xf2b1jT/frisco-navbar-logo.png&w=240&output=png';

function buildEmailHtml(name: string, email: string, phone: string, message: string): string {
  return `<!DOCTYPE html>
<html lang="sk">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Nová správa z kontaktného formulára</title>
</head>
<body style="margin:0;padding:0;background-color:#faf8f5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">

  <!-- Wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#faf8f5;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background-color:#1a1a1a;border-radius:16px 16px 0 0;padding:36px 40px;text-align:center;">
              <!-- Logo with white background for visibility -->
              <table align="center" cellpadding="0" cellspacing="0" style="margin:0 auto;">
                <tr>
                  <td style="background-color:#ffffff;padding:12px 24px;border-radius:8px;">
                    <img
                      src="${LOGO_URL}"
                      alt="Frisco Reality"
                      width="120"
                      style="display:block;max-width:120px;width:100%;height:auto;"
                    />
                  </td>
                </tr>
              </table>
              <p style="margin:20px 0 0;color:#ffffff;font-size:11px;letter-spacing:0.25em;text-transform:uppercase;opacity:0.5;">
                Kontaktný formulár
              </p>
            </td>
          </tr>

          <!-- Red accent bar -->
          <tr>
            <td style="background-color:#d32f2f;height:4px;"></td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background-color:#ffffff;padding:40px 40px 32px;border-left:1px solid #ede9e3;border-right:1px solid #ede9e3;">
              <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#1a1a1a;letter-spacing:-0.5px;">
                Nová správa
              </h1>
              <p style="margin:0 0 32px;font-size:14px;color:#888;letter-spacing:0.05em;">
                Niekto vám napísal cez kontaktný formulár na frisco.sk
              </p>

              <!-- Sender info cards -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td style="padding-bottom:12px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf8f5;border:1px solid #ede9e3;border-radius:10px;padding:16px 20px;">
                      <tr>
                        <td>
                          <p style="margin:0 0 4px;font-size:10px;color:#aaa;letter-spacing:0.15em;text-transform:uppercase;">Meno</p>
                          <p style="margin:0;font-size:16px;font-weight:600;color:#1a1a1a;">${escapeHtml(name)}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom:12px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf8f5;border:1px solid #ede9e3;border-radius:10px;padding:16px 20px;">
                      <tr>
                        <td width="50%" style="padding-right:8px;">
                          <p style="margin:0 0 4px;font-size:10px;color:#aaa;letter-spacing:0.15em;text-transform:uppercase;">Email</p>
                          <a href="mailto:${escapeHtml(email)}" style="font-size:15px;font-weight:600;color:#d32f2f;text-decoration:none;">${escapeHtml(email)}</a>
                        </td>
                        <td width="50%" style="padding-left:8px;">
                          <p style="margin:0 0 4px;font-size:10px;color:#aaa;letter-spacing:0.15em;text-transform:uppercase;">Telefón</p>
                          <a href="tel:${escapeHtml(phone)}" style="font-size:15px;font-weight:600;color:#d32f2f;text-decoration:none;">${phone ? escapeHtml(phone) : '—'}</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Message -->
              <p style="margin:0 0 10px;font-size:10px;color:#aaa;letter-spacing:0.15em;text-transform:uppercase;">Správa</p>
              <div style="background:#faf8f5;border:1px solid #ede9e3;border-left:4px solid #d32f2f;border-radius:0 10px 10px 0;padding:20px 24px;margin-bottom:32px;">
                <p style="margin:0;font-size:15px;color:#2c2c2c;line-height:1.7;white-space:pre-wrap;">${escapeHtml(message)}</p>
              </div>

              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="mailto:${escapeHtml(email)}"
                       style="display:inline-block;background-color:#d32f2f;color:#ffffff;font-size:13px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;text-decoration:none;padding:14px 36px;border-radius:100px;">
                      Odpovedať klientovi
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#1a1a1a;border-radius:0 0 16px 16px;padding:28px 40px;text-align:center;">
              <p style="margin:0 0 6px;font-size:12px;color:#ffffff;opacity:0.9;font-weight:600;">FRISCO, s.r.o.</p>
              <p style="margin:0 0 4px;font-size:11px;color:#ffffff;opacity:0.4;">Námestie Slobody 1185/30, 926 01 Sereď</p>
              <p style="margin:0;font-size:11px;color:#ffffff;opacity:0.4;">
                <a href="mailto:info@frisco.sk" style="color:#d32f2f;text-decoration:none;">info@frisco.sk</a>
                &nbsp;·&nbsp;
                <a href="tel:+421905447220" style="color:#ffffff;opacity:0.4;text-decoration:none;">+421 905 447 220</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!RESEND_API_KEY) {
      return NextResponse.json({ error: 'Email service not configured' }, { status: 500 });
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [TO_EMAIL],
        reply_to: email,
        subject: `Nová správa od ${name} — Frisco kontaktný formulár`,
        html: buildEmailHtml(name, email, phone ?? '', message),
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error('Resend error:', error);
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Contact API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
