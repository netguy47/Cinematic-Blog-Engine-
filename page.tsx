
'use client'

import { useEffect, useState } from 'react'

export default function AdminPage() {
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [msg, setMsg] = useState('')
  const [settingKey, setSettingKey] = useState('ENABLE_RENDER_IMAGES')
  const [settingValue, setSettingValue] = useState('true')
  const [enqueuePayload, setEnqueuePayload] = useState('')

  useEffect(() => {
    setUser(localStorage.getItem('ADMIN_USER') || '')
    setPass(localStorage.getItem('ADMIN_PASS') || '')
  }, [])

  const authHeader = () => 'Basic ' + btoa(`${user}:${pass}`)

  async function postSetting() {
    setMsg('Saving setting...')
    try {
      const res = await fetch('/api/admin/setting', {
        method: 'POST',
        headers: { 'Authorization': authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: settingKey, value: settingValue })
      })
      if (!res.ok) throw new Error(await res.text())
      setMsg('Setting saved.')
    } catch (e: any) { setMsg('Error: ' + e.message) }
  }

  async function enqueue() {
    setMsg('Enqueuing...')
    try {
      const body = enqueuePayload ? JSON.parse(enqueuePayload) : {}
      const res = await fetch('/api/admin/enqueue', {
        method: 'POST',
        headers: { 'Authorization': authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ payload: body })
      })
      if (!res.ok) throw new Error(await res.text())
      const j = await res.json()
      setMsg('Queued: ' + j.id)
    } catch (e: any) { setMsg('Error: ' + e.message) }
  }

  return (
    <div className="card">
      <h1>🔐 Admin (Client Actions)</h1>
      <p className="small">Enter your Basic Auth credentials (from env) to perform server actions. Values are stored in localStorage for convenience.</p>

      <div className="row">
        <div>
          <label>Admin user</label>
          <input value={user} onChange={e => { setUser(e.target.value); localStorage.setItem('ADMIN_USER', e.target.value) }} />
        </div>
        <div>
          <label>Admin password</label>
          <input type="password" value={pass} onChange={e => { setPass(e.target.value); localStorage.setItem('ADMIN_PASS', e.target.value) }} />
        </div>
      </div>

      <h2>Update Setting</h2>
      <div className="row">
        <input value={settingKey} onChange={e => setSettingKey(e.target.value)} placeholder="Key e.g. ENABLE_RENDER_IMAGES" />
        <input value={settingValue} onChange={e => setSettingValue(e.target.value)} placeholder="Value e.g. true" />
      </div>
      <button onClick={postSetting}>Save Setting</button>

      <h2 style={{ marginTop: 16 }}>Enqueue Publish</h2>
      <textarea value={enqueuePayload} onChange={e => setEnqueuePayload(e.target.value)} placeholder='{"payload": { ... }}'></textarea>
      <button onClick={enqueue}>Enqueue</button>

      <div style={{ marginTop: 12 }} className="small">{msg}</div>
    </div>
  )
}
