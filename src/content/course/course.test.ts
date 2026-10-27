import { describe, expect, it } from 'vitest'
import { exerciseText } from '../../core/course/exercises'
import { createRng } from '../../core/generator/random'
import { hasChar, layouts } from '../../core/layouts'
import { courses } from '.'

describe.each(Object.values(courses))('курс $layout', (course) => {
  const layout = layouts[course.layout]

  it('id уроков уникальны', () => {
    const ids = course.lessons.map((l) => l.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('все слова словаря набираются в раскладке', () => {
    for (const w of course.dictionary) {
      for (const ch of w) expect(hasChar(layout, ch), `${w}: ${ch}`).toBe(true)
    }
  })

  it('упражнения используют только изученные буквы', () => {
    for (const lesson of course.lessons) {
      for (const ex of lesson.exercises ?? []) {
        for (let seed = 0; seed < 5; seed++) {
          const text = exerciseText(ex, lesson, course, createRng(seed))
          expect(text.length, lesson.id).toBeGreaterThan(0)
          for (const ch of text) expect(lesson.keys, `${lesson.id}: «${ch}»`).toContain(ch)
        }
      }
    }
  })

  it('урок повторения даёт настоящие слова', () => {
    const review = course.lessons.at(-1)!
    const text = exerciseText({ kind: 'words', count: 20 }, review, course, createRng(1))
    for (const w of text.split(' ')) expect(course.dictionary).toContain(w)
  })
})
