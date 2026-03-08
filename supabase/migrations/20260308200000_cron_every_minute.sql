-- ============================================================
-- Update image processing cron from every 30 min → every 1 minute
--
-- Rationale: With parallel processing (10 images per run), the bottleneck
-- is Gemini's ~10 RPM limit for the image model. Running every minute
-- saturates that limit and processes a 400-image bulk import in ~40 min.
-- A single new listing with 20 images completes in 2-3 minutes.
-- ============================================================

-- Drop existing schedule
do $$
begin
    perform cron.unschedule('process-pending-images');
exception when others then
    null;
end;
$$;

-- Re-create with 1-minute interval
select cron.schedule(
    'process-pending-images',
    '* * * * *',
    $$
    select net.http_post(
        url    := 'https://fcvswlurtchqorgnwclw.supabase.co/functions/v1/process-images',
        headers := '{"Content-Type": "application/json"}'::jsonb,
        body   := '{}'::jsonb
    ) as request_id;
    $$
);
