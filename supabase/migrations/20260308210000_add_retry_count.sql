-- ============================================================
-- Add retry_count to listing_images
--
-- Allows failed images to be automatically retried up to 3 times
-- before being permanently marked as failed.
--
-- retry_count is incremented by enhance-image each time it fails.
-- process-images resets failed images with retry_count < 3 back to pending.
-- After 3 failures the image stays failed — the site falls back to original_url.
-- ============================================================

alter table listing_images
    add column if not exists retry_count integer not null default 0;
