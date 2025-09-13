import { NextRequest, NextResponse } from 'next/server'
import { checkAdmin, noStoreHeaders } from '@/lib/auth'
import { removeItemFromState, setState } from '@/lib/state'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { password, id } = body || {}
  if (!checkAdmin(password)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  await setState(s => {
    const it = s.items.find(i => i.id === id)
    if (!it) return
    if (it.source === 'public') return
    removeItemFromState(s, id)
  })
  return NextResponse.json({ ok: true }, { headers: noStoreHeaders() })
}

