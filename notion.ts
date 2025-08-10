type Payload = { title: string; slug: string; markdown: string; seo: { excerpt: string, tags: string[], ogTitle: string, ogDescription: string }; imagePrompts: { section: string, prompt: string }[]; ssml: string }
export async function publishToNotion(payload: Payload) {
  const token = process.env.NOTION_TOKEN
  const parent = process.env.NOTION_PARENT_PAGE
  if (!token || !parent) throw new Error('Missing NOTION_TOKEN or NOTION_PARENT_PAGE')
  const headers = { 'Authorization': `Bearer ${token}`, 'Notion-Version':'2022-06-28', 'Content-Type':'application/json' }
  const title = payload.title
  const createRes = await fetch('https://api.notion.com/v1/pages', { method:'POST', headers, body: JSON.stringify({ parent:{ type:'page_id', page_id: parent }, properties:{ title:{ title:[{ type:'text', text:{ content: title } }] } } }) })
  if (!createRes.ok) throw new Error('Notion create error: ' + await createRes.text())
  const page = await createRes.json()
  const blocks:any[] = []
  blocks.push(paragraph(payload.seo.ogDescription))
  blocks.push(heading('Article (Markdown)'))
  for (const chunk of chunkText(payload.markdown, 1800)) blocks.push(codeBlock(chunk,'markdown'))
  blocks.push(heading('Image Prompts')); for (const ip of payload.imagePrompts) blocks.push(bullet(`${ip.section}: ${ip.prompt}`))
  blocks.push(heading('Narration (SSML)')); for (const chunk of chunkText(payload.ssml, 1800)) blocks.push(codeBlock(chunk,'xml'))
  const appendRes = await fetch(`https://api.notion.com/v1/blocks/${page.id}/children`, { method:'PATCH', headers, body: JSON.stringify({ children: blocks }) })
  if (!appendRes.ok) throw new Error('Notion append error: ' + await appendRes.text())
  const url = page.url; return { pageId: page.id, url }
}
function paragraph(text:string){ return { object:'block', type:'paragraph', paragraph:{ rich_text:[{ type:'text', text:{ content:text } }] } } }
function heading(text:string){ return { object:'block', type:'heading_2', heading_2:{ rich_text:[{ type:'text', text:{ content:text } }] } } }
function bullet(text:string){ return { object:'block', type:'bulleted_list_item', bulleted_list_item:{ rich_text:[{ type:'text', text:{ content:text } }] } } }
function codeBlock(text:string, lang:string){ return { object:'block', type:'code', code:{ language:lang, rich_text:[{ type:'text', text:{ content:text } }] } } }
function chunkText(s:string, max:number){ const out:string[]=[]; let i=0; while(i<s.length){ out.push(s.slice(i,i+max)); i+=max } return out }
