import type { Keystroke, Metrics, Session } from '../core/engine/session'
import type { LayoutId } from '../core/layouts'
import { aggregateKeystrokes, emptyKeyStat, mergeKeyStat } from '../core/stats/keyStats'
import { levelFromXp, xpForSession } from '../core/progress/xp'
import type { Achievement } from '../core/progress/achievements'
import { db, type LessonProgress } from './db'
import { totalXp, unlockAchievements } from './gamification'

/** Что принесла попытка: опыт, повышение уровня и новые достижения. */
export interface Rewards {
  xp: number
  levelBefore: number
  levelAfter: number
  achievements: Achievement[]
}

const correctChars = (sessions: readonly Session[]) =>
  sessions.reduce(
    (sum, s) => sum + s.statuses.filter((st) => st !== 'pending' && st !== 'wrong').length,
    0,
  )

async function grantRewards(xp: number, before: number): Promise<Rewards> {
  return {
    xp,
    levelBefore: levelFromXp(before).level,
    levelAfter: levelFromXp(before + xp).level,
    achievements: await unlockAchievements(),
  }
}

/** Сохраняет статистику по клавишам из завершённых упражнений. */
export async function recordKeyStats(
  layout: LayoutId,
  sessions: readonly Pick<Session, 'keystrokes'>[],
) {
  // Промахи мимо всех слов в играх без ожидаемого символа — в статистику клавиш не идут
  const totals = aggregateKeystrokes(
    sessions.flatMap((s) => s.keystrokes).filter((k) => k.expected !== ''),
  )
  await db.transaction('rw', db.keyStats, async () => {
    for (const [char, stat] of totals) {
      const prev = await db.keyStats.get([layout, char])
      await db.keyStats.put({ layout, char, ...mergeKeyStat(prev ?? emptyKeyStat(), stat) })
    }
  })
}

export async function recordPractice(
  layout: LayoutId,
  session: Session,
  m: Metrics,
): Promise<Rewards> {
  const before = await totalXp()
  const chars = correctChars([session])
  const xp = xpForSession(chars)
  await db.sessions.add({
    lessonId: 'practice',
    layout,
    finishedAt: Date.now(),
    cpm: m.cpm,
    accuracy: m.accuracy,
    errors: m.errors,
    elapsedMs: m.elapsedMs,
    chars,
    xp,
  })
  await recordKeyStats(layout, [session])
  return grantRewards(xp, before)
}

/**
 * Записывает попытку урока и обновляет лучший результат.
 * Возвращает прогресс до этой попытки — чтобы показать «новый рекорд» — и награды.
 */
export async function recordLesson(
  lessonId: string,
  layout: LayoutId,
  sessions: readonly Session[],
  m: Metrics,
  stars: number,
): Promise<{ prev?: LessonProgress; rewards: Rewards }> {
  const now = Date.now()
  const before = await totalXp()
  const prev = await db.lessonProgress.get(lessonId)
  const chars = correctChars(sessions)
  const xp = xpForSession(chars, stars)
  await db.lessonProgress.put({
    lessonId,
    completed: (prev?.completed ?? false) || stars > 0,
    bestStars: Math.max(prev?.bestStars ?? 0, stars),
    bestCpm: Math.max(prev?.bestCpm ?? 0, stars > 0 ? m.cpm : 0),
    bestAccuracy: Math.max(prev?.bestAccuracy ?? 0, m.accuracy),
    attempts: (prev?.attempts ?? 0) + 1,
    lastPlayedAt: now,
  })
  await db.sessions.add({
    lessonId,
    layout,
    finishedAt: now,
    cpm: m.cpm,
    accuracy: m.accuracy,
    errors: m.errors,
    elapsedMs: m.elapsedMs,
    stars,
    chars,
    xp,
  })
  await recordKeyStats(layout, sessions)
  return { prev, rewards: await grantRewards(xp, before) }
}

/** Урок только с теорией считается пройденным, когда дочитан до конца. */
export async function completeTheoryLesson(lessonId: string) {
  const prev = await db.lessonProgress.get(lessonId)
  await db.lessonProgress.put({
    lessonId,
    completed: true,
    bestStars: prev?.bestStars ?? 0,
    bestCpm: prev?.bestCpm ?? 0,
    bestAccuracy: prev?.bestAccuracy ?? 0,
    attempts: (prev?.attempts ?? 0) + 1,
    lastPlayedAt: Date.now(),
  })
  return unlockAchievements()
}

export interface GameResult {
  /** 'falling' или 'ghost' */
  game: string
  layout: LayoutId
  m: Metrics
  chars: number
  keystrokes: readonly Keystroke[]
  score?: number
  won?: boolean
}

/** Записывает партию мини-игры: она тоже идёт в опыт, серию и статистику клавиш. */
export async function recordGame(r: GameResult): Promise<Rewards> {
  const before = await totalXp()
  const xp = xpForSession(r.chars)
  await db.sessions.add({
    lessonId: `game:${r.game}`,
    layout: r.layout,
    finishedAt: Date.now(),
    cpm: r.m.cpm,
    accuracy: r.m.accuracy,
    errors: r.m.errors,
    elapsedMs: r.m.elapsedMs,
    chars: r.chars,
    xp,
    score: r.score,
    won: r.won,
  })
  await recordKeyStats(r.layout, [{ keystrokes: [...r.keystrokes] }])
  return grantRewards(xp, before)
}
