-- Add is_demo flag to projects.
-- Demo projects appear in the editor feed with a "DEMO" badge and disable candidature.
-- Set manually via SQL (no UI toggle in ProjectForm).
ALTER TABLE projects ADD COLUMN IF NOT EXISTS is_demo BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS projects_is_demo_idx ON projects (is_demo) WHERE is_demo = true;
