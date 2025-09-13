import { NextRequest, NextResponse } from 'next/server'
import { getFingerprint } from '@/lib/fingerprint'
import { getState, setState } from '@/lib/state'
import { checkSuper, noStoreHeaders } from '@/lib/auth'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { password, signInEnabled, allowedNames } = body || {}
  const fp = await getFingerprint()
  const s = await getState()
  const ok = s.lock.heldBy === fp || checkSuper(password)
  if (!ok) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  await setState(st => {
    if (typeof signInEnabled === 'boolean') st.signInEnabled = signInEnabled
    if (Array.isArray(allowedNames)) {
      st.allowedNames = allowedNames
      // ensure slot limits exist
      for (const n of allowedNames) st.slotLimits[n] = st.slotLimits[n] ?? 1
      for (const n of Object.keys(st.slotLimits)) if (!allowedNames.includes(n)) delete st.slotLimits[n]
    }
  })
  return NextResponse.json({ ok: true }, { headers: noStoreHeaders() })
}
