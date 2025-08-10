'use client'
import React, { useEffect, useRef, useState } from 'react'
import styles from './storyboard.module.css'
type Frame = { src?: string; caption?: string; prompt?: string }
export default function StoryboardPlayer({ frames, audioUrl, intervalMs = 4000 }: { frames: Frame[]; audioUrl?: string; intervalMs?: number }) {
  const [index, setIndex] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  useEffect(() => { if (frames.length < 2) return; const id = setInterval(() => setIndex(i => (i + 1) % frames.length), intervalMs); return () => clearInterval(id) }, [frames.length, intervalMs])
  return (
    <div>
      <div className={styles.stage}>
        {frames.map((f, i) => (
          <div key={i} className={styles.layer + ' ' + (i === index ? styles.active : '')} style={{ backgroundImage: f.src ? `url(${f.src})` : undefined }} aria-hidden={i !== index}>
            {!f.src && (<div className={styles.promptCard}><div className={styles.promptTitle}>Image Prompt</div><div className={styles.promptText}>{f.prompt}</div></div>)}
            {f.caption && <div className={styles.caption}>{f.caption}</div>}
          </div>
        ))}
      </div>
      {audioUrl && (<div style={{ marginTop: 12 }}><audio ref={audioRef} controls src={audioUrl} /></div>)}
    </div>
  )
}
