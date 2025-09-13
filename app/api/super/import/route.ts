import { NextRequest, NextResponse } from 'next/server'
import { getFingerprint } from '@/lib/fingerprint'
import { saveState, loadState } from '@/lib/storage'
import { checkSuper, noStoreHeaders } from '@/lib/auth'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const { password, data } = await req.json()
  const fp = await getFingerprint()
  const s = await loadState()
  const ok = s.lock.heldBy === fp || checkSuper(password)
  if (!ok) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  try {
    const parsed = JSON.parse(data)
    await saveState(parsed)
    return NextResponse.json({ ok: true }, { headers: noStoreHeaders() })
  } catch (e) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
}
