import { useCallback, useEffect, useState } from 'react'
import {
  backspace,
  createSession,
  expectedChar,
  isFinished,
  typeChar,
  type Session,
} from '../../core/engine/session'
import { isWrongLayout, strokeFor, type Layout } from '../../core/layouts'

interface TypingState {
  session: Session
  /** Счётчик ошибок — перезапускает анимацию встряски */
  errorTick: number
  /** Клавиша последней ошибки, подсвечивается на экранной клавиатуре */
  errorCode?: string
  wrongLayout: boolean
}

function initialState(text: string, stopOnError: boolean): TypingState {
  return { session: createSession(text, { stopOnError }), errorTick: 0, wrongLayout: false }
}

function applyKey(state: TypingState, layout: Layout, key: string, code: string, now: number) {
  const { session } = state
  if (key === 'Backspace') return { ...state, session: backspace(session) }
  if (isWrongLayout(layout, key)) return { ...state, wrongLayout: true }
  const correct = expectedChar(session) === key
  return {
    session: typeChar(session, key, now),
    errorTick: correct ? state.errorTick : state.errorTick + 1,
    errorCode: correct ? undefined : code,
    wrongLayout: false,
  }
}

function isTextField(el: HTMLElement) {
  return el.tagName === 'TEXTAREA' || (el instanceof HTMLInputElement && el.type === 'text')
}

/**
 * Связывает сессию набора с клавиатурой: слушает keydown на window.
 * Новый текст или раскладка — новый компонент (через key), поэтому сброс только ручной.
 */
export function useTypingSession(text: string, layout: Layout, stopOnError: boolean) {
  const [state, setState] = useState(() => initialState(text, stopOnError))

  const reset = useCallback(() => setState(initialState(text, stopOnError)), [text, stopOnError])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.repeat || e.ctrlKey || e.metaKey || e.altKey) return
      if (e.key !== 'Backspace' && e.key.length !== 1) return
      const el = e.target as HTMLElement
      if (isTextField(el)) return
      // Иначе пробел нажмёт кнопку или переключит чекбокс, на котором остался фокус
      if (el !== document.body) el.blur()
      // Пробел прокручивает страницу, а ' и / открывают быстрый поиск в Firefox
      e.preventDefault()
      const now = performance.now()
      setState((prev) =>
        isFinished(prev.session) ? prev : applyKey(prev, layout, e.key, e.code, now),
      )
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [layout])

  const expected = expectedChar(state.session)
  const target = expected === undefined ? undefined : strokeFor(layout, expected)

  return { ...state, reset, target }
}

/** Текущее время, обновляемое по таймеру, — чтобы живые метрики шли и во время пауз. */
export function useTicker(active: boolean, ms = 250) {
  const [now, setNow] = useState(() => performance.now())
  useEffect(() => {
    if (!active) return
    const id = setInterval(() => setNow(performance.now()), ms)
    return () => clearInterval(id)
  }, [active, ms])
  return now
}
