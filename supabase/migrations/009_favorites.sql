-- Favorites: creators can bookmark editor profiles
CREATE TABLE IF NOT EXISTS favorites (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  editor_id  uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(creator_id, editor_id)
);

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "favorites_select_own" ON favorites;
DROP POLICY IF EXISTS "favorites_insert_own" ON favorites;
DROP POLICY IF EXISTS "favorites_delete_own" ON favorites;

CREATE POLICY "favorites_select_own"
  ON favorites FOR SELECT USING (auth.uid() = creator_id);

CREATE POLICY "favorites_insert_own"
  ON favorites FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "favorites_delete_own"
  ON favorites FOR DELETE USING (auth.uid() = creator_id);
