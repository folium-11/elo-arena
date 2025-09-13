import { NextRequest, NextResponse } from 'next/server'
import { getFingerprint } from '@/lib/fingerprint'
import { getState, setState } from '@/lib/state'
import { checkSuper, noStoreHeaders } from '@/lib/auth'
import { initialState } from '@/lib/storage'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const { password } = await req.json().catch(() => ({ }))
  const fp = await getFingerprint()
  const s = await getState()
  const ok = s.lock.heldBy === fp || checkSuper(password)
  if (!ok) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  await setState(st => {
    const keepSign = { signInEnabled: st.signInEnabled, allowedNames: st.allowedNames, slotLimits: st.slotLimits, activeSessions: st.activeSessions, sessions: st.sessions, lock: st.lock }
    const fresh = initialState()
    st.title = fresh.title
    st.items = fresh.items
    st.ratings = fresh.ratings
    st.nameOverrides = {}
    st.perUserRatings = {}
    st.contributions = {}
    st.signInEnabled = keepSign.signInEnabled
    st.allowedNames = keepSign.allowedNames
    st.slotLimits = keepSign.slotLimits
    st.activeSessions = keepSign.activeSessions
    st.sessions = keepSign.sessions
    st.lock = keepSign.lock
  })
  return NextResponse.json({ ok: true }, { headers: noStoreHeaders() })
}
