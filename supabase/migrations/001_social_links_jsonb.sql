-- Migration: social_links text -> jsonb (5 platforms)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS social_links_new jsonb DEFAULT '{}'::jsonb;

UPDATE profiles
SET social_links_new = CASE
  WHEN social_links IS NULL OR social_links = '' THEN '{}'::jsonb
  WHEN social_links ~* '^https?://' THEN jsonb_build_object('portfolio', social_links)
  ELSE jsonb_build_object('other', social_links)
END
WHERE social_links_new = '{}'::jsonb OR social_links_new IS NULL;

ALTER TABLE profiles DROP COLUMN social_links;
ALTER TABLE profiles RENAME COLUMN social_links_new TO social_links;
ALTER TABLE profiles ALTER COLUMN social_links SET DEFAULT '{}'::jsonb;
ALTER TABLE profiles ALTER COLUMN social_links SET NOT NULL;
