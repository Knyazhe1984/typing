import { buildCourse } from '../../core/course/build'
import type { LessonDef } from '../../core/course/types'
import { enWords } from '../words/en'
import { basicsLesson, newKeysPage, standardExercises } from './basics'

const gentle = { accuracy: [0.9, 0.94, 0.97], cpm: [50, 90] } as const

const lessons: LessonDef[] = [
  basicsLesson('en-basics', { left: 'A S D F', right: 'J K L ;', homing: 'F and J' }),
  {
    id: 'en-fj',
    title: { ru: 'F и J', en: 'F and J' },
    newKeys: 'fj',
    thresholds: { accuracy: [...gentle.accuracy], cpm: [...gentle.cpm] },
    theory: [
      newKeysPage({
        ru: `F нажимает левый указательный палец, J — правый указательный. Это клавиши с засечками, их можно найти на ощупь.
Пробел — большим пальцем любой руки.`,
        en: `Press F with your left index finger and J with your right index finger. These are the keys with bumps, so you can find them by touch.
Press space with either thumb.`,
      }),
    ],
    exercises: [...standardExercises],
  },
  {
    id: 'en-dk',
    title: { ru: 'D и K', en: 'D and K' },
    newKeys: 'dk',
    thresholds: { accuracy: [...gentle.accuracy], cpm: [...gentle.cpm] },
    theory: [
      newKeysPage({
        ru: 'D — левый средний палец, K — правый средний.',
        en: 'D is the left middle finger, K is the right middle finger.',
      }),
    ],
    exercises: [...standardExercises],
  },
  {
    id: 'en-sl',
    title: { ru: 'S и L', en: 'S and L' },
    newKeys: 'sl',
    thresholds: { accuracy: [...gentle.accuracy], cpm: [...gentle.cpm] },
    theory: [
      newKeysPage({
        ru: 'S — левый безымянный палец, L — правый безымянный. Не торопитесь: безымянные пальцы слушаются хуже остальных.',
        en: 'S is the left ring finger, L is the right ring finger. Take your time: ring fingers are the least obedient.',
      }),
    ],
    exercises: [...standardExercises],
  },
  {
    id: 'en-a-semicolon',
    title: { ru: 'A и ;', en: 'A and ;' },
    newKeys: 'a;',
    theory: [
      newKeysPage({
        ru: 'A — левый мизинец, ; (точка с запятой) — правый мизинец. Теперь все восемь пальцев на основной позиции.',
        en: 'A is the left pinky, ; (semicolon) is the right pinky. Now all eight fingers are in the home position.',
      }),
    ],
    exercises: [...standardExercises],
  },
  {
    id: 'en-gh',
    title: { ru: 'G и H', en: 'G and H' },
    newKeys: 'gh',
    theory: [
      newKeysPage({
        ru: 'G и H лежат в центре, между руками. G нажимает левый указательный палец, H — правый указательный: палец сдвигается к центру и сразу возвращается на засечку.',
        en: 'G and H sit in the middle, between your hands. Press G with the left index finger and H with the right index finger: slide toward the center and return to the bump right away.',
      }),
    ],
    exercises: [...standardExercises],
  },
  {
    id: 'en-quote',
    title: { ru: 'Апостроф', en: 'Apostrophe' },
    newKeys: "'",
    theory: [
      newKeysPage({
        ru: "' (апостроф) — правый мизинец, на одну клавишу правее ;. Остальные пальцы правой руки остаются на месте.",
        en: "' (apostrophe) is the right pinky, one key to the right of ;. Keep the other fingers of your right hand in place.",
      }),
    ],
    exercises: [...standardExercises],
  },
  {
    id: 'en-home-review',
    title: { ru: 'Повторение: основной ряд', en: 'Review: home row' },
    exercises: [
      { kind: 'words', count: 15 },
      { kind: 'letters', groups: 15 },
      { kind: 'words', count: 20 },
    ],
  },
]

export const enCourse = buildCourse('en', lessons, enWords)
