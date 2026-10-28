import type { Course, L10n } from '../course/types'
import type { LayoutId } from '../layouts'

export interface SessionSummary {
  lessonId: string
  layout: LayoutId
  cpm: number
  accuracy: number
  chars: number
  stars?: number
}

export interface AchievementContext {
  sessions: readonly SessionSummary[]
  /** id пройденных уроков */
  completed: ReadonlySet<string>
  courses: Record<LayoutId, Course>
  bestStreak: number
}

export interface Achievement {
  id: string
  icon: string
  title: L10n
  description: L10n
  check: (ctx: AchievementContext) => boolean
}

const isLesson = (s: SessionSummary) => s.lessonId !== 'practice'
const totalChars = (ctx: AchievementContext) => ctx.sessions.reduce((sum, s) => sum + s.chars, 0)
// Скорость засчитываем только при приличной точности — иначе это не скорость, а спешка
const reachedSpeed = (ctx: AchievementContext, cpm: number) =>
  ctx.sessions.some((s) => s.cpm >= cpm && s.accuracy >= 0.9 && s.chars >= 30)

function courseDone(ctx: AchievementContext, layout: LayoutId) {
  return ctx.courses[layout].lessons.every((l) => ctx.completed.has(l.id))
}

const speed = (cpm: number, icon: string): Achievement => ({
  id: `speed-${cpm}`,
  icon,
  title: { ru: `${cpm} знаков в минуту`, en: `${cpm} characters per minute` },
  description: {
    ru: `Наберите текст со скоростью ${cpm} зн/мин и точностью от 90%`,
    en: `Type at ${cpm} cpm with at least 90% accuracy`,
  },
  check: (ctx) => reachedSpeed(ctx, cpm),
})

const streak = (days: number, icon: string): Achievement => ({
  id: `streak-${days}`,
  icon,
  title: { ru: `${days} дней подряд`, en: `${days}-day streak` },
  description: {
    ru: `Занимайтесь ${days} дней подряд`,
    en: `Practice ${days} days in a row`,
  },
  check: (ctx) => ctx.bestStreak >= days,
})

const chars = (n: number, icon: string): Achievement => ({
  id: `chars-${n}`,
  icon,
  title: {
    ru: `${n.toLocaleString('ru-RU')} символов`,
    en: `${n.toLocaleString('en-US')} characters`,
  },
  description: {
    ru: `Наберите всего ${n.toLocaleString('ru-RU')} символов`,
    en: `Type ${n.toLocaleString('en-US')} characters in total`,
  },
  check: (ctx) => totalChars(ctx) >= n,
})

export const achievements: Achievement[] = [
  {
    id: 'basics',
    icon: '🌱',
    title: { ru: 'Первые шаги', en: 'First steps' },
    description: { ru: 'Изучите азы слепой печати', en: 'Learn the basics of touch typing' },
    check: (ctx) => ctx.completed.has('ru-basics') || ctx.completed.has('en-basics'),
  },
  {
    id: 'first-lesson',
    icon: '🎯',
    title: { ru: 'Первый урок', en: 'First lesson' },
    description: { ru: 'Пройдите первый урок с набором', en: 'Complete your first typing lesson' },
    check: (ctx) => ctx.sessions.some((s) => isLesson(s) && (s.stars ?? 0) > 0),
  },
  {
    id: 'three-stars',
    icon: '⭐',
    title: { ru: 'Три звезды', en: 'Three stars' },
    description: { ru: 'Пройдите урок на три звезды', en: 'Get three stars in a lesson' },
    check: (ctx) => ctx.sessions.some((s) => s.stars === 3),
  },
  {
    id: 'flawless',
    icon: '💎',
    title: { ru: 'Без единой ошибки', en: 'Flawless' },
    description: { ru: 'Пройдите урок без ошибок', en: 'Complete a lesson without mistakes' },
    check: (ctx) => ctx.sessions.some((s) => isLesson(s) && (s.stars ?? 0) > 0 && s.accuracy === 1),
  },
  {
    id: 'course-ru',
    icon: '🏠',
    title: { ru: 'Основной ряд: ЙЦУКЕН', en: 'Home row: ЙЦУКЕН' },
    description: {
      ru: 'Пройдите все уроки русского курса',
      en: 'Complete every lesson of the Russian course',
    },
    check: (ctx) => courseDone(ctx, 'ru'),
  },
  {
    id: 'course-en',
    icon: '🏡',
    title: { ru: 'Основной ряд: QWERTY', en: 'Home row: QWERTY' },
    description: {
      ru: 'Пройдите все уроки английского курса',
      en: 'Complete every lesson of the English course',
    },
    check: (ctx) => courseDone(ctx, 'en'),
  },
  {
    id: 'bilingual',
    icon: '🌍',
    title: { ru: 'Две раскладки', en: 'Bilingual' },
    description: {
      ru: 'Пройдите урок и в русской, и в английской раскладке',
      en: 'Complete a lesson in both the Russian and English layouts',
    },
    check: (ctx) =>
      (['ru', 'en'] as const).every((layout) =>
        ctx.sessions.some((s) => isLesson(s) && s.layout === layout && (s.stars ?? 0) > 0),
      ),
  },
  {
    id: 'practice-10',
    icon: '📝',
    title: { ru: 'Тренировка', en: 'Practice makes perfect' },
    description: {
      ru: 'Наберите 10 текстов в свободной тренировке',
      en: 'Finish 10 texts in free practice',
    },
    check: (ctx) => ctx.sessions.filter((s) => !isLesson(s)).length >= 10,
  },
  speed(100, '🚲'),
  speed(200, '🚗'),
  speed(300, '🚀'),
  streak(3, '🔥'),
  streak(7, '📅'),
  streak(30, '🏆'),
  chars(1000, '✍️'),
  chars(10000, '📚'),
  chars(100000, '🏛️'),
]

/** id всех достижений, условия которых выполнены. */
export function satisfiedAchievements(ctx: AchievementContext): string[] {
  return achievements.filter((a) => a.check(ctx)).map((a) => a.id)
}
