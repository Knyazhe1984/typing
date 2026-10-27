import { buildCourse } from '../../core/course/build'
import type { LessonDef } from '../../core/course/types'
import { ruWords } from '../words/ru'
import { basicsLesson, newKeysPage, standardExercises } from './basics'

// Первые уроки — щадящие пороги скорости, пока пальцы только запоминают клавиши
const gentle = { accuracy: [0.9, 0.94, 0.97], cpm: [50, 90] } as const

const lessons: LessonDef[] = [
  basicsLesson('ru-basics', { left: 'Ф Ы В А', right: 'О Л Д Ж', homing: 'А и О' }),
  {
    id: 'ru-ao',
    title: { ru: 'А и О', en: 'А and О' },
    newKeys: 'ао',
    thresholds: { accuracy: [...gentle.accuracy], cpm: [...gentle.cpm] },
    theory: [
      newKeysPage({
        ru: `А нажимает левый указательный палец, О — правый указательный. Это клавиши с засечками, так что найти их можно на ощупь.
Пробел — большим пальцем любой руки.`,
        en: `Press А with your left index finger and О with your right index finger. These are the keys with bumps, so you can find them by touch.
Press space with either thumb.`,
      }),
    ],
    exercises: [...standardExercises],
  },
  {
    id: 'ru-vl',
    title: { ru: 'В и Л', en: 'В and Л' },
    newKeys: 'вл',
    thresholds: { accuracy: [...gentle.accuracy], cpm: [...gentle.cpm] },
    theory: [
      newKeysPage({
        ru: 'В — левый средний палец, Л — правый средний. Они лежат сразу рядом с указательными.',
        en: 'В is the left middle finger, Л is the right middle finger. They rest right next to the index fingers.',
      }),
    ],
    exercises: [...standardExercises],
  },
  {
    id: 'ru-yd',
    title: { ru: 'Ы и Д', en: 'Ы and Д' },
    newKeys: 'ыд',
    thresholds: { accuracy: [...gentle.accuracy], cpm: [...gentle.cpm] },
    theory: [
      newKeysPage({
        ru: 'Ы — левый безымянный палец, Д — правый безымянный. Безымянные пальцы самые непослушные — не торопитесь.',
        en: 'Ы is the left ring finger, Д is the right ring finger. Ring fingers are the least obedient — take your time.',
      }),
    ],
    exercises: [...standardExercises],
  },
  {
    id: 'ru-fzh',
    title: { ru: 'Ф и Ж', en: 'Ф and Ж' },
    newKeys: 'фж',
    theory: [
      newKeysPage({
        ru: 'Ф — левый мизинец, Ж — правый мизинец. Теперь все восемь пальцев стоят на основной позиции.',
        en: 'Ф is the left pinky, Ж is the right pinky. Now all eight fingers are in the home position.',
      }),
    ],
    exercises: [...standardExercises],
  },
  {
    id: 'ru-pr',
    title: { ru: 'П и Р', en: 'П and Р' },
    newKeys: 'пр',
    theory: [
      newKeysPage({
        ru: `П и Р лежат в центре клавиатуры, между руками. П нажимает левый указательный палец, Р — правый указательный: палец сдвигается к центру и сразу возвращается на засечку.`,
        en: `П and Р sit in the middle of the keyboard, between your hands. Press П with the left index finger and Р with the right index finger: slide toward the center and return to the bump right away.`,
      }),
    ],
    exercises: [...standardExercises],
  },
  {
    id: 'ru-e',
    title: { ru: 'Э', en: 'Э' },
    newKeys: 'э',
    theory: [
      newKeysPage({
        ru: 'Э — правый мизинец, на одну клавишу правее Ж. Остальные пальцы правой руки остаются на месте.',
        en: 'Э is the right pinky, one key to the right of Ж. Keep the other fingers of your right hand in place.',
      }),
    ],
    exercises: [...standardExercises],
  },
  {
    id: 'ru-home-review',
    title: { ru: 'Повторение: основной ряд', en: 'Review: home row' },
    exercises: [
      { kind: 'words', count: 15 },
      { kind: 'letters', groups: 15 },
      { kind: 'words', count: 20 },
    ],
  },
]

export const ruCourse = buildCourse('ru', lessons, ruWords)
