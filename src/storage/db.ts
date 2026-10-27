import Dexie, { type EntityTable, type Table } from 'dexie'
import type { LayoutId } from '../core/layouts'
import type { KeyStat } from '../core/stats/keyStats'

export interface LessonProgress {
  lessonId: string
  completed: boolean
  bestStars: number
  bestCpm: number
  bestAccuracy: number
  attempts: number
  lastPlayedAt: number
}

export interface SessionRecord {
  id?: number
  /** id урока или 'practice' для свободной тренировки */
  lessonId: string
  layout: LayoutId
  finishedAt: number
  cpm: number
  accuracy: number
  errors: number
  elapsedMs: number
  stars?: number
}

export interface KeyStatRecord extends KeyStat {
  layout: LayoutId
  char: string
}

/** Всё хранится только в браузере пользователя. */
export const db = new Dexie('typing-trainer') as Dexie & {
  lessonProgress: EntityTable<LessonProgress, 'lessonId'>
  sessions: EntityTable<SessionRecord, 'id'>
  keyStats: Table<KeyStatRecord, [LayoutId, string]>
}

db.version(1).stores({
  lessonProgress: 'lessonId',
  sessions: '++id, lessonId, finishedAt',
  keyStats: '[layout+char], layout',
})
