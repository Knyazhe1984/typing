/** Опыт за упражнение: за каждые 10 верных символов + бонус за звёзды урока. */
export function xpForSession(correctChars: number, stars?: number): number {
  const base = Math.floor(correctChars / 10)
  const bonus = stars ? [0, 10, 20, 35][stars] : 0
  return base + bonus
}

/** Опыт, нужный для перехода с уровня n на n+1: растёт плавно. */
export const xpToNext = (level: number) => 50 + (level - 1) * 25

export interface LevelInfo {
  level: number
  /** Опыт, набранный внутри текущего уровня */
  current: number
  /** Сколько нужно на этом уровне всего */
  needed: number
}

export function levelFromXp(xp: number): LevelInfo {
  let level = 1
  let rest = xp
  while (rest >= xpToNext(level)) {
    rest -= xpToNext(level)
    level++
  }
  return { level, current: rest, needed: xpToNext(level) }
}
