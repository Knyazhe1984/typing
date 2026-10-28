import { describe, expect, it } from 'vitest'
import { letterGroups, textDrill, wordDrill, wordsWithin } from './generator'
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

  describe('textDrill', () => {
    const dict = ['вода', 'два', 'дал', 'вал', 'ода', 'лад', 'дом', 'вол']

    it('без лишних клавиш даёт просто слова', () => {
      const text = textDrill(dict, ' аволд', 'л', 40, createRng(5))
      for (const w of text.split(' ')) expect(dict).toContain(w)
    })

    it('добавляет заглавные, знаки и числа, только изученные', () => {
      const allowed = ' аволдмАВОЛДМ.,!-123()%'
      const text = textDrill(dict, allowed, '()%', 200, createRng(9))
      for (const ch of text) expect(allowed).toContain(ch)
      expect(text).toMatch(/[А-Я]/)
      expect(text).toMatch(/\d/)
      expect(text).toMatch(/\([а-яА-Я0-9]+\)/)
      expect(text).toMatch(/\d%/)
    })

    it('после точки — заглавная буква', () => {
      const text = textDrill(dict, ' аволдмАВОЛДМ.', '.', 200, createRng(2))
      for (const m of text.matchAll(/\. (\S)/g)) expect(m[1]).toMatch(/[А-Я]/)
    })

    it('новые символы встречаются чаще изученных', () => {
      const allowed = ' аволдм,!'
      const count = (text: string, ch: string) => text.split(ch).length - 1
      const focusComma = textDrill(dict, allowed, ',', 300, createRng(4))
      const focusExcl = textDrill(dict, allowed, '!', 300, createRng(4))
      expect(count(focusComma, ',')).toBeGreaterThan(count(focusExcl, ','))
    })
  })
})
