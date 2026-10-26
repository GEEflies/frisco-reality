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
