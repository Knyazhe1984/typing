import { en } from './en'
import { ru } from './ru'
import type { KeyStroke, Layout, LayoutId } from './types'

export * from './types'
export { homingCodes } from './geometry'

export const layouts: Record<LayoutId, Layout> = { ru, en }

const strokeCache = new Map<LayoutId, Map<string, KeyStroke>>()

function strokeMap(layout: Layout): Map<string, KeyStroke> {
  let map = strokeCache.get(layout.id)
  if (map) return map
  map = new Map()
  for (const key of layout.rows.flat()) {
    if (key.label) continue
    if (!map.has(key.base)) map.set(key.base, { key })
    if (key.shift !== key.base && !map.has(key.shift)) {
      // Shift жмём мизинцем другой руки
      const shiftCode = key.finger.startsWith('L') ? 'ShiftRight' : 'ShiftLeft'
      map.set(key.shift, { key, shiftCode })
    }
  }
  strokeCache.set(layout.id, map)
  return map
}

/** Как набрать символ в раскладке; undefined — символа в ней нет. */
export function strokeFor(layout: Layout, char: string): KeyStroke | undefined {
  return strokeMap(layout).get(char)
}

export function hasChar(layout: Layout, char: string): boolean {
  return strokeMap(layout).has(char)
}

/**
 * Символ набран не в той раскладке: в текущей его нет, а в другой есть.
 * Например, латинская «f» во время русского урока.
 */
export function isWrongLayout(layout: Layout, char: string): boolean {
  if (hasChar(layout, char)) return false
  return Object.values(layouts).some((l) => l.id !== layout.id && hasChar(l, char))
}
