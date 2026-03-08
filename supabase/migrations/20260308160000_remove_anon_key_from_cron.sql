-- ============================================
-- Remove leaked anon key from cron job headers
-- The process-images function uses --no-verify-jwt so no auth header is needed.
-- ============================================

-- Drop the old schedule
do $$
begin
    perform cron.unschedule('process-pending-images');
exception when others then
    null;
end;
$$;

-- Re-create without Authorization header
select cron.schedule(
    'process-pending-images',
    '*/30 * * * *',
    $$
    select net.http_post(
        url    := 'https://fcvswlurtchqorgnwclw.supabase.co/functions/v1/process-images',
        headers := '{"Content-Type": "application/json"}'::jsonb,
        body   := '{}'::jsonb
    ) as request_id;
    $$
);
