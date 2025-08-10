export async function renderImageOpenAI(prompt: string) {
  const key = process.env.IMAGE_API_KEY || process.env.OPENAI_API_KEY
  const base = process.env.IMAGE_BASE_URL || 'https://api.openai.com/v1'
  const model = process.env.IMAGE_MODEL || 'gpt-image-1'
  if (!key) throw new Error('IMAGE_API_KEY or OPENAI_API_KEY not set')
  const res = await fetch(`${base}/images`, { method:'POST', headers:{ 'Content-Type':'application/json','Authorization':`Bearer ${key}` }, body: JSON.stringify({ model, prompt, size:'1792x1024' }) })
  if (!res.ok) throw new Error('OpenAI image error: ' + await res.text())
  const json: any = await res.json()
  const url = json?.data?.[0]?.url
  if (!url) throw new Error('No image URL in response')
  return { url }
}
