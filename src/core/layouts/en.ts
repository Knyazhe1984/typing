import { buildLayout } from './build'

export const en = buildLayout(
  'en',
  'English (QWERTY)',
  ['`1234567890-=', 'qwertyuiop[]\\', "asdfghjkl;'", 'zxcvbnm,./', ' '],
  ['~!@#$%^&*()_+', 'QWERTYUIOP{}|', 'ASDFGHJKL:"', 'ZXCVBNM<>?', ' '],
)
