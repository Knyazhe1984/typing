import { useLiveQuery } from 'dexie-react-hooks'
import { dayKey, streakInfo, type StreakInfo } from '../core/progress/streak'
import { levelFromXp, type LevelInfo } from '../core/progress/xp'
import { db } from '../storage/db'

export interface GameStats {
  xp: number
  level: LevelInfo
  streak: StreakInfo
  /** Время занятий сегодня, мс */
  todayMs: number
  /** id достижения → когда открыто */
  unlocked: Map<string, number>
}

/** Игровые показатели из базы; обновляются сами после каждого занятия. */
export function useGameStats(): GameStats | undefined {
  return useLiveQuery(async () => {
    const [sessions, achievements] = await Promise.all([
      db.sessions.toArray(),
      db.achievements.toArray(),
    ])
    const now = Date.now()
    const today = dayKey(now)
    let xp = 0
    let todayMs = 0
    for (const s of sessions) {
      xp += s.xp
      if (dayKey(s.finishedAt) === today) todayMs += s.elapsedMs
    }
    return {
      xp,
      level: levelFromXp(xp),
      streak: streakInfo(
        sessions.map((s) => dayKey(s.finishedAt)),
        now,
      ),
      todayMs,
      unlocked: new Map(achievements.map((a) => [a.id, a.unlockedAt])),
    }
  }, [])
}
