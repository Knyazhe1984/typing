import { describe, expect, it } from 'vitest'
import { heatLevel, physicalKeyStat, summarize } from './summary'

describe('summary', () => {
  it('summarize считает итоги и лучшую скорость при хорошей точности', () => {
    const s = summarize([
      { finishedAt: 1, cpm: 300, accuracy: 0.8, elapsedMs: 60000, chars: 100 },
      { finishedAt: 2, cpm: 150, accuracy: 0.95, elapsedMs: 30000, chars: 300 },
    ])
    expect(s.sessions).toBe(2)
    expect(s.totalMs).toBe(90000)
    expect(s.totalChars).toBe(400)
    expect(s.bestCpm).toBe(150)
    expect(s.recentAccuracy).toBeCloseTo((0.8 * 100 + 0.95 * 300) / 400)
  })

  it('пустая история', () => {
    expect(summarize([])).toMatchObject({ sessions: 0, bestCpm: 0, recentAccuracy: 0 })
  })

  it('physicalKeyStat объединяет регистры', () => {
    const stats = new Map([
      ['а', { hits: 10, errors: 1, latencyMs: 900, latencyCount: 9 }],
      ['А', { hits: 2, errors: 1, latencyMs: 300, latencyCount: 1 }],
    ])
    expect(physicalKeyStat(stats, ['а', 'А'])).toEqual({
      hits: 12,
      errors: 2,
      latencyMs: 1200,
      latencyCount: 10,
    })
    expect(physicalKeyStat(stats, ['б'])).toBeUndefined()
  })

  it('heatLevel', () => {
    const t = [0.01, 0.03, 0.06, 0.1]
    expect(heatLevel(0, t)).toBe(1)
    expect(heatLevel(0.02, t)).toBe(2)
    expect(heatLevel(0.5, t)).toBe(5)
  })
})
