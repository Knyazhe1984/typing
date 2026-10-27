import type { Keystroke } from '../engine/session'

export interface KeyStat {
  hits: number
  errors: number
  /** Сумма задержек перед верными нажатиями, мс */
  latencyMs: number
  latencyCount: number
}

export const emptyKeyStat = (): KeyStat => ({ hits: 0, errors: 0, latencyMs: 0, latencyCount: 0 })

// Паузы длиннее — это отвлёкся, а не медленная клавиша
const MAX_LATENCY_MS = 3000

/** Сводит нажатия сессии в статистику по ожидаемым символам. */
export function aggregateKeystrokes(keystrokes: readonly Keystroke[]): Map<string, KeyStat> {
  const stats = new Map<string, KeyStat>()
  let prevAt: number | null = null
  for (const k of keystrokes) {
    const stat = stats.get(k.expected) ?? emptyKeyStat()
    stat.hits++
    if (!k.correct) stat.errors++
    else if (prevAt !== null && k.at - prevAt <= MAX_LATENCY_MS) {
      stat.latencyMs += k.at - prevAt
      stat.latencyCount++
    }
    stats.set(k.expected, stat)
    prevAt = k.at
  }
  return stats
}

export function mergeKeyStat(a: KeyStat, b: KeyStat): KeyStat {
  return {
    hits: a.hits + b.hits,
    errors: a.errors + b.errors,
    latencyMs: a.latencyMs + b.latencyMs,
    latencyCount: a.latencyCount + b.latencyCount,
  }
}
