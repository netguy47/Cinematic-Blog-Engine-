type WriteArgs = { topic: string, style: 'satire'|'investigative'|'narrative'|'tutorial', cta?: string }
import { markdownFromSections } from './util'
export async function aiWriteArticle({ topic, style, cta }: WriteArgs) {
  const title = makeTitle(topic, style)
  const sections = makeSections(topic, style)
  const excerpt = makeExcerpt(topic, style)
  const tags = ['AI','Blog','Multimedia','Automation']
  const markdown = markdownFromSections(title, sections, cta)
  return { title, sections, excerpt, tags, markdown }
}
function makeTitle(topic: string, style: WriteArgs['style']) {
  const prefixes = { investigative:'The Real Story:', narrative:'Inside the Moment:', satire:'Hot Takes & Cold Facts:', tutorial:'How To:' } as const
  return `${prefixes[style]} ${topic}`
}
function makeExcerpt(topic: string, style: WriteArgs['style']) {
  const tone = {
    investigative:'A clear-eyed breakdown of what changed, what didn’t, and how to verify it.',
    narrative:'A guided tour through the moving parts and the people feeling the impact.',
    satire:'A sharp, good-faith roast of hype and panic—with receipts.',
    tutorial:'A practical, step-by-step playbook to get results today.'
  } as const
  return `${topic} — ${tone[style]}`
}
function makeSections(topic: string, style: WriteArgs['style']) {
  const base = [
    { heading: 'What Just Happened', body: `A concise summary of the event/topic: ${topic}. Distill the key changes, the sources of confusion, and why readers should care.` },
    { heading: 'Why People Are Reacting', body: `Outline the most common reactions, separating perception from measurable changes. Include 2–3 examples or user scenarios.` },
    { heading: 'What Actually Changed Under the Hood', body: 'List concrete improvements or regressions. Include a short table of before/after behaviors and edge cases.' },
    { heading: 'What the Critics Get Right', body: 'Give the strongest fair criticisms. Explain what must be fixed or clarified.' },
    { heading: 'What the Noise Gets Wrong', body: 'Correct misconceptions using neutral language. Clarify trade-offs.' },
    { heading: 'Actionable Settings & Workarounds', body: 'Offer tweaks that improve real-world outcomes today. Include 3–5 bullet points.' },
    { heading: 'Verdict', body: 'Deliver a direct recommendation. State who benefits, who should wait, and what to watch next.' }
  ]
  if (style === 'tutorial') {
    base.splice(1,0,{ heading:'Prerequisites', body:'Tools and accounts needed. Minimal setup notes.' })
    base.splice(2,0,{ heading:'Step-by-Step', body:'Numbered instructions with checkpoints and expected outputs.' })
  }
  if (style === 'narrative') base[1].body = 'Tell this through a scene: a developer at 2AM, a PM triaging feedback, or a researcher checking benchmarks.'
  if (style === 'satire') base[4].body = 'Correct misconceptions with dry humor; stick to falsifiable claims and keep jokes punchy, not mean.'
  return base
}
