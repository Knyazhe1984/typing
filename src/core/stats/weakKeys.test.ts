import { describe, expect, it } from 'vitest'
import type { KeyStat } from './keyStats'
import { scoreKeys, weakKeys } from './weakKeys'

const stat = (hits: number, errors: number, latency: number): KeyStat => ({
  hits,
  errors,
  latencyMs: latency * (hits - errors),
  latencyCount: hits - errors,
})

describe('weakKeys', () => {
  const stats: [string, KeyStat][] = [
    ['а', stat(100, 2, 200)],
    ['о', stat(100, 3, 210)],
    ['ж', stat(50, 10, 400)],
    ['э', stat(40, 2, 800)],
    ['ъ', stat(3, 3, 900)],
    [' ', stat(200, 50, 900)],
  ]

  it('находит клавиши с ошибками и задержками', () => {
    expect(weakKeys(stats).map((k) => k.char)).toEqual(['ж', 'э'])
  })

  it('игнорирует редкие клавиши и пробел', () => {
    const chars = scoreKeys(stats).map((k) => k.char)
    expect(chars).not.toContain('ъ')
    expect(chars).not.toContain(' ')
  })

  it('без ошибок оценивает только по скорости', () => {
    const k = scoreKeys([
      ['a', stat(20, 0, 100)],
      ['b', stat(20, 0, 300)],
    ])
    expect(k[1].score).toBeGreaterThan(k[0].score)
  })
})
