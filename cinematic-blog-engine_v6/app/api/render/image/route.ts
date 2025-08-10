import { NextRequest, NextResponse } from 'next/server'
import { renderImageOpenAI } from '@/lib/providers/images_openai'
import { renderImageStability } from '@/lib/providers/images_stability'
import { uploadFromUrlToSupabase } from '@/lib/storage_supabase'

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json()
    const provider = (process.env.IMAGE_PROVIDER || 'openai').toLowerCase()
    let url: string | undefined
    if (provider === 'stability') { url = (await renderImageStability(prompt)).url } else { url = (await renderImageOpenAI(prompt)).url }
    if (process.env.ENABLE_SUPABASE === 'true' && url) {
      try { const out = await uploadFromUrlToSupabase(url, `media/${Date.now()}_${Math.random().toString(36).slice(2)}.png`); url = out.publicUrl } catch (e) { console.error('SUPABASE_UPLOAD_WARN', e) }
    }
    return NextResponse.json({ url })
  } catch (err: any) {
    console.error('IMAGE_RENDER_ERROR', err)
    return new NextResponse('Image render failed', { status: 500 })
  }
}
