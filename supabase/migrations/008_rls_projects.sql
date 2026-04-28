-- RLS: projects — public read for published projects, owner-only write
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "projects_select_published" ON projects;
DROP POLICY IF EXISTS "projects_select_own" ON projects;
DROP POLICY IF EXISTS "projects_insert_owner" ON projects;
DROP POLICY IF EXISTS "projects_update_owner" ON projects;
DROP POLICY IF EXISTS "projects_delete_owner" ON projects;

-- Anyone can browse published projects (catalog, discovery)
CREATE POLICY "projects_select_published"
  ON projects FOR SELECT
  USING (status = 'published' OR auth.uid() = creator_id);

CREATE POLICY "projects_insert_owner"
  ON projects FOR INSERT
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "projects_update_owner"
  ON projects FOR UPDATE
  USING (auth.uid() = creator_id);

CREATE POLICY "projects_delete_owner"
  ON projects FOR DELETE
  USING (auth.uid() = creator_id);
