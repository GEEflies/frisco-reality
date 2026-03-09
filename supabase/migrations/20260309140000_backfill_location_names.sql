-- Backfill location_city, location_district, location_region from UC codelist IDs
-- region_id → Obec (municipality/city)
-- district_id → Okres (district)
-- county_id → Kraj (region/county)

UPDATE listings SET
  location_city = CASE region_id
    WHEN 504009 THEN 'Sereď'
    WHEN 504050 THEN 'Šoporňa'
    WHEN 504114 THEN 'Váhovce'
    WHEN 504131 THEN 'Veľké Úľany'
    WHEN 504157 THEN 'Vinohrady nad Váhom'
    WHEN 518042 THEN 'Terchová'
    ELSE location_city
  END,
  location_district = CASE district_id
    WHEN 202 THEN 'Galanta'
    WHEN 511 THEN 'Žilina'
    ELSE location_district
  END,
  location_region = CASE county_id
    WHEN 2 THEN 'Trnavský kraj'
    WHEN 5 THEN 'Žilinský kraj'
    ELSE location_region
  END
WHERE location_city IS NULL AND is_deleted = false;
