export async function renderTTSPlayHT(ssml: string) {
  const key = process.env.TTS_API_KEY
  const base = process.env.TTS_BASE_URL || 'https://api.play.ht/api/v2'
  if (!key) throw new Error('TTS_API_KEY required')
  const res = await fetch(`${base}/tts`, { method:'POST', headers:{ 'Authorization':`Bearer ${key}`, 'Content-Type':'application/json' }, body: JSON.stringify({ text:ssml, voice:'Jenny', quality:'high', format:'mp3', voice_engine:'PlayHT2.0-turbo', output_format:'mp3' }) })
  if (!res.ok) throw new Error('PlayHT TTS error: ' + await res.text())
  const json: any = await res.json()
  const url = json?.url || json?.audioUrl || json?.audio
  if (!url) throw new Error('No TTS URL in response')
  return { url }
}
