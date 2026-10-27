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
  /** Буквы, которые появляются в этом уроке */
  newKeys?: string
  theory?: TheoryPage[]
  exercises?: Exercise[]
  thresholds?: StarThresholds
}

export interface Lesson extends LessonDef {
  layout: LayoutId
  index: number
  /** Все буквы, изученные к этому уроку включительно, плюс пробел */
  keys: string
}

export interface Course {
  layout: LayoutId
  lessons: Lesson[]
  dictionary: readonly string[]
}
