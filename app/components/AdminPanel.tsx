"use client"
import { useEffect, useState } from 'react'
import Uploader from './Uploader'

export default function AdminPanel({ onChanged }: { onChanged?: () => void }) {
  const [pwd, setPwd] = useState('')
  const [title, setTitle] = useState('')
  const [textName, setTextName] = useState('')

  useEffect(() => {
    const p = localStorage.getItem('arena_admin_pwd')
    if (p) setPwd(p)
  }, [])

  async function saveTitle() {
    localStorage.setItem('arena_admin_pwd', pwd)
    const res = await fetch('/api/admin/title', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: pwd, title }), cache: 'no-store' })
    if (res.ok) onChanged?.()
  }
  async function addText() {
    localStorage.setItem('arena_admin_pwd', pwd)
    const res = await fetch('/api/admin/add-text', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: pwd, name: textName }), cache: 'no-store' })
    if (res.ok) { setTextName(''); onChanged?.() }
  }
  function onUnauthorizedLocalFallback() {
    // No-op: local images would be handled here via IndexedDB (out of scope minimal fallback)
  }
  return (
    <section className="card">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold">Admin</h3>
        <div className="text-xs text-neutral-500">Password required</div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm">Admin Password</label>
          <input className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-transparent" type="password" value={pwd} onChange={e => setPwd(e.target.value)} placeholder="••••••" />
          <label className="text-sm">Arena Title</label>
          <div className="flex gap-2">
            <input className="flex-1 px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-transparent" value={title} onChange={e => setTitle(e.target.value)} placeholder="Elo Arena" />
            <button className="btn btn-primary" onClick={saveTitle}>Save</button>
          </div>
          <label className="text-sm">Add Text Item</label>
          <div className="flex gap-2">
            <input className="flex-1 px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-transparent" value={textName} onChange={e => setTextName(e.target.value)} placeholder="New item name" />
            <button className="btn btn-primary" onClick={addText}>Add</button>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm">Upload Images</label>
          <Uploader adminPassword={pwd} onUnauthorized={onUnauthorizedLocalFallback} onDone={() => onChanged?.()} />
        </div>
      </div>
    </section>
  )
}
