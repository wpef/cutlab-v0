-- Migration: extend offers table with project fields
-- Run with backup first

-- Rename format → content_format
ALTER TABLE public.offers RENAME COLUMN format TO content_format;

-- Add missing project-model columns
ALTER TABLE public.offers
  ADD COLUMN budget_type        text CHECK (budget_type IN ('fixed', 'range')) DEFAULT 'fixed',
  ADD COLUMN budget_min         numeric,
  ADD COLUMN budget_max         numeric,
  ADD COLUMN quality            text,
  ADD COLUMN video_count        integer,
  ADD COLUMN video_duration     text,
  ADD COLUMN thumbnail_included boolean DEFAULT false,
  ADD COLUMN niches             text[],
  ADD COLUMN preferred_software text[],
  ADD COLUMN required_languages text[],
  ADD COLUMN experience_level   text,
  ADD COLUMN mission_type       text,
  ADD COLUMN rushes_info        text;
