'use client'
import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import StoryboardPlayer from '@/components/StoryboardPlayer'

type GenerateResponse = {
  title: string
  slug: string
  markdown: string
  imagePrompts: { section: string, prompt: string }[]
  ssml: string
  seo: { excerpt: string, tags: string[], ogTitle: string, ogDescription: string }
  media?: { images?: string[], audioUrl?: string }
}

export default function Page() {
  const [topic, setTopic] = useState('GPT-5 launch backlash: what actually changed?')
  const [style, setStyle] = useState<'satire' | 'investigative' | 'narrative' | 'tutorial'>('investigative')
  const [cta, setCta] = useState('Subscribe for weekly deep-dives.')
  const [status, setStatus] = useState<string>('')
  const [result, setResult] = useState<GenerateResponse | null>(null)
  const [publishing, setPublishing] = useState(false)
  const onPublishDual = async () => {
    if (!result) return
    setPublishing(true); setStatus('Publishing to WordPress + Notion...')
    try {
      const { data } = await axios.post('/api/publish-dual', { payload: result })
      setStatus('Dual publish → WP: ' + data?.wordpress + ' | Notion: ' + data?.notion)
    } catch (err: any) { console.error(err); setStatus('Dual publish error. Check server logs.') }
    finally { setPublishing(false) }
  }


  // Prefill when forking via /?fork=slug (simple)
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search)
    const fork = sp.get('fork')
    if (fork) setTopic(`Fork of ${fork}: alternate timeline`)
  }, [])

  const onGenerate = async () => {
    setStatus('Generating...'); setResult(null)
    try {
      const { data } = await axios.post<GenerateResponse>('/api/generate', { topic, style, cta })
      setResult(data); setStatus('Generated. Review below.')
    } catch (err: any) { console.error(err); setStatus('Error generating content. Check server logs.') }
  }

  const onPublish = async () => {
    if (!result) return
    setPublishing(true); setStatus('Publishing to WordPress...')
    try {
      const { data } = await axios.post('/api/publish', { payload: result })
      setStatus('Published: ' + data?.permalink)
    } catch (err: any) { console.error(err); setStatus('Publish error. Check server logs.') }
    finally { setPublishing(false) }
  }

  const onPublishNotion = async () => {
    if (!result) return
    setStatus('Publishing to Notion...')
    try {
      const { data } = await axios.post('/api/publish-notion', { payload: result })
      setStatus('Notion: ' + data?.url)
    } catch (err: any) { console.error(err); setStatus('Notion publish error.') }
  }

  return (
    <div className="card">
      <h1>🎬 Cinematic Blog Engine (v5)</h1>
      <p className="small">Enter a topic. Get article + image prompts + SSML. Optional: auto-render and one-click publish.</p>
      <div className="row">
        <div>
          <label>Topic or Headline</label>
          <input value={topic} onChange={e => setTopic(e.target.value)} placeholder="Type your topic..." />
        </div>
        <div>
          <label>Style</label>
          <select value={style} onChange={e => setStyle(e.target.value as any)}>
            <option value="investigative">Investigative</option>
            <option value="narrative">Narrative</option>
            <option value="satire">Satire</option>
            <option value="tutorial">Tutorial</option>
          </select>
        </div>
      </div>
      <label>Call to Action</label>
      <input value={cta} onChange={e => setCta(e.target.value)} placeholder="e.g., Subscribe for updates" />

      <div style={{ marginTop: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <button onClick={onGenerate}>Generate</button>
        <button onClick={onPublish} disabled={!result || publishing}>Publish</button>
        <button onClick={onPublishNotion} disabled={!result}>Publish → Notion</button>
        <button onClick={onPublishDual} disabled={!result || publishing}>Publish → Both</button>
        <a href="/library">Library</a>
        <a href="/admin">Admin</a>
        <span className="small">{status}</span>
      </div>

      {result && (
        <div style={{ marginTop: 24 }}>
          <h2>Preview</h2>
          <div className="grid">
            <div>
              <h3>Markdown</h3>
              <pre><code>{result.markdown}</code></pre>
              <h3>SSML</h3>
              <pre><code>{result.ssml}</code></pre>
            </div>
            <div>
              <h3>Image Prompts</h3>
              <ul>{result.imagePrompts.map((p, i) => (<li key={i}><strong>{p.section}:</strong> {p.prompt}</li>))}</ul>
              <h3>Storyboard</h3>
              <StoryboardPlayer
                frames={(result.media?.images || result.imagePrompts.map(ip => ''))
                  .map((srcOrEmpty, i) => (srcOrEmpty ? { src: srcOrEmpty, caption: result.imagePrompts[i]?.section } : { prompt: result.imagePrompts[i]?.prompt, caption: result.imagePrompts[i]?.section }))}
                audioUrl={result.media?.audioUrl}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
