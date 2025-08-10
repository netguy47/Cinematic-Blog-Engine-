export function slugify(input: string): string {
  return input.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
}
export function markdownFromSections(title: string, sections: { heading: string, body: string }[], cta?: string) {
  const content = ['# ' + title, '']
  for (const s of sections) { content.push('## ' + s.heading); content.push(s.body); content.push('') }
  if (cta) { content.push('---'); content.push('**Call to Action:** ' + cta) }
  return content.join('\n')
}
