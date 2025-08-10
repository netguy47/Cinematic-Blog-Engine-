import { createClient } from '@supabase/supabase-js'
export async function uploadFromUrlToSupabase(url: string, filename: string) {
  const supabaseUrl = process.env.SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE
  const bucket = process.env.SUPABASE_BUCKET || 'media'
  if (!supabaseUrl || !serviceKey) throw new Error('Supabase env missing')
  const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } })
  const res = await fetch(url); if (!res.ok) throw new Error('Fetch source failed')
  const buf = Buffer.from(await res.arrayBuffer())
  const { error } = await supabase.storage.from(bucket).upload(filename, buf, { contentType: guessContentType(filename), upsert: true })
  if (error) throw error
  const { data } = supabase.storage.from(bucket).getPublicUrl(filename)
  return { publicUrl: data.publicUrl }
}
function guessContentType(name: string) { if (name.endsWith('.mp3')) return 'audio/mpeg'; if (name.endsWith('.png')) return 'image/png'; if (name.endsWith('.jpg')||name.endsWith('.jpeg')) return 'image/jpeg'; return 'application/octet-stream' }
