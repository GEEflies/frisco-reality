-- ============================================================
-- Add has_baked_logo to listing_images
--
-- Stores the result of automated logo detection.
-- A Python script scans the bottom-right corner of each image
-- for the red FRISCO watermark (baked in by UC Export API).
--
-- NULL  = not yet scanned
-- TRUE  = red FRISCO logo detected → do NOT show CSS overlay
-- FALSE = no logo detected → show CSS overlay
-- ============================================================

alter table listing_images
    add column if not exists has_baked_logo boolean default null;
