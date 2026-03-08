-- ============================================
-- CRON: Trigger image enhancement every 30 minutes
-- ============================================
-- Uses pg_cron + pg_net to call the process-images Edge Function.
-- process-images picks up listing_images with enhancement_status='pending',
-- sends each to enhance-image (Gemini), and updates the DB.
-- If no pending images exist, it returns immediately.
-- ============================================

-- Enable required extensions
create extension if not exists pg_cron with schema pg_catalog;
create extension if not exists pg_net with schema extensions;

-- Remove any existing schedule with this name (idempotent)
do $$
begin
    perform cron.unschedule('process-pending-images');
exception when others then
    -- Job doesn't exist yet, that's fine
    null;
end;
$$;

-- Schedule every 30 minutes
select cron.schedule(
    'process-pending-images',
    '*/30 * * * *',
    $$
    select net.http_post(
        url    := 'https://fcvswlurtchqorgnwclw.supabase.co/functions/v1/process-images',
        headers := '{"Content-Type": "application/json", "Authorization": "Bearer ***REDACTED_SUPABASE_ANON_KEY***"}'::jsonb,
        body   := '{}'::jsonb
    ) as request_id;
    $$
);
