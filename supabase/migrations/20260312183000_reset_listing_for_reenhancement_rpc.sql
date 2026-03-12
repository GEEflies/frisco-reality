-- Reset one listing's images for re-enhancement.
-- SECURITY DEFINER bypasses RLS so it can be called with the anon key.
CREATE OR REPLACE FUNCTION reset_listing_for_reenhancement(target_listing_id uuid)
RETURNS INTEGER AS $$
DECLARE
    affected INTEGER;
BEGIN
    UPDATE listing_images
    SET enhancement_status = 'pending',
        has_baked_logo = NULL,
        retry_count = 0
    WHERE listing_id = target_listing_id;

    GET DIAGNOSTICS affected = ROW_COUNT;
    RETURN affected;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
