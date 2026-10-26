# 01 — Site "doesn't load": Supabase disk IO starved (2026-10-26)

## Ask
"Could you please check why the site doesn't load?"

## Found
- frisco.sk → 308 → www.frisco.sk answers 200, but TTFB is 11–20 s (once 33 s). Browsers give up or look dead.
- The homepage (`src/app/page.tsx`) is rendered per request (`cache-control: no-store`) and `await`s
  `fetchAllActiveListings()` (Supabase `listings` + `listing_images` join) before sending any HTML.
- That query, called directly, took 33 s, and on the second try failed with
  `57014 canceling statement due to statement timeout`.
- Supabase dashboard (project fcvswlurtchqorgnwclw, free plan, Nano):
  - banner "Your project is about to deplete its Disk IO Budget" (baseline after that is 5 MB/s)
  - CPU ~88 %, memory commitment 1.56 GB marked SEVERE
  - Management API health: `db` UNHEALTHY, `rest` and `pooler` healthy
  - new DB connections time out (CLI `inspect db`, Management API SQL both fail)
- Traffic is not the cause: 161 API requests in the last hour. 41 of them were the homepage listings query
  failing with 500/504 at ~128 s average.
- Only background load: pg_cron job `process-pending-images` runs **every minute**
  (`migrations/20260308200000_cron_every_minute.sql`) → `process-images` edge function → `claim_pending_images`
  RPC + 4 `count: exact` queries on `listing_images`. With the DB starved, each run hangs ~120 s and the
  next one starts anyway, so runs pile up. Edge logs show many concurrent boots/shutdowns.
- `import-listings` shows 0 invocations; nothing was deployed recently (functions 3–9 months old).

## Not yet confirmed
What first drained the IO budget. Can't query `pg_stat_statements` / table sizes while the DB refuses
connections. Suspects: the every-minute cron (1,440 runs/day, unbounded `cron.job_run_details` history),
and `listing_images` bloat from earlier duplicate re-imports.

## Options proposed to the user (nothing changed yet)
1. Restart the Supabase project (Settings → General → Restart) to clear the stuck queries, then right away
   pause the cron (`select cron.alter_job(jobid, active := false) from cron.job where jobname='process-pending-images'`)
   and read pg_stat_statements + table sizes to confirm the cause.
2. Code: give the homepage a revalidate cache (ISR) so a slow DB can't take the whole site down;
   run the image cron every 10–15 min (or only when images are pending) and purge `cron.job_run_details`.
3. Upgrade Supabase compute to Micro (~$10/month): user/client decision.

## Correction + fix (same day, later turns)
User: "we don't need the enhancement of the images because they don't use it" — do it ASAP.

Confirmed after restarting the project (dashboard, 09:52):
- Data is tiny: 41 listings (16 active), 651 images (424 kB), DB 14 MB after cleanup.
- The cron's own log `cron.job_run_details` was **334k rows / 127 MB**, by far the largest thing in the DB:
  1,440 runs/day since March, never purged. That is the IO drain.
- Correction to the earlier note: idle cron runs made 3 queries (2 recovery SELECTs + claim RPC), not the
  4 count(exact) queries; those only ran when an image was processed.
- AI enhancement was already switched off (`AI_ENHANCEMENT_ENABLED` not `true`), so the cron did no useful work.

Done:
- Live: `cron.unschedule('process-pending-images')`, `truncate cron.job_run_details`, dropped RPCs
  claim_pending_images / reset_all_for_reenhancement / reset_listing_for_reenhancement / set_has_baked_logo,
  deleted edge functions process-images + enhance-image, redeployed import-listings (verify_jwt stays false).
- Commit 11cb852 (pushed, Vercel production deploy succeeded):
  - migration `20261026120000_remove_image_enhancement.sql` records the live changes
  - import-listings: no enhancement queue/kick; new images stored as 'completed'; always refreshes rotated
    original_url; aborts image sync if it can't read existing rows
  - `src/api/listingsServer.ts`: homepage, /ponuka, listing detail read through `unstable_cache` (5 min,
    tag `listings`), 8 s timeout, last-good fallback — page views no longer hit Supabase each time
  - enhanced_url only used when it is a real R2 / legacy enhanced output (some rows held stale UC URLs)

Verified: www.frisco.sk TTFB 0.3 s (was 11–33 s), /ponuka shows all 16 active listings, sitemap 200.

Open:
- `src/app/sitemap.ts` still queries listings directly (uncached); low traffic, fine for now.
- New listings show up within 5 min (cache); import-listings could call revalidateTag('listings') if faster is needed.
- Columns enhanced_url / enhancement_status / has_baked_logo / upscaled_url left in place (harmless).
- R2 bucket with old enhanced images and Gemini/R2 secrets are still there; delete only if the client confirms.

## Deeper research + optimizations (same day, next turn)
User: "research a bit more what might be causing this whole thing … see what we could optimize, supabase or code-wise".

Root cause, refined:
- Free Nano = 0.5 GB RAM, 5 MB/s / 250 IOPS baseline, burst only from a daily IO budget. Supabase docs: when
  memory runs out the OS swaps (1 GB swap disk) and swap IO drains the budget.
- Dashboard: memory commitment 1.56 GB (SEVERE) before, still 1.12 GB SEVERE after restart. The box
  over-commits even idle (Postgres + PostgREST + Storage API + exporter + pg_net + pg_cron workers).
- Every-minute cron → pg_net HTTP → edge function → 3+ queries, plus 1,440 log rows/day (334k, 127 MB), on
  top of per-request uncached listings joins from Vercel functions in **iad1 (US)** talking to the DB in
  **eu-west-1**. Once the budget hit 5 MB/s, queries stalled, piled up, used more memory → more swap: spiral.
- Free plan keeps only 1 day of metrics, so the exact start date can't be seen.

Done this turn:
- Live DB: dropped extensions pg_cron + pg_net (nothing uses them now; their workers idle until next
  restart), set search_path on update_listing_images_updated_at (security advisor warning).
- Commit f1b6cdd: `vercel.json` `regions: ["dub1"]`. Verified `x-vercel-id: fra1::dub1::…`, warm TTFB 0.3–0.6 s.
- Since restart, pg_stat_statements: listings join 2–69 ms; nothing heavy left.

Advisors still open (low value): unused indexes idx_listings_action / idx_listings_category (tiny tables).

Vercel budget: `vercel-usage.sh` → VERDICT WARN, team run-rate $23.34 vs $20 credit, $1.69 billed on top.
The user believed frisco is on a free Vercel plan; it is on the billik Pro team. Flagged to the user for the founder.

Further ideas, not done:
- Every route is dynamic (ƒ) because resolveServerLanguage reads headers/cookies; moving language fully to
  the URL would let most pages be static (fewer Vercel function invocations = lower cost).
- sitemap.ts reads Supabase directly (hourly revalidate, fine).
- If the free Nano keeps over-committing memory, the only real fix is Micro compute (~$10/mo).

## Correction: Vercel account
The Vercel budget note above is wrong. frisco-realitka is deployed under the **GEEflies** Vercel account
(deploy URLs `*-geeflies-projects.vercel.app`; not in `vercel project ls --scope billik`), not the billik
Pro team. The billik WARN is unrelated to frisco. The local Vercel CLI is logged in as billikwork, so it
can't see this project; use the GitHub deployment statuses (`gh api repos/GEEflies/frisco-reality/...`)
to check deploys. The dub1 region change deployed fine on that account.

## Decision + verification (same day)
User asked me to decide as an engineer. Decision: no static-pages/i18n-routing refactor. It touches the
SEO routing (canonical/hreflang) for a gain (fewer Vercel invocations) this small site doesn't need.
Verified instead:
- Cache: 120 production page views (/, /ponuka, /en, /de) → 0 listings queries in pg_stat_statements.
- Failure path: local build pointed at a dead DB address → /, /ponuka and a detail page all return 200 in
  ~8.0 s (timeout + fallback), and the error is logged. Before the fix a stalled DB meant 30–120 s hangs.
Watch: free Supabase projects pause after ~1 week of inactivity. The every-minute cron used to keep it awake;
now only cache refreshes (visits) and UC imports do. That's fine while the site gets weekly traffic.

## /ponuka blank until scroll (same day, next turn)
User: "when I click … /ponuka … it loads white screen. When I scroll it down, it only then loads all of the listings."
Cause: the listings section had `.reveal` (opacity 0 until IntersectionObserver adds `.revealed`) and the
observer used `threshold: 0.15/0.18`. The grid is 4000+ px tall, so 15 % of it can never be on screen:
it stayed invisible until scrolled. Also a hydration warning (observer touched a Suspense subtree before
hydration) and the navbar PONUKA item was a div (no real link, no keyboard focus).
Fix (a65eca8): observer uses `threshold: 0` + negative bottom rootMargin; listings section no longer uses
`.reveal`, framer `useInView` uses `amount: 'some'`; PONUKA is a `<Link>`. Verified in Chrome: 16 cards visible
at load, no hydration error.

## Maintenance / speed pass (same day, next turn)
User: "let's call this a maintenance of the website … find something to optimize for, like speed, load".
Measured with a Playwright script (TTFB, LCP, CLS, bytes per page, desktop 1512×745 + mobile 390×844) on
production, then a site-wide audit (console errors, content hidden at load/after scroll, 4xx, broken images,
internal links) on a local production build.

Found and fixed:
- **Mobile homepage downloaded 9.0 MB**: both hero videos. The desktop hero used a bare `<video autoPlay>`;
  Chrome fetches autoplay video even under `display:none`. Desktop hero now uses `AutoplayVideo`
  (IntersectionObserver, never fires when hidden). Mobile homepage now 3.2 MB, each viewport fetches only
  its own video (checked both play).
- Desktop hero video re-encoded 1920p 3.1 Mbps → 1280p CRF 26 (5.9 → 3.4 MB, visually identical at display
  size). New filename `hero-desktop-1280.mp4` because /public files are served `immutable, max-age=1y`:
  never replace a public file under the same name.
- **/ponuka CLS 0.36** (intermittent): the Suspense fallback was 400 px, so on a slow stream the footer
  painted in view and jumped away. Fallback is now `min-h-screen`.
- `/predaj-a-prenajom` mobile video pointed at a 404 (`/hero-video.mp4`); dead `head.tsx` files in
  chcem-predat/chcem-prenajat (App Router ignores them) removed.
- Images: pani-krizova 172 → 71 KB, nehnutelnosti logo 74 → 10 KB, hero-property 145 → 44 KB (WebP,
  right-sized); listing cards and pages use the existing 12 KB `frisco-logo-hq.webp` instead of the 63 KB PNG
  (PNG kept for the schema.org logo). Old files left in /public so external links don't break.
- `canvas-confetti` loaded on demand (only fires on a like-click / animation end).
- `middleware.ts` → `proxy.ts` (Next 16 deprecation); matcher now excludes files, `/api` and `/_next`, so
  images/videos/fonts no longer invoke the proxy on every request.

Checked, left as is:
- Fonts 190 KB: Inter + Playfair variable, latin + latin-ext both needed for Slovak diacritics.
- Listing detail 622 KB is mostly OpenStreetMap's own embed JS inside a lazy, cookie-free iframe.
- Desktop LCP ~2.1 s is the typewriter word (each longer typed word is a new LCP candidate); under 2.5 s.
- All routes are dynamic (language via cookies/headers); TTFB is already ~90 ms from dub1.

## Mobile homepage: logo + hero video slow (same day, next turn)
User on a phone: page text loads fast, but "the logo and the hero video loaded really slowly".
Cause on production: the desktop hero's bare `<video autoPlay>` sits in the HTML, so phones start the 5.7 MB
desktop video at once, next to the 2.3 MB mobile one; both saturate the connection, and the 12 KB logo and
the mobile video wait behind them. Fixed by the AutoplayVideo change above (not live until this push).
Extra:
- Mobile hero video re-encoded from the 1080p master: 960 px, CRF 30, 2.4 → 1.4 MB (`hero-mobile-960.mp4`).
- Sell/rent mobile videos 960 px CRF 29: 2.8 → 1.4 MB and 3.5 → 1.8 MB (`*-mobile-960.mp4`).
  Frames compared side by side at 3× phone scale: no visible difference.
- Navbar logos `fetchPriority="high"`.
- To tell the owner: before 11–33 s or no load; now server response ~0.1–0.6 s. Don't promise "never again"
  (still free Supabase plan).

### Shipped a113f8d, verified live (Vercel success)
Site-wide audit on the local prod build: 59 internal links OK, no hydration/page errors. Fixed from it:
CSP blocked canvas-confetti's blob worker → `worker-src 'self' blob:`. False positives checked by hand:
reveal sections caught mid-animation, route-loading overlay, card hover overlays, `/_vercel/insights` 404
(local only), `/api/google-reviews` 429 (local requests share one rate-limit bucket; prod is a CDN HIT).

Live on www.frisco.sk after deploy (Playwright, mobile 390×844):
| page | before | after |
|---|---|---|
| / mobile | 9.0 MB, LCP 1.43 s | 2.2 MB, LCP 0.47 s |
| /chcem-prenajat mobile | 4.2 MB | 2.4 MB |
| /chcem-predat mobile | 3.7 MB | ~2.3 MB |
| / desktop | 6.7 MB | 4.3 MB |
Each viewport fetches only its own hero video; both play. /en 200, /sk/ponuka → 308 /ponuka (proxy OK).
