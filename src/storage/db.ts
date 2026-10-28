import Dexie, { type EntityTable, type Table } from 'dexie'
import type { LayoutId } from '../core/layouts'
import { xpForSession } from '../core/progress/xp'
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
  /** Верно набранные символы */
  chars: number
  xp: number
  /** Мини-игры: очки и победа над призраком */
  score?: number
  won?: boolean
}

/** Лучший заезд по тексту — с ним соревнуется «призрак». */
export interface GhostRecord {
  layout: LayoutId
  textId: string
  /** Время набора каждого символа, мс от первого нажатия */
  timeline: number[]
  cpm: number
  recordedAt: number
}

export interface AchievementRecord {
  id: string
  unlockedAt: number
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
  achievements: EntityTable<AchievementRecord, 'id'>
  ghosts: Table<GhostRecord, [LayoutId, string]>
}

db.version(1).stores({
  lessonProgress: 'lessonId',
  sessions: '++id, lessonId, finishedAt',
  keyStats: '[layout+char], layout',
})

// v2: достижения; у сессий появились символы и опыт — досчитываем для старых записей
db.version(2)
  .stores({ achievements: 'id' })
  .upgrade((tx) =>
    tx
      .table('sessions')
      .toCollection()
      .modify((s: SessionRecord) => {
        s.chars ??= Math.round((s.cpm * s.elapsedMs) / 60000)
        s.xp ??= xpForSession(s.chars, s.stars)
      }),
  )

// v3: лучшие заезды для гонки с призраком
db.version(3).stores({ ghosts: '[layout+textId]' })
