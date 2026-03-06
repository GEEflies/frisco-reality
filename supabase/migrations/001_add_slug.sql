-- ============================================
-- MIGRATION: Slug auto-generation (fallback)
-- The import-listings Edge Function normally pre-fills slug in TypeScript.
-- This trigger acts as a safety net for any row inserted without one.
-- Uses Export API column names: action (1-6), category (1-11), subcategory (3-digit)
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

-- 3. Helper: Slovak diacritics → ASCII for URL-safe slugs
--    (Replaces the version in export_api_schema.sql with a cleaner translate() approach)
CREATE OR REPLACE FUNCTION sluggify(input TEXT)
RETURNS TEXT
LANGUAGE plpgsql IMMUTABLE
SET search_path = public
AS $$
BEGIN
  RETURN regexp_replace(
    regexp_replace(
      regexp_replace(
        lower(
          translate(
            input,
            'áäčďéíĺľňóôŕšťúýžÁÄČĎÉÍĹĽŇÓÔŔŠŤÚÝŽöüß',
            'aacdeillnoorstuyzaacdeillnoorstuyzouß'
          )
        ),
        '[^a-z0-9\s-]', '', 'g'   -- remove non-alphanumeric (except spaces and hyphens)
      ),
      '\s+', '-', 'g'              -- spaces → hyphens
    ),
    '-+', '-', 'g'                 -- collapse multiple hyphens
  );
END;
$$;

-- 4. Slug generator using Export API codes
--    Pattern: {action}-{subcategory}-{title}-{short-id}
--    Example: predaj-3-izbovy-byt-luxusny-byt-v-centre-a1b2c3d4
CREATE OR REPLACE FUNCTION generate_listing_slug()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  v_action TEXT;
  v_type TEXT;
  v_base TEXT;
  v_slug TEXT;
  v_short_id TEXT;
BEGIN
  -- Only generate if slug is not already set
  IF NEW.slug IS NOT NULL AND NEW.slug != '' THEN
    RETURN NEW;
  END IF;

  -- Map action (Export API: 1-6) → Slovak URL keyword
  v_action := CASE NEW.action
    WHEN 1 THEN 'predaj'
    WHEN 2 THEN 'kupa'
    WHEN 3 THEN 'prenajom'
    WHEN 4 THEN 'hladam-prenajom'
    WHEN 5 THEN 'vymena'
    WHEN 6 THEN 'drazba'
    ELSE 'detail'
  END;

  -- Map subcategory (Export API: 3-4 digit codes) → Slovak URL keyword
  -- Falls back to category (1-11) if subcategory is NULL
  v_type := CASE NEW.subcategory
    -- Category 4: Byty
    WHEN 401 THEN 'garsonka'
    WHEN 408 THEN 'dvojgarsonka'
    WHEN 402 THEN '1-izbovy-byt'
    WHEN 403 THEN '2-izbovy-byt'
    WHEN 404 THEN '3-izbovy-byt'
    WHEN 405 THEN '4-izbovy-byt'
    WHEN 406 THEN '5-izbovy-byt'
    WHEN 409 THEN 'mezonet'
    WHEN 410 THEN 'apartman'
    WHEN 411 THEN 'loft'
    -- Category 6: Domy a vily
    WHEN 603 THEN 'rodinny-dom'
    WHEN 604 THEN 'vila'
    WHEN 607 THEN 'vidiecky-dom'
    WHEN 608 THEN 'mobilny-dom'
    -- Category 3: Pozemky
    WHEN 302 THEN 'stavebny-pozemok'
    WHEN 306 THEN 'zahrada'
    WHEN 313 THEN 'rekreacny-pozemok'
    WHEN 309 THEN 'orna-poda'
    -- Category 9: Komerčné priestory
    WHEN 901 THEN 'kancelaria'
    WHEN 902 THEN 'obchodny-priestor'
    WHEN 903 THEN 'sklad'
    WHEN 906 THEN 'restauracia'
    -- Category 7: Hotely
    WHEN 701 THEN 'hotel-penzion'
    WHEN 703 THEN 'restauracia'
    -- Category 10: Chaty
    WHEN 1001 THEN 'chata'
    WHEN 1002 THEN 'chalupa'
    -- Category 11: Garáže
    WHEN 1101 THEN 'garaz'
    ELSE NULL
  END;

  -- If subcategory didn't match, fall back to broad category
  IF v_type IS NULL THEN
    v_type := CASE NEW.category
      WHEN 1  THEN 'polnohospodarsky-objekt'
      WHEN 2  THEN 'komercny-objekt'
      WHEN 3  THEN 'pozemok'
      WHEN 4  THEN 'byt'
      WHEN 5  THEN 'historicky-objekt'
      WHEN 6  THEN 'dom'
      WHEN 7  THEN 'hotel'
      WHEN 8  THEN 'najomny-dom'
      WHEN 9  THEN 'komercny-priestor'
      WHEN 10 THEN 'chata'
      WHEN 11 THEN 'garaz'
      ELSE 'nehnutelnost'
    END;
  END IF;

  -- Short ID: first 8 chars of UUID
  v_short_id := left(NEW.id::text, 8);

  -- Build: "predaj-3-izbovy-byt-nazov-nehnutelnosti-a1b2c3d4"
  v_base := v_action || '-' || v_type || '-' || sluggify(COALESCE(NEW.title, ''));
  v_slug := v_base || '-' || v_short_id;

  -- Truncate if too long (max 120 chars for SEO)
  IF length(v_slug) > 120 THEN
    v_slug := left(v_base, 120 - 9) || '-' || v_short_id;
  END IF;

  NEW.slug := v_slug;
  RETURN NEW;
END;
$$;

-- 5. Attach trigger
DROP TRIGGER IF EXISTS trg_generate_listing_slug ON listings;
CREATE TRIGGER trg_generate_listing_slug
  BEFORE INSERT OR UPDATE ON listings
  FOR EACH ROW
  EXECUTE FUNCTION generate_listing_slug();

-- 6. Backfill slugs for any existing listings that don't have one
UPDATE listings SET slug = NULL WHERE slug IS NULL OR slug = '';
-- The trigger fires on UPDATE, so setting to NULL will auto-generate slugs
