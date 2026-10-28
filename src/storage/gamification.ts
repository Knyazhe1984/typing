import { courses } from '../content/course'
import {
  achievements,
  satisfiedAchievements,
  type Achievement,
} from '../core/progress/achievements'
import { dayKey, streakInfo } from '../core/progress/streak'
import { db } from './db'

export async function totalXp(): Promise<number> {
  let xp = 0
  await db.sessions.each((s) => {
    xp += s.xp
  })
  return xp
}

/** Проверяет условия достижений, сохраняет новые и возвращает их. */
export async function unlockAchievements(): Promise<Achievement[]> {
  const [sessions, progress, unlocked] = await Promise.all([
    db.sessions.toArray(),
    db.lessonProgress.toArray(),
    db.achievements.toArray(),
  ])
  const days = sessions.map((s) => dayKey(s.finishedAt))
  const ids = satisfiedAchievements({
    sessions,
    completed: new Set(progress.filter((p) => p.completed).map((p) => p.lessonId)),
    courses,
    bestStreak: streakInfo(days, Date.now()).best,
  })
  const have = new Set(unlocked.map((a) => a.id))
  const fresh = ids.filter((id) => !have.has(id))
  const now = Date.now()
  await db.achievements.bulkPut(fresh.map((id) => ({ id, unlockedAt: now })))
  return achievements.filter((a) => fresh.includes(a.id))
}
