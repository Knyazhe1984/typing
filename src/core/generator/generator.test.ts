import { describe, expect, it } from 'vitest'
import { letterGroups, wordDrill, wordsWithin } from './generator'
import { createRng } from './random'

describe('generator', () => {
  it('letterGroups использует только разрешённые буквы', () => {
    const text = letterGroups('ао', 'о', 20, createRng(1))
    expect(text.split(' ')).toHaveLength(20)
    expect(text).toMatch(/^[ао ]+$/)
  })

  it('одинаковый seed — одинаковый текст', () => {
    expect(letterGroups('фыва', 'а', 10, createRng(7))).toBe(
      letterGroups('фыва', 'а', 10, createRng(7)),
    )
  })

  it('wordsWithin фильтрует словарь по буквам', () => {
    expect(wordsWithin(['вода', 'дом', 'два'], 'адвоы')).toEqual(['вода', 'два'])
  })

  it('wordDrill берёт слова из словаря', () => {
    const dict = ['вода', 'два', 'дал', 'вал', 'ода', 'лад', 'дом']
    const text = wordDrill(dict, 'аволд', 'л', 30, createRng(3))
    for (const w of text.split(' ')) expect(dict).toContain(w)
    expect(text).not.toContain('дом')
  })

  it('wordDrill откатывается к буквенным группам, если слов мало', () => {
    const text = wordDrill(['вода'], 'ао', 'о', 5, createRng(3))
    expect(text).toMatch(/^[ао ]+$/)
  })
})
