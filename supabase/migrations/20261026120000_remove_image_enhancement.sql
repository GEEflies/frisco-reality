-- Remove the AI image enhancement pipeline (2026-10-26).
-- The client does not use it, and its every-minute cron (334k log rows, 127 MB)
-- drained the free-tier disk IO budget and took the site down.
-- The unschedule, log cleanup and RPC drops were first applied live on 2026-10-26.

do $$
begin
    perform cron.unschedule('process-pending-images');
exception when others then
    null;
end;
$$;

truncate cron.job_run_details;

update listing_images
set enhancement_status = 'completed'
where enhancement_status <> 'completed';

drop function if exists claim_pending_images(int);
drop function if exists reset_all_for_reenhancement();
drop function if exists reset_listing_for_reenhancement(uuid);
drop function if exists set_has_baked_logo(uuid, boolean);
