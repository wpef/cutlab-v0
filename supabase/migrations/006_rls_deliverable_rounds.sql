-- RLS: deliverable_rounds — only the two parties of the collab can access
ALTER TABLE deliverable_rounds ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "deliverable_rounds_select_parties" ON deliverable_rounds;
DROP POLICY IF EXISTS "deliverable_rounds_insert_parties" ON deliverable_rounds;
DROP POLICY IF EXISTS "deliverable_rounds_update_parties" ON deliverable_rounds;

-- Access via contact_request which holds creator_id and editor_id
CREATE POLICY "deliverable_rounds_select_parties"
  ON deliverable_rounds FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM contact_requests cr
      WHERE cr.id = deliverable_rounds.request_id
        AND (cr.user_id = auth.uid() OR cr.editor_id = auth.uid())
    )
  );

CREATE POLICY "deliverable_rounds_insert_parties"
  ON deliverable_rounds FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM contact_requests cr
      WHERE cr.id = deliverable_rounds.request_id
        AND (cr.user_id = auth.uid() OR cr.editor_id = auth.uid())
    )
  );

CREATE POLICY "deliverable_rounds_update_parties"
  ON deliverable_rounds FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM contact_requests cr
      WHERE cr.id = deliverable_rounds.request_id
        AND (cr.user_id = auth.uid() OR cr.editor_id = auth.uid())
    )
  );
