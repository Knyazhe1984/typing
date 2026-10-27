import type { Metrics, Session } from '../core/engine/session'
import type { LayoutId } from '../core/layouts'
import { aggregateKeystrokes, emptyKeyStat, mergeKeyStat } from '../core/stats/keyStats'
import { db, type LessonProgress } from './db'

/** Сохраняет статистику по клавишам из завершённых упражнений. */
export async function recordKeyStats(layout: LayoutId, sessions: readonly Session[]) {
  const totals = aggregateKeystrokes(sessions.flatMap((s) => s.keystrokes))
  await db.transaction('rw', db.keyStats, async () => {
    for (const [char, stat] of totals) {
      const prev = await db.keyStats.get([layout, char])
      await db.keyStats.put({ layout, char, ...mergeKeyStat(prev ?? emptyKeyStat(), stat) })
    }
  })
}

export async function recordPractice(layout: LayoutId, session: Session, m: Metrics) {
  await db.sessions.add({
    lessonId: 'practice',
    layout,
    finishedAt: Date.now(),
    cpm: m.cpm,
    accuracy: m.accuracy,
    errors: m.errors,
    elapsedMs: m.elapsedMs,
  })
  await recordKeyStats(layout, [session])
}

/**
 * Записывает попытку урока и обновляет лучший результат.
 * Возвращает прогресс до этой попытки — чтобы показать «новый рекорд».
 */
export async function recordLesson(
  lessonId: string,
  layout: LayoutId,
  sessions: readonly Session[],
  m: Metrics,
  stars: number,
): Promise<LessonProgress | undefined> {
  const now = Date.now()
  const prev = await db.lessonProgress.get(lessonId)
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
  })
  await recordKeyStats(layout, sessions)
  return prev
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
}
