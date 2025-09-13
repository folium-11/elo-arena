import { Rating } from './types'

export const DEFAULT_RATING = 1000
export const K_FACTOR = 32

export function ensureRating(r?: Rating): Rating {
  return r ?? { rating: DEFAULT_RATING, wins: 0, losses: 0, appearances: 0 }
}

export function expectedScore(rA: number, rB: number) {
  return 1 / (1 + Math.pow(10, (rB - rA) / 400))
}

export function updateElo(winner: Rating, loser: Rating) {
  const expW = expectedScore(winner.rating, loser.rating)
  const expL = expectedScore(loser.rating, winner.rating)
  const newWinner = {
    ...winner,
    rating: Math.round((winner.rating + K_FACTOR * (1 - expW)) * 100) / 100,
    wins: winner.wins + 1,
    appearances: winner.appearances + 1,
  }
  const newLoser = {
    ...loser,
    rating: Math.round((loser.rating + K_FACTOR * (0 - expL)) * 100) / 100,
    losses: loser.losses + 1,
    appearances: loser.appearances + 1,
  }
  return { newWinner, newLoser }
}

