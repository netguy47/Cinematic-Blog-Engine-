import { NextRequest, NextResponse } from 'next/server'
import { publishToNotion } from '@/lib/notion'
import { adminClient } from '@/lib/db_supabase'

export async function POST(req: NextRequest) {
  try {
    const { payload } = await req.json()
    const { url, pageId } = await publishToNotion(payload)
    try {
      if (process.env.ENABLE_SUPABASE === 'true') {
        const sb = adminClient()
        await sb.from('posts').update({ notion_url: url }).eq('slug', payload.slug)
      }
    } catch (e) { console.error('SUPABASE_NOTION_WARN', e) }
    return NextResponse.json({ ok: true, url, pageId })
  } catch (err: any) {
    console.error('NOTION_PUBLISH_ERROR', err)
    return new NextResponse('Publish to Notion failed', { status: 500 })
  }
}
