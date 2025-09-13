import { NextResponse } from 'next/server'
import { getFingerprint } from '@/lib/fingerprint'
import { getState } from '@/lib/state'
import { noStoreHeaders } from '@/lib/auth'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const runtime = 'nodejs'

export async function GET() {
  const fp = await getFingerprint()
  const s = await getState()
  const name = s.sessions[fp]?.name
  return NextResponse.json({ name, enabled: s.signInEnabled }, { headers: noStoreHeaders() })
}
