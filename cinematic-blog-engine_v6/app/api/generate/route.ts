import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { aiWriteArticle } from '@/lib/openai'
import { buildImagePrompts } from '@/lib/images'
import { buildSSML } from '@/lib/tts'
import { slugify } from '@/lib/util'
import { upsertPost } from '@/lib/db_supabase'

const Body = z.object({ topic: z.string().min(4), style: z.enum(['satire','investigative','narrative','tutorial']), cta: z.string().min(0).default('') })

export async function POST(req: NextRequest) {
  try {
    const json = await req.json()
    const { topic, style, cta } = Body.parse(json)

    const article = await aiWriteArticle({ topic, style, cta })
    const imagePrompts = buildImagePrompts(article.sections)
    const ssml = buildSSML(article)

    // Optional auto-render (images + tts)
    const media: { images?: string[], audioUrl?: string } = {}
    try {
      if (process.env.ENABLE_RENDER_IMAGES === 'true') {
        const prompts = imagePrompts.map(p => p.prompt)
        const urls: string[] = []
        for (const pr of prompts) {
          const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/render/image`, { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ prompt: pr }) })
          if (res.ok) { const j = await res.json(); if (j?.url) urls.push(j.url) }
        }
        if (urls.length) media.images = urls
      }
      if (process.env.ENABLE_RENDER_TTS === 'true') {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/render/tts`, { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ ssml }) })
        if (res.ok) { const j = await res.json(); if (j?.url) media.audioUrl = j.url }
      }
    } catch (e) { console.error('AUTO_RENDER_WARN', e) }

    const payload = {
      title: article.title,
      slug: slugify(article.title),
      markdown: article.markdown,
      imagePrompts,
      ssml,
      seo: { excerpt: article.excerpt, tags: article.tags, ogTitle: article.title, ogDescription: article.excerpt },
      media
    }

    try {
      if (process.env.ENABLE_SUPABASE === 'true') {
        await upsertPost({
          id: crypto.randomUUID(),
          title: payload.title,
          slug: payload.slug,
          excerpt: payload.seo.excerpt,
          tags: payload.seo.tags,
          markdown: payload.markdown,
          image_prompts: payload.imagePrompts,
          image_urls: media.images || null,
          audio_url: media.audioUrl || null
        })
      }
    } catch (e) { console.error('SUPABASE_DRAFT_WARN', e) }

    return NextResponse.json(payload)
  } catch (err: any) {
    console.error('GENERATION_ERROR', err)
    return new NextResponse('Bad Request', { status: 400 })
  }
}
