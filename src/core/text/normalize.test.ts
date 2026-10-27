import { describe, expect, it } from 'vitest'
import { layouts } from '../layouts'
import { normalizeText } from './normalize'

describe('normalizeText', () => {
  it('заменяет типографику и схлопывает пробелы', () => {
    const { text } = normalizeText('«Привет» — сказал он…\n\n  Ок', layouts.ru)
    expect(text).toBe('"Привет" - сказал он... Ок')
  })

  it('выбрасывает символы не из раскладки и сообщает о них', () => {
    const { text, removed } = normalizeText('мир hello мир', layouts.ru)
    expect(text).toBe('мир мир')
    expect(removed).toEqual(['h', 'e', 'l', 'o'])
  })
})
