import { NextRequest, NextResponse } from 'next/server'
import { checkAdmin, noStoreHeaders } from '@/lib/auth'
import { setState } from '@/lib/state'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { password, title } = body || {}
  if (!checkAdmin(password)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await setState(s => { s.title = title || 'Elo Arena' })
  return NextResponse.json({ ok: true }, { headers: noStoreHeaders() })
}

