import { buildCourse } from '../../core/course/build'
import type { LessonDef } from '../../core/course/types'
import { practiceText } from '../practiceTexts'
import { ruWords } from '../words/ru'
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

const text = (id: string) => practiceText('ru', id)

const lessons: LessonDef[] = [
  {
    ...basicsLesson('ru-basics', { left: 'Ф Ы В А', right: 'О Л Д Ж', homing: 'А и О' }),
    section: { ru: 'Основной ряд', en: 'Home row' },
  },
  keysLesson(
    'ru-ao',
    'ао',
    pairTitle('А', 'О'),
    {
      ru: `А нажимает левый указательный палец, О — правый указательный. Это клавиши с засечками, так что найти их можно на ощупь.
Пробел — большим пальцем любой руки.`,
      en: `Press А with your left index finger and О with your right index finger. These are the keys with bumps, so you can find them by touch.
Press space with either thumb.`,
    },
    { thresholds: gentle() },
  ),
  keysLesson(
    'ru-vl',
    'вл',
    pairTitle('В', 'Л'),
    {
      ru: 'В — левый средний палец, Л — правый средний. Они лежат сразу рядом с указательными.',
      en: 'В is the left middle finger, Л is the right middle finger. They rest right next to the index fingers.',
    },
    { thresholds: gentle() },
  ),
  keysLesson(
    'ru-yd',
    'ыд',
    pairTitle('Ы', 'Д'),
    {
      ru: 'Ы — левый безымянный палец, Д — правый безымянный. Безымянные пальцы самые непослушные — не торопитесь.',
      en: 'Ы is the left ring finger, Д is the right ring finger. Ring fingers are the least obedient — take your time.',
    },
    { thresholds: gentle() },
  ),
  keysLesson('ru-fzh', 'фж', pairTitle('Ф', 'Ж'), {
    ru: 'Ф — левый мизинец, Ж — правый мизинец. Теперь все восемь пальцев стоят на основной позиции.',
    en: 'Ф is the left pinky, Ж is the right pinky. Now all eight fingers are in the home position.',
  }),
  keysLesson('ru-pr', 'пр', pairTitle('П', 'Р'), {
    ru: 'П и Р лежат в центре клавиатуры, между руками. П нажимает левый указательный палец, Р — правый указательный: палец сдвигается к центру и сразу возвращается на засечку.',
    en: 'П and Р sit in the middle of the keyboard, between your hands. Press П with the left index finger and Р with the right index finger: slide toward the center and return to the bump right away.',
  }),
  keysLesson(
    'ru-e',
    'э',
    { ru: 'Э', en: 'Э' },
    {
      ru: 'Э — правый мизинец, на одну клавишу правее Ж. Остальные пальцы правой руки остаются на месте.',
      en: 'Э is the right pinky, one key to the right of Ж. Keep the other fingers of your right hand in place.',
    },
  ),
  {
    id: 'ru-home-review',
    title: { ru: 'Повторение: основной ряд', en: 'Review: home row' },
    exercises: reviewExercises,
  },

  keysLesson(
    'ru-en',
    'ен',
    pairTitle('Е', 'Н'),
    {
      ru: `Начинаем верхний ряд. Е и Н — две самые частые буквы в нём, они лежат в центре над П и Р.
Е нажимает левый указательный палец, Н — правый указательный. Палец тянется вверх и чуть к центру, а потом возвращается на засечку.`,
      en: `Starting the top row. Е and Н are its two most frequent letters; they sit in the middle above П and Р.
Press Е with the left index finger and Н with the right index finger. Reach up and slightly toward the center, then return to the bump.`,
    },
    { section: { ru: 'Верхний ряд', en: 'Top row' } },
  ),
  keysLesson('ru-kg', 'кг', pairTitle('К', 'Г'), {
    ru: 'К находится прямо над А, Г — прямо над О. Указательные пальцы тянутся строго вверх.',
    en: 'К is right above А, Г is right above О. The index fingers reach straight up.',
  }),
  keysLesson('ru-ush', 'уш', pairTitle('У', 'Ш'), {
    ru: 'У — левый средний палец, Ш — правый средний. Клавиши над В и Л.',
    en: 'У is the left middle finger, Ш is the right middle finger. The keys are above В and Л.',
  }),
  keysLesson('ru-tsshch', 'цщ', pairTitle('Ц', 'Щ'), {
    ru: 'Ц — левый безымянный палец, Щ — правый безымянный. Клавиши над Ы и Д.',
    en: 'Ц is the left ring finger, Щ is the right ring finger. The keys are above Ы and Д.',
  }),
  keysLesson('ru-yz', 'йз', pairTitle('Й', 'З'), {
    ru: 'Й — левый мизинец, З — правый мизинец. Клавиши над Ф и Ж.',
    en: 'Й is the left pinky, З is the right pinky. The keys are above Ф and Ж.',
  }),
  keysLesson('ru-hhard', 'хъ', pairTitle('Х', 'Ъ'), {
    ru: 'Х и Ъ — тоже правый мизинец: он тянется вверх и вправо от Ж. Ъ встречается редко, а Х — часто.',
    en: 'Х and Ъ are also the right pinky: it reaches up and to the right of Ж. Ъ is rare, Х is common.',
  }),
  {
    id: 'ru-top-review',
    title: { ru: 'Повторение: верхний ряд', en: 'Review: top row' },
    exercises: reviewExercises,
  },

  keysLesson(
    'ru-mi-soft',
    'мь',
    pairTitle('М', 'Ь'),
    {
      ru: `Начинаем нижний ряд. Пальцы сгибаются и тянутся вниз, а ладонь остаётся на месте.
М — левый указательный палец, прямо под А. Ь — правый указательный, прямо под О.`,
      en: `Starting the bottom row. Curl your fingers down while your palm stays in place.
М is the left index finger, right below А. Ь is the right index finger, right below О.`,
    },
    { section: { ru: 'Нижний ряд', en: 'Bottom row' } },
  ),
  keysLesson('ru-it', 'ит', pairTitle('И', 'Т'), {
    ru: 'И и Т — в центре нижнего ряда. И нажимает левый указательный палец, Т — правый указательный.',
    en: 'И and Т sit in the middle of the bottom row. Press И with the left index finger and Т with the right index finger.',
  }),
  keysLesson('ru-sb', 'сб', pairTitle('С', 'Б'), {
    ru: 'С — левый средний палец, под В. Б — правый средний, под Л.',
    en: 'С is the left middle finger, below В. Б is the right middle finger, below Л.',
  }),
  keysLesson('ru-chyu', 'чю', pairTitle('Ч', 'Ю'), {
    ru: 'Ч — левый безымянный палец, под Ы. Ю — правый безымянный, под Д.',
    en: 'Ч is the left ring finger, below Ы. Ю is the right ring finger, below Д.',
  }),
  keysLesson(
    'ru-ya-dot',
    'я.',
    { ru: 'Я и точка', en: 'Я and period' },
    {
      ru: 'Я — левый мизинец, под Ф. Точка — правый мизинец, под Ж. Точку ставят сразу после слова, без пробела.',
      en: 'Я is the left pinky, below Ф. The period is the right pinky, below Ж. Put the period right after a word, with no space.',
    },
  ),
  keysLesson(
    'ru-yo',
    'ё',
    { ru: 'Ё', en: 'Ё' },
    {
      ru: 'Ё лежит в левом верхнем углу, над Й. Её нажимает левый мизинец — это самая дальняя буква.',
      en: 'Ё is in the top left corner, above Й. Press it with the left pinky — it is the farthest letter.',
    },
  ),
  {
    id: 'ru-letters-review',
    title: { ru: 'Повторение: все буквы', en: 'Review: all letters' },
    exercises: reviewExercises,
  },

  {
    id: 'ru-capitals',
    title: { ru: 'Заглавные буквы', en: 'Capital letters' },
    section: { ru: 'Заглавные и знаки', en: 'Capitals and punctuation' },
    newKeys: 'ЁЙЦУКЕНГШЩЗХЪФЫВАПРОЛДЖЭЯЧСМИТЬБЮ',
    thresholds: slow(),
    theory: [
      {
        title: { ru: 'Клавиша Shift', en: 'The Shift key' },
        illustration: { type: 'shift' },
        body: {
          ru: `Заглавную букву набирают с зажатым Shift. Shift нажимает мизинец той руки, которая свободна:
- буква левой рукой (например, Ф или К) — правый Shift;
- буква правой рукой (например, О или Н) — левый Shift.
Сначала зажмите Shift, затем нажмите букву и отпустите обе клавиши. Не используйте Caps Lock для одной буквы.`,
          en: `Type a capital letter while holding Shift. Press Shift with the pinky of the free hand:
- a left-hand letter (such as Ф or К) — right Shift;
- a right-hand letter (such as О or Н) — left Shift.
Hold Shift first, then press the letter and release both keys. Do not use Caps Lock for a single letter.`,
        },
      },
    ],
    exercises: wordExercises,
  },
  keysLesson(
    'ru-comma',
    ',-',
    { ru: 'Запятая и дефис', en: 'Comma and hyphen' },
    {
      ru: `Запятая — это Shift и клавиша точки. Точку жмёт правый мизинец, значит Shift — левый.
Дефис — правый мизинец в цифровом ряду, правее нуля. Если дефис стоит между словами вместо тире, его отделяют пробелами.`,
      en: `The comma is Shift plus the period key. The right pinky presses the period, so use the left Shift.
The hyphen is the right pinky on the number row, to the right of zero. Used between words as a dash, it is surrounded by spaces.`,
    },
    { exercises: wordExercises, thresholds: slow() },
  ),
  keysLesson(
    'ru-excl',
    '!?',
    { ru: 'Знаки ! и ?', en: 'Marks ! and ?' },
    {
      ru: `Эти знаки — в цифровом ряду с Shift. ! — Shift и 1 (левый мизинец, Shift правый). ? — Shift и 7 (правый указательный, Shift левый).
После них, как и после точки, предложение начинается с заглавной буквы.`,
      en: `These marks are on the number row with Shift. ! is Shift + 1 (left pinky, right Shift). ? is Shift + 7 (right index finger, left Shift).
As after a period, the next sentence starts with a capital letter.`,
    },
    { exercises: wordExercises, thresholds: slow() },
  ),
  keysLesson(
    'ru-colon',
    ':;"',
    { ru: 'Двоеточие и кавычки', en: 'Colon and quotes' },
    {
      ru: `В русской раскладке эти знаки тоже на цифрах с Shift:
- : — Shift и 6 (правый указательный);
- ; — Shift и 4 (левый указательный);
- " — Shift и 2 (левый безымянный).`,
      en: `In the Russian layout these marks are on the digits with Shift too:
- : is Shift + 6 (right index finger);
- ; is Shift + 4 (left index finger);
- " is Shift + 2 (left ring finger).`,
    },
    { exercises: wordExercises, thresholds: slow() },
  ),

  keysLesson(
    'ru-d4567',
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
    'ru-d38',
    '38',
    pairTitle('3', '8'),
    {
      ru: '3 — левый средний палец, 8 — правый средний.',
      en: '3 is the left middle finger, 8 is the right middle finger.',
    },
    { exercises: digitExercises, thresholds: slow() },
  ),
  keysLesson(
    'ru-d29',
    '29',
    pairTitle('2', '9'),
    {
      ru: '2 — левый безымянный палец, 9 — правый безымянный.',
      en: '2 is the left ring finger, 9 is the right ring finger.',
    },
    { exercises: digitExercises, thresholds: slow() },
  ),
  keysLesson(
    'ru-d10',
    '10',
    pairTitle('1', '0'),
    {
      ru: '1 — левый мизинец, 0 — правый мизинец.',
      en: '1 is the left pinky, 0 is the right pinky.',
    },
    { exercises: digitExercises, thresholds: slow() },
  ),
  {
    id: 'ru-digits-review',
    title: { ru: 'Повторение: цифры', en: 'Review: digits' },
    exercises: wordExercises,
    thresholds: slow(),
  },

  keysLesson(
    'ru-parens',
    '()',
    { ru: 'Скобки', en: 'Parentheses' },
    {
      ru: '( — Shift и 9 (правый безымянный), ) — Shift и 0 (правый мизинец). Shift для обеих — левый.',
      en: '( is Shift + 9 (right ring finger), ) is Shift + 0 (right pinky). Use the left Shift for both.',
    },
    { section: { ru: 'Символы', en: 'Symbols' }, exercises: wordExercises, thresholds: slow() },
  ),
  keysLesson(
    'ru-num-pct',
    '№%',
    { ru: '№ и %', en: '№ and %' },
    {
      ru: '№ — Shift и 3 (левый средний), % — Shift и 5 (левый указательный). Shift — правый.',
      en: '№ is Shift + 3 (left middle finger), % is Shift + 5 (left index finger). Use the right Shift.',
    },
    { exercises: wordExercises, thresholds: slow() },
  ),
  keysLesson(
    'ru-math',
    '*+=_',
    { ru: '* + = _', en: '* + = _' },
    {
      ru: `* — Shift и 8 (правый средний). = и + — правый мизинец на клавише справа от дефиса, + с Shift. _ — Shift и дефис.`,
      en: `* is Shift + 8 (right middle finger). = and + are the right pinky on the key to the right of the hyphen, + with Shift. _ is Shift + hyphen.`,
    },
    { exercises: wordExercises, thresholds: slow() },
  ),
  keysLesson(
    'ru-slash',
    '\\/',
    { ru: 'Слеши', en: 'Slashes' },
    {
      ru: '\\ и / — правый мизинец на клавише над Enter. / набирается с Shift.',
      en: '\\ and / are the right pinky on the key above Enter. / is typed with Shift.',
    },
    { exercises: wordExercises, thresholds: slow() },
  ),

  textLesson(
    'ru-text-1',
    { ru: 'Текст: утро и вечер', en: 'Text: morning and evening' },
    [text('ru-morning'), text('ru-evening')],
    { section: { ru: 'Тексты', en: 'Texts' } },
  ),
  textLesson('ru-text-2', { ru: 'Текст: кофе и письмо', en: 'Text: coffee and a letter' }, [
    text('ru-coffee'),
    text('ru-letter'),
  ]),
  textLesson('ru-text-3', { ru: 'Текст: числа и дорога', en: 'Text: numbers and travel' }, [
    text('ru-numbers'),
    text('ru-travel'),
  ]),
  textLesson('ru-final', { ru: 'Финал', en: 'Finale' }, [text('ru-final')]),
]

export const ruCourse = buildCourse('ru', lessons, ruWords)
