-- ============================================================
-- Prevent duplicate listing_images per photo position
--
-- UC's Export API returns a fresh, opaque image URL on every scrape (the path
-- token and the st=/ts= signature both rotate), so the same photo never keeps a
-- stable URL across imports. The import function used to dedupe by original_url,
-- which therefore never matched on re-import and re-inserted the whole photo set
-- each time — stacking duplicate rows (a broken thumbnail from one scrape plus
-- the full-size image from another) that showed up twice in the gallery.
--
-- import-listings now dedupes by position (sort_order). This constraint is the
-- DB-level backstop: a listing can hold at most one image row per sort_order, so
-- the bug can never silently reappear even if application logic regresses.
--
-- NOTE: existing duplicates must be removed first (see
-- scripts/dedupe_listing_images.py) or this index creation will fail.
-- ============================================================

CREATE UNIQUE INDEX IF NOT EXISTS idx_listing_images_listing_position
    ON listing_images (listing_id, sort_order);
