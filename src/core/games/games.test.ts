import { describe, expect, it } from 'vitest'
import { createRng } from '../generator/random'
import { createFalling, LIVES, stepFalling, typeFalling, type FallingState } from './falling'
import { ghostPosition, paceTimeline, timelineFromProgress } from './ghost'

const dict = ['кот', 'дом', 'лес']

function withWords(...texts: [string, number][]): FallingState {
  return {
    ...createFalling('normal'),
    spawnIn: 99_999,
    words: texts.map(([text, y], i) => ({ id: i + 1, text, x: 0.5, y, typed: 0 })),
    nextId: texts.length + 1,
  }
}

describe('падающие слова', () => {
  it('появляются слова и падают', () => {
    let s = stepFalling(createFalling('normal'), 16, dict, createRng(1))
    expect(s.words).toHaveLength(1)
    const y = s.words[0].y
    s = stepFalling(s, 1000, dict, createRng(1))
    expect(s.words[0].y).toBeGreaterThan(y)
  })

  it('первая буква выбирает самое низкое слово, набранное слово исчезает', () => {
    let s = withWords(['кот', 0.2], ['кит', 0.6])
    s = typeFalling(s, 'к')
    expect(s.target).toBe(2)
    s = typeFalling(typeFalling(s, 'и'), 'т')
    expect(s.words.map((w) => w.text)).toEqual(['кот'])
    expect(s.score).toBe(3)
    expect(s.target).toBeNull()
  })

  it('ошибка не сбрасывает набранное', () => {
    let s = typeFalling(withWords(['дом', 0.1]), 'д')
    s = typeFalling(s, 'х')
    expect(s.words[0].typed).toBe(1)
    expect(s.keystrokes.filter((k) => !k.correct)).toHaveLength(1)
    expect(typeFalling(s, 'о').words[0].typed).toBe(2)
  })

  it('упавшее слово отнимает жизнь, без жизней игра окончена', () => {
    let s = withWords(['дом', 0.99], ['кот', 0.995], ['лес', 0.999])
    s = typeFalling(s, 'д')
    s = stepFalling(s, 500, dict, createRng(1))
    expect(s.lives).toBe(LIVES - 3)
    expect(s.target).toBeNull()
    expect(s.over).toBe(true)
  })
})

describe('призрак', () => {
  it('ghostPosition', () => {
    const t = [100, 200, 300]
    expect(ghostPosition(t, 0)).toBe(0)
    expect(ghostPosition(t, 200)).toBe(2)
    expect(ghostPosition(t, 1000)).toBe(3)
  })

  it('paceTimeline: 60 зн/мин — символ в секунду', () => {
    expect(paceTimeline(3, 60)).toEqual([1000, 2000, 3000])
  })

  it('timelineFromProgress учитывает откат Backspace', () => {
    const t = timelineFromProgress(4, [
      { position: 1, at: 100 },
      { position: 2, at: 200 },
      { position: 1, at: 250 },
      { position: 2, at: 300 },
      { position: 4, at: 400 },
    ])
    expect(t).toEqual([100, 200, 400, 400])
  })
})
