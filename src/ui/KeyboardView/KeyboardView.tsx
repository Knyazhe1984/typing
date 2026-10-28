import { homingCodes, type KeyDef, type KeyStroke, type Layout } from '../../core/layouts'
import { fingerColor } from '../fingers'
import s from './KeyboardView.module.css'

interface Props {
  layout: Layout
  /** Клавиша, которую нужно нажать следующей */
  target?: KeyStroke
  /** Клавиша, на которой только что ошиблись */
  errorCode?: string
  /** Если задано — остальные символьные клавиши приглушены (ещё не изучены) */
  enabledChars?: Set<string>
  /** Клавиши, выделенные для объяснения (например, новые в уроке) */
  highlightCodes?: Set<string>
  /** Свой цвет клавиши вместо цвета пальца (тепловая карта) */
  keyClass?: (k: KeyDef) => string | undefined
  /** Подсказка при наведении на клавишу */
  keyTitle?: (k: KeyDef) => string | undefined
}

function isLetter(ch: string) {
  return ch.toLowerCase() !== ch.toUpperCase()
}

function KeyCap({ k }: { k: KeyDef }) {
  if (k.label) return <>{k.label}</>
  if (k.code === 'Space') return null
  if (isLetter(k.base)) return <>{k.base.toUpperCase()}</>
  return (
    <>
      <span className={s.shiftChar}>{k.shift}</span>
      {k.base}
    </>
  )
}

export function KeyboardView({
  layout,
  target,
  errorCode,
  enabledChars,
  highlightCodes,
  keyClass,
  keyTitle,
}: Props) {
  return (
    <div className={s.keyboard} aria-hidden="true">
      {layout.rows.map((row, r) => (
        <div key={r} className={r === 4 ? `${s.row} ${s.spaceRow}` : s.row}>
          {row.map((k) => {
            const isTarget =
              k.code === target?.key.code ||
              k.code === target?.shiftCode ||
              highlightCodes?.has(k.code)
            const classes = [s.key]
            if (k.label) classes.push(s.special)
            if (homingCodes.includes(k.code)) classes.push(s.homing)
            if (isTarget) classes.push(s.target)
            if (k.code === errorCode) classes.push(s.error)
            if (
              enabledChars &&
              !k.label &&
              !enabledChars.has(k.base) &&
              !enabledChars.has(k.shift)
            ) {
              classes.push(s.dim)
            }
            const custom = keyClass && !k.label ? keyClass(k) : undefined
            if (custom) classes.push(custom)
            return (
              <div
                key={k.code}
                className={classes.join(' ')}
                title={keyTitle?.(k)}
                style={{
                  flex: r === 4 ? `0 0 ${(k.width / 15) * 100}%` : `${k.width} 1 0`,
                  background: k.label || keyClass ? undefined : fingerColor[k.finger],
                }}
              >
                <KeyCap k={k} />
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
