import { describe, expect, it } from 'vitest'
import en from './en.json'
import ru from './ru.json'

function keys(obj: object, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([k, v]) =>
    typeof v === 'object' && v !== null ? keys(v, `${prefix}${k}.`) : [`${prefix}${k}`],
  )
}

describe('i18n', () => {
  it('ru и en содержат одинаковый набор ключей', () => {
    expect(keys(en).sort()).toEqual(keys(ru).sort())
  })
})
