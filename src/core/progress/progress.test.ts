import { describe, expect, it } from 'vitest'
import { dayKey, streakInfo } from './streak'
import { levelFromXp, xpForSession } from './xp'

describe('xp', () => {
  it('опыт за символы и звёзды', () => {
    expect(xpForSession(95)).toBe(9)
    expect(xpForSession(100, 3)).toBe(45)
    expect(xpForSession(100, 0)).toBe(10)
  })

  it('уровни', () => {
    expect(levelFromXp(0)).toEqual({ level: 1, current: 0, needed: 50 })
    expect(levelFromXp(49).level).toBe(1)
    expect(levelFromXp(50)).toEqual({ level: 2, current: 0, needed: 75 })
    expect(levelFromXp(50 + 75 + 10)).toEqual({ level: 3, current: 10, needed: 100 })
  })
})

describe('streak', () => {
  const at = (y: number, m: number, d: number, h = 12) => new Date(y, m - 1, d, h).getTime()
  const days = (...ds: number[][]) => ds.map(([y, m, d]) => dayKey(at(y, m, d)))

  it('серия, включая сегодня', () => {
    const s = streakInfo(days([2026, 10, 26], [2026, 10, 27], [2026, 10, 28]), at(2026, 10, 28))
    expect(s).toEqual({ current: 3, best: 3, activeToday: true })
  })

  it('сегодня ещё не занимались — серия со вчера не обнулилась', () => {
    const s = streakInfo(days([2026, 10, 26], [2026, 10, 27]), at(2026, 10, 28))
    expect(s).toEqual({ current: 2, best: 2, activeToday: false })
  })

  it('пропуск дня обнуляет текущую серию, но лучшая остаётся', () => {
    const s = streakInfo(
      days([2026, 10, 20], [2026, 10, 21], [2026, 10, 22], [2026, 10, 27]),
      at(2026, 10, 29),
    )
    expect(s).toEqual({ current: 0, best: 3, activeToday: false })
  })

  it('серия переходит через границу месяца', () => {
    const s = streakInfo(days([2026, 10, 31], [2026, 11, 1]), at(2026, 11, 1))
    expect(s.current).toBe(2)
  })
})
