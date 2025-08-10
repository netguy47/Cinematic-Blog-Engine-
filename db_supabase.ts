import { createClient } from '@supabase/supabase-js'
export type PostRecord = { id: string; title: string; slug: string; excerpt: string; tags: string[]; markdown: string; image_prompts: { section: string, prompt: string }[]; audio_url?: string | null; image_urls?: string[] | null; created_at?: string; published_url?: string | null; notion_url?: string | null }
export type SettingRecord = { key: string; value: string; updated_at?: string }
export type QueueRecord = { id: string; payload: any; status: 'queued'|'published'|'error'; created_at?: string; result_url?: string | null; error?: string | null }
export function adminClient() { const url = process.env.SUPABASE_URL!; const key = process.env.SUPABASE_SERVICE_ROLE!; if (!url || !key) throw new Error('Missing Supabase service role env'); return createClient(url, key, { auth: { persistSession: false } }) }
export async function upsertPost(p: PostRecord) { const sb = adminClient(); const { error } = await sb.from('posts').upsert(p, { onConflict: 'slug' }); if (error) throw error }
export async function listPosts(query?: { search?: string, tag?: string }) { const sb = adminClient(); let req = sb.from('posts').select('*').order('created_at', { ascending: false }); if (query?.tag) req = req.contains('tags', [query.tag]); if (query?.search) req = req.ilike('title', `%${query.search}%`); const { data, error } = await req; if (error) throw error; return data as PostRecord[] }
export async function getSettings() { const sb = adminClient(); const { data, error } = await sb.from('settings').select('*'); if (error) throw error; return (data || []) as SettingRecord[] }
export async function setSetting(key: string, value: string) { const sb = adminClient(); const { error } = await sb.from('settings').upsert({ key, value }); if (error) throw error }
export async function enqueue(payload: any) { const sb = adminClient(); const { data, error } = await sb.from('queue').insert({ payload, status: 'queued' }).select().single(); if (error) throw error; return data as QueueRecord }
export async function popQueue() { const sb = adminClient(); const { data, error } = await sb.from('queue').select('*').eq('status','queued').order('created_at').limit(1); if (error) throw error; const item = (data || [])[0] as QueueRecord | undefined; return item || null }
export async function markQueue(id: string, status: QueueRecord['status'], result_url?: string, errorMsg?: string) { const sb = adminClient(); const { error } = await sb.from('queue').update({ status, result_url, error: errorMsg }).eq('id', id); if (error) throw error }


export async function getPostBySlug(slug: string) {
  const sb = adminClient();
  const { data, error } = await sb.from('posts').select('*').eq('slug', slug).limit(1).single();
  if (error) throw error;
  return data as PostRecord;
}
