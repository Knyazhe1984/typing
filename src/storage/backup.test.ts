import { describe, expect, it } from 'vitest'
import { parseBackup } from './backup'

const valid = {
  app: 'typing-trainer',
  version: 1,
  exportedAt: 1,
  settings: { theme: 'dark' },
  data: {
    lessonProgress: [{ lessonId: 'ru-ao', completed: true, bestStars: 3 }],
    sessions: [{ lessonId: 'ru-ao', layout: 'ru', finishedAt: 1, cpm: 100 }],
    keyStats: [{ layout: 'ru', char: 'а', hits: 10, errors: 1 }],
    achievements: [{ id: 'basics', unlockedAt: 1 }],
  },
}

describe('parseBackup', () => {
  it('принимает корректную копию', () => {
    expect(parseBackup(valid).data.sessions).toHaveLength(1)
  })

  it('отклоняет чужие и битые файлы', () => {
    expect(() => parseBackup({ foo: 1 })).toThrow()
    expect(() => parseBackup(null)).toThrow()
    expect(() => parseBackup({ ...valid, version: 99 })).toThrow()
    expect(() =>
      parseBackup({ ...valid, data: { ...valid.data, sessions: [{ lessonId: 1 }] } }),
    ).toThrow()
  })
})
