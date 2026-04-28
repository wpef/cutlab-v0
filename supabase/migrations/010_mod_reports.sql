-- Moderation reports
CREATE TABLE IF NOT EXISTS mod_reports (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  target_id   uuid REFERENCES profiles(id) ON DELETE SET NULL,
  message_id  uuid REFERENCES messages(id) ON DELETE SET NULL,
  reason      text NOT NULL,
  status      text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  created_at  timestamptz DEFAULT now()
);

ALTER TABLE mod_reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "mod_reports_insert_auth" ON mod_reports;
DROP POLICY IF EXISTS "mod_reports_select_own" ON mod_reports;

-- Anyone authenticated can submit a report
CREATE POLICY "mod_reports_insert_auth"
  ON mod_reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);

-- Users can only see their own submitted reports (admins use service role)
CREATE POLICY "mod_reports_select_own"
  ON mod_reports FOR SELECT USING (auth.uid() = reporter_id);
