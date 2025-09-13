import { NextRequest, NextResponse } from 'next/server'
import { getFingerprint } from '@/lib/fingerprint'
import { applyVote, getState, setState } from '@/lib/state'
import { noStoreHeaders } from '@/lib/auth'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { winnerId, loserId } = body || {}
  if (!winnerId || !loserId) return NextResponse.json({ error: 'Invalid' }, { status: 400 })
  const fp = await getFingerprint()
  const s0 = await getState()
  if (s0.signInEnabled && !s0.sessions[fp]?.name) {
    return NextResponse.json({ error: 'Sign-in required' }, { status: 403 })
  }
  let upset = false
  const out = await setState(s => {
    const res = applyVote(s, fp, winnerId, loserId)
    upset = res.upset
  })
  const s = await getState()
  const sess = s.sessions[fp]
  const [a,b] = sess.currentPair!
  const left = s.items.find(i => i.id === a)!
  const right = s.items.find(i => i.id === b)!
  const leftRating = s.ratings[a]!
  const rightRating = s.ratings[b]!
  return NextResponse.json({ pair: { left, right, leftRating, rightRating }, upset }, { headers: noStoreHeaders() })
}
