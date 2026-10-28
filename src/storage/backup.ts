import { useSettings } from '../store/settings'
import {
  db,
  type AchievementRecord,
  type KeyStatRecord,
  type LessonProgress,
  type SessionRecord,
} from './db'

const APP = 'typing-trainer'
const VERSION = 1

export interface Backup {
  app: typeof APP
  version: number
  exportedAt: number
  settings: Record<string, unknown>
  data: {
    lessonProgress: LessonProgress[]
    sessions: SessionRecord[]
    keyStats: KeyStatRecord[]
    achievements: AchievementRecord[]
  }
}

export async function createBackup(): Promise<Backup> {
  const { set: _set, ...settings } = useSettings.getState()
  const [lessonProgress, sessions, keyStats, achievements] = await Promise.all([
    db.lessonProgress.toArray(),
    db.sessions.toArray(),
    db.keyStats.toArray(),
    db.achievements.toArray(),
  ])
  return {
    app: APP,
    version: VERSION,
    exportedAt: Date.now(),
    settings,
    data: { lessonProgress, sessions, keyStats, achievements },
  }
}

const isObj = (x: unknown): x is Record<string, unknown> => typeof x === 'object' && x !== null
const hasFields = (x: unknown, fields: Record<string, string>) =>
  isObj(x) && Object.entries(fields).every(([k, type]) => typeof x[k] === type)

const SCHEMAS = {
  lessonProgress: { lessonId: 'string', completed: 'boolean', bestStars: 'number' },
  sessions: { lessonId: 'string', layout: 'string', finishedAt: 'number', cpm: 'number' },
  keyStats: { layout: 'string', char: 'string', hits: 'number', errors: 'number' },
  achievements: { id: 'string', unlockedAt: 'number' },
} as const

/** Проверяет файл резервной копии; бросает ошибку, если это не он. */
export function parseBackup(raw: unknown): Backup {
  if (!isObj(raw) || raw.app !== APP || !isObj(raw.data) || !isObj(raw.settings)) {
    throw new Error('not a backup')
  }
  if (typeof raw.version !== 'number' || raw.version > VERSION) {
    throw new Error('unsupported version')
  }
  const data = raw.data
  for (const [table, fields] of Object.entries(SCHEMAS)) {
    const rows = data[table]
    if (!Array.isArray(rows) || !rows.every((r) => hasFields(r, fields))) {
      throw new Error(`bad table ${table}`)
    }
  }
  return raw as unknown as Backup
}

const tables = () => [db.lessonProgress, db.sessions, db.keyStats, db.achievements]

/** Заменяет весь прогресс и настройки содержимым копии. */
export async function restoreBackup(backup: Backup) {
  const { data } = backup
  await db.transaction('rw', tables(), async () => {
    await Promise.all(tables().map((t) => t.clear()))
    await db.lessonProgress.bulkPut(data.lessonProgress)
    await db.sessions.bulkPut(data.sessions)
    await db.keyStats.bulkPut(data.keyStats)
    await db.achievements.bulkPut(data.achievements)
  })
  const current = useSettings.getState()
  // Берём только известные настройки нужного типа
  const patch = Object.fromEntries(
    Object.entries(backup.settings).filter(
      ([k, v]) =>
        k in current && k !== 'set' && typeof v === typeof current[k as keyof typeof current],
    ),
  )
  current.set(patch)
}

export async function resetProgress() {
  await db.transaction('rw', tables(), () => Promise.all(tables().map((t) => t.clear())))
}

/** Отдаёт копию пользователю как файл. */
export function downloadBackup(backup: Backup) {
  const blob = new Blob([JSON.stringify(backup, null, 1)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `typing-trainer-${new Date(backup.exportedAt).toISOString().slice(0, 10)}.json`
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
