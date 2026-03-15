/**
 * useStats — win/loss/streak tracking persisted to localStorage.
 */

import { useCallback, useState } from 'react'

import { DEFAULT_STATS, type GameStats } from '@/domain'

import { load, save } from '@/infrastructure/storage'

const STORAGE_KEY = 'nim-stats'

export function useStats() {
  const [stats, setStats] = useState<GameStats>(() => load(STORAGE_KEY, DEFAULT_STATS))

  const recordWin = useCallback(() => {
    setStats((prev) => {
      const next: GameStats = {
        wins: prev.wins + 1,
        losses: prev.losses,
        streak: prev.streak + 1,
        bestStreak: Math.max(prev.bestStreak, prev.streak + 1),
      }
      save(STORAGE_KEY, next)
      return next
    })
  }, [])

  const recordLoss = useCallback(() => {
    setStats((prev) => {
      const next: GameStats = {
        wins: prev.wins,
        losses: prev.losses + 1,
        streak: 0,
        bestStreak: prev.bestStreak,
      }
      save(STORAGE_KEY, next)
      return next
    })
  }, [])

  const resetStats = useCallback(() => {
    save(STORAGE_KEY, DEFAULT_STATS)
    setStats(DEFAULT_STATS)
  }, [])

  return { stats, recordWin, recordLoss, resetStats }
}
