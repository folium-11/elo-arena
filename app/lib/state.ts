import { AppState, Item, Rating } from './types'
import { ensureRating, updateElo } from './elo'
import { isValidPair, loadState, pickPair, saveState } from './storage'

export async function getState(): Promise<AppState> {
  return await loadState()
}

export async function setState(updater: (s: AppState) => AppState | void): Promise<AppState> {
  const s = await loadState()
  const ret = updater(s)
  const out = (ret as AppState) || s
  await saveState(out)
  return out
}

export function getDisplayNameMap(s: AppState): Record<string, string> {
  const map: Record<string, string> = {}
  for (const it of s.items) map[it.id] = s.nameOverrides[it.id] ?? it.baseName
  return map
}

export function getOrCreateRating(map: Record<string, Rating>, id: string): Rating {
  return map[id] ?? (map[id] = ensureRating())
}

export function ensureSessionPair(s: AppState, fp: string) {
  const sess = s.sessions[fp] ?? (s.sessions[fp] = { updatedAt: Date.now() })
  if (!isValidPair(s, sess.currentPair)) {
    sess.currentPair = pickPair(s, fp)
    sess.updatedAt = Date.now()
  }
}

export function selectNewPair(s: AppState, fp: string) {
  const sess = s.sessions[fp] ?? (s.sessions[fp] = { updatedAt: Date.now() })
  sess.currentPair = pickPair(s, fp)
  sess.updatedAt = Date.now()
}

export function removeItemFromState(s: AppState, itemId: string) {
  s.items = s.items.filter(i => i.id !== itemId)
  delete s.ratings[itemId]
  delete s.nameOverrides[itemId]
  for (const [fp, sess] of Object.entries(s.sessions)) {
    if (sess.currentPair && sess.currentPair.includes(itemId)) {
      sess.currentPair = undefined
    }
  }
  for (const [user, map] of Object.entries(s.perUserRatings)) {
    delete map[itemId]
  }
}

export function applyVote(s: AppState, fp: string, winnerId: string, loserId: string) {
  const w = getOrCreateRating(s.ratings, winnerId)
  const l = getOrCreateRating(s.ratings, loserId)
  const beforeUpset = w.rating < l.rating
  const { newWinner, newLoser } = updateElo(w, l)
  s.ratings[winnerId] = newWinner
  s.ratings[loserId] = newLoser

  const name = s.sessions[fp]?.name
  if (name) {
    const map = (s.perUserRatings[name] ??= {})
    const rw = getOrCreateRating(map, winnerId)
    const rl = getOrCreateRating(map, loserId)
    const uw = updateElo(rw, rl)
    map[winnerId] = uw.newWinner
    map[loserId] = uw.newLoser
    s.contributions[name] = (s.contributions[name] ?? 0) + 1
  }

  selectNewPair(s, fp)
  return { upset: beforeUpset }
}

