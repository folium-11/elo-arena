import { NextRequest, NextResponse } from 'next/server'
import { checkAdmin, noStoreHeaders } from '@/lib/auth'
import { setState } from '@/lib/state'
import { put } from '@vercel/blob'
import { promises as fs } from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const fd = await req.formData()
  const password = fd.get('password')?.toString()
  if (!checkAdmin(password)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const files = fd.getAll('files').filter(Boolean) as File[]
  const urls: string[] = []
  const useBlob = !!process.env.BLOB_READ_WRITE_TOKEN && !!process.env.VERCEL
  for (const f of files) {
    const id = 'u_' + Math.random().toString(36).slice(2, 9)
    let url = ''
    if (useBlob) {
      const { url: u } = await put(`elo-arena/uploads/${id}_${f.name}`, f, { access: 'public', token: process.env.BLOB_READ_WRITE_TOKEN, contentType: f.type || 'application/octet-stream' })
      url = u
    } else {
      const dir = path.join(process.cwd(), 'public', 'uploads')
      await fs.mkdir(dir, { recursive: true })
      const array = await f.arrayBuffer()
      const p = path.join(dir, `${id}_${f.name}`)
      await fs.writeFile(p, Buffer.from(array))
      url = `/uploads/${id}_${f.name}`
    }
    urls.push(url)
    await setState(s => {
      const iid = 'up_' + Math.random().toString(36).slice(2, 9)
      s.items.push({ id: iid, baseName: f.name.replace(/\..+$/, ''), source: 'upload', imageUrl: url })
      s.ratings[iid] = { rating: 1000, wins: 0, losses: 0, appearances: 0 }
    })
  }

  return NextResponse.json({ ok: true, urls }, { headers: noStoreHeaders() })
}

