import { physicalRows } from './geometry'
import type { KeyDef, Layout, LayoutId } from './types'

/**
 * Собирает раскладку из строк символов: по одной строке на ряд для обычного
 * и Shift-регистра, символы идут подряд для всех клавиш ряда без label.
 */
export function buildLayout(id: LayoutId, name: string, base: string[], shift: string[]): Layout {
  const rows = physicalRows.map((row, r): KeyDef[] => {
    const baseChars = [...base[r]]
    const shiftChars = [...shift[r]]
    let i = 0
    const keys = row.map((pk) => {
      if (pk.label) return { ...pk, base: '', shift: '' }
      const def = { ...pk, base: baseChars[i], shift: shiftChars[i] }
      i++
      return def
    })
    if (i !== baseChars.length || i !== shiftChars.length) {
      throw new Error(`Layout ${id}: row ${r} expects ${i} chars`)
    }
    return keys
  })
  return { id, name, rows }
}
