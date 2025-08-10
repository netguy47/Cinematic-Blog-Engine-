export async function renderImageStability(prompt: string) {
  const key = process.env.IMAGE_API_KEY
  const base = process.env.IMAGE_BASE_URL || 'https://api.stability.ai'
  const model = process.env.IMAGE_MODEL || 'stable-image-ultra'
  if (!key) throw new Error('IMAGE_API_KEY not set')
  const res = await fetch(`${base}/v2beta/stable-image/generate/ultra`, { method:'POST', headers:{ 'Authorization':`Bearer ${key}`, 'Accept':'application/json', 'Content-Type':'application/json' }, body: JSON.stringify({ prompt, output_format:'png', aspect_ratio:'16:9' }) })
  if (!res.ok) throw new Error('Stability image error: ' + await res.text())
  const json: any = await res.json()
  const url = json?.image?.url || json?.artifacts?.[0]?.url
  if (!url) throw new Error('No image URL in response')
  return { url }
}
