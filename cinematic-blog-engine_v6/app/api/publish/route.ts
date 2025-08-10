import { NextRequest, NextResponse } from 'next/server'
import { publishToWordPress } from '@/lib/wordpress'
import { adminClient } from '@/lib/db_supabase'

export async function POST(req: NextRequest) {
  try {
    const { payload } = await req.json()
    const { permalink, postId } = await publishToWordPress(payload)
    try {
      if (process.env.ENABLE_SUPABASE === 'true') {
        const sb = adminClient()
        await sb.from('posts').update({ published_url: permalink }).eq('slug', payload.slug)
      }
    } catch (e) { console.error('SUPABASE_PUBLISH_WARN', e) }
    return NextResponse.json({ ok: true, permalink, postId })
  } catch (err: any) {
    console.error('PUBLISH_ERROR', err)
    return new NextResponse('Publish failed', { status: 500 })
  }
}
