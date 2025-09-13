"use client"
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Pair, AppState } from '@/lib/types'
import VoteCard from './VoteCard'
import { SkeletonCard } from './Skeleton'
import { useInterval } from '@/hooks/useInterval'
import { useKey } from '@/hooks/useKey'
import Toast, { triggerToast } from './Toast'

export default function Arena() {
  const [pair, setPair] = useState<Pair | null>(null)
  const [state, setState] = useState<AppState | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchPair = useCallback(async () => {
    const res = await fetch('/api/pair', { cache: 'no-store' })
    if (res.ok) setPair(await res.json())
  }, [])

  const fetchState = useCallback(async () => {
    const res = await fetch('/api/state', { cache: 'no-store' })
    if (res.ok) setState(await res.json())
  }, [])

  useEffect(() => { (async () => { await Promise.all([fetchPair(), fetchState()]); setLoading(false) })() }, [fetchPair, fetchState])
  useInterval(fetchState, 5000)

  const vote = useCallback(async (winnerId: string, loserId: string) => {
    const res = await fetch('/api/vote', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ winnerId, loserId }), cache: 'no-store' })
    if (res.ok) {
      const data = await res.json()
      if (data.upset) triggerToast('Upset!')
      setPair(data.pair)
      fetchState()
    }
  }, [fetchState])

  useKey(['ArrowLeft', 'ArrowRight'], (key) => {
    if (!pair) return
    if (key === 'ArrowLeft') vote(pair.left.id, pair.right.id)
    if (key === 'ArrowRight') vote(pair.right.id, pair.left.id)
  })

  if (loading || !pair || !state) {
    return (
      <div className="space-y-6">
        <div className="text-2xl font-semibold">Elo Arena</div>
        <div className="grid md:grid-cols-2 gap-4">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{state.title}</h1>
        <div className="text-xs text-neutral-500">Hint: use ← → keys</div>
      </div>
      <div className="grid md:grid-cols-2 gap-4 min-h-[22rem]">
        <VoteCard item={pair.left} rating={pair.leftRating} onClick={() => vote(pair.left.id, pair.right.id)} side="left" />
        <VoteCard item={pair.right} rating={pair.rightRating} onClick={() => vote(pair.right.id, pair.left.id)} side="right" />
      </div>
      <Toast />
    </div>
  )
}

