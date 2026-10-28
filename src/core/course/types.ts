import type { LayoutId } from '../layouts'
import type { StarThresholds } from '../progress/stars'

/** Текст на языке интерфейса: курс один, а читать теорию можно на любом языке */
export interface L10n {
  ru: string
  en: string
}

/** Иллюстрация к странице теории */
export type Illustration =
  | { type: 'posture' }
  /** Руки на основной позиции, клавиши основного ряда подсвечены */
  | { type: 'homeRow' }
  /** Клавиатура, раскрашенная по пальцам */
  | { type: 'fingers' }
  /** Новые клавиши урока и пальцы, которыми их нажимать */
  | { type: 'newKeys' }
  /** Обе клавиши Shift и мизинцы */
  | { type: 'shift' }

export interface TheoryPage {
  title: L10n
  /** Абзацы; строки, начинающиеся с «- », — пункты списка */
  body: L10n
  illustration?: Illustration
}

export type Exercise =
  /** Готовый текст */
  | { kind: 'text'; text: string }
  /** Группы случайных букв из изученных, с упором на новые */
  | { kind: 'letters'; groups: number; onlyNew?: boolean }
  /** Настоящие слова из изученных букв */
  | { kind: 'words'; count: number }

export interface LessonDef {
  id: string
  title: L10n
  /** С этого урока начинается новый раздел курса — заголовок на карте */
  section?: L10n
  /** Буквы, которые появляются в этом уроке */
  newKeys?: string
  theory?: TheoryPage[]
  exercises?: Exercise[]
  thresholds?: StarThresholds
}

export interface Lesson extends LessonDef {
  layout: LayoutId
  index: number
  /** Все символы, изученные к этому уроку включительно, плюс пробел */
  keys: string
  /** Изученные клавиши буквенных рядов без Shift — из них собираются буквенные группы */
  letters: string
}

export interface Course {
  layout: LayoutId
  lessons: Lesson[]
  dictionary: readonly string[]
}
