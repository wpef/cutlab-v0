-- Admin policies: allow users with role='admin' to read all profiles and reports
-- Required for /admin/users and /admin/reports pages to function

CREATE POLICY "admins_read_all_profiles" ON profiles
  FOR SELECT USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "admins_view_all_reports" ON mod_reports
  FOR SELECT USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );
