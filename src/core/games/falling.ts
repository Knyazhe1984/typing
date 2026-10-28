import type { Keystroke } from '../engine/session'
import { pick, type Rng } from '../generator/random'

/**
 * «Падающие слова»: слова падают сверху, набранное слово исчезает,
 * упавшее на землю отнимает жизнь. Чистые функции — состояние неизменяемое.
 */

export type Difficulty = 'easy' | 'normal' | 'hard'

export interface FallingWord {
  id: number
  text: string
  /** Положение по горизонтали, 0…1 */
  x: number
  /** Сколько пролетело, 0…1; на 1 слово падает на землю */
  y: number
  /** Сколько букв уже набрано */
  typed: number
}

export interface FallingState {
  difficulty: Difficulty
  words: FallingWord[]
  nextId: number
  /** Через сколько мс появится следующее слово */
  spawnIn: number
  elapsedMs: number
  lives: number
  /** Очки — сумма длин сбитых слов */
  score: number
  /** Слово, которое сейчас набирается */
  target: number | null
  keystrokes: Keystroke[]
  correctChars: number
  /** Сбитые слова — для звука и анимации */
  destroyed: number
  /** Упавшие слова */
  missed: number
  over: boolean
}

export const LIVES = 3
const LEVEL_MS = 30_000

const CONFIG: Record<Difficulty, { fallMs: number; spawnMs: number; maxLen: number }> = {
  easy: { fallMs: 12_000, spawnMs: 2800, maxLen: 5 },
  normal: { fallMs: 9_000, spawnMs: 2200, maxLen: 7 },
  hard: { fallMs: 7_000, spawnMs: 1700, maxLen: 10 },
}

export const level = (s: FallingState) => 1 + Math.floor(s.elapsedMs / LEVEL_MS)

/** Слова, подходящие для уровня сложности. */
export function fallingDictionary(dictionary: readonly string[], difficulty: Difficulty) {
  const { maxLen } = CONFIG[difficulty]
  return dictionary.filter((w) => w.length >= 2 && w.length <= maxLen)
}

export function createFalling(difficulty: Difficulty): FallingState {
  return {
    difficulty,
    words: [],
    nextId: 1,
    spawnIn: 0,
    elapsedMs: 0,
    lives: LIVES,
    score: 0,
    target: null,
    keystrokes: [],
    correctChars: 0,
    destroyed: 0,
    missed: 0,
    over: false,
  }
}

/** Новое слово: по возможности с первой буквой, которой нет на экране, — чтобы цель была однозначной. */
function spawn(s: FallingState, dictionary: readonly string[], rng: Rng): FallingWord {
  const firsts = new Set(s.words.map((w) => w.text[0]))
  let text = pick(dictionary, rng)
  for (let i = 0; i < 8 && firsts.has(text[0]); i++) text = pick(dictionary, rng)
  return { id: s.nextId, text, x: 0.08 + rng() * 0.74, y: 0, typed: 0 }
}

/** Ход времени на dt мс: слова падают, появляются новые, упавшие отнимают жизни. */
export function stepFalling(
  s: FallingState,
  dt: number,
  dictionary: readonly string[],
  rng: Rng,
): FallingState {
  if (s.over) return s
  const cfg = CONFIG[s.difficulty]
  // С каждым уровнем слова падают и появляются быстрее
  const speedUp = 1 + 0.15 * (level(s) - 1)
  let words = s.words.map((w) => ({ ...w, y: w.y + (dt / cfg.fallMs) * speedUp }))
  const fallen = words.filter((w) => w.y >= 1)
  words = words.filter((w) => w.y < 1)
  const lives = Math.max(0, s.lives - fallen.length)
  const target = fallen.some((w) => w.id === s.target) ? null : s.target

  let next: FallingState = {
    ...s,
    words,
    lives,
    target,
    missed: s.missed + fallen.length,
    elapsedMs: s.elapsedMs + dt,
    spawnIn: s.spawnIn - dt,
    over: lives === 0,
  }
  if (!next.over && next.spawnIn <= 0) {
    next = {
      ...next,
      words: [...next.words, spawn(next, dictionary, rng)],
      nextId: next.nextId + 1,
      spawnIn: cfg.spawnMs / (1 + 0.12 * (level(next) - 1)),
    }
  }
  return next
}

/** Нажатие клавиши: продолжает набор цели или выбирает новую — самое низкое слово на эту букву. */
export function typeFalling(s: FallingState, char: string): FallingState {
  if (s.over) return s
  const at = s.elapsedMs
  let target = s.words.find((w) => w.id === s.target)
  if (!target) {
    const candidates = s.words.filter((w) => w.text[0] === char)
    if (!candidates.length) return { ...s, keystrokes: [...s.keystrokes, miss(char, at)] }
    target = candidates.reduce((a, b) => (b.y > a.y ? b : a))
  }
  const expected = target.text[target.typed]
  if (char !== expected) {
    return {
      ...s,
      target: target.id,
      keystrokes: [...s.keystrokes, { expected, actual: char, correct: false, at }],
    }
  }
  const typed = target.typed + 1
  const done = typed === target.text.length
  const id = target.id
  return {
    ...s,
    words: done
      ? s.words.filter((w) => w.id !== id)
      : s.words.map((w) => (w.id === id ? { ...w, typed } : w)),
    target: done ? null : id,
    score: done ? s.score + target.text.length : s.score,
    destroyed: done ? s.destroyed + 1 : s.destroyed,
    correctChars: s.correctChars + 1,
    keystrokes: [...s.keystrokes, { expected, actual: char, correct: true, at }],
  }
}

/** Промах мимо всех слов: в точность идёт, в статистику клавиш — нет (ожидаемой буквы не было). */
function miss(char: string, at: number): Keystroke {
  return { expected: '', actual: char, correct: false, at }
}
