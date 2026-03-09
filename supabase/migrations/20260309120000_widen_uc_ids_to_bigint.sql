-- ============================================
-- Widen UC-sourced ID columns from INTEGER to BIGINT
--
-- UC's object_id values can exceed 2^31-1 (2,147,483,647).
-- Observed failures:
--   "2641779781" is out of range for type integer
--   "3440856281" is out of range for type integer
--
-- Fix: ALTER the columns to BIGINT (int8, max ~9.2 × 10^18).
-- Also widen street_id and citypart_id preventively — they
-- come from UC's codelist and could grow beyond int4 range.
-- ============================================

ALTER TABLE listings ALTER COLUMN uc_object_id TYPE BIGINT;
ALTER TABLE listings ALTER COLUMN street_id     TYPE BIGINT;
ALTER TABLE listings ALTER COLUMN citypart_id   TYPE BIGINT;
