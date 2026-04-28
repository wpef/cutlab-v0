-- RLS: project_reviews — public read, only author can insert, no edits
ALTER TABLE project_reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "project_reviews_select_public" ON project_reviews;
DROP POLICY IF EXISTS "project_reviews_insert_author" ON project_reviews;

-- Reviews are public (social proof on editor profiles)
CREATE POLICY "project_reviews_select_public"
  ON project_reviews FOR SELECT
  USING (true);

-- Only the reviewer (creator) can submit their own review
CREATE POLICY "project_reviews_insert_author"
  ON project_reviews FOR INSERT
  WITH CHECK (auth.uid() = reviewer_id);
