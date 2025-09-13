"use client"
import { useEffect, useState } from 'react'

export default function SuperAdminPanel({ onChanged }: { onChanged?: () => void }) {
  const [status, setStatus] = useState<{ isMine: boolean; held: boolean; since?: number } | null>(null)
  const [pwd, setPwd] = useState('')
  const [enabled, setEnabled] = useState(false)
  const [allow, setAllow] = useState('')

  async function refresh() {
    const res = await fetch('/api/super/status', { cache: 'no-store' })
    if (res.ok) setStatus(await res.json())
  }
  useEffect(() => { refresh() }, [])

  async function claim() {
    const res = await fetch('/api/super/claim', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: pwd || undefined }), cache: 'no-store' })
    await refresh()
  }
  async function clearLock() {
    const res = await fetch('/api/super/clear', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: pwd }), cache: 'no-store' })
    await refresh()
  }
  async function saveConfig() {
    const names = allow.split('\n').map(s => s.trim()).filter(Boolean)
    await fetch('/api/super/config', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: pwd || undefined, signInEnabled: enabled, allowedNames: names }), cache: 'no-store' })
    onChanged?.();
  }
  async function exportState() {
    const res = await fetch('/api/super/export', { cache: 'no-store' })
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'elo-arena-state.json'; a.click(); URL.revokeObjectURL(url)
  }
  async function importState(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const text = await file.text()
    await fetch('/api/super/import', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: pwd || undefined, data: text }), cache: 'no-store' })
    onChanged?.()
  }
  async function resetData() {
    await fetch('/api/super/reset', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: pwd || undefined }), cache: 'no-store' })
    onChanged?.()
  }

  return (
    <section className="card border-oj/30">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-oj">Super Admin</h3>
        <div className="text-xs text-neutral-500">OJ lock required</div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm">Super Admin Password</label>
          <input className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-transparent" type="password" value={pwd} onChange={e => setPwd(e.target.value)} placeholder="••••••" />
          <div className="flex gap-2">
            <button className="btn btn-oj" onClick={claim}>Claim OJ Lock</button>
            <button className="btn btn-danger" onClick={clearLock}>Clear Lock</button>
          </div>
          <div className="text-xs text-neutral-500">
            Status: {status?.held ? (status?.isMine ? 'Held by you' : 'Held by someone else') : 'Free'}
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input id="sien" type="checkbox" checked={enabled} onChange={e => setEnabled(e.target.checked)} />
            <label htmlFor="sien">Enable sign-in gate</label>
          </div>
          <label className="text-sm">Allowed Names (one per line)</label>
          <textarea className="w-full min-h-[120px] px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-transparent" value={allow} onChange={e => setAllow(e.target.value)} placeholder={'Alice\nBob'} />
          <div className="flex gap-2 flex-wrap">
            <button className="btn btn-oj" onClick={saveConfig}>Save Config</button>
            <button className="btn btn-ghost" onClick={exportState}>Export State</button>
            <label className="btn btn-ghost cursor-pointer">Import JSON<input type="file" accept="application/json" className="hidden" onChange={importState} /></label>
            <button className="btn btn-danger" onClick={resetData}>Reset Arena Data</button>
          </div>
        </div>
      </div>
    </section>
  )
}
