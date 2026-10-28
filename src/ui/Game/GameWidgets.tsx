import type { CSSProperties } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { achievements } from '../../core/progress/achievements'
import { useSettings } from '../../store/settings'
import { FlameIcon } from '../icons'
import type { GameStats } from '../useGameStats'
import s from './Game.module.css'

export function ProgressBar({ value, style }: { value: number; style?: CSSProperties }) {
  return (
    <div className={s.bar} style={style}>
      <div className={s.barFill} style={{ width: `${Math.min(1, value) * 100}%` }} />
    </div>
  )
}

/** Кольцо дневной цели. */
export function GoalRing({ value, size = 22 }: { value: number; size?: number }) {
  const r = 9
  const c = 2 * Math.PI * r
  const done = value >= 1
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" aria-hidden="true">
      <circle cx={11} cy={11} r={r} fill="none" stroke="var(--border)" strokeWidth={3} />
      <circle
        cx={11}
        cy={11}
        r={r}
        fill="none"
        stroke={done ? 'var(--ok)' : 'var(--accent)'}
        strokeWidth={3}
        strokeLinecap="round"
        strokeDasharray={`${Math.min(1, value) * c} ${c}`}
        transform="rotate(-90 11 11)"
      />
    </svg>
  )
}

const goalProgress = (stats: GameStats, goalMinutes: number) =>
  stats.todayMs / (goalMinutes * 60000)

/** Компактная сводка в шапке: серия, цель дня, уровень. */
export function HeaderStats({ stats }: { stats: GameStats }) {
  const { t } = useTranslation()
  const goal = useSettings((st) => st.dailyGoalMinutes)
  const { level, streak } = stats
  return (
    <Link to="/" className={s.headerStats} style={{ textDecoration: 'none' }}>
      <span className={s.badge} title={t('game.streak', { count: streak.current })}>
        <FlameIcon active={streak.activeToday} /> {streak.current}
      </span>
      <span className={s.badge} title={t('game.dailyGoal')}>
        <GoalRing value={goalProgress(stats, goal)} />
      </span>
      <span className={s.badge} title={t('game.xp', { ...level })}>
        {t('game.levelShort', { level: level.level })}
        <ProgressBar value={level.current / level.needed} style={{ width: 60 }} />
      </span>
    </Link>
  )
}

/** Карточки на главной. */
export function GameCards({ stats }: { stats: GameStats }) {
  const { t } = useTranslation()
  const goal = useSettings((st) => st.dailyGoalMinutes)
  const { level, streak } = stats
  const goalValue = goalProgress(stats, goal)
  const doneMinutes = Math.floor(stats.todayMs / 60000)

  return (
    <div className={s.cards}>
      <div className={s.card}>
        <span className={s.cardLabel}>{t('game.dailyGoal')}</span>
        <span className={s.cardValue} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <GoalRing value={goalValue} size={32} />
          {goalValue >= 1
            ? t('game.dailyGoalDone')
            : t('game.dailyGoalProgress', { done: doneMinutes, goal })}
        </span>
      </div>
      <div className={s.card}>
        <span className={s.cardLabel}>{t('game.streakTitle')}</span>
        <span className={s.cardValue}>🔥 {t('game.streak', { count: streak.current })}</span>
        <span className={s.cardHint}>
          {streak.current === 0
            ? t('game.streakNone')
            : streak.activeToday
              ? t('game.streakBest', { n: streak.best })
              : t('game.streakKeep')}
        </span>
      </div>
      <div className={s.card}>
        <span className={s.cardLabel}>{t('game.level', { level: level.level })}</span>
        <ProgressBar value={level.current / level.needed} />
        <span className={s.cardHint}>{t('game.xp', { ...level })}</span>
      </div>
      <Link to="/achievements" className={s.card}>
        <span className={s.cardLabel}>{t('nav.achievements')}</span>
        <span className={s.cardValue}>
          {t('game.achievementsCount', { n: stats.unlocked.size, total: achievements.length })}
        </span>
        <span style={{ fontSize: 22 }}>
          {achievements
            .filter((a) => stats.unlocked.has(a.id))
            .sort((a, b) => stats.unlocked.get(b.id)! - stats.unlocked.get(a.id)!)
            .slice(0, 6)
            .map((a) => a.icon)
            .join(' ')}
        </span>
      </Link>
    </div>
  )
}
