import { NextRequest } from 'next/server'

export function checkAdmin(password?: string | null) {
  const want = process.env.ARENA_PASSWORD
  if (!want) return false
  return password === want
}

export function checkSuper(password?: string | null) {
  const want = process.env.ARENA_SUPER_ADMIN_PASSWORD
  if (!want) return false
  return password === want
}

export function noStoreHeaders() {
  return {
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    Pragma: 'no-cache',
    Expires: '0',
  }
}

