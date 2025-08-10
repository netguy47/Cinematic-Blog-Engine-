import { ImageResponse } from '@vercel/og'
export const runtime = 'edge'
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const title = searchParams.get('title') || 'Cinematic Blog Engine'
  const subtitle = searchParams.get('subtitle') || 'Multimedia posts in one click'
  return new ImageResponse(
    (<div style={{display:'flex',height:'100%',width:'100%',background:'radial-gradient(1400px 800px at 80% -10%, #1a2040 0, #0b1024 60%, #070b17 100%)',color:'#e7f0ff',padding:64,flexDirection:'column',justifyContent:'flex-end',fontSize:48}}>
      <div style={{ fontSize:24, opacity:.8, marginBottom:10 }}>Cinematic Blog Engine</div>
      <div style={{ fontWeight:800, lineHeight:1.1 }}>{title}</div>
      <div style={{ fontSize:28, opacity:.85, marginTop:12 }}>{subtitle}</div>
    </div>),
    { width: 1200, height: 630 }
  )
}
