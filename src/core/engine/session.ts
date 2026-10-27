/**
 * Сессия набора — неизменяемое состояние и чистые функции над ним,
 * чтобы логику было легко тестировать без браузера.
 */

/** pending — ещё не набран; corrected — набран верно, но перед этим была ошибка */
export type CharStatus = 'pending' | 'correct' | 'corrected' | 'wrong'

export interface Keystroke {
  expected: string
  actual: string
  correct: boolean
  /** мс от начала сессии */
  at: number
}

export interface SessionOptions {
  /** Курсор не двигается, пока не нажата верная клавиша */
  stopOnError: boolean
}

export interface Session {
  text: string
  options: SessionOptions
  position: number
  statuses: CharStatus[]
  /** Что набрано на позиции при stopOnError=false (для показа ошибки) */
  typed: string[]
  keystrokes: Keystroke[]
  startedAt: number | null
  finishedAt: number | null
}

export function createSession(text: string, options: SessionOptions): Session {
  return {
    text,
    options,
    position: 0,
    statuses: Array.from(text, () => 'pending'),
    typed: Array.from(text, () => ''),
    keystrokes: [],
    startedAt: null,
    finishedAt: null,
  }
}

export const isFinished = (s: Session) => s.finishedAt !== null

export function expectedChar(s: Session): string | undefined {
  return s.text[s.position]
}

/** Нажатие символьной клавиши. now — метка времени в мс (performance.now()). */
export function typeChar(s: Session, char: string, now: number): Session {
  if (isFinished(s)) return s
  const startedAt = s.startedAt ?? now
  const expected = s.text[s.position]
  const correct = char === expected
  const keystrokes = [...s.keystrokes, { expected, actual: char, correct, at: now - startedAt }]
  const statuses = [...s.statuses]
  const typed = [...s.typed]
  let position = s.position

  if (correct) {
    statuses[position] = statuses[position] === 'pending' ? 'correct' : 'corrected'
    typed[position] = char
    position++
  } else if (s.options.stopOnError) {
    // Помечаем ошибку, но ждём верную клавишу
    statuses[position] = 'wrong'
  } else {
    statuses[position] = 'wrong'
    typed[position] = char
    position++
  }

  const finishedAt = position >= s.text.length ? now : null
  return { ...s, position, statuses, typed, keystrokes, startedAt, finishedAt }
}

/** Backspace работает только в режиме без остановки на ошибке. */
export function backspace(s: Session): Session {
  if (isFinished(s) || s.options.stopOnError || s.position === 0) return s
  const position = s.position - 1
  const statuses = [...s.statuses]
  const typed = [...s.typed]
  // Позиция с ошибкой остаётся «исправленной», чтобы ошибка не терялась
  statuses[position] = s.statuses[position] === 'correct' ? 'pending' : 'wrong'
  typed[position] = ''
  return { ...s, position, statuses, typed }
}

export interface Metrics {
  elapsedMs: number
  /** Слов в минуту: 5 верных символов = 1 слово */
  wpm: number
  /** Знаков в минуту — привычная метрика в русскоязычных тренажёрах */
  cpm: number
  /** Доля верных нажатий, 0…1 */
  accuracy: number
  errors: number
}

function sessionTotals(s: Session, now: number) {
  const end = s.finishedAt ?? now
  return {
    // Таймер в UI может отставать от момента первого нажатия — не уходим в минус
    elapsedMs: s.startedAt === null ? 0 : Math.max(0, end - s.startedAt),
    correctChars: s.statuses.filter((st) => st === 'correct' || st === 'corrected').length,
    errors: s.keystrokes.filter((k) => !k.correct).length,
    keystrokes: s.keystrokes.length,
  }
}

function toMetrics(t: ReturnType<typeof sessionTotals>): Metrics {
  const minutes = t.elapsedMs / 60000
  const cpm = minutes > 0 ? t.correctChars / minutes : 0
  return {
    elapsedMs: t.elapsedMs,
    cpm,
    wpm: cpm / 5,
    accuracy: t.keystrokes ? 1 - t.errors / t.keystrokes : 1,
    errors: t.errors,
  }
}

export function metrics(s: Session, now: number): Metrics {
  return toMetrics(sessionTotals(s, now))
}

/** Общие метрики нескольких завершённых упражнений — как одного длинного. */
export function combinedMetrics(sessions: readonly Session[]): Metrics {
  const sum = { elapsedMs: 0, correctChars: 0, errors: 0, keystrokes: 0 }
  for (const s of sessions) {
    const t = sessionTotals(s, s.finishedAt ?? 0)
    sum.elapsedMs += t.elapsedMs
    sum.correctChars += t.correctChars
    sum.errors += t.errors
    sum.keystrokes += t.keystrokes
  }
  return toMetrics(sum)
}
