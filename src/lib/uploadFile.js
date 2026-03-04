import { supabase } from './supabase'

/**
 * Upload a file to Supabase Storage and return the public URL.
 *
 * @param {string} bucket  — Storage bucket name ('avatars' or 'videos')
 * @param {string} path    — Path inside the bucket (e.g. 'userId/filename.jpg')
 * @param {File}   file    — The File object to upload
 * @returns {Promise<string|null>} — Public URL or null on failure
 */
export async function uploadFile(bucket, path, file) {
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: true })

  if (error) {
    console.error(`[Upload] ${bucket}/${path}:`, error.message)
    return null
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data?.publicUrl ?? null
}
