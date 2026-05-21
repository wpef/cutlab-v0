-- RLS: projects — extend SELECT to editors with accepted candidatures
-- Fixes: editors lose access to project details when status changes to 'filled'
-- (blocks ChatView header title fetch and ProjectDetail page)

DROP POLICY IF EXISTS "projects_select_published" ON projects;

-- Allow SELECT when:
--   1. project is published (public discovery)
--   2. caller is the creator (always sees own projects)
--   3. caller is an editor with an accepted candidature on this project
CREATE POLICY "projects_select_published"
  ON projects FOR SELECT
  USING (
    status = 'published'
    OR auth.uid() = creator_id
    OR EXISTS (
      SELECT 1
      FROM contact_requests
      WHERE contact_requests.project_id = projects.id
        AND contact_requests.editor_id = auth.uid()
        AND contact_requests.status = 'accepted'
    )
  );
