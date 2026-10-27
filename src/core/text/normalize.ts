import { hasChar, type Layout } from '../layouts'

// Типографские символы, которых нет на клавиатуре, заменяем на набираемые аналоги
const replacements: [RegExp, string][] = [
  [/[«»„“”]/g, '"'],
  [/[‘’]/g, "'"],
  [/[—–−]/g, '-'],
  [/…/g, '...'],
  [/ /g, ' '],
]

/**
 * Готовит произвольный текст к набору: заменяет типографику,
 * сводит переводы строк и повторные пробелы к одному пробелу
 * и выбрасывает символы, которых нет в раскладке.
 */
export function normalizeText(raw: string, layout: Layout): { text: string; removed: string[] } {
  let text = raw
  for (const [re, to] of replacements) text = text.replace(re, to)
  text = text.replace(/\s+/g, ' ').trim()
  const removed = new Set<string>()
  text = [...text]
    .filter((ch) => {
      if (hasChar(layout, ch)) return true
      removed.add(ch)
      return false
    })
    .join('')
    .replace(/ {2,}/g, ' ')
    .trim()
  return { text, removed: [...removed] }
}
