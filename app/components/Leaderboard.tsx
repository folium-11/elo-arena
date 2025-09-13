"use client"
import { useEffect, useMemo, useState } from 'react'
import InlineEdit from './InlineEdit'
import { Item, Rating, AppState } from '@/lib/types'

type Row = { id: string; name: string; rating: number; wins: number; losses: number; appearances: number }

function computeRows(items: Item[], ratings: Record<string, Rating>, nameOverrides: Record<string, string>) {
  const rows: Row[] = []
  for (const it of items) {
    const r = ratings[it.id]
    if (!r) continue
    rows.push({ id: it.id, name: nameOverrides[it.id] ?? it.baseName, rating: r.rating, wins: r.wins, losses: r.losses, appearances: r.appearances })
  }
  return rows.sort((a,b) => b.rating - a.rating)
}

export default function Leaderboard({ state, adminPassword, onChange }: { state: AppState; adminPassword?: string; onChange: () => void }) {
  const [editing, setEditing] = useState<string | null>(null)
  const rows = useMemo(() => computeRows(state.items, state.ratings, state.nameOverrides), [state])

  async function saveName(id: string, name: string) {
    setEditing(null)
    if (!adminPassword) return
    await fetch('/api/admin/rename', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: adminPassword, id, name }) })
    onChange()
  }
  async function resetName(id: string) {
    if (!adminPassword) return
    await fetch('/api/admin/rename', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: adminPassword, id, name: '' }) })
    onChange()
  }
  async function removeItem(id: string) {
    if (!adminPassword) return
    if (!confirm('Remove this item?')) return
    await fetch('/api/admin/remove', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: adminPassword, id }) })
    onChange()
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold">Global Leaderboard</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="text-left text-neutral-500">
            <tr>
              <th className="py-2 pr-4">#</th>
              <th className="py-2 pr-4">Name</th>
              <th className="py-2 pr-4">Rating</th>
              <th className="py-2 pr-4">W-L</th>
              <th className="py-2 pr-4">Win%</th>
              <th className="py-2 pr-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => {
              const removable = (state.items.find(i => i.id === r.id)?.source !== 'public')
              const total = r.wins + r.losses
              const winp = total ? Math.round((r.wins / total) * 100) : 0
              return (
                <tr key={r.id} className="border-t border-neutral-200/60 dark:border-neutral-800">
                  <td className="py-2 pr-4">{idx + 1}</td>
                  <td className="py-2 pr-4">
                    {editing === r.id ? (
                      <InlineEdit value={r.name} onSave={v => saveName(r.id, v)} onCancel={() => setEditing(null)} />
                    ) : r.name}
                  </td>
                  <td className="py-2 pr-4">{Math.round(r.rating)}</td>
                  <td className="py-2 pr-4">{r.wins}-{r.losses}</td>
                  <td className="py-2 pr-4">{winp}%</td>
                  <td className="py-2 pr-4 space-x-2">
                    <button className="btn btn-ghost" onClick={() => setEditing(r.id)}>Edit</button>
                    <button className="btn btn-ghost" onClick={() => resetName(r.id)}>Reset</button>
                    {removable && <button className="btn btn-danger" onClick={() => removeItem(r.id)}>Remove</button>}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

