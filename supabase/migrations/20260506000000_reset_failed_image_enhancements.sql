-- ============================================================
-- Reset stuck 'failed' image rows
--
-- After Gemini removed image-gen from the free tier (March 2026),
-- many images accumulated in enhancement_status='failed' with retry_count=3.
-- The cron's recovery loop only re-queues rows with retry_count < 3, so they
-- were stuck.
--
-- With AI_ENHANCEMENT_ENABLED defaulting to false, enhance-image now
-- short-circuits to 'completed' without calling Gemini. To clear stuck rows
-- in one shot (instead of waiting for them to be touched), drop them straight
-- to 'completed' here. enhanced_url stays null; getBestImageUrl() falls back
-- to original_url so the gallery still renders.
-- ============================================================

update listing_images
set enhancement_status = 'completed',
    retry_count = 0,
    updated_at = now()
where enhancement_status = 'failed';
