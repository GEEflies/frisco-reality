-- ============================================
-- MIGRATION: Add slug column + auto-generation
-- Safe to run on an existing database (won't break anything)
-- Paste this into Supabase SQL Editor
-- ============================================

-- 1. Add slug column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'listings' AND column_name = 'slug'
  ) THEN
    ALTER TABLE listings ADD COLUMN slug TEXT UNIQUE;
  END IF;
END $$;

-- 2. Create index for fast slug lookups
CREATE INDEX IF NOT EXISTS idx_listings_slug ON listings(slug);

-- 3. Helper function: Slovak diacritics → ASCII for URL-safe slugs
CREATE OR REPLACE FUNCTION sluggify(input TEXT) RETURNS TEXT AS $$
BEGIN
  RETURN regexp_replace(
    regexp_replace(
      regexp_replace(
        lower(
          translate(
            input,
            'áäčďéíĺľňóôŕšťúýžÁÄČĎÉÍĹĽŇÓÔŔŠŤÚÝŽ',
            'aacdeillnoorstuyzaacdeillnoorstuyz'
          )
        ),
        '[^\w\s-]', '', 'g'   -- remove non-word chars (except spaces and hyphens)
      ),
      '\s+', '-', 'g'         -- spaces → hyphens
    ),
    '-+', '-', 'g'            -- collapse multiple hyphens
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 4. Function: auto-generate slug on INSERT (or UPDATE if slug is NULL)
--    Pattern: {transaction}-{category}-{title}-{short-id}
--    Example: predaj-4-izbovy-byt-luxusny-byt-v-centre-a1b2c3d4
CREATE OR REPLACE FUNCTION generate_listing_slug() RETURNS TRIGGER AS $$
DECLARE
  v_transaction TEXT;
  v_category TEXT;
  v_base TEXT;
  v_slug TEXT;
  v_short_id TEXT;
BEGIN
  -- Only generate if slug is not already set
  IF NEW.slug IS NOT NULL AND NEW.slug != '' THEN
    RETURN NEW;
  END IF;

  -- Map transaction ID → Slovak URL keyword
  v_transaction := CASE NEW.transaction_id
    WHEN 122 THEN 'kupa'
    WHEN 123 THEN 'prenajom'
    WHEN 124 THEN 'prenajom'
    WHEN 127 THEN 'predaj'
    ELSE 'detail'
  END;

  -- Map category ID → Slovak URL keyword
  v_category := CASE NEW.category_id
    WHEN 9  THEN 'garsonka'
    WHEN 10 THEN 'dvojgarsonka'
    WHEN 11 THEN '1-izbovy-byt'
    WHEN 12 THEN '2-izbovy-byt'
    WHEN 13 THEN '3-izbovy-byt'
    WHEN 14 THEN '4-izbovy-byt'
    WHEN 15 THEN '5-izbovy-byt'
    WHEN 16 THEN 'apartman'
    WHEN 17 THEN 'podkrovie'
    WHEN 18 THEN 'mezonet'
    WHEN 20 THEN 'rodinny-dom'
    WHEN 21 THEN 'vidiecky-dom'
    WHEN 27 THEN 'chata'
    WHEN 30 THEN 'pozemok'
    WHEN 31 THEN 'rekreacny-pozemok'
    WHEN 32 THEN 'stavebny-pozemok'
    WHEN 37 THEN 'zahrada'
    WHEN 46 THEN 'kancelaria'
    WHEN 47 THEN 'obchodny-priestor'
    WHEN 48 THEN 'restauracny-priestor'
    WHEN 49 THEN 'skladovy-priestor'
    WHEN 55 THEN 'bytovy-dom'
    WHEN 65 THEN 'hotel-penzion'
    ELSE 'nehnutelnost'
  END;

  -- Short ID: first 8 chars of UUID (unique enough, keeps URL short)
  v_short_id := left(NEW.id::text, 8);

  -- Build: "predaj-3-izbovy-byt-nazov-nehnutelnosti-a1b2c3d4"
  v_base := v_transaction || '-' || v_category || '-' || sluggify(NEW.title);
  v_slug := v_base || '-' || v_short_id;

  -- Truncate if too long (max 120 chars for SEO best practice)
  IF length(v_slug) > 120 THEN
    v_slug := left(v_base, 120 - 9) || '-' || v_short_id;
  END IF;

  NEW.slug := v_slug;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. Attach trigger to listings table
DROP TRIGGER IF EXISTS trg_generate_listing_slug ON listings;
CREATE TRIGGER trg_generate_listing_slug
  BEFORE INSERT OR UPDATE ON listings
  FOR EACH ROW
  EXECUTE FUNCTION generate_listing_slug();

-- 6. Backfill slugs for any existing listings that don't have one
UPDATE listings SET slug = NULL WHERE slug IS NULL OR slug = '';
-- The trigger fires on UPDATE, so setting them to NULL will auto-generate slugs

-- Done! All new imports will automatically get SEO-friendly slugs.
