"use client"
import { useEffect, useState } from 'react'
import { AppState } from '@/lib/types'

export default function Contributions() {
  const [state, setState] = useState<AppState | null>(null)
  async function refresh() {
    const res = await fetch('/api/state', { cache: 'no-store' })
    if (res.ok) setState(await res.json())
  }
  useEffect(() => { refresh(); const id = setInterval(refresh, 5000); return () => clearInterval(id) }, [])
  if (!state?.signInEnabled) return null
  const rows = Object.entries(state.contributions).sort((a,b) => b[1] - a[1])
  return (
    <section className="card">
      <h3 className="font-semibold mb-2">Contributions</h3>
      <div className="text-sm space-y-1">
        {rows.map(([name, count]) => (
          <div key={name} className="flex items-center justify-between">
            <div>{name}</div>
            <div className="text-neutral-500">{count}</div>
          </div>
        ))}
        {!rows.length && <div className="text-neutral-500">No votes yet</div>}
      </div>
    </section>
  )
}

