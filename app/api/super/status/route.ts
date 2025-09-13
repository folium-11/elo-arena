import { NextResponse } from 'next/server'
import { getState } from '@/lib/state'
import { getFingerprint } from '@/lib/fingerprint'
import { noStoreHeaders } from '@/lib/auth'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const runtime = 'nodejs'

export async function GET() {
  const s = await getState()
  const fp = await getFingerprint()
  const held = !!s.lock.heldBy
  const isMine = s.lock.heldBy === fp
  return NextResponse.json({ held, isMine, since: s.lock.since || undefined }, { headers: noStoreHeaders() })
}
