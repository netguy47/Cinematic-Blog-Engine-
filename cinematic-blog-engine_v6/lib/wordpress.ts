type Payload = { title: string; slug: string; markdown: string; seo: { excerpt: string, tags: string[], ogTitle: string, ogDescription: string }; imagePrompts: { section: string, prompt: string }[]; ssml: string }
export async function publishToWordPress(payload: Payload) {
  const base = process.env.WP_BASE_URL
  const user = process.env.WP_USERNAME
  const app = process.env.WP_APP_PASSWORD
  const status = process.env.WP_DEFAULT_STATUS || 'draft'
  if (!base || !user || !app) throw new Error('WordPress env vars missing.')

  const auth = Buffer.from(`${user}:${app}`).toString('base64')
  const body = { title: payload.title, slug: payload.slug, status, excerpt: payload.seo.excerpt, content: serializeContent(payload) }
  const res = await fetch(`${base}/wp-json/wp/v2/posts`, { method:'POST', headers:{ 'Content-Type':'application/json', 'Authorization': `Basic ${auth}` }, body: JSON.stringify(body) })
  if (!res.ok) throw new Error('WordPress error: ' + await res.text())
  const json = await res.json() as any
  const permalink = json?.link ?? `${base}/?p=${json?.id}`
  return { postId: json?.id, permalink }
}
function serializeContent(p: Payload) {
  const imgList = p.imagePrompts.map(ip => `<li><strong>${escapeHtml(ip.section)}:</strong> ${escapeHtml(ip.prompt)}</li>`).join('')
  const content = [`<p><em>${escapeHtml(p.seo.ogDescription)}</em></p>`,`<hr/>`,`<h2>Article</h2>`,`<pre>${escapeHtml(p.markdown)}</pre>`,`<h2>Image Prompts</h2>`,`<ul>${imgList}</ul>`,`<h2>Narration (SSML)</h2>`,`<pre>${escapeHtml(p.ssml)}</pre>`].join('\n')
  return content
}
function escapeHtml(s: string) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;') }
