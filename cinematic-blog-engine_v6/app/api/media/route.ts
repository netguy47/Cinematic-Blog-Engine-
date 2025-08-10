import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'node:fs/promises'
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const f = url.searchParams.get('f')
    if (!f) return new NextResponse('Missing f', { status: 400 })
    const data = await readFile(f)
    return new NextResponse(data, { headers: { 'Content-Type': 'audio/mpeg' } })
  } catch (err: any) { console.error('MEDIA_PROXY_ERROR', err); return new NextResponse('Not found', { status: 404 }) }
}
