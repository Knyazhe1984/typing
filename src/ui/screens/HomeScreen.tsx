import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { courses } from '../../content/course'
import { useSettings } from '../../store/settings'
import { GameCards } from '../Game/GameWidgets'
import { useGameStats } from '../useGameStats'
import { useL10n } from '../useL10n'
import { useProgressMap } from '../useProgress'

export function HomeScreen() {
  const { t } = useTranslation()
  const l = useL10n()
  const { keyboardLayout, gamification } = useSettings()
  const progress = useProgressMap()
  const stats = useGameStats()
  const course = courses[keyboardLayout]
  const next = course.lessons.find((x) => !progress.get(x.id)?.completed)

  return (
    <section style={{ display: 'grid', gap: 20 }}>
      <div>
        <h1 style={{ marginBottom: 4 }}>{t('app.title')}</h1>
        <p style={{ margin: 0 }}>{t('app.tagline')}</p>
      </div>
      <p style={{ display: 'flex', gap: 12, flexWrap: 'wrap', margin: 0 }}>
        {next ? (
          <Link to={`/course/${next.id}`} className="btn btn-primary">
            {next.index === 0 ? t('home.start') : t('home.continue', { lesson: l(next.title) })}
          </Link>
        ) : (
          <span>{t('home.allDone')}</span>
        )}
        <Link to="/practice" className="btn">
          {t('home.practice')}
        </Link>
      </p>
      {gamification && stats && <GameCards stats={stats} />}
      <p style={{ color: 'var(--text-muted)', margin: 0 }}>{t('home.noMobile')}</p>
    </section>
  )
}
