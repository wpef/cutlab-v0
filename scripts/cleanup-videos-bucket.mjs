// Usage: node scripts/cleanup-videos-bucket.mjs --confirm
// Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars.
//
// Without --confirm: performs a dry run — lists all objects in the "videos" bucket.
// With --confirm:    deletes ALL objects in the "videos" bucket (irreversible).
//
// Run bucket cleanup BEFORE the schema migration so you can still cross-reference
// presentation_video_url values (see cleanup-videos-bucket.md for full runbook).

import { createClient } from '@supabase/supabase-js'

const confirmed = process.argv.includes('--confirm')
const url = process.env.SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !key) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars.')
  process.exit(1)
}

const supabase = createClient(url, key)

async function main() {
  const { data: objects, error } = await supabase.storage.from('videos').list('', { limit: 1000 })
  if (error) { console.error('List failed:', error.message); process.exit(1) }
  console.log(`Found ${objects.length} object(s) in "videos" bucket.`)

  if (!confirmed) {
    console.log('DRY RUN. Pass --confirm to delete all listed objects.')
    objects.forEach((o) => console.log(' - ' + o.name))
    return
  }

  const paths = objects.map((o) => o.name)
  if (paths.length === 0) { console.log('Nothing to delete.'); return }

  const { error: delErr } = await supabase.storage.from('videos').remove(paths)
  if (delErr) { console.error('Delete failed:', delErr.message); process.exit(1) }
  console.log(`Deleted ${paths.length} object(s).`)
}

main()
