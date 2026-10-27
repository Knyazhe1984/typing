import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './en.json'
import ru from './ru.json'

export const uiLanguages = ['ru', 'en'] as const
export type UiLanguage = (typeof uiLanguages)[number]

export function detectUiLanguage(): UiLanguage {
  return navigator.language.toLowerCase().startsWith('ru') ? 'ru' : 'en'
}

export function initI18n(lng: UiLanguage) {
  return i18n.use(initReactI18next).init({
    resources: { ru: { translation: ru }, en: { translation: en } },
    lng,
    fallbackLng: 'ru',
    interpolation: { escapeValue: false },
  })
}

export default i18n
