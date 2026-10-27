import { useTranslation } from 'react-i18next'

export function PlaceholderScreen({ titleKey }: { titleKey: string }) {
  const { t } = useTranslation()
  return (
    <section>
      <h1>{t(titleKey)}</h1>
      <p>{t('common.comingSoon')}</p>
    </section>
  )
}
