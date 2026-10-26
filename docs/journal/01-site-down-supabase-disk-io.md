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
