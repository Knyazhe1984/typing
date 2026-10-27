import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export function HomeScreen() {
  const { t } = useTranslation()
  return (
    <section>
      <h1>{t('app.title')}</h1>
      <p>{t('app.tagline')}</p>
      <p style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Link to="/course" className="btn btn-primary">
          {t('home.start')}
        </Link>
        <Link to="/practice" className="btn">
          {t('home.practice')}
        </Link>
      </p>
      <p style={{ color: 'var(--text-muted)' }}>{t('home.noMobile')}</p>
    </section>
  )
}
