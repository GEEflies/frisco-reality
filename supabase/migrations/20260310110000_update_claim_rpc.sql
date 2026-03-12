-- Update claim_pending_images: remove enhanced_url IS NULL filter
-- to support re-enhancement of already-enhanced images.
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
