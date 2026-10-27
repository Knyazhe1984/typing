import type { Finger, PhysicalKey } from './types'

const k = (code: string, finger: Finger, width = 1, label?: string): PhysicalKey => ({
  code,
  finger,
  width,
  label,
})

/** ANSI-клавиатура: 5 рядов, каждый шириной 15 единиц. */
export const physicalRows: PhysicalKey[][] = [
  [
    k('Backquote', 'L5'),
    k('Digit1', 'L5'),
    k('Digit2', 'L4'),
    k('Digit3', 'L3'),
    k('Digit4', 'L2'),
    k('Digit5', 'L2'),
    k('Digit6', 'R2'),
    k('Digit7', 'R2'),
    k('Digit8', 'R3'),
    k('Digit9', 'R4'),
    k('Digit0', 'R5'),
    k('Minus', 'R5'),
    k('Equal', 'R5'),
    k('Backspace', 'R5', 2, '⌫'),
  ],
  [
    k('Tab', 'L5', 1.5, 'Tab'),
    k('KeyQ', 'L5'),
    k('KeyW', 'L4'),
    k('KeyE', 'L3'),
    k('KeyR', 'L2'),
    k('KeyT', 'L2'),
    k('KeyY', 'R2'),
    k('KeyU', 'R2'),
    k('KeyI', 'R3'),
    k('KeyO', 'R4'),
    k('KeyP', 'R5'),
    k('BracketLeft', 'R5'),
    k('BracketRight', 'R5'),
    k('Backslash', 'R5', 1.5),
  ],
  [
    k('CapsLock', 'L5', 1.75, 'Caps'),
    k('KeyA', 'L5'),
    k('KeyS', 'L4'),
    k('KeyD', 'L3'),
    k('KeyF', 'L2'),
    k('KeyG', 'L2'),
    k('KeyH', 'R2'),
    k('KeyJ', 'R2'),
    k('KeyK', 'R3'),
    k('KeyL', 'R4'),
    k('Semicolon', 'R5'),
    k('Quote', 'R5'),
    k('Enter', 'R5', 2.25, 'Enter'),
  ],
  [
    k('ShiftLeft', 'L5', 2.25, 'Shift'),
    k('KeyZ', 'L5'),
    k('KeyX', 'L4'),
    k('KeyC', 'L3'),
    k('KeyV', 'L2'),
    k('KeyB', 'L2'),
    k('KeyN', 'R2'),
    k('KeyM', 'R2'),
    k('Comma', 'R3'),
    k('Period', 'R4'),
    k('Slash', 'R5'),
    k('ShiftRight', 'R5', 2.75, 'Shift'),
  ],
  [k('Space', 'TH', 6.25)],
]

/** Клавиши с засечками — ориентир для указательных пальцев. */
export const homingCodes = ['KeyF', 'KeyJ']
