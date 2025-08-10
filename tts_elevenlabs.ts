export async function renderTTSElevenLabs(ssml: string) {
  const key = process.env.TTS_API_KEY
  const voice = process.env.TTS_VOICE_ID
  const base = process.env.TTS_BASE_URL || 'https://api.elevenlabs.io'
  if (!key || !voice) throw new Error('TTS_API_KEY and TTS_VOICE_ID required')
  const res = await fetch(`${base}/v1/text-to-speech/${voice}/stream`, { method:'POST', headers:{ 'xi-api-key':key, 'Content-Type':'application/json' }, body: JSON.stringify({ model_id:'eleven_multilingual_v2', text:ssml }) })
  if (!res.ok) throw new Error('ElevenLabs TTS error: ' + await res.text())
  const buf = Buffer.from(await res.arrayBuffer())
  const file = `/tmp/tts_${Date.now()}.mp3`
  await import('node:fs/promises').then(fs => fs.writeFile(file, buf))
  const publicBase = process.env.PUBLIC_BASE_URL || 'http://localhost:3000'
  return { url: `${publicBase}/api/media?f=${encodeURIComponent(file)}` }
}
