import { NextRequest, NextResponse } from 'next/server'
import { getFingerprint } from '@/lib/fingerprint'
import { getState, setState } from '@/lib/state'
import { checkSuper, noStoreHeaders } from '@/lib/auth'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const { password } = await req.json().catch(() => ({ }))
  const fp = await getFingerprint()
  const s = await getState()
  if (!s.lock.heldBy) {
    await setState(st => { st.lock.heldBy = fp; st.lock.since = Date.now() })
    return NextResponse.json({ ok: true }, { headers: noStoreHeaders() })
  }
  if (s.lock.heldBy === fp) return NextResponse.json({ ok: true }, { headers: noStoreHeaders() })
  if (checkSuper(password)) {
    await setState(st => { st.lock.heldBy = fp; st.lock.since = Date.now() })
    return NextResponse.json({ ok: true }, { headers: noStoreHeaders() })
  }
  return NextResponse.json({ error: 'Lock held by another' }, { status: 409 })
}
