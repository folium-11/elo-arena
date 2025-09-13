export type ItemSource = 'public' | 'upload' | 'text'

export interface Item {
  id: string
  baseName: string
  imageUrl?: string
  source: ItemSource
}

export interface Rating {
  rating: number
  wins: number
  losses: number
  appearances: number
}

export interface SessionInfo {
  name?: string
  currentPair?: [string, string]
  updatedAt: number
}

export interface OJLockInfo {
  heldBy: string | null
  since: number | null
}

export interface AppState {
  title: string
  items: Item[]
  ratings: Record<string, Rating>
  nameOverrides: Record<string, string>
  perUserRatings: Record<string, Record<string, Rating>>
  contributions: Record<string, number>
  signInEnabled: boolean
  allowedNames: string[]
  slotLimits: Record<string, number>
  activeSessions: Record<string, number>
  sessions: Record<string, SessionInfo>
  lock: OJLockInfo
}

export interface Pair {
  left: Item
  right: Item
  leftRating: Rating
  rightRating: Rating
}

