import type { LayoutId } from '../layouts'
import type { Course, LessonDef } from './types'

/** Проставляет урокам номер и накопленный набор изученных букв. */
export function buildCourse(
  layout: LayoutId,
  defs: LessonDef[],
  dictionary: readonly string[],
): Course {
  let keys = ' '
  const lessons = defs.map((def, index) => {
    for (const ch of def.newKeys ?? '') if (!keys.includes(ch)) keys += ch
    return { ...def, layout, index, keys }
  })
  return { layout, lessons, dictionary }
}
