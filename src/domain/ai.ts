import type { Move as AIMove, Difficulty, GameState } from './types'

/**
 * Calculates the current Nim-sum (XOR sum) of all piles.
 * The core strategy of Nim depends on whether this sum is 0 or non-zero.
 */
export const calculateNimSum = (state: GameState): number => {
  return state.piles.reduce((acc, p) => acc ^ p.count, 0)
}

/**
 * Misere Play strategy logic:
 * If there is only one pile with > 1 object, reduce it to 1 or 0
 * to ensure an odd number of piles with count 1 remains.
 */
const getMisereMove = (state: GameState): AIMove | null => {
  const bigPiles = state.piles.filter((p) => p.count > 1)
  if (bigPiles.length === 1) {
    const singleBigPile = bigPiles[0]
    const onesPiles = state.piles.filter((p) => p.count === 1).length
    // We want to leave an odd number of piles with count 1.
    const targetCount = onesPiles % 2 === 0 ? 1 : 0
    return { pileId: singleBigPile.id, removeCount: singleBigPile.count - targetCount }
  }
  return null
}

/**
 * Easy AI — picks a random pile and removes a random amount.
 */
const selectMoveEasy = (state: GameState): AIMove => {
  const nonEmpty = state.piles.filter((p) => p.count > 0)
  if (nonEmpty.length === 0) {
    return { pileId: 0, removeCount: 0 }
  }
  const pile = nonEmpty[Math.floor(Math.random() * nonEmpty.length)]
  const removeCount = Math.floor(Math.random() * pile.count) + 1
  return { pileId: pile.id, removeCount }
}

/**
 * Medium AI — plays optimally 40% of the time, otherwise takes 1 from a random pile.
 */
const selectMoveMedium = (state: GameState): AIMove => {
  if (Math.random() < 0.4) {
    return selectMoveHard(state)
  }
  const nonEmpty = state.piles.filter((p) => p.count > 0)
  if (nonEmpty.length === 0) {
    return { pileId: 0, removeCount: 0 }
  }
  const pile = nonEmpty[Math.floor(Math.random() * nonEmpty.length)]
  return { pileId: pile.id, removeCount: 1 }
}

/**
 * Hard AI — Selects the best move using the Nim-sum strategy.
 * This is optimal for both Normal play and (mostly) Misère play.
 */
const selectMoveHard = (state: GameState): AIMove => {
  // Check for specialized Misère end-game first
  if (state.mode === 'misere') {
    const misereMove = getMisereMove(state)
    if (misereMove) {
      return misereMove
    }
  }

  const nimSum = calculateNimSum(state)

  if (nimSum !== 0) {
    // There exists a winning move: make nimSum 0.
    for (const pile of state.piles) {
      const targetCount = pile.count ^ nimSum
      if (targetCount < pile.count) {
        return { pileId: pile.id, removeCount: pile.count - targetCount }
      }
    }
  }

  // If nimSum is 0 (losing position), just take 1 from the first non-empty pile.
  const firstNonEmpty = state.piles.find((p) => p.count > 0)
  if (firstNonEmpty) {
    return { pileId: firstNonEmpty.id, removeCount: 1 }
  }

  // Should never happen if checkGameOver works.
  return { pileId: 0, removeCount: 0 }
}

/**
 * Selects a move based on difficulty level.
 */
export const selectMove = (state: GameState, difficulty: Difficulty = 'hard'): AIMove => {
  switch (difficulty) {
    case 'easy':
      return selectMoveEasy(state)
    case 'medium':
      return selectMoveMedium(state)
    case 'hard':
      return selectMoveHard(state)
  }
}
