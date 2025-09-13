import { Rating } from './types'
import { ensureRating, updateElo } from './elo'
import { readCookie, writeCookie } from './cookies'

const COOKIE = 'elo_personal'

export type PersonalMap = Record<string, Rating>

export function readPersonal(): PersonalMap {
  try {
    const raw = readCookie(COOKIE)
    if (!raw) return {}
    return JSON.parse(raw) as PersonalMap
  } catch { return {} }
}

export function writePersonal(map: PersonalMap) {
  try { writeCookie(COOKIE, JSON.stringify(map)) } catch {}
}

export function applyPersonalVote(map: PersonalMap, winnerId: string, loserId: string): PersonalMap {
  const w = map[winnerId] ??= ensureRating()
  const l = map[loserId] ??= ensureRating()
  const { newWinner, newLoser } = updateElo(w, l)
  map[winnerId] = newWinner
  map[loserId] = newLoser
  writePersonal(map)
  return map
}

