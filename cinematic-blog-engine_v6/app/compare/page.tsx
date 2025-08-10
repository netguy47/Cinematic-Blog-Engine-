import { getPostBySlug } from '@/lib/db_supabase'

export const dynamic = 'force-dynamic'

export default async function ComparePage({ searchParams }: any) {
  const a = typeof searchParams?.slug === 'string' ? searchParams.slug : undefined
  const b = typeof searchParams?.alt === 'string' ? searchParams.alt : undefined
  if (!a || !b) return <div className="card"><h1>Compare</h1><p className="small">Provide ?slug=...&alt=...</p></div>

  if (process.env.ENABLE_SUPABASE !== 'true') {
    return <div className="card"><h1>Compare</h1><p className="small">Enable Supabase to use comparison.</p></div>
  }

  const [left, right] = await Promise.all([getPostBySlug(a), getPostBySlug(b)])

  return (
    <div className="card">
      <h1>🪞 Fork & Compare</h1>
      <p className="small">Side-by-side view of two versions. Use this to evaluate alternate timelines before publishing.</p>
      <div className="grid">
        <section>
          <h2>{left.title}</h2>
          {Array.isArray(left.image_urls) && left.image_urls?.[0] ? <img src={left.image_urls[0]} alt={left.title} /> : null}
          <pre><code>{left.markdown}</code></pre>
        </section>
        <section>
          <h2>{right.title}</h2>
          {Array.isArray(right.image_urls) && right.image_urls?.[0] ? <img src={right.image_urls[0]} alt={right.title} /> : null}
          <pre><code>{right.markdown}</code></pre>
        </section>
      </div>
    </div>
  )
}
