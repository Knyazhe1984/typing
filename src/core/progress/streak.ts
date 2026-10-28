/** Ключ дня по местному времени: «2026-10-28». */
export function dayKey(ts: number): string {
  const d = new Date(ts)
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${mm}-${dd}`
}

function prevDay(key: string): string {
  const [y, m, d] = key.split('-').map(Number)
  return dayKey(new Date(y, m - 1, d - 1, 12).getTime())
}

export interface StreakInfo {
  /** Дней подряд с занятиями, включая сегодня или вчера (если сегодня ещё не занимались) */
  current: number
  best: number
  activeToday: boolean
}

export function streakInfo(activeDays: Iterable<string>, now: number): StreakInfo {
  const days = new Set(activeDays)
  const today = dayKey(now)
  const activeToday = days.has(today)

  let current = 0
  let cursor = activeToday ? today : prevDay(today)
  while (days.has(cursor)) {
    current++
    cursor = prevDay(cursor)
  }

  let best = 0
  for (const day of days) {
    // Считаем только от начала каждой серии
    if (days.has(prevDay(day))) continue
    let len = 0
    let c = day
    while (days.has(c)) {
      len++
      const [y, m, d] = c.split('-').map(Number)
      c = dayKey(new Date(y, m - 1, d + 1, 12).getTime())
    }
    best = Math.max(best, len)
  }
  return { current, best, activeToday }
}
