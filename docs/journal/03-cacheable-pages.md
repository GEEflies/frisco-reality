# 03 — Cacheable pages: cut Vercel usage on the GEEflies Hobby account (2026-11-27)

## Asked
Started from Karol's GEEflies cost session. 28 Oct – 27 Nov 2026 the free Vercel Hobby account used 2 h of its
4 h Fluid Active CPU, ~95 % of it this project (`frisco-realitka`, 71K function invocations), because no page is
cached. Over a Hobby limit sites get paused, not billed; Karol wants never to need an upgrade.
Task: make the pages cacheable without changing anything a visitor, the owner or Google sees. Karol: "Make sure
to actually really read what they do exactly, so we will not block them … check everything diligently. And then
optimize." Journal 01 had decided *against* this refactor (SEO routing risk for a small gain); the gain is now
needed, so this entry does it carefully.

## Map of what the site does (read before changing anything; line numbers = before this change)

**Language system**
- `src/i18n/types.ts:1-20`: languages sk/en/de, default sk, cookie name `frisco-language`, `localePath()` (sk bare,
  en/de prefixed).
- `src/proxy.ts:46-94` (Next 16 middleware) runs on every page request (matcher `:99` skips `_next/`, `api/`,
  anything with a dot):
  - `/sk/...` → 308 to the bare path (`:58-65`) + sets cookie `frisco-language=sk`.
  - `/en/...`, `/de/...` → *rewrite* to the bare path with request header `x-frisco-language` (`:68-80`) + cookie.
  - bare path → header `x-frisco-language: sk` + cookie `sk` (`:83-93`).
  - So every page response carries `Set-Cookie` (1 year, Secure, Lax). No redirect ever depends on the cookie:
    `/` is always Slovak.
- `src/i18n/serverLanguage.ts:25-35` `resolveServerLanguage()`: header → cookie → Accept-Language. For pages the
  proxy always sets the header, so the cookie/Accept-Language branches only matter where the proxy is skipped:
  `manifest.webmanifest` and 404s for dotted paths.
- Called by the root layout (`src/app/layout.tsx:84,155`), every page's `generateMetadata` + body, `not-found.tsx`,
  `manifest.ts`. `headers()`/`cookies()` there make **every route dynamic**.
- Client: `src/i18n/LanguageProvider.tsx:36-50` takes the language from the URL path on every navigation and writes
  it to localStorage + `document.cookie`; the switchers (`Navbar.tsx:113-140`, `PropertyDetailContent.tsx:338-354`)
  write cookie + localStorage, then do a **full page load** to the prefixed URL. Nothing ever *reads* the cookie
  or localStorage key on the client. → There is **no remembered-language behaviour** for visitors; the cookie
  only steers the manifest's language. `PrivacyContent.tsx:146` tells visitors the language is kept in localStorage.
- `src/app/[lang]/page.tsx`: renders Home for en/de, but the proxy rewrites `/en` → `/`, so in practice it only
  catches unknown one-segment paths (→ 404).
- `usePathname` users (Navbar, PDC, ScrollToTop, ScrollToHash, RouteLoadingIndicator, useScrollReveal) only use
  it as an effect trigger or after stripping the language prefix, so a server/client prefix difference is harmless.

**Pages** (all `ƒ` dynamic): `/` (`app/page.tsx`, server-prefetches listings), `/ponuka` (prefetches listings;
`PropertiesSection` reads `useSearchParams()` for `?category`/`?type`, applied in an effect at `:131-153`, so the
SSR HTML is the unfiltered list), `/nehnutelnost/[id]` (cached listing + agent; unknown id → 200 with
"not found" + `noindex`, no 404), `/predaj-a-prenajom`, `/chcem-predat`, `/chcem-prenajat`, `/preco-frisco`,
`/kontakt`, `/ochrana-osobnych-udajov`, `/cookies` (`permanentRedirect` → `/ochrana-osobnych-udajov#cookies`, also
for /en and /de), `not-found.tsx` (localized via header). Per-page `title`, description, canonical + hreflang
(`buildLanguageAlternates`, `serverLanguage.ts:45-58`, x-default = SK), OG/Twitter (`buildPageSocialMetadata`),
JSON-LD (breadcrumb, service, FAQ, local business, listing).
- Redirects in `next.config.ts:126-139`: `/sluzby` → `/preco-frisco`, `/(en|de)/sluzby` → `/:lang/preco-frisco`.
- Time-dependent render: Footer `© {new Date().getFullYear()}` (`Footer.tsx:256`), "new build" badge
  (`MainListings.tsx:29`, `PropertiesSection.tsx:239`).

**Listings data**
- `src/api/listingsServer.ts:31-47`: `unstable_cache` 300 s, tag `listings`, 8 s timeout; on error last-good value
  of this instance, else `[]` / `null` (`:53-83`).
- Client: `src/hooks/useListings.ts` React Query, same keys, `staleTime` 5 min (agent 10 min), client Supabase
  fetch (`listingsService.ts`). Server pages seed it via `HydrationBoundary`.
- Writes: UC posts to `https://frisco.sk/api/uc-import` (README), `src/app/api/uc-import/route.ts` only proxies
  the body to the Supabase edge function `import-listings` and returns its answer. Codes (function header):
  1 added, 2 edited, 3 deleted, 4 not found, 10/11/12 errors. EN/DE text is filled by DeepL *after* the response
  (fire-and-forget, `import-listings/index.ts:661-670`). Today nothing invalidates the page cache: new listings
  show within the 5 min data cache.

**Other endpoints**
- `api/contact` POST (rate-limited, Resend) — untouched. `api/google-reviews` GET, already CDN-cached
  (`s-maxage=3600, swr=86400`), called by `useGoogleReviews` (localStorage 6 h) from the footer badge — untouched.
- `sitemap.ts`: `force-dynamic` (+ ignored `revalidate 3600`), Supabase query per request, errors swallowed.
- `manifest.ts`: `force-dynamic`, language from cookie/Accept-Language (proxy skips it). Linked from every page.
- `robots.ts`, `app/opengraph-image.png`: static already.
- Cookie consent: no banner; the Google map loads only after a click, consent kept in localStorage
  (`ConsentMapEmbed.tsx:92-105`). Analytics: `@vercel/analytics/next` (internal Suspense; reports path + route).
- Images: `next/image` only with the weserv loader (`src/lib/imageLoader.ts`); live HTML has **0** `/_next/image`
  URLs (819 weserv URLs across the saved pages). No Vercel image transformations from this site.

## Measured before (live www.frisco.sk, 27 Nov ~16:50)
Every page, both requests: `200`, `cache-control: private, no-cache, no-store, max-age=0, must-revalidate`,
`x-vercel-cache: MISS`, `set-cookie: frisco-language=…` (/, /ponuka, a listing, all static pages, /en, /en/ponuka,
/en/…listing, /en/kontakt, /de, /de/ponuka, /de/…listing, /de/preco-frisco, 404s, unknown listing).
`/cookies`: 308 MISS with two Set-Cookie. `/sk`, `/sk/ponuka`: 308 from the proxy + Set-Cookie.
`/sitemap.xml`, `/manifest.webmanifest`: MISS every time (function). `/robots.txt`, `/opengraph-image.png`: HIT.
`next build` (16.1.6): every route `ƒ` except `/robots.txt`, `/opengraph-image.png`; `ƒ Proxy (Middleware)`.

## Decided (and why)
- **Language from the path, not a header/cookie.** All pages moved to `app/[lang]/…` with
  `generateStaticParams` sk/en/de. Slovak keeps bare URLs through **next.config `rewrites()` afterFiles**
  (`/` → `/sk`, `/:first(not en|de|sk|_next|_vercel)/:rest*` → `/sk/…`), not middleware: config rewrites cost
  no function call. afterFiles runs after real routes, so `/api/*`, `/sitemap.xml`, `/robots.txt`,
  `/manifest.webmanifest` and public files are never rewritten. `/api/unknown` and dotted junk paths fall
  through to the SK 404, as before.
- **Proxy deleted.** Nothing read the `frisco-language` cookie except the manifest (see Map), so there was no
  remembered-language behaviour to keep. The client still writes the cookie/localStorage as before
  (`LanguageProvider`, switchers): unchanged, harmless. `/sk/…` → bare and `/cookies` → privacy `#cookies`
  are now config redirects (308, same Location).
- **Revalidate:** home, /ponuka, listing pages 300 s (same freshness as the old 5-min data cache); other pages
  1 day (only the footer year is time-dependent); sitemap 1 h (as intended before, when `force-dynamic`
  overrode it). Listing pages: active listings prerendered at build, others render on first visit and are
  cached; unknown slug still gives the 200 "not found" page with `noindex` (cached 5 min).
- **Webhook refresh:** `api/uc-import` calls `revalidateTag('listings', { expire: 0 })` +
  `revalidatePath('/sitemap.xml')` when the import function answers code 1/2/3 (listing or agent added,
  edited, deleted). `unstable_cache` tags reach the page cache entries (checked in `.next/server/app/*.meta`:
  home, /ponuka and listing pages carry `listings`; static pages don't). `expire: 0` = next visitor gets a fresh
  render, no stale page.
- **Never cache an empty page:** `prefetchQuery` swallows errors, so home and /ponuka now fetch with
  `getCachedActiveListings()` and seed React Query with `setQueryData` (same dehydrated data). The listings
  reads now throw when the DB fails and this instance has no last good value (agent read still returns null);
  the sitemap throws instead of dropping listings. A failed ISR regeneration keeps serving the last good page.
  A DB outage at build time fails the deploy (old deployment stays live) instead of shipping empty pages.
- **/ponuka `?category=` / `?type=`:** `useSearchParams()` in a static page makes React bail out to the nearest
  Suspense fallback, which would have dropped the 15 cards from the HTML. The same effect now lives in a small
  `UrlFilterSync` child behind its own `<Suspense fallback={null}>`.
- **Manifest:** `/manifest.webmanifest` is static Slovak; EN/DE pages link `/en|de/manifest.webmanifest`
  (static route). Before, the one URL followed the cookie. Only HTML change on purpose: the manifest `<link>` on
  EN/DE pages.
- **Root layout is a pass-through** (`app/layout.tsx` returns children + `metadataBase`); `app/[lang]/layout.tsx`
  renders `<html lang>`. `app/not-found.tsx` (own `<html>`, SK) only serves paths outside `[lang]`
  (e.g. a missing `/_next` file). Localized 404s: `app/[lang]/[...rest]/page.tsx` calls `notFound()` →
  `app/[lang]/not-found.tsx` (metadata per language from params, body from `useLanguage`).
- **OG image:** `app/opengraph-image.png` now belongs to the pass-through root segment, and the `[lang]`
  layout's `openGraph` replaced it, so the privacy page and 404s lost `og:image`. The `[lang]` layout now
  carries the parent's resolved image over (`ResolvingMetadata`), same URL incl. `?opengraph-image.dbf1e294.png`.
- **404 title in the browser:** after hydration Next applies the *page's* metadata, so a page that calls
  `notFound()` showed the layout's default title + `index, follow` (plus Next's automatic `noindex`) in the
  browser. Live already does this today (`/neexistuje-5` in Chrome). The catch-all page now has the same
  metadata as not-found, so the tab shows "Stránka nenájdená (404)" / "Page not found" / "Seite nicht gefunden"
  and `noindex, follow`: better than before, HTML identical.
- 404s under `[...rest]` are ISR too (`generateStaticParams = []`): each junk URL renders once, then is cached.

## Built (commit `ff5f515`, pushed with `dd9d655` 19 years)
- `next.config.ts`: redirects `/sk`, `/sk/:path*`, `/cookies`, `/:lang(en|de)/cookies`; afterFiles rewrites.
- `src/proxy.ts`, `src/app/cookies/page.tsx`, `src/app/page.tsx`, old `src/app/[lang]/page.tsx` removed;
  all pages + layout + not-found `git mv`'d into `src/app/[lang]/` and read `languageFromParams(params)`
  (`src/i18n/serverLanguage.ts`, `resolveServerLanguage` removed).
- New: `src/app/layout.tsx` (pass-through), `src/app/not-found.tsx` (global), `src/app/[lang]/[...rest]/page.tsx`,
  `src/app/[lang]/manifest.webmanifest/route.ts`, `src/config/manifest.ts`, `src/i18n/notFoundCopy.ts`,
  `src/components/NotFoundContent.tsx`.
- Changed: `src/api/listingsServer.ts` (export `LISTINGS_TAG`, throw without last good), `src/app/sitemap.ts`,
  `src/app/manifest.ts`, `src/app/api/uc-import/route.ts`, `src/components/PropertiesSection.tsx`.
- Not changed: design, copy, contact form, google-reviews, analytics, image loader, Supabase.

## Verified locally (`next build` + `next start`, 27 Nov)
- Route table: every page `●` (SSG/ISR): `/[lang]` 5m, `/[lang]/ponuka` 5m, `/[lang]/nehnutelnost/[id]` 5m
  (45 paths = 15 listings × 3), all other pages 1d, `/[lang]/[...rest]` ●, manifests `○`/`●`, `/sitemap.xml` 1h,
  `/robots.txt`, `/opengraph-image.png` `○`. Functions left: `api/contact`, `api/google-reviews`, `api/uc-import`.
  No `Proxy (Middleware)` line any more.
- Headers (same 29 URLs as "before", twice each): every page `200`, `x-nextjs-cache: HIT`,
  `s-maxage=300` (listing pages) / `s-maxage=86400` (others), **0 Set-Cookie** in 58 responses; `/sk`, `/sk/ponuka`,
  `/cookies`, `/sluzby`, `/en/sluzby` 308 with the same Location; 404s `404` (MISS then HIT).
- HTML vs live (title, meta incl. robots/OG/Twitter/keywords/geo, canonical, hreflang, icons, JSON-LD, visible
  text) for all 29 URLs: identical except the intended EN/DE manifest link, redirect bodies, and the sitemap's
  static-page `lastmod` (generation time instead of request time). Sitemap URL + hreflang set identical (22 URLs).
- Edge paths: `/en|de/manifest.webmanifest` 200 `application/manifest+json`, `/sk/manifest.webmanifest` 308,
  `/api/unknown`, `/foo.php`, `/favicon.ico` → SK 404 (as live), `/de/kontakt/xyz` → DE 404, `/ponuka/` → 308.
- Chrome (local build): client navigation home → /ponuka → listing without reload (15 cards, right
  title/canonical), language switch SK→EN on a listing and EN→SK on /kontakt, `?category=land` 4 cards and
  `/en/ponuka?type=rent` 4 cards (live: 4 and 4), localized 404s, no console errors. No form was submitted.
- Webhook: local mock of the import function (`UC_WEBHOOK_FUNCTION_URL=http://127.0.0.1:3458/`, the real one
  was never called). Code 4 → nothing invalidated; code 2 → `/`, `/en/ponuka`, the listing and `/sitemap.xml`
  render fresh on the next request (MISS → HIT), `/kontakt` stays HIT.
- Local `next start` on macOS serves `/PONUKA` and `/EN` (case-insensitive file system); live check below.
- A stale, git-ignored `dist/` (Feb 2026 `distDir` dev types) broke the local typecheck after the move; moved
  out of the repo (not on Vercel, not in git).

## Deployed (27 Nov ~17:15) and verified live
- Usage before deploy (`geeflies-usage.sh`, read-only): VERDICT OK, frisco-realitka ≈95 % of the account's
  invocations (74,472 in the period), Active CPU est. ≈2.06 h of 4 h.
- `git push origin main` (`dd9d655..ff5f515`); production deployment Ready ~60 s later.
- Headers, same 29 URLs twice: every page `200`, **0 Set-Cookie** (was 1–2 on every response),
  `x-vercel-cache: HIT` on the second request (first request too, except `/` and `/manifest.webmanifest`:
  `PRERENDER`, then HIT). Vercel shows `cache-control: public, max-age=0, must-revalidate` to the browser and
  caches at the edge (the `s-maxage` stays internal). Redirects unchanged (`/sk`, `/sk/ponuka`, `/cookies`,
  `/sluzby`, `/en/sluzby` → 308, same Location). 404s and the unknown listing: MISS, then HIT. `/sitemap.xml`,
  `/robots.txt`, `/manifest.webmanifest`, `/en|de/manifest.webmanifest`: HIT.
- HTML live after vs live before, all 29 URLs: identical except the intended EN/DE manifest `<link>`, the
  `/cookies` 308 body (was an RSC page body, now "Redirecting...", same status and Location) and sitemap times.
- **Found live, fixed in `63109c2`:** a client-side navigation to `/` (logo, "Domov") got HTML instead of the
  RSC payload, and the `/` segment prefetch got a 404. Vercel serves those as the internal paths `/index.rsc`
  and `/index.segments/…`, which the `/` → `/sk` rewrite doesn't match (local `next start` has no such paths, so
  this only showed on Vercel). Effect: a full page load instead of a soft navigation; nothing was broken. Added
  afterFiles rewrites `/index.rsc` → `/sk.rsc` and `/index.segments/:path*` → `/sk.segments/:path*`. After deploy
  the `/` segment prefetch is 200 (HIT) and in Chrome a click on "DOMOV" from /ponuka navigates without a reload
  (page state kept, no extra request: Next uses the prefetched segments). The `/index.rsc` rule itself has no
  effect (Vercel still answers `/` + `RSC: 1` with HTML); only matters if a click happens before the prefetch,
  and then it is a normal full page load, as with every navigation on the old site.
- Chrome on live (main window, own tab, closed after): "DOMOV" soft navigation, /ponuka?type=rent → listing
  soft navigation (right h1/title), `?category=land` 4 cards (same as before), language switch SK→EN→SK (full
  load, as before: the switcher sets `window.location.href`), DE 404 title "Seite nicht gefunden (404)",
  `noindex, follow`, `lang=de`. No console errors. No form submitted.
- Edge paths live: `/en/sk`, `/de/kontakt/xyz`, `/api/unknown`, `/index` → localized 404 (MISS, then HIT);
  `/sk/neexistuje` → 308 `/neexistuje`. Mixed case: `/PONUKA` → 200 /ponuka page (Vercel matches routes
  case-insensitively; canonical stays `/ponuka`), `/EN`, `/En/ponuka`, `/DE/kontakt` → 404 with the plain SK 404
  content, `noindex`, but an empty `<title>` and no navbar (see Open). The old deployment is behind Vercel login,
  so these could not be compared with before.

## Open
- **Re-measure in a few days** with `geeflies-usage.sh` + the Vercel dashboard (Active CPU, invocations):
  expected large drop, since pages are now served from the edge cache. Not measurable on the day.
- The real uc-import webhook was not called (only a local mock). First real import: check that the changed
  listing shows on `/`, `/ponuka` and its page right after the import.
- The ISR "keep the last good page when the DB fails" path was not exercised (needs a DB outage).
  A DB outage during a build now fails the deploy (old deployment stays live) instead of shipping empty pages.
- EN/DE listing text from DeepL that arrives after the webhook shows within 300 s (ISR backstop).
- Sitemap `lastmod` of static pages is now the generation time (hourly) instead of the request time.
- Vercel Analytics route names for EN/DE pages are now `/[lang]/…` (page paths unchanged).
- Mixed-case language prefix (`/EN`, `/De/…`): 404 page without `<title>`/navbar. Only reachable by typing it;
  fix would need Next's experimental `global-not-found`. Left as is.
- `/index.rsc` rewrite in `next.config.ts` is inert on Vercel (see above); harmless, kept next to the working
  `/index.segments` rule.
- Stale git-ignored `dist/` (Feb 2026) moved to the session scratchpad, not deleted; nothing to restore.

## How to undo
`git revert 63109c2 ff5f515 && git push origin main` (production deploys from `main`). That restores the proxy,
the cookie and dynamic pages; `dd9d655` (19 years copy) stays.
