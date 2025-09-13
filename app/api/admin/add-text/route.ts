import { NextRequest, NextResponse } from 'next/server'
import { checkAdmin, noStoreHeaders } from '@/lib/auth'
import { setState } from '@/lib/state'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { password, name } = body || {}
  if (!checkAdmin(password)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!name) return NextResponse.json({ error: 'Missing name' }, { status: 400 })
  await setState(s => {
    const id = 't_' + Math.random().toString(36).slice(2, 9)
    s.items.push({ id, baseName: name, source: 'text' })
    s.ratings[id] = { rating: 1000, wins: 0, losses: 0, appearances: 0 }
  })
  return NextResponse.json({ ok: true }, { headers: noStoreHeaders() })
}

