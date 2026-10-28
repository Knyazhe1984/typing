import { letterGroups, textDrill } from '../generator/generator'
import type { Rng } from '../generator/random'
import type { Course, Exercise, Lesson } from './types'

/** Превращает описание упражнения в конкретный текст для набора. */
export function exerciseText(exercise: Exercise, lesson: Lesson, course: Course, rng: Rng): string {
  const focus = lesson.newKeys ?? ''
  switch (exercise.kind) {
    case 'text':
      return exercise.text
    case 'letters':
      return letterGroups(
        exercise.onlyNew && focus ? focus : lesson.letters + focus,
        focus,
        exercise.groups,
        rng,
      )
    case 'words':
      return textDrill(course.dictionary, lesson.keys, focus, exercise.count, rng)
  }
}
