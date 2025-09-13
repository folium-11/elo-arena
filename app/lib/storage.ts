import { AppState, Item, Rating, SessionInfo } from './types'
import { list, put } from '@vercel/blob'
import { promises as fs } from 'fs'
import path from 'path'
import { ensureRating } from './elo'

const BLOB_KEY = 'elo-arena/state.json'
const DATA_DIR = path.join(process.cwd(), 'data')
const DATA_FILE = path.join(DATA_DIR, 'state.json')

function now() { return Date.now() }

export async function loadState(): Promise<AppState> {
  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (token && process.env.VERCEL) {
    try {
      const l = await list({ prefix: BLOB_KEY, token })
      const match = l.blobs.find(b => b.pathname === BLOB_KEY) || l.blobs[0]
      if (match) {
        const res = await fetch(match.url, { cache: 'no-store' })
        if (res.ok) return (await res.json()) as AppState
      }
    } catch {}
  }
  // FS fallback
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8')
    return JSON.parse(raw) as AppState
  } catch {
    const state = initialState()
    await saveState(state)
    return state
  }
}

export async function saveState(state: AppState) {
  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (token && process.env.VERCEL) {
    await put(BLOB_KEY, JSON.stringify(state, null, 2), {
      access: 'public',
      contentType: 'application/json',
      token,
    })
    return
  }
  await fs.mkdir(DATA_DIR, { recursive: true })
  await fs.writeFile(DATA_FILE, JSON.stringify(state, null, 2), 'utf-8')
}

export function initialState(): AppState {
  const items: Item[] = [
    { id: 'i_alpha', baseName: 'Alpha', imageUrl: '/images/item1.svg', source: 'public' },
    { id: 'i_beta', baseName: 'Beta', imageUrl: '/images/item2.svg', source: 'public' },
    { id: 'i_gamma', baseName: 'Gamma', imageUrl: '/images/item3.svg', source: 'public' },
    { id: 'i_text1', baseName: 'Texty McTextface', source: 'text' },
  ]
  const ratings: Record<string, Rating> = {}
  for (const it of items) ratings[it.id] = ensureRating()
  const sessions: Record<string, SessionInfo> = {}
  return {
    title: 'Elo Arena',
    items,
    ratings,
    nameOverrides: {},
    perUserRatings: {},
    contributions: {},
    signInEnabled: false,
    allowedNames: ['Alice', 'Bob', 'Charlie'],
    slotLimits: { Alice: 1, Bob: 1, Charlie: 1 },
    activeSessions: {},
    sessions,
    lock: { heldBy: null, since: null },
  }
}

export function displayName(state: AppState, id: string) {
  const it = state.items.find(i => i.id === id)
  if (!it) return 'Unknown'
  return state.nameOverrides[id] ?? it.baseName
}

export function pickPair(state: AppState, fp: string): [string, string] {
  const ids = state.items.map(i => i.id)
  if (ids.length < 2) throw new Error('Not enough items')
  // Prefer items with similar ratings for interesting matchups
  const sorted = [...ids].sort((a,b) => (state.ratings[a]?.rating ?? 0) - (state.ratings[b]?.rating ?? 0))
  const idx = Math.floor(Math.random() * (sorted.length - 1))
  const id1 = sorted[idx]
  const id2 = sorted[idx + 1]
  if (!id1 || !id2 || id1 === id2) {
    // fallback random distinct
    let a = ids[Math.floor(Math.random() * ids.length)]
    let b = a
    while (b === a) b = ids[Math.floor(Math.random() * ids.length)]
    return [a, b]
  }
  return [id1, id2]
}

export function isValidPair(state: AppState, pair?: [string,string]) {
  if (!pair) return false
  const [a,b] = pair
  if (!a || !b || a === b) return false
  const hasA = state.items.some(i => i.id === a)
  const hasB = state.items.some(i => i.id === b)
  return hasA && hasB
}

