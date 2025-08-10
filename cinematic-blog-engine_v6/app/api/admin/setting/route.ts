import { NextRequest, NextResponse } from 'next/server'
import { basicAuthOk } from '@/lib/auth'
import { setSetting } from '@/lib/db_supabase'
export async function POST(req: NextRequest) {
  if (!basicAuthOk(req.headers.get('authorization'))) return new NextResponse('Unauthorized', { status: 401 })
  try { const { key, value } = await req.json(); await setSetting(key, value); return NextResponse.json({ ok:true }) }
  catch (e:any) { console.error('ADMIN_SETTING_ERR', e); return new NextResponse('Error', { status:500 }) }
}
