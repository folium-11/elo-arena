import { NextResponse } from 'next/server'
import { getState } from '@/lib/state'
import { noStoreHeaders } from '@/lib/auth'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const runtime = 'nodejs'

export async function GET() {
  const s = await getState()
  return new NextResponse(JSON.stringify(s, null, 2), { headers: { 'Content-Type': 'application/json', ...noStoreHeaders() } })
}

