import { listPosts } from '@/lib/db_supabase'
import Link from 'next/link'
export const dynamic = 'force-dynamic'
export default async function LibraryPage({ searchParams }: any) {
  const q = typeof searchParams?.q === 'string' ? searchParams.q : undefined
  const tag = typeof searchParams?.tag === 'string' ? searchParams.tag : undefined
  const posts = process.env.ENABLE_SUPABASE === 'true' ? await listPosts({ search: q, tag }) : []
  return (
    <div className="card">
      <h1>📚 Library</h1>
      <form action="/library" method="get" style={{ display:'flex', gap:8, margin:'12px 0' }}>
        <input type="text" name="q" placeholder="Search titles..." defaultValue={q} />
        <input type="text" name="tag" placeholder="Tag filter (e.g., AI)" defaultValue={tag} />
        <button type="submit">Search</button>
        <Link href="/">New Post</Link>
      </form>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
        {posts.map(p => (
          <article key={p.id} style={{ border:'1px solid var(--border)', borderRadius:12, padding:12, background:'#0e1324' }}>
            <div style={{ fontSize:12, color:'var(--muted)' }}>{new Date(p.created_at || '').toLocaleString()}</div>
            <h3 style={{ margin:'4px 0 8px' }}>{p.title}</h3>
            {Array.isArray(p.image_urls) && p.image_urls.length > 0 ? (<img src={p.image_urls[0]!} alt={p.title} />) : (<div style={{ border:'1px dashed var(--border)', borderRadius:10, padding:12, color:'var(--muted)' }}>No cover image yet</div>)}
            <p style={{ color:'var(--muted)' }}>{p.excerpt}</p>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              {(p.tags || []).map((t: string) => (<Link key={t} href={`/library?tag=${encodeURIComponent(t)}`} style={{ fontSize:12, border:'1px solid var(--border)', borderRadius:999, padding:'2px 8px', color:'var(--muted)' }}>#{t}</Link>))}
            </div>
            <div style={{ display:'flex', gap:8, marginTop:10 }}>
              {p.published_url && <a href={p.published_url} target="_blank" rel="noreferrer">View Post</a>}
              <Link href={`/?fork=${encodeURIComponent(p.slug)}`}>Fork</Link>
              {p.notion_url && <a href={p.notion_url} target="_blank" rel="noreferrer">Notion</a>}
              <a href={`/compare?slug=${encodeURIComponent(p.slug)}&alt=`}>Compare…</a>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
