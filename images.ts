type Section = { heading: string; body: string }
export function buildImagePrompts(sections: Section[]) {
  return sections.slice(0, 6).map((s) => ({
    section: s.heading,
    prompt: `Cinematic 16:9 illustration for section "${s.heading}": ${summarize(s.body)}; realistic lighting, slight film grain, crisp detail.`
  }))
}
export async function maybeGenerateImages(prompts: string[]): Promise<string[]> { return [] }
function summarize(text: string) { const t = text.replace(/\s+/g,' ').trim(); return t.length>160? t.slice(0,157)+'…' : t }
