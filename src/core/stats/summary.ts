import { emptyKeyStat, mergeKeyStat, type KeyStat } from './keyStats'

export interface SessionLike {
  finishedAt: number
  cpm: number
  accuracy: number
  elapsedMs: number
  chars: number
}

export interface Summary {
  sessions: number
  totalMs: number
  totalChars: number
  /** Лучшая скорость среди попыток с точностью от 90% */
  bestCpm: number
  /** Точность за последние занятия, взвешенная по числу символов */
  recentAccuracy: number
}

export function summarize(sessions: readonly SessionLike[], recent = 20): Summary {
  const last = [...sessions].sort((a, b) => a.finishedAt - b.finishedAt).slice(-recent)
  const lastChars = last.reduce((sum, x) => sum + x.chars, 0)
  return {
    sessions: sessions.length,
    totalMs: sessions.reduce((sum, x) => sum + x.elapsedMs, 0),
    totalChars: sessions.reduce((sum, x) => sum + x.chars, 0),
    bestCpm: Math.max(0, ...sessions.filter((x) => x.accuracy >= 0.9).map((x) => x.cpm)),
    recentAccuracy: lastChars
      ? last.reduce((sum, x) => sum + x.accuracy * x.chars, 0) / lastChars
      : 0,
  }
}

/** Статистика физической клавиши: символ без Shift и с Shift вместе. */
export function physicalKeyStat(stats: Map<string, KeyStat>, chars: string[]): KeyStat | undefined {
  const found = chars.flatMap((c) => stats.get(c) ?? [])
  return found.length ? found.reduce(mergeKeyStat, emptyKeyStat()) : undefined
}

/** Ступень шкалы 1…5 по возрастающим порогам. */
export function heatLevel(value: number, thresholds: readonly number[]): number {
  const i = thresholds.findIndex((t) => value < t)
  return i === -1 ? thresholds.length + 1 : i + 1
}
