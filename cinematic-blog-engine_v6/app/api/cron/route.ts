import { NextRequest, NextResponse } from 'next/server'
import { publishToWordPress } from '@/lib/wordpress'
import { popQueue, markQueue } from '@/lib/db_supabase'

export async function POST(req: NextRequest) {
  return new NextResponse('Use /api/admin/enqueue', { status: 400 })
}
export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization') || ''
  const secret = process.env.CRON_SECRET || ''
  if (!secret || auth !== `Bearer ${secret}`) return new NextResponse('Unauthorized', { status: 401 })
  try {
    const item = await popQueue()
    if (!item) return NextResponse.json({ ok: true, published: 0 })
    const { permalink } = await publishToWordPress(item.payload)
    await markQueue(item.id, 'published', permalink)
    return NextResponse.json({ ok: true, published: 1, permalink })
  } catch (e: any) {
    console.error('CRON_ERR', e)
    return new NextResponse('Cron failed', { status: 500 })
  }
}
