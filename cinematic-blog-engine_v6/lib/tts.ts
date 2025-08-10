type Article = { title: string; sections: { heading: string, body: string }[]; excerpt: string }
export function buildSSML(article: Article) {
  const chunks = article.sections.map(s => `
    <p><s><emphasis level="moderate">${escapeXml(s.heading)}</emphasis></s><s>${escapeXml(s.body)}</s></p>
  `).join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>
<speak>
  <prosody rate="fast" pitch="+1st">${escapeXml(article.title)}</prosody>
  <break time="300ms"/>
  <prosody rate="medium">${escapeXml(article.excerpt)}</prosody>
  <break time="400ms"/>
  <prosody rate="medium">${chunks}</prosody>
</speak>`
}
function escapeXml(s: string) { return s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&apos;') }
