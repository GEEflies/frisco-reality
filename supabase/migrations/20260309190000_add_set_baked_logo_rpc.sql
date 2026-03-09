-- RPC function to set has_baked_logo (bypasses RLS for the detection script)
CREATE OR REPLACE FUNCTION set_has_baked_logo(image_id uuid, logo_value boolean)
RETURNS void AS $$
BEGIN
  UPDATE listing_images SET has_baked_logo = logo_value WHERE id = image_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
