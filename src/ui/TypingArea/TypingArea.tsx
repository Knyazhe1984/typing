import type { Session } from '../../core/engine/session'
import s from './TypingArea.module.css'

interface Props {
  session: Session
  /** Меняется при каждой ошибке — перезапускает анимацию встряски */
  errorTick: number
  animations: boolean
}

export function TypingArea({ session, errorTick, animations }: Props) {
  return (
    <div
      key={animations ? errorTick : undefined}
      className={animations && errorTick > 0 ? `${s.area} ${s.shake}` : s.area}
      aria-live="off"
      data-testid="typing-area"
    >
      {[...session.text].map((ch, i) => {
        const status = session.statuses[i]
        const isCurrent = i === session.position
        // В режиме без остановки показываем то, что набрано по ошибке
        const shown = status === 'wrong' && session.typed[i] ? session.typed[i] : ch
        const cls = [s[status]]
        if (isCurrent) cls.push(s.current)
        return (
          <span key={i} className={cls.join(' ')}>
            {shown === ' ' && status === 'wrong' ? '·' : shown}
          </span>
        )
      })}
    </div>
  )
}
