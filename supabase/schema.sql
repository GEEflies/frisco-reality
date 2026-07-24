-- ============================================
-- FRISCO REAL ESTATE - DATABASE SCHEMA
-- Built for UC Export API integration
-- https://plt.unitedclassifieds.sk/import/docs/v1/realsoft/docs/export/intro
-- ============================================

-- Drop old tables if migrating from import-based schema
DROP TABLE IF EXISTS listing_images CASCADE;
DROP TABLE IF EXISTS listings CASCADE;
DROP TABLE IF EXISTS agents CASCADE;

-- ============================================
-- LISTINGS (from UC Export API)
-- ============================================
CREATE TABLE listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- UC identifiers
    uc_object_id BIGINT UNIQUE NOT NULL,        -- UC's object_id (never changes; BIGINT — values exceed int4 max)
    agency_id TEXT,                              -- Agency's internal ID (field: id)

    -- Content
    title TEXT NOT NULL,
    description TEXT,
    lang_data JSONB DEFAULT '{}',               -- Multilingual: {"en":{"title":"...","description":"..."}}

    -- Transaction & Category (Export API codes)
    action INTEGER NOT NULL,                    -- 1=Predaj, 2=Kúpa, 3=Prenájom, 4=Hľadám prenájom, 5=Výmena, 6=Dražba
    category INTEGER NOT NULL,                  -- 1=Poľnohosp, 2=Komerčné obj, 3=Pozemky, 4=Byty, 5=Historické, 6=Domy, 7=Hotely, 8=Nájomné domy, 9=Komerčné priestory, 10=Chaty, 11=Garáže
    subcategory INTEGER,                        -- Detailed subcategory (e.g. 401=Garsónka, 403=2-izb. byt)

    -- Pricing
    price DECIMAL(12, 2) NOT NULL DEFAULT 0,
    price_unit INTEGER DEFAULT 1,               -- 1=celkom, 2=m², 3=mesiac, 4=m²/mesiac, 5=rok, 6=m²/rok, 7=deň
    price_currency INTEGER DEFAULT 1,           -- 1=EUR, 3=CZK, 4=GBP, 5=USD, 6=PLN, 7=HUF, 8=RON, 9=RSD
    price_by_agreement BOOLEAN DEFAULT FALSE,
    price_energy DECIMAL(12, 2),
    price_note TEXT,
    unit_price DECIMAL(12, 2),
    guarantee DECIMAL(12, 2),

    -- Location
    state_id INTEGER,
    county_id INTEGER,
    district_id INTEGER,
    region_id INTEGER,
    citypart_id BIGINT,                         -- BIGINT — UC codelist IDs can exceed int4
    street_id BIGINT,                           -- BIGINT — UC codelist IDs can exceed int4
    street TEXT,
    street_number TEXT,
    geo_lat FLOAT,
    geo_lon FLOAT,
    -- Derived location text (populated by webhook from UC code list or reverse geocoding)
    location_city TEXT,
    location_district TEXT,
    location_region TEXT,

    -- Areas
    usable_area DECIMAL(10, 2),
    building_area DECIMAL(10, 2),
    plot_area DECIMAL(10, 2),
    total_area DECIMAL(10, 2),

    -- Property details
    rooms_count INTEGER,
    bathrooms_count INTEGER,
    floor INTEGER,
    floors INTEGER,                             -- Total floors
    floors_under INTEGER,
    placement INTEGER,                          -- 1=podkrovie, 2=vyššie podlažie, 3=vyvýšené prízemie, 4=prízemie, 5=posledné podlažie, 6=nadstavba, 7=suterén
    equip_type INTEGER,                         -- 0=nezáleží, 1=nezariadený, 2=čiastočne, 3=zariadený, 4=holopriestor

    -- Condition & Construction
    condition INTEGER,                          -- 4=vo výstavbe, 5=projekt, 6=novostavba, 7=demolácia, 8=čiastočná rekon, 9=kompletná rekon, 10=pôvodný stav
    age INTEGER,                                -- Year of construction
    year_of_last_reconstruction INTEGER,
    year_of_building_approval INTEGER,
    building_type INTEGER,                      -- 1=drevená, 2=tehlová, 3=kamenná, 4=montovaná, 5=panelová, 6=skeletová, 7=zmiešaná, ...
    ownership INTEGER,                          -- 1=osobné, 2=družstevné, 3=iné, 4=firemné, 5=štátne, 6=obecné, 7=nevysporiadané
    energy_cert INTEGER,                        -- 1=A, 2=B, 3=C, 4=D, 5=E, 6=F, 7=G, 99=Nemá
    energy_rating INTEGER,                      -- 1=klasické mat., 2=energeticky úsporný, 3=nízkoenergetický, 4=pasívny, 5=nulový
    orientation INTEGER,                        -- 1=južná, 2=západná, 3=juhozápadná, 4=severná, 5=východná, 6=juhovýchodná, 7=severozápadná, 8=severovýchodná
    house_type INTEGER,                         -- 1=klasický, 2=vila, 3=bungalov, 4=drevený, 5=zrub, 6=dvojgeneračný

    -- Status (Export API codes)
    status INTEGER DEFAULT 1,                   -- 1=Aktívna, 2=Kontaktovanie, 3=Rezervované, 4=Predané, 5=Zrušené, 6=Inkognito, 7=Korekcia, 8=Prenajatá, 9=Zrealizovaná

    -- Agent info
    agent_id TEXT,
    agent_name TEXT,
    agent_email TEXT,
    agent_phone TEXT,

    -- SEO
    slug TEXT UNIQUE,

    -- Flags
    is_top BOOLEAN DEFAULT FALSE,
    is_exclusive BOOLEAN DEFAULT FALSE,
    is_luxury BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,

    -- All extra boolean fields from Export API stored as JSONB
    -- (heating_central, balcony, garage, floor_floating, window_plastic, etc.)
    extra_data JSONB DEFAULT '{}',

    -- Video/media links: {"youtube":["url1"],"matterport":["url2"]}
    medias JSONB DEFAULT '{}',

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- LISTING IMAGES (with AI enhancement tracking)
-- ============================================
CREATE TABLE listing_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
    original_url TEXT NOT NULL,
    enhanced_url TEXT,
    upscaled_url TEXT,
    enhancement_status TEXT DEFAULT 'pending'
        CHECK (enhancement_status IN ('pending', 'processing', 'completed', 'failed')),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- AGENTS (from UC Export API action=2)
-- ============================================
CREATE TABLE agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    uc_user_id TEXT UNIQUE NOT NULL,             -- UC's user_id (never changes)
    full_name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    photo_url TEXT,
    is_sora BOOLEAN DEFAULT FALSE,
    is_nark BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_listings" ON listings FOR SELECT USING (true);
CREATE POLICY "public_read_images" ON listing_images FOR SELECT USING (true);
CREATE POLICY "public_read_agents" ON agents FOR SELECT USING (true);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_listings_action ON listings(action);
CREATE INDEX idx_listings_category ON listings(category);
CREATE INDEX idx_listings_slug ON listings(slug);
CREATE INDEX idx_listings_created ON listings(created_at DESC);
CREATE INDEX idx_listings_not_deleted ON listings(is_deleted) WHERE is_deleted = FALSE;
CREATE INDEX idx_listing_images_listing ON listing_images(listing_id);
CREATE INDEX idx_listing_images_status ON listing_images(enhancement_status);
-- At most one image row per photo position — backstops the position-based dedup
-- in import-listings so re-imports can never stack duplicate rows for one photo.
CREATE UNIQUE INDEX idx_listing_images_listing_position ON listing_images(listing_id, sort_order);
CREATE INDEX idx_agents_uc_user_id ON agents(uc_user_id);

-- ============================================
-- AUTO-UPDATE TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

CREATE TRIGGER update_listings_updated_at
    BEFORE UPDATE ON listings FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agents_updated_at
    BEFORE UPDATE ON agents FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SLUG GENERATION (helper)
-- ============================================
DROP FUNCTION IF EXISTS sluggify(text);
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
        '[^a-z0-9\s-]', '', 'g'
      ),
      '\s+', '-', 'g'
    ),
    '-+', '-', 'g'
  );
END;
$$;

-- ============================================
-- STORAGE BUCKETS (create via Supabase Dashboard > Storage)
-- ============================================
-- Create bucket: enhanced-images (public)
-- Create bucket: original-images (public)
