import { describe, expect, it } from 'vitest'
import type { Metrics } from '../engine/session'
import { starsFor } from './stars'

const m = (accuracy: number, cpm: number): Metrics => ({
  accuracy,
  cpm,
  wpm: cpm / 5,
  errors: 0,
  elapsedMs: 1,
})

describe('starsFor', () => {
  it('низкая точность — урок не пройден, даже если быстро', () => {
    expect(starsFor(m(0.8, 300))).toBe(0)
  })
  it('точно, но медленно — 1 звезда', () => {
    expect(starsFor(m(1, 30))).toBe(1)
  })
  it('2 и 3 звезды требуют и точности, и скорости', () => {
    expect(starsFor(m(0.95, 90))).toBe(2)
    expect(starsFor(m(0.95, 200))).toBe(2)
    expect(starsFor(m(0.98, 130))).toBe(3)
  })
})
