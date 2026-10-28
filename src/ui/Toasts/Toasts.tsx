import { useToasts } from '../../store/toasts'
import s from './Toasts.module.css'

export function Toasts() {
  const { items, dismiss } = useToasts()
  return (
    <div className={s.stack} role="status" aria-live="polite">
      {items.map((t) => (
        <button key={t.id} className={s.toast} onClick={() => dismiss(t.id)}>
          <span className={s.icon}>{t.icon}</span>
          <span>
            <strong>{t.title}</strong>
            {t.text && <div className={s.text}>{t.text}</div>}
          </span>
        </button>
      ))}
    </div>
  )
}
