import { NextRequest, NextResponse } from 'next/server'
import { basicAuthOk } from '@/lib/auth'
import { enqueue } from '@/lib/db_supabase'
export async function POST(req: NextRequest) {
  if (!basicAuthOk(req.headers.get('authorization'))) return new NextResponse('Unauthorized', { status: 401 })
  try { const body = await req.json(); const row = await enqueue(body?.payload); return NextResponse.json({ ok:true, id:row.id }) }
  catch (e:any) { console.error('ADMIN_ENQUEUE_ERR', e); return new NextResponse('Error', { status:500 }) }
}
