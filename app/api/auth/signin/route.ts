import { NextRequest, NextResponse } from 'next/server'
import { getFingerprint } from '@/lib/fingerprint'
import { getState, setState } from '@/lib/state'
import { noStoreHeaders } from '@/lib/auth'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const { name } = await req.json()
  if (!name) return NextResponse.json({ error: 'Missing name' }, { status: 400 })
  const fp = await getFingerprint()
  const s = await getState()
  if (!s.signInEnabled) return NextResponse.json({ error: 'Sign-in disabled' }, { status: 403 })
  if (!s.allowedNames.includes(name)) return NextResponse.json({ error: 'Name not allowed' }, { status: 403 })
  const limit = s.slotLimits[name] ?? 1
  const active = s.activeSessions[name] ?? 0
  if (active >= limit) return NextResponse.json({ error: 'No slots available' }, { status: 429 })
  await setState(st => {
    st.sessions[fp] = { ...(st.sessions[fp] || { updatedAt: Date.now() }), name, updatedAt: Date.now() }
    st.activeSessions[name] = (st.activeSessions[name] ?? 0) + 1
  })
  return NextResponse.json({ ok: true }, { headers: noStoreHeaders() })
}
