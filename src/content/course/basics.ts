import type { L10n, LessonDef, TheoryPage } from '../../core/course/types'

interface HomeKeys {
  left: string
  right: string
  homing: string
}

/** Вводный урок без набора: посадка, основная позиция, зоны пальцев, правила. */
export function basicsLesson(id: string, k: HomeKeys): LessonDef {
  const pages: TheoryPage[] = [
    {
      title: { ru: 'Посадка', en: 'Posture' },
      illustration: { type: 'posture' },
      body: {
        ru: `Удобная посадка — половина успеха: в напряжённой позе быстро устают руки и спина.
- Сядьте прямо, спиной опирайтесь на спинку стула.
- Ступни стоят на полу, колени согнуты примерно под прямым углом.
- Локти свободно опущены вдоль тела и согнуты под прямым углом или чуть больше.
- Запястья не лежат на столе и не проваливаются вниз — пальцы слегка согнуты, как будто держат мяч.
- Экран — на расстоянии вытянутой руки, верх экрана примерно на уровне глаз.`,
        en: `Good posture is half the battle: a tense position quickly tires your hands and back.
- Sit up straight and lean against the back of the chair.
- Keep your feet flat on the floor, knees bent at roughly a right angle.
- Let your elbows hang loosely by your sides, bent at a right angle or slightly more.
- Do not rest your wrists on the desk or let them sag — keep your fingers slightly curved, as if holding a ball.
- Keep the screen at arm's length, its top at about eye level.`,
      },
    },
    {
      title: { ru: 'Основная позиция', en: 'Home position' },
      illustration: { type: 'homeRow' },
      body: {
        ru: `Найдите на клавишах ${k.homing} небольшие выступы — засечки. Их можно нащупать, не глядя на клавиатуру: на них лежат указательные пальцы.
- Левая рука: мизинец, безымянный, средний и указательный — на клавишах ${k.left}.
- Правая рука: указательный, средний, безымянный и мизинец — на клавишах ${k.right}.
- Большие пальцы свободно висят над пробелом.
Это основная позиция. С неё начинается любое нажатие, и в неё пальцы возвращаются после каждой клавиши.`,
        en: `Find the small bumps on the ${k.homing} keys. You can feel them without looking: your index fingers rest on them.
- Left hand: pinky, ring, middle and index fingers on ${k.left}.
- Right hand: index, middle, ring fingers and pinky on ${k.right}.
- Your thumbs hover over the space bar.
This is the home position. Every keystroke starts here, and your fingers return here after each key.`,
      },
    },
    {
      title: { ru: 'Зоны пальцев', en: 'Finger zones' },
      illustration: { type: 'fingers' },
      body: {
        ru: `Каждый палец отвечает за свои клавиши — на схеме они одного цвета с пальцем. Палец тянется к нужной клавише и сразу возвращается на основную позицию.
Пробел нажимайте большим пальцем. Заглавные буквы — с Shift, который зажимает мизинец другой руки: для букв левой руки — правый Shift, для букв правой — левый.`,
        en: `Each finger is responsible for its own keys — on the diagram they share the finger's color. The finger reaches for its key and immediately returns to the home position.
Press the space bar with your thumb. For capital letters, hold Shift with the pinky of the other hand: right Shift for left-hand letters, left Shift for right-hand letters.`,
      },
    },
    {
      title: { ru: 'Главные правила', en: 'Golden rules' },
      body: {
        ru: `- Не смотрите на клавиатуру. Подглядывать хочется, но именно так вырабатывается мышечная память. Если забыли клавишу — посмотрите на экранную подсказку.
- Точность важнее скорости. Скорость придёт сама, а привычку ошибаться потом трудно исправить.
- Держите ровный ритм: лучше медленно и равномерно, чем рывками.
- Занимайтесь понемногу, но регулярно: 10–15 минут каждый день дают больше, чем час раз в неделю.
- Устали руки — сделайте перерыв.`,
        en: `- Do not look at the keyboard. It is tempting, but this is how muscle memory forms. If you forget a key, check the on-screen hint.
- Accuracy matters more than speed. Speed will come by itself, but a habit of making mistakes is hard to unlearn.
- Keep a steady rhythm: slow and even is better than fast and jerky.
- Practice a little but often: 10–15 minutes every day beats an hour once a week.
- If your hands get tired, take a break.`,
      },
    },
  ]
  return { id, title: { ru: 'Азы', en: 'The basics' }, theory: pages }
}

/** Страница теории о новых клавишах урока. */
export function newKeysPage(body: L10n): TheoryPage {
  return {
    title: { ru: 'Новые клавиши', en: 'New keys' },
    illustration: { type: 'newKeys' },
    body,
  }
}

/** Стандартный набор упражнений для урока с новыми клавишами. */
export const standardExercises = [
  { kind: 'letters', groups: 10, onlyNew: true },
  { kind: 'letters', groups: 14 },
  { kind: 'words', count: 12 },
] as const
