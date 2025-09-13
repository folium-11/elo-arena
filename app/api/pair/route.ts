import { NextResponse } from 'next/server'
import { getFingerprint } from '@/lib/fingerprint'
import { ensureSessionPair, getState, setState } from '@/lib/state'
import { noStoreHeaders } from '@/lib/auth'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const runtime = 'nodejs'

export async function GET() {
  const fp = await getFingerprint()
  await setState(s => { ensureSessionPair(s, fp) })
  const s = await getState()
  const pair = s.sessions[fp].currentPair!
  const [a, b] = pair
  const left = s.items.find(i => i.id === a)!
  const right = s.items.find(i => i.id === b)!
  const leftRating = s.ratings[a]!
  const rightRating = s.ratings[b]!
  return NextResponse.json({ left, right, leftRating, rightRating }, { headers: noStoreHeaders() })
}
