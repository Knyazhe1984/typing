import { describe, expect, it } from 'vitest'
import en from './en.json'
import ru from './ru.json'

function keys(obj: object, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([k, v]) =>
    typeof v === 'object' && v !== null ? keys(v, `${prefix}${k}.`) : [`${prefix}${k}`],
  )
}

// Формы множественного числа у языков разные (в русском есть _few и _many)
const normalized = (obj: object) => [
  ...new Set(keys(obj).map((k) => k.replace(/_(zero|one|two|few|many|other)$/, ''))),
]

describe('i18n', () => {
  it('ru и en содержат одинаковый набор ключей', () => {
    expect(normalized(en).sort()).toEqual(normalized(ru).sort())
  })
})
