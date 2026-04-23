# Runbook — Cleanup `videos` bucket + drop legacy fields

## Prerequisites
- Supabase project backup confirmed (dashboard > Database > Backups, or `pg_dump`).
- UI cleanup commit `47f52f0` already deployed (no new videos can be added).

## Step 1 — Export references (for audit trail)
Run in Supabase SQL editor:
```sql
SELECT id, presentation_video_url
FROM profiles
WHERE presentation_video_url IS NOT NULL AND presentation_video_url <> '';
```
Save the result as `referenced_videos.csv` (local file, for post-migration audit).

## Step 2 — List bucket objects
Supabase Dashboard → Storage → `videos` bucket → list and export all object names.
Or via Supabase CLI: `supabase storage ls videos`

## Step 3 — Delete orphans
For each object in the `videos` bucket:
- If its URL or path does NOT appear in `referenced_videos.csv`, delete it.
- If you do not need any presentation videos anymore (the field is being dropped anyway), you may delete ALL objects in the bucket — this is safe since no code references them.

Option A (surgical): use Supabase Dashboard to delete selected objects.
Option B (wipe): run the script `scripts/cleanup-videos-bucket.mjs` (see below).

```sh
# Dry run — lists objects without deleting
SUPABASE_URL=https://<project>.supabase.co \
SUPABASE_SERVICE_ROLE_KEY=<service_role_key> \
node scripts/cleanup-videos-bucket.mjs

# Actual wipe — pass --confirm to delete all objects
SUPABASE_URL=https://<project>.supabase.co \
SUPABASE_SERVICE_ROLE_KEY=<service_role_key> \
node scripts/cleanup-videos-bucket.mjs --confirm
```

## Step 4 — Apply schema migration
Open `supabase-migration-drop-legacy-fields.sql` in the Supabase SQL editor and run it.

## Step 5 — Verify
Run:
```sql
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'profiles' AND table_schema = 'public'
ORDER BY ordinal_position;
```
Confirm neither `username` nor `presentation_video_url` appears in the result.

## Step 6 — Rollback plan
If anything goes wrong, restore from the backup taken in Prerequisites.
The `videos` bucket objects cannot be restored from a DB backup — they live in object storage.
If you need to restore bucket contents, you must have a separate storage export (e.g. downloaded locally before the wipe).
