import { useEffect } from 'react'
import { play } from '../sound'
import s from './Celebration.module.css'

const STAR_DELAY_MS = 250

/** Звёзды результата: появляются по одной, каждая со звуком. */
export function AnimatedStars({ count, animate }: { count: number; animate: boolean }) {
  useEffect(() => {
    const timers = Array.from({ length: count }, (_, i) =>
      setTimeout(() => play('star'), 200 + i * STAR_DELAY_MS),
    )
    return () => timers.forEach(clearTimeout)
  }, [count])

  return (
    <div className={`${s.stars} ${animate ? s.animate : ''}`} aria-label={`${count}/3`}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={`${s.star} ${i < count ? s.on : ''}`}
          style={{ animationDelay: `${200 + i * STAR_DELAY_MS}ms` }}
        >
          ★
        </span>
      ))}
    </div>
  )
}

export function XpGain({ text, animate }: { text: string; animate: boolean }) {
  return (
    <div className={animate ? s.animate : undefined}>
      <span className={s.xp}>{text}</span>
    </div>
  )
}

const colors = ['#f2b705', '#2f6fed', '#1f9d55', '#d93838', '#9b6bf2', '#f28c38']

/** Конфетти за идеальный результат. Позиции псевдослучайные, но стабильные между рендерами. */
export function Confetti() {
  return (
    <div className={s.confetti} aria-hidden="true">
      {Array.from({ length: 48 }, (_, i) => (
        <span
          key={i}
          className={s.piece}
          style={{
            left: `${(i * 37) % 100}%`,
            background: colors[i % colors.length],
            animationDuration: `${1.8 + ((i * 13) % 10) / 8}s`,
            animationDelay: `${((i * 7) % 10) / 12}s`,
          }}
        />
      ))}
    </div>
  )
}
