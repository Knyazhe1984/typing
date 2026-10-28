import type { KeyStat } from './keyStats'

export interface KeyScore {
  char: string
  hits: number
  errorRate: number
  /** Средняя задержка перед верным нажатием, мс; undefined — нет данных */
  latencyMs?: number
  /** Насколько клавиша хуже средней: 1 — как все, больше — хуже */
  score: number
}

const avg = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0)

/**
 * Оценивает клавиши относительно средних по пользователю: доля ошибок важнее
 * задержки. Клавиши, нажатые реже minHits раз, не оцениваются — мало данных.
 */
export function scoreKeys(stats: Iterable<[string, KeyStat]>, minHits = 10): KeyScore[] {
  const rows = [...stats]
    .filter(([char, s]) => char !== ' ' && s.hits >= minHits)
    .map(([char, s]) => ({
      char,
      hits: s.hits,
      errorRate: s.errors / s.hits,
      latencyMs: s.latencyCount ? s.latencyMs / s.latencyCount : undefined,
    }))
  const meanErr = avg(rows.map((r) => r.errorRate))
  const meanLat = avg(rows.flatMap((r) => (r.latencyMs === undefined ? [] : [r.latencyMs])))
  return rows.map((r) => {
    const err = meanErr > 0 ? r.errorRate / meanErr : 1
    const lat = meanLat > 0 && r.latencyMs !== undefined ? r.latencyMs / meanLat : 1
    return { ...r, score: 0.65 * err + 0.35 * lat }
  })
}

/** Самые проблемные клавиши — только те, что заметно хуже средних. */
export function weakKeys(stats: Iterable<[string, KeyStat]>, limit = 5, minHits = 10): KeyScore[] {
  return scoreKeys(stats, minHits)
    .filter((k) => k.score > 1.05)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}
