import { describe, expect, it } from 'vitest'
import { isWrongLayout, layouts, strokeFor } from '.'

describe('layouts', () => {
  it('каждый ряд шириной 15 единиц, кроме пробела', () => {
    for (const layout of Object.values(layouts)) {
      for (const row of layout.rows.slice(0, 4)) {
        expect(row.reduce((sum, k) => sum + k.width, 0)).toBe(15)
      }
    }
  })

  it('русская раскладка содержит все 33 буквы в обоих регистрах', () => {
    const alphabet = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя'
    for (const ch of alphabet + alphabet.toUpperCase()) {
      expect(strokeFor(layouts.ru, ch), ch).toBeDefined()
    }
  })

  it('английская раскладка содержит все 26 букв в обоих регистрах', () => {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz'
    for (const ch of alphabet + alphabet.toUpperCase()) {
      expect(strokeFor(layouts.en, ch), ch).toBeDefined()
    }
  })

  it('буквы на правильных физических клавишах', () => {
    expect(strokeFor(layouts.ru, 'а')?.key.code).toBe('KeyF')
    expect(strokeFor(layouts.ru, 'о')?.key.code).toBe('KeyJ')
    expect(strokeFor(layouts.ru, 'ё')?.key.code).toBe('Backquote')
    expect(strokeFor(layouts.ru, '.')?.key.code).toBe('Slash')
    expect(strokeFor(layouts.en, 'f')?.key.code).toBe('KeyF')
    expect(strokeFor(layouts.en, ' ')?.key.finger).toBe('TH')
  })

  it('Shift берётся на противоположной руке', () => {
    expect(strokeFor(layouts.ru, 'А')?.shiftCode).toBe('ShiftRight')
    expect(strokeFor(layouts.ru, 'О')?.shiftCode).toBe('ShiftLeft')
    expect(strokeFor(layouts.ru, 'а')?.shiftCode).toBeUndefined()
    expect(strokeFor(layouts.en, '!')?.shiftCode).toBe('ShiftRight')
  })

  it('распознаёт набор не в той раскладке', () => {
    expect(isWrongLayout(layouts.ru, 'f')).toBe(true)
    expect(isWrongLayout(layouts.en, 'а')).toBe(true)
    expect(isWrongLayout(layouts.ru, '5')).toBe(false)
    expect(isWrongLayout(layouts.ru, 'ы')).toBe(false)
  })
})
