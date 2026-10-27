import { useTranslation } from 'react-i18next'
import type { Metrics } from '../../core/engine/session'
import s from './Trainer.module.css'

function formatTime(ms: number) {
  const total = Math.floor(ms / 1000)
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`
}

export function StatsBar({ m }: { m: Metrics }) {
  const { t } = useTranslation()
  const items = [
    {
      label: t('practice.speed'),
      value: Math.round(m.cpm),
      unit: `${t('practice.cpmUnit')} · ${Math.round(m.wpm)} ${t('practice.wpmUnit')}`,
    },
    { label: t('practice.accuracy'), value: `${Math.round(m.accuracy * 1000) / 10}%` },
    { label: t('practice.errors'), value: m.errors },
    { label: t('practice.time'), value: formatTime(m.elapsedMs) },
  ]
  return (
    <div className={s.stats}>
      {items.map((it) => (
        <div key={it.label} className={s.stat}>
          <span className={s.statLabel}>{it.label}</span>
          <span className={s.statValue}>
            {it.value}
            {it.unit && <span className={s.statUnit}>{it.unit}</span>}
          </span>
        </div>
      ))}
    </div>
  )
}
