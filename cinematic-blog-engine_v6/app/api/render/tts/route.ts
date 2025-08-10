import { NextRequest, NextResponse } from 'next/server'
import { renderTTSElevenLabs } from '@/lib/providers/tts_elevenlabs'
import { renderTTSPlayHT } from '@/lib/providers/tts_playht'
import { uploadFromUrlToSupabase } from '@/lib/storage_supabase'

export async function POST(req: NextRequest) {
  try {
    const { ssml } = await req.json()
    const provider = (process.env.TTS_PROVIDER || 'elevenlabs').toLowerCase()
    let url: string | undefined
    if (provider === 'playht') { url = (await renderTTSPlayHT(ssml)).url } else { url = (await renderTTSElevenLabs(ssml)).url }
    if (process.env.ENABLE_SUPABASE === 'true' && url) {
      try { const out = await uploadFromUrlToSupabase(url, `media/${Date.now()}_${Math.random().toString(36).slice(2)}.mp3`); url = out.publicUrl } catch (e) { console.error('SUPABASE_UPLOAD_WARN', e) }
    }
    return NextResponse.json({ url })
  } catch (err: any) {
    console.error('TTS_RENDER_ERROR', err)
    return new NextResponse('TTS render failed', { status: 500 })
  }
}
