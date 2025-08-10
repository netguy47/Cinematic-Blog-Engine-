import { NextRequest, NextResponse } from 'next/server'
import { publishToWordPress } from '@/lib/wordpress'
import { publishToNotion } from '@/lib/notion'
import { adminClient } from '@/lib/db_supabase'

export async function POST(req: NextRequest) {
  try {
    const { payload } = await req.json()
    const results: any = {}
    // Publish to WordPress
    const { permalink } = await publishToWordPress(payload)
    results.wordpress = permalink
    // Publish to Notion
    const { url } = await publishToNotion(payload)
    results.notion = url

    // Persist both URLs
    try {
      if (process.env.ENABLE_SUPABASE === 'true') {
        const sb = adminClient()
        await sb.from('posts').update({ published_url: permalink, notion_url: url }).eq('slug', payload.slug)
      }
    } catch (e) { console.error('SUPABASE_DUAL_WARN', e) }

    return NextResponse.json({ ok: true, ...results })
  } catch (err: any) {
    console.error('PUBLISH_DUAL_ERROR', err)
    return new NextResponse('Dual publish failed', { status: 500 })
  }
}
