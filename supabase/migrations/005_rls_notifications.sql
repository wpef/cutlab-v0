-- RLS: notifications — users can only read/delete their own notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "notifications_select_own" ON notifications;
DROP POLICY IF EXISTS "notifications_delete_own" ON notifications;
DROP POLICY IF EXISTS "notifications_insert_service" ON notifications;

CREATE POLICY "notifications_select_own"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "notifications_delete_own"
  ON notifications FOR DELETE
  USING (auth.uid() = user_id);

-- Only service role (triggers/functions) can insert notifications
CREATE POLICY "notifications_insert_service"
  ON notifications FOR INSERT
  WITH CHECK (auth.uid() = user_id);
