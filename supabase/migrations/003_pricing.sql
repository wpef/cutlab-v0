-- Migration: pricing refactor
-- Prerequisite: full Supabase backup confirmed.
-- Adds a jsonb `pricing` column on profiles and drops the legacy hourly_rate + delivery_time columns.

-- Add new column
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS pricing jsonb NOT NULL DEFAULT '{}'::jsonb;

-- Drop legacy columns (data loss — backup mandatory)
ALTER TABLE profiles DROP COLUMN IF EXISTS hourly_rate;
ALTER TABLE profiles DROP COLUMN IF EXISTS delivery_time;
