import { describe, expect, it } from 'vitest'
import { aggregateKeystrokes } from './keyStats'

describe('aggregateKeystrokes', () => {
  it('считает нажатия, ошибки и задержки по ожидаемым символам', () => {
    const stats = aggregateKeystrokes([
      { expected: 'а', actual: 'а', correct: true, at: 0 },
      { expected: 'о', actual: 'л', correct: false, at: 200 },
      { expected: 'о', actual: 'о', correct: true, at: 500 },
      { expected: 'а', actual: 'а', correct: true, at: 9000 },
    ])
    expect(stats.get('а')).toEqual({ hits: 2, errors: 0, latencyMs: 0, latencyCount: 0 })
    expect(stats.get('о')).toEqual({ hits: 2, errors: 1, latencyMs: 300, latencyCount: 1 })
  })
})
