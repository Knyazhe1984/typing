import { useLiveQuery } from 'dexie-react-hooks'
import type { Lesson } from '../core/course/types'
import { db, type LessonProgress } from '../storage/db'

/** Урок открыт, если это первый урок или предыдущий пройден. */
export function isUnlocked(lessons: Lesson[], i: number, progress: Map<string, LessonProgress>) {
  return i === 0 || !!progress.get(lessons[i - 1].id)?.completed
}

/** Прогресс всех уроков; обновляется сам при записи в базу. */
export function useProgressMap() {
  const rows = useLiveQuery(() => db.lessonProgress.toArray(), [])
  return new Map((rows ?? []).map((r) => [r.lessonId, r]))
}
