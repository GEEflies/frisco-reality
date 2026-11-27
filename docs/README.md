# frisco.sk docs

## Status (2026-11-27)
2026-11-27: pages are cacheable (journal 03). Language comes from the URL (`app/[lang]/`, bare SK URLs via next.config rewrites), proxy/cookie removed, pages ISR (listings 5 min, others 1 day), the uc-import webhook refreshes listing pages at once. Live since 27 Nov (`ff5f515` + fix `63109c2`): every page `x-vercel-cache: HIT`, no Set-Cookie. Goal: keep the GEEflies Hobby account under its Active CPU limit; re-measure usage in a few days.
2026-10-26: AI image enhancement removed (its cron log drained Supabase disk IO), listings cached, /ponuka blank-screen fixed, speed pass live (mobile homepage 9.0 → 2.2 MB). Open items + owner message draft: end of journal 01.

## Index
- [seo.md](seo.md): SEO overhaul and next steps
- [duplicate-listing-images-fix.md](duplicate-listing-images-fix.md)
- Journal
  - [01 — Site down: Supabase disk IO starved](journal/01-site-down-supabase-disk-io.md)
  - [02 — 18 → 19 years across the site](journal/02-19-years.md)
  - [03 — Cacheable pages: cut Vercel usage](journal/03-cacheable-pages.md)
