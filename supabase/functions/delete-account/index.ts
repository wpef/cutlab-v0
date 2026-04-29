import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  const authHeader = req.headers.get('Authorization')
  if (!authHeader) return new Response('Unauthorized', { status: 401, headers: corsHeaders })

  // Use service role to delete auth user — requires SUPABASE_SERVICE_ROLE_KEY secret
  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  )

  // Get user from JWT
  const supabaseUser = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    { global: { headers: { Authorization: authHeader } } },
  )
  const { data: { user }, error: userError } = await supabaseUser.auth.getUser()
  if (userError || !user) return new Response('Unauthorized', { status: 401, headers: corsHeaders })

  const userId = user.id

  // Delete storage objects (avatars)
  const { data: files } = await supabaseAdmin.storage.from('avatars').list(userId)
  if (files?.length) {
    const paths = files.map((f) => `${userId}/${f.name}`)
    await supabaseAdmin.storage.from('avatars').remove(paths)
  }

  // Delete profile data (cascade deletes related rows via FK if configured)
  await supabaseAdmin.from('profiles').delete().eq('id', userId)
  await supabaseAdmin.from('notifications').delete().eq('user_id', userId)
  await supabaseAdmin.from('messages').delete().eq('sender_id', userId)

  // Delete auth user (irreversible)
  const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId)
  if (deleteError) {
    console.error('delete-account: auth delete failed', deleteError)
    return new Response(JSON.stringify({ error: deleteError.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
})
