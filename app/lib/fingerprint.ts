import { headers } from 'next/headers'
import crypto from 'crypto'

type HeaderLike = { get(name: string): string | null | undefined }

export function deriveFingerprint(h: HeaderLike): string {
  const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || '0.0.0.0'
  const ua = h.get('user-agent') || 'unknown'
  const lang = h.get('accept-language') || 'en'
  const salt = process.env.FP_SALT || 'dev-salt-change-me'
  const material = `${ip}|${ua}|${lang}|${salt}`
  return crypto.createHash('sha256').update(material).digest('hex')
}

export async function getFingerprint() {
  const h = await (headers() as any)
  return deriveFingerprint(h)
}
