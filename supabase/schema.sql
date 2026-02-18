-- ============================================
-- SUPABASE DATABASE SCHEMA
-- Run this in Supabase SQL Editor
-- ============================================

-- Listings table (imported from UC API)
CREATE TABLE IF NOT EXISTS listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  uc_source_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(12,2) NOT NULL DEFAULT 0,
  currency TEXT DEFAULT 'EUR',
  category_id INTEGER,
  transaction_id INTEGER,
  usable_area DECIMAL(10,2),
  land_area DECIMAL(10,2),
  building_area DECIMAL(10,2),
  rooms_count INTEGER,
  floor INTEGER,
  year_of_construction INTEGER,
  location_region TEXT,
  location_district TEXT,
  location_city TEXT,
  street TEXT,
  slug TEXT UNIQUE,
  geo_lat TEXT,
  geo_lon TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'reserved', 'sold', 'rented')),
  real_estate_state INTEGER,
  ownership INTEGER,
  building_type INTEGER[],
  heating_system INTEGER[],
  estate_equipment INTEGER[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Images table (tracks original + enhanced versions)
CREATE TABLE IF NOT EXISTS listing_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  original_url TEXT NOT NULL,
  enhanced_url TEXT,
  upscaled_url TEXT,
  enhancement_status TEXT DEFAULT 'pending' CHECK (enhancement_status IN ('pending', 'processing', 'completed', 'failed')),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_images ENABLE ROW LEVEL SECURITY;

-- Public read access policies (anyone can view listings)
CREATE POLICY "Allow public read access on listings" ON listings
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access on listing_images" ON listing_images
  FOR SELECT USING (true);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_category ON listings(category_id);
CREATE INDEX IF NOT EXISTS idx_listings_transaction ON listings(transaction_id);
CREATE INDEX IF NOT EXISTS idx_listings_slug ON listings(slug);
CREATE INDEX IF NOT EXISTS idx_listings_created ON listings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_listing_images_listing ON listing_images(listing_id);
CREATE INDEX IF NOT EXISTS idx_listing_images_status ON listing_images(enhancement_status);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_listings_updated_at
  BEFORE UPDATE ON listings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- STORAGE BUCKETS (run in Supabase Dashboard > Storage)
-- ============================================
-- Create bucket: enhanced-images (public)
-- Create bucket: original-images (public)
