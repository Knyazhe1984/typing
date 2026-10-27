import { describe, expect, it } from 'vitest'
import {
  backspace,
  combinedMetrics,
  createSession,
  isFinished,
  metrics,
  typeChar,
  type Session,
} from './session'

function typeAll(s: Session, chars: string, start = 0, step = 100): Session {
  return [...chars].reduce((acc, ch, i) => typeChar(acc, ch, start + i * step), s)
}

describe('session: stopOnError', () => {
  const opts = { stopOnError: true }

  it('верный набор двигает курсор и завершает сессию', () => {
    const s = typeAll(createSession('фыва', opts), 'фыва')
    expect(s.position).toBe(4)
    expect(s.statuses).toEqual(['correct', 'correct', 'correct', 'correct'])
    expect(isFinished(s)).toBe(true)
  })

  it('ошибка не двигает курсор, а после исправления символ — corrected', () => {
    let s = createSession('ab', opts)
    s = typeChar(s, 'x', 0)
    expect(s.position).toBe(0)
    expect(s.statuses[0]).toBe('wrong')
    s = typeChar(s, 'a', 100)
    expect(s.position).toBe(1)
    expect(s.statuses[0]).toBe('corrected')
  })

  it('Backspace игнорируется', () => {
    const s = typeChar(createSession('ab', opts), 'a', 0)
    expect(backspace(s)).toBe(s)
  })

  it('после завершения ввод игнорируется', () => {
    const s = typeAll(createSession('a', opts), 'a')
    expect(typeChar(s, 'b', 1000)).toBe(s)
  })
})

describe('session: без остановки на ошибке', () => {
  const opts = { stopOnError: false }

  it('ошибка двигает курсор, Backspace позволяет исправить', () => {
    let s = createSession('ab', opts)
    s = typeChar(s, 'x', 0)
    expect(s.position).toBe(1)
    expect(s.typed[0]).toBe('x')
    s = backspace(s)
    expect(s.position).toBe(0)
    s = typeChar(s, 'a', 100)
    expect(s.statuses[0]).toBe('corrected')
  })

  it('Backspace по верному символу возвращает его в pending', () => {
    let s = typeChar(createSession('ab', opts), 'a', 0)
    s = backspace(s)
    expect(s.statuses[0]).toBe('pending')
  })
})

describe('metrics', () => {
  it('считает скорость и точность', () => {
    // 10 символов за 6 секунд (первый в 0, последний в 6000) = 100 зн/мин = 20 wpm
    let s = createSession('aaaaaaaaaa', { stopOnError: true })
    s = typeChar(s, 'b', 0) // одна ошибка
    s = [...'aaaaaaaaaa'].reduce((acc, ch, i) => typeChar(acc, ch, ((i + 1) * 6000) / 10), s)
    const m = metrics(s, 99999)
    expect(m.elapsedMs).toBe(6000)
    expect(m.cpm).toBeCloseTo(100)
    expect(m.wpm).toBeCloseTo(20)
    expect(m.errors).toBe(1)
    expect(m.accuracy).toBeCloseTo(10 / 11)
  })

  it('до начала набора всё по нулям', () => {
    const m = metrics(createSession('abc', { stopOnError: true }), 1000)
    expect(m).toMatchObject({ elapsedMs: 0, wpm: 0, cpm: 0, accuracy: 1, errors: 0 })
  })
})

describe('combinedMetrics', () => {
  it('складывает упражнения как одно длинное', () => {
    const a = typeAll(createSession('aaaaa', { stopOnError: true }), 'aaaaa', 0, 1500) // 6 с
    const b = typeChar(typeAll(createSession('bbbbb', { stopOnError: true }), 'x', 0), 'b', 0)
    const b2 = typeAll(b, 'bbbb', 1500, 1500) // 6 с, 1 ошибка
    const m = combinedMetrics([a, b2])
    expect(m.elapsedMs).toBe(12000)
    expect(m.cpm).toBeCloseTo(50)
    expect(m.errors).toBe(1)
    expect(m.accuracy).toBeCloseTo(10 / 11)
  })
})
