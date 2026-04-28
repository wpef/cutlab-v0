-- Migration: drop legacy fields (username + presentation_video_url)
-- Prerequisite: full Supabase backup confirmed.
-- IMPORTANT: Run bucket cleanup (see cleanup-videos-bucket.md) BEFORE this migration
--            so you can cross-reference presentation_video_url values against bucket objects.

-- ──────────────────────────────────────────────────────────────────────────────
-- Step 1 — Drop any UNIQUE constraint / index on `username` (idempotent)
-- ──────────────────────────────────────────────────────────────────────────────

-- Drop named UNIQUE constraint if it exists (Supabase may have auto-created one)
DO $$
DECLARE
  constraint_name text;
BEGIN
  SELECT conname INTO constraint_name
  FROM pg_constraint
  WHERE conrelid = 'public.profiles'::regclass
    AND contype = 'u'
    AND conkey = ARRAY[
      (SELECT attnum FROM pg_attribute
       WHERE attrelid = 'public.profiles'::regclass AND attname = 'username')
    ]::smallint[];

  IF constraint_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS %I', constraint_name);
    RAISE NOTICE 'Dropped UNIQUE constraint: %', constraint_name;
  ELSE
    RAISE NOTICE 'No UNIQUE constraint found on profiles.username — skipping.';
  END IF;
END $$;

-- Drop unique index on username if one exists independently of a constraint
DO $$
DECLARE
  idx_name text;
BEGIN
  SELECT indexname INTO idx_name
  FROM pg_indexes
  WHERE tablename = 'profiles'
    AND schemaname = 'public'
    AND indexdef LIKE '%UNIQUE%'
    AND indexdef LIKE '%username%';

  IF idx_name IS NOT NULL THEN
    EXECUTE format('DROP INDEX IF EXISTS public.%I', idx_name);
    RAISE NOTICE 'Dropped UNIQUE index: %', idx_name;
  ELSE
    RAISE NOTICE 'No standalone UNIQUE index found on profiles.username — skipping.';
  END IF;
END $$;

-- ──────────────────────────────────────────────────────────────────────────────
-- Step 2 — Drop the columns (both idempotent via IF EXISTS)
-- ──────────────────────────────────────────────────────────────────────────────

ALTER TABLE public.profiles DROP COLUMN IF EXISTS username;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS presentation_video_url;
