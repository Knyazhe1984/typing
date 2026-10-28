import { useTranslation } from 'react-i18next'
import { achievements } from '../../core/progress/achievements'
import s from '../Game/Game.module.css'
import { useGameStats } from '../useGameStats'
import { useL10n } from '../useL10n'

export function AchievementsScreen() {
  const { t, i18n } = useTranslation()
  const l = useL10n()
  const stats = useGameStats()
  const unlocked = stats?.unlocked ?? new Map<string, number>()

  return (
    <section style={{ display: 'grid', gap: 18 }}>
      <h1 style={{ margin: 0 }}>{t('nav.achievements')}</h1>
      <p style={{ margin: 0, color: 'var(--text-muted)' }}>
        {t('game.achievementsCount', { n: unlocked.size, total: achievements.length })}
      </p>
      <div className={s.cards}>
        {achievements.map((a) => {
          const at = unlocked.get(a.id)
          return (
            <div key={a.id} className={s.card} style={at ? undefined : { opacity: 0.55 }}>
              <span style={{ fontSize: 34, filter: at ? undefined : 'grayscale(1)' }}>
                {a.icon}
              </span>
              <strong>{l(a.title)}</strong>
              <span className={s.cardHint}>{l(a.description)}</span>
              <span className={s.cardHint}>
                {at
                  ? t('game.unlockedAt', { date: new Date(at).toLocaleDateString(i18n.language) })
                  : t('game.lockedAchievement')}
              </span>
            </div>
          )
        })}
      </div>
    </section>
  )
}
