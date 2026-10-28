import { describe, expect, it } from 'vitest'
import { courses } from '../../content/course'
import { achievements, satisfiedAchievements, type AchievementContext } from './achievements'

const ctx = (patch: Partial<AchievementContext>): AchievementContext => ({
  sessions: [],
  completed: new Set(),
  courses,
  bestStreak: 0,
  ...patch,
})

describe('achievements', () => {
  it('id уникальны', () => {
    const ids = achievements.map((a) => a.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('с нуля ничего не открыто', () => {
    expect(satisfiedAchievements(ctx({}))).toEqual([])
  })

  it('первый урок, три звезды и без ошибок', () => {
    const ids = satisfiedAchievements(
      ctx({
        sessions: [{ lessonId: 'ru-ao', layout: 'ru', cpm: 80, accuracy: 1, chars: 120, stars: 3 }],
        completed: new Set(['ru-basics', 'ru-ao']),
      }),
    )
    expect(ids).toEqual(['basics', 'first-lesson', 'three-stars', 'flawless'])
  })

  it('скорость без точности не засчитывается', () => {
    const fast = { lessonId: 'practice', layout: 'ru' as const, cpm: 250, chars: 100 }
    expect(satisfiedAchievements(ctx({ sessions: [{ ...fast, accuracy: 0.8 }] }))).toEqual([])
    expect(satisfiedAchievements(ctx({ sessions: [{ ...fast, accuracy: 0.95 }] }))).toEqual([
      'speed-100',
      'speed-200',
    ])
  })

  it('весь курс и серии', () => {
    const all = new Set(courses.ru.lessons.map((l) => l.id))
    const ids = satisfiedAchievements(ctx({ completed: all, bestStreak: 7 }))
    expect(ids).toEqual(['basics', 'course-ru', 'streak-3', 'streak-7'])
  })
})
