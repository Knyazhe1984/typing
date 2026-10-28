import { pick, type Rng } from './random'

/**
 * Группы из случайных букв: «аоа оо аао». Новые буквы выпадают чаще,
 * чтобы закрепить именно их.
 */
export function letterGroups(
  chars: string,
  focus: string,
  groups: number,
  rng: Rng,
  minLen = 2,
  maxLen = 5,
): string {
  const pool = [...chars].filter((c) => c !== ' ')
  const focusPool = [...focus].filter((c) => c !== ' ')
  const out: string[] = []
  for (let g = 0; g < groups; g++) {
    const len = minLen + Math.floor(rng() * (maxLen - minLen + 1))
    let word = ''
    for (let i = 0; i < len; i++) {
      word += focusPool.length && rng() < 0.6 ? pick(focusPool, rng) : pick(pool, rng)
    }
    out.push(word)
  }
  return out.join(' ')
}

/** Слова из словаря, которые набираются только изученными буквами. */
export function wordsWithin(dictionary: readonly string[], allowed: string): string[] {
  const set = new Set(allowed)
  return dictionary.filter((w) => [...w].every((c) => set.has(c)))
}

/**
 * Настоящие слова из изученных букв, примерно половина — с новыми буквами.
 * Если подходящих слов мало, добираем буквенными группами.
 */
export function wordDrill(
  dictionary: readonly string[],
  allowed: string,
  focus: string,
  count: number,
  rng: Rng,
): string {
  const words = wordsWithin(dictionary, allowed)
  if (words.length < 5) return letterGroups(allowed, focus, count, rng)
  const focused = words.filter((w) => [...focus].some((c) => w.includes(c)))
  const out: string[] = []
  for (let i = 0; i < count; i++) {
    const source = focused.length && rng() < 0.5 ? focused : words
    let w = pick(source, rng)
    // Не повторяем одно слово дважды подряд
    if (w === out[out.length - 1]) w = pick(source, rng)
    out.push(w)
  }
  return out.join(' ')
}

const isLetter = (c: string) => c.toLowerCase() !== c.toUpperCase()
const isUpper = (c: string) => isLetter(c) && c === c.toUpperCase()
const isDigit = (c: string) => c >= '0' && c <= '9'

const END_MARKS = '.!?'
const MID_MARKS = ',;:'
const PAIRS: [string, string][] = [
  ['(', ')'],
  ['[', ']'],
  ['{', '}'],
  ['<', '>'],
  ['"', '"'],
  ["'", "'"],
  ['`', '`'],
]
const PAIR_CHARS = new Set(PAIRS.flat())
// Как символ обычно стоит рядом с числом: «№3», «15%», «2+5». Остальные соединяют слова: «a/b»
const BEFORE_NUMBER = '№#$~'
const AFTER_NUMBER = '%'
const BETWEEN_NUMBERS = '+=*^&'

/** Новые символы урока встречаются часто, уже изученные — изредка. */
const rate = (inFocus: boolean, base: number) => (inFocus ? 0.45 : base)

/**
 * Слова из словаря вперемешку со всем, что уже изучено: заглавными буквами,
 * знаками препинания, числами и символами. Новые клавиши урока (focus)
 * встречаются чаще. Без «лишних» клавиш работает как {@link wordDrill}.
 */
export function textDrill(
  dictionary: readonly string[],
  allowed: string,
  focus: string,
  count: number,
  rng: Rng,
): string {
  const set = new Set(allowed)
  const has = (c: string) => set.has(c)
  const inFocus = (pred: (c: string) => boolean) => [...focus].some(pred)

  const lower = [...set].filter((c) => isLetter(c) && !isUpper(c)).join('')
  const words = wordsWithin(dictionary, lower)
  if (words.length < 5) return letterGroups(allowed, focus, count, rng)
  const focused = words.filter((w) => [...focus].some((c) => w.includes(c)))

  const capRate = [...set].some(isUpper) ? (inFocus(isUpper) ? 0.35 : 0.15) : 0
  const endMarks = [...END_MARKS].filter(has)
  const midMarks = [...MID_MARKS].filter(has)
  const marks = [...endMarks, ...midMarks]
  const focusMarks = marks.filter((c) => focus.includes(c))
  const punctRate = rate(
    inFocus((c) => marks.includes(c) || c === '-'),
    0.12,
  )
  const digits = [...set].filter(isDigit)
  const focusDigits = digits.filter((d) => focus.includes(d))
  const numRate = digits.length ? rate(focusDigits.length > 0, 0.08) : 0
  const pairs = PAIRS.filter(([a, b]) => has(a) && has(b))
  const singles = [...set].filter(
    (c) =>
      !isLetter(c) &&
      !isDigit(c) &&
      c !== ' ' &&
      !marks.includes(c) &&
      !PAIR_CHARS.has(c) &&
      c !== '-',
  )
  const symbols = pairs.length + singles.length
  const symRate = symbols
    ? rate(
        inFocus((c) => PAIR_CHARS.has(c) || singles.includes(c)),
        0.06,
      )
    : 0

  const pickWord = () => pick(focused.length && rng() < 0.5 ? focused : words, rng)
  const number = () => {
    const len = 1 + Math.floor(rng() * 4)
    let n = ''
    for (let i = 0; i < len; i++) {
      n += focusDigits.length && rng() < 0.6 ? pick(focusDigits, rng) : pick(digits, rng)
    }
    return n
  }
  const capitalize = (w: string) => {
    const up = w[0].toUpperCase() + w.slice(1)
    return has(up[0]) ? up : w
  }

  const out: string[] = []
  let sentenceStart = false
  for (let i = 0; i < count; i++) {
    let token: string
    if (numRate && rng() < numRate) token = number()
    else {
      token = pickWord()
      if (token === out[out.length - 1]) token = pickWord()
      if (capRate && (sentenceStart || rng() < capRate)) token = capitalize(token)
    }
    sentenceStart = false

    if (symRate && rng() < symRate) {
      const kind = Math.floor(rng() * symbols)
      if (kind < pairs.length) {
        const [a, b] = pairs[kind]
        token = a + token + b
      } else {
        const sym = singles[kind - pairs.length]
        if (digits.length && BEFORE_NUMBER.includes(sym)) token = sym + number()
        else if (digits.length && AFTER_NUMBER.includes(sym)) token = number() + sym
        else if (digits.length && BETWEEN_NUMBERS.includes(sym)) token = number() + sym + number()
        else token = token + sym + pickWord()
      }
    } else if (rng() < punctRate) {
      const dashFirst = has('-') && (focus.includes('-') ? rng() < 0.5 : rng() < 0.2)
      if (dashFirst || !marks.length) {
        if (has('-') && i < count - 1) {
          out.push(token, '-')
          continue
        }
      } else {
        const mark = pick(focusMarks.length && rng() < 0.7 ? focusMarks : marks, rng)
        token += mark
        sentenceStart = capRate > 0 && endMarks.includes(mark)
      }
    }
    out.push(token)
  }
  return out.join(' ')
}
