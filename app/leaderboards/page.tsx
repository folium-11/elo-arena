"use client"
import { useCallback, useEffect, useMemo, useState } from 'react'
import Leaderboard from '@/components/Leaderboard'
import Tabs from '@/components/Tabs'
import { AppState, Rating } from '@/lib/types'
import { readPersonal } from '@/lib/personal'
import { useLocalStorage } from '@/hooks/useLocalStorage'

export default function LeaderboardsPage() {
  const [tab, setTab] = useState<'global' | 'personal'>('global')
  const [state, setState] = useState<AppState | null>(null)
  const [adminPwd, setAdminPwd] = useLocalStorage('arena_admin_pwd', '')
  const [me, setMe] = useState<{ name?: string; enabled?: boolean } | null>(null)

  const refresh = useCallback(async () => {
    const [s, m] = await Promise.all([
      fetch('/api/state', { cache: 'no-store' }),
      fetch('/api/auth/me', { cache: 'no-store' }),
    ])
    if (s.ok) setState(await s.json())
    if (m.ok) setMe(await m.json())
  }, [])

  useEffect(() => { refresh() }, [refresh])

  const personalRatings: Record<string, Rating> | null = useMemo(() => {
    if (!state) return null
    if (me?.name && state.perUserRatings[me.name]) return state.perUserRatings[me.name]
    // sign-in disabled or not signed-in
    return readPersonal()
  }, [state, me])

  if (!state) return <div className="space-y-4"><div className="text-2xl font-semibold">Leaderboards</div><div>Loading...</div></div>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Leaderboards</h1>
        <Tabs initial="global" tabs={[{ key: 'global', label: 'Global' }, { key: 'personal', label: 'Personal' }]} onChange={(t) => setTab(t)} />
      </div>
      {tab === 'global' && (
        <Leaderboard state={state} adminPassword={adminPwd} onChange={refresh} />
      )}
      {tab === 'personal' && (
        <div className="card">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-semibold">Personal Leaderboard</h3>
            {me?.name ? <div className="text-xs text-neutral-500">Signed in as {me.name}</div> : <div className="text-xs text-neutral-500">Local ratings (cookies)</div>}
          </div>
          <table className="min-w-full text-sm">
            <thead className="text-left text-neutral-500">
              <tr>
                <th className="py-2 pr-4">#</th>
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Rating</th>
                <th className="py-2 pr-4">W-L</th>
                <th className="py-2 pr-4">Win%</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(personalRatings ?? {})
                .map(([id, r]) => ({ id, r, it: state.items.find(i => i.id === id) }))
                .filter(x => !!x.it)
                .map(x => ({ id: x!.id, name: state.nameOverrides[x!.id] ?? x!.it!.baseName, r: x!.r! }))
                .sort((a,b) => b.r.rating - a.r.rating)
                .map((row, idx) => {
                  const total = row.r.wins + row.r.losses
                  const winp = total ? Math.round((row.r.wins / total) * 100) : 0
                  return (
                    <tr key={row.id} className="border-t border-neutral-200/60 dark:border-neutral-800">
                      <td className="py-2 pr-4">{idx + 1}</td>
                      <td className="py-2 pr-4">{row.name}</td>
                      <td className="py-2 pr-4">{Math.round(row.r.rating)}</td>
                      <td className="py-2 pr-4">{row.r.wins}-{row.r.losses}</td>
                      <td className="py-2 pr-4">{winp}%</td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

