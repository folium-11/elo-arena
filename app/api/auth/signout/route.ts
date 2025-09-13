import { NextRequest, NextResponse } from 'next/server'
import { getFingerprint } from '@/lib/fingerprint'
import { setState } from '@/lib/state'
import { noStoreHeaders } from '@/lib/auth'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const runtime = 'nodejs'

export async function POST() {
  const fp = await getFingerprint()
  await setState(s => {
    const name = s.sessions[fp]?.name
    if (name) s.activeSessions[name] = Math.max(0, (s.activeSessions[name] ?? 1) - 1)
    if (s.sessions[fp]) delete s.sessions[fp].name
  })
  return NextResponse.json({ ok: true }, { headers: noStoreHeaders() })
}
