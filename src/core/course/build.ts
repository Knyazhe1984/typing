import { layouts, type LayoutId } from '../layouts'
import type { Course, LessonDef } from './types'

/** Проставляет урокам номер и накопленный набор изученных символов. */
export function buildCourse(
  layout: LayoutId,
  defs: LessonDef[],
  dictionary: readonly string[],
): Course {
  // Ряды 1–3 — буквенные; цифровой ряд и Shift-символы в буквенные группы не идут
  const letterRowChars = new Set(
    layouts[layout].rows.slice(1, 4).flatMap((row) => row.map((k) => k.base)),
  )
  let keys = ' '
  let letters = ''
  const lessons = defs.map((def, index) => {
    for (const ch of def.newKeys ?? '') {
      if (!keys.includes(ch)) keys += ch
      if (letterRowChars.has(ch) && !letters.includes(ch)) letters += ch
    }
    return { ...def, layout, index, keys, letters }
  })
  return { layout, lessons, dictionary }
}
