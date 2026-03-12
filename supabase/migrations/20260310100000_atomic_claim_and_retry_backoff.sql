-- ============================================================
-- 1. Add updated_at column for retry backoff tracking
-- 2. Create atomic claim_pending_images RPC to prevent race conditions
-- ============================================================

-- updated_at: tracks when a row was last modified.
-- Used by retry logic to implement backoff (only re-queue failed images
-- that have been in failed state for >5 minutes).
ALTER TABLE listing_images
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Backfill existing rows: set updated_at = created_at where NULL
UPDATE listing_images SET updated_at = COALESCE(updated_at, created_at, NOW());

-- Auto-update trigger: keep updated_at current on every UPDATE
CREATE OR REPLACE FUNCTION update_listing_images_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_listing_images_updated_at ON listing_images;
CREATE TRIGGER trg_listing_images_updated_at
    BEFORE UPDATE ON listing_images
    FOR EACH ROW
    EXECUTE FUNCTION update_listing_images_updated_at();

-- Atomic claim: SELECT + UPDATE in one statement using FOR UPDATE SKIP LOCKED.
-- Prevents two concurrent process-images runs from grabbing the same image.
CREATE OR REPLACE FUNCTION claim_pending_images(batch_limit INT DEFAULT 1)
RETURNS SETOF listing_images AS $$
BEGIN
    RETURN QUERY
    WITH candidates AS (
        SELECT id
        FROM listing_images
        WHERE enhancement_status = 'pending'
        ORDER BY created_at ASC
        LIMIT batch_limit
        FOR UPDATE SKIP LOCKED
    )
    UPDATE listing_images li
    SET enhancement_status = 'processing'
    FROM candidates c
    WHERE li.id = c.id
    RETURNING li.*;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
