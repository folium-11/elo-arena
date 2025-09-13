import { NextRequest, NextResponse } from 'next/server'
import { setState } from '@/lib/state'
import { checkSuper, noStoreHeaders } from '@/lib/auth'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const { password } = await req.json()
  if (!checkSuper(password)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await setState(st => { st.lock.heldBy = null; st.lock.since = null })
  return NextResponse.json({ ok: true }, { headers: noStoreHeaders() })
}

