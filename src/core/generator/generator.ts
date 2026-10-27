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
