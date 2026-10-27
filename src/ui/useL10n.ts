import { useTranslation } from 'react-i18next'
import type { L10n } from '../core/course/types'

/** Выбирает текст курса на языке интерфейса. */
export function useL10n() {
  const { i18n } = useTranslation()
  const lang = i18n.language === 'en' ? 'en' : 'ru'
  return (text: L10n) => text[lang]
}
