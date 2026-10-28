import { buildCourse } from '../../core/course/build'
import type { LessonDef } from '../../core/course/types'
import { practiceText } from '../practiceTexts'
import { enWords } from '../words/en'
import {
  basicsLesson,
  digitExercises,
  gentle,
  keysLesson,
  pairTitle,
  reviewExercises,
  slow,
  textLesson,
  wordExercises,
} from './basics'

const text = (id: string) => practiceText('en', id)
const symbols = { exercises: wordExercises, thresholds: slow() }

const lessons: LessonDef[] = [
  {
    ...basicsLesson('en-basics', { left: 'A S D F', right: 'J K L ;', homing: 'F and J' }),
    section: { ru: 'Основной ряд', en: 'Home row' },
  },
  keysLesson(
    'en-fj',
    'fj',
    pairTitle('F', 'J'),
    {
      ru: `F нажимает левый указательный палец, J — правый указательный. Это клавиши с засечками, их можно найти на ощупь.
Пробел — большим пальцем любой руки.`,
      en: `Press F with your left index finger and J with your right index finger. These are the keys with bumps, so you can find them by touch.
Press space with either thumb.`,
    },
    { thresholds: gentle() },
  ),
  keysLesson(
    'en-dk',
    'dk',
    pairTitle('D', 'K'),
    {
      ru: 'D — левый средний палец, K — правый средний.',
      en: 'D is the left middle finger, K is the right middle finger.',
    },
    { thresholds: gentle() },
  ),
  keysLesson(
    'en-sl',
    'sl',
    pairTitle('S', 'L'),
    {
      ru: 'S — левый безымянный палец, L — правый безымянный. Не торопитесь: безымянные пальцы слушаются хуже остальных.',
      en: 'S is the left ring finger, L is the right ring finger. Take your time: ring fingers are the least obedient.',
    },
    { thresholds: gentle() },
  ),
  keysLesson('en-a-semicolon', 'a;', pairTitle('A', ';'), {
    ru: 'A — левый мизинец, ; (точка с запятой) — правый мизинец. Теперь все восемь пальцев на основной позиции.',
    en: 'A is the left pinky, ; (semicolon) is the right pinky. Now all eight fingers are in the home position.',
  }),
  keysLesson('en-gh', 'gh', pairTitle('G', 'H'), {
    ru: 'G и H лежат в центре, между руками. G нажимает левый указательный палец, H — правый указательный: палец сдвигается к центру и сразу возвращается на засечку.',
    en: 'G and H sit in the middle, between your hands. Press G with the left index finger and H with the right index finger: slide toward the center and return to the bump right away.',
  }),
  keysLesson(
    'en-quote',
    "'",
    { ru: 'Апостроф', en: 'Apostrophe' },
    {
      ru: "' (апостроф) — правый мизинец, на одну клавишу правее ;. Остальные пальцы правой руки остаются на месте.",
      en: "' (apostrophe) is the right pinky, one key to the right of ;. Keep the other fingers of your right hand in place.",
    },
  ),
  {
    id: 'en-home-review',
    title: { ru: 'Повторение: основной ряд', en: 'Review: home row' },
    exercises: reviewExercises,
  },

  keysLesson(
    'en-ei',
    'ei',
    pairTitle('E', 'I'),
    {
      ru: `Начинаем верхний ряд. E и I — самые частые буквы в нём. E нажимает левый средний палец, I — правый средний: палец тянется вверх и чуть влево, потом возвращается на место.`,
      en: `Starting the top row. E and I are its most frequent letters. Press E with the left middle finger and I with the right middle finger: reach up and slightly left, then return home.`,
    },
    { section: { ru: 'Верхний ряд', en: 'Top row' } },
  ),
  keysLesson('en-ru', 'ru', pairTitle('R', 'U'), {
    ru: 'R — левый указательный палец, над F. U — правый указательный, над J.',
    en: 'R is the left index finger, above F. U is the right index finger, above J.',
  }),
  keysLesson('en-ty', 'ty', pairTitle('T', 'Y'), {
    ru: 'T и Y — в центре верхнего ряда. T нажимает левый указательный палец, Y — правый указательный.',
    en: 'T and Y sit in the middle of the top row. Press T with the left index finger and Y with the right index finger.',
  }),
  keysLesson('en-wo', 'wo', pairTitle('W', 'O'), {
    ru: 'W — левый безымянный палец, над S. O — правый безымянный, над L.',
    en: 'W is the left ring finger, above S. O is the right ring finger, above L.',
  }),
  keysLesson('en-qp', 'qp', pairTitle('Q', 'P'), {
    ru: 'Q — левый мизинец, над A. P — правый мизинец, над ;.',
    en: 'Q is the left pinky, above A. P is the right pinky, above ;.',
  }),
  {
    id: 'en-top-review',
    title: { ru: 'Повторение: верхний ряд', en: 'Review: top row' },
    exercises: reviewExercises,
  },

  keysLesson(
    'en-vm',
    'vm',
    pairTitle('V', 'M'),
    {
      ru: `Начинаем нижний ряд. Пальцы сгибаются и тянутся вниз, а ладонь остаётся на месте.
V — левый указательный палец, под F. M — правый указательный, под J.`,
      en: `Starting the bottom row. Curl your fingers down while your palm stays in place.
V is the left index finger, below F. M is the right index finger, below J.`,
    },
    { section: { ru: 'Нижний ряд', en: 'Bottom row' } },
  ),
  keysLesson('en-bn', 'bn', pairTitle('B', 'N'), {
    ru: 'B и N — в центре нижнего ряда. B нажимает левый указательный палец, N — правый указательный.',
    en: 'B and N sit in the middle of the bottom row. Press B with the left index finger and N with the right index finger.',
  }),
  keysLesson(
    'en-c-comma',
    'c,',
    { ru: 'C и запятая', en: 'C and comma' },
    {
      ru: 'C — левый средний палец, под D. Запятая — правый средний, под K. Запятую ставят сразу после слова.',
      en: 'C is the left middle finger, below D. The comma is the right middle finger, below K. Put it right after a word.',
    },
  ),
  keysLesson(
    'en-x-dot',
    'x.',
    { ru: 'X и точка', en: 'X and period' },
    {
      ru: 'X — левый безымянный палец, под S. Точка — правый безымянный, под L.',
      en: 'X is the left ring finger, below S. The period is the right ring finger, below L.',
    },
  ),
  keysLesson(
    'en-z-slash',
    'z/',
    { ru: 'Z и слеш', en: 'Z and slash' },
    {
      ru: 'Z — левый мизинец, под A. / (слеш) — правый мизинец, под ;.',
      en: 'Z is the left pinky, below A. / (slash) is the right pinky, below ;.',
    },
  ),
  {
    id: 'en-letters-review',
    title: { ru: 'Повторение: все буквы', en: 'Review: all letters' },
    exercises: reviewExercises,
  },

  {
    id: 'en-capitals',
    title: { ru: 'Заглавные буквы', en: 'Capital letters' },
    section: { ru: 'Заглавные и знаки', en: 'Capitals and punctuation' },
    newKeys: 'QWERTYUIOPASDFGHJKLZXCVBNM',
    thresholds: slow(),
    theory: [
      {
        title: { ru: 'Клавиша Shift', en: 'The Shift key' },
        illustration: { type: 'shift' },
        body: {
          ru: `Заглавную букву набирают с зажатым Shift. Shift нажимает мизинец той руки, которая свободна:
- буква левой рукой (например, A или R) — правый Shift;
- буква правой рукой (например, J или N) — левый Shift.
Сначала зажмите Shift, затем нажмите букву и отпустите обе клавиши. Не используйте Caps Lock для одной буквы.`,
          en: `Type a capital letter while holding Shift. Press Shift with the pinky of the free hand:
- a left-hand letter (such as A or R) — right Shift;
- a right-hand letter (such as J or N) — left Shift.
Hold Shift first, then press the letter and release both keys. Do not use Caps Lock for a single letter.`,
        },
      },
    ],
    exercises: wordExercises,
  },
  keysLesson(
    'en-excl',
    '!?',
    { ru: 'Знаки ! и ?', en: 'Marks ! and ?' },
    {
      ru: `! — Shift и 1 (левый мизинец, Shift правый). ? — Shift и / (правый мизинец, Shift левый).
После них, как и после точки, предложение начинается с заглавной буквы.`,
      en: `! is Shift + 1 (left pinky, right Shift). ? is Shift + / (right pinky, left Shift).
As after a period, the next sentence starts with a capital letter.`,
    },
    symbols,
  ),
  keysLesson(
    'en-colon',
    ':"-',
    { ru: 'Двоеточие, кавычки, дефис', en: 'Colon, quotes, hyphen' },
    {
      ru: `: — Shift и ;, " — Shift и ' (обе — правый мизинец, Shift левый).
Дефис — правый мизинец в цифровом ряду, правее нуля. Между словами вместо тире его отделяют пробелами.`,
      en: `: is Shift + ; and " is Shift + ' (both the right pinky, left Shift).
The hyphen is the right pinky on the number row, to the right of zero. Used between words as a dash, it is surrounded by spaces.`,
    },
    symbols,
  ),

  keysLesson(
    'en-d4567',
    '4567',
    { ru: 'Цифры 4 5 6 7', en: 'Digits 4 5 6 7' },
    {
      ru: `Цифровой ряд далеко от основной позиции. Тянитесь к цифре одним пальцем, не отрывая ладонь, и возвращайтесь назад.
4 и 5 — левый указательный палец, 6 и 7 — правый указательный.`,
      en: `The number row is far from the home position. Reach for a digit with one finger without lifting your palm, then come back.
4 and 5 are the left index finger, 6 and 7 are the right index finger.`,
    },
    { section: { ru: 'Цифры', en: 'Digits' }, exercises: digitExercises, thresholds: slow() },
  ),
  keysLesson(
    'en-d38',
    '38',
    pairTitle('3', '8'),
    {
      ru: '3 — левый средний палец, 8 — правый средний.',
      en: '3 is the left middle finger, 8 is the right middle finger.',
    },
    { exercises: digitExercises, thresholds: slow() },
  ),
  keysLesson(
    'en-d29',
    '29',
    pairTitle('2', '9'),
    {
      ru: '2 — левый безымянный палец, 9 — правый безымянный.',
      en: '2 is the left ring finger, 9 is the right ring finger.',
    },
    { exercises: digitExercises, thresholds: slow() },
  ),
  keysLesson(
    'en-d10',
    '10',
    pairTitle('1', '0'),
    {
      ru: '1 — левый мизинец, 0 — правый мизинец.',
      en: '1 is the left pinky, 0 is the right pinky.',
    },
    { exercises: digitExercises, thresholds: slow() },
  ),
  {
    id: 'en-digits-review',
    title: { ru: 'Повторение: цифры', en: 'Review: digits' },
    exercises: wordExercises,
    thresholds: slow(),
  },

  keysLesson(
    'en-brackets',
    '()[]',
    { ru: 'Скобки', en: 'Brackets' },
    {
      ru: `( — Shift и 9, ) — Shift и 0 (Shift левый).
[ и ] — правый мизинец, правее P.`,
      en: `( is Shift + 9, ) is Shift + 0 (left Shift).
[ and ] are the right pinky, to the right of P.`,
    },
    { section: { ru: 'Символы', en: 'Symbols' }, ...symbols },
  ),
  keysLesson(
    'en-braces',
    '{}<>',
    { ru: 'Фигурные и угловые скобки', en: 'Braces and angle brackets' },
    {
      ru: '{ и } — Shift и [ или ]. < и > — Shift и запятая или точка. Shift везде левый.',
      en: '{ and } are Shift + [ or ]. < and > are Shift + comma or period. Always use the left Shift.',
    },
    symbols,
  ),
  keysLesson(
    'en-at',
    '@#$%',
    { ru: '@ # $ %', en: '@ # $ %' },
    {
      ru: '@ — Shift и 2, # — Shift и 3, $ — Shift и 4, % — Shift и 5. Это левая рука, значит Shift — правый.',
      en: '@ is Shift + 2, # is Shift + 3, $ is Shift + 4, % is Shift + 5. These are left-hand keys, so use the right Shift.',
    },
    symbols,
  ),
  keysLesson(
    'en-caret',
    '^&*',
    { ru: '^ & *', en: '^ & *' },
    {
      ru: '^ — Shift и 6, & — Shift и 7, * — Shift и 8. Правая рука, Shift — левый.',
      en: '^ is Shift + 6, & is Shift + 7, * is Shift + 8. Right-hand keys, so use the left Shift.',
    },
    symbols,
  ),
  keysLesson(
    'en-math',
    '_=+',
    { ru: '_ = +', en: '_ = +' },
    {
      ru: '_ — Shift и дефис. = и + — правый мизинец на клавише правее дефиса, + с Shift.',
      en: '_ is Shift + hyphen. = and + are the right pinky on the key to the right of the hyphen, + with Shift.',
    },
    symbols,
  ),
  keysLesson(
    'en-backslash',
    '\\|`~',
    { ru: '\\ | ` ~', en: '\\ | ` ~' },
    {
      ru: `\\ и | — правый мизинец на клавише над Enter, | с Shift.
\` и ~ — левый мизинец в левом верхнем углу, ~ с Shift.`,
      en: `\\ and | are the right pinky on the key above Enter, | with Shift.
\` and ~ are the left pinky in the top left corner, ~ with Shift.`,
    },
    symbols,
  ),

  textLesson(
    'en-text-1',
    { ru: 'Текст: утро и вечер', en: 'Text: morning and evening' },
    [text('en-morning'), text('en-evening')],
    { section: { ru: 'Тексты', en: 'Texts' } },
  ),
  textLesson('en-text-2', { ru: 'Текст: кофе и письмо', en: 'Text: coffee and a letter' }, [
    text('en-coffee'),
    text('en-letter'),
  ]),
  textLesson('en-text-3', { ru: 'Текст: числа и дорога', en: 'Text: numbers and travel' }, [
    text('en-numbers'),
    text('en-travel'),
  ]),
  textLesson('en-final', { ru: 'Финал', en: 'Finale' }, [text('en-final')]),
]

export const enCourse = buildCourse('en', lessons, enWords)
