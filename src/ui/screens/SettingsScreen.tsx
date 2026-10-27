import { useTranslation } from 'react-i18next'
import { uiLanguages } from '../../i18n'
import { useSettings, type Theme } from '../../store/settings'

const themes: { value: Theme; key: string }[] = [
  { value: 'system', key: 'settings.themeSystem' },
  { value: 'light', key: 'settings.themeLight' },
  { value: 'dark', key: 'settings.themeDark' },
]

const languageNames = { ru: 'Русский', en: 'English' }

export function SettingsScreen() {
  const { t } = useTranslation()
  const settings = useSettings()

  const toggles = [
    { field: 'sound', key: 'settings.sound' },
    { field: 'animations', key: 'settings.animations' },
    { field: 'gamification', key: 'settings.gamification' },
  ] as const

  return (
    <section style={{ display: 'grid', gap: 16, maxWidth: 480 }}>
      <h1>{t('nav.settings')}</h1>
      <label>
        {t('settings.uiLanguage')}{' '}
        <select
          value={settings.uiLanguage}
          onChange={(e) =>
            settings.set({ uiLanguage: e.target.value as typeof settings.uiLanguage })
          }
        >
          {uiLanguages.map((l) => (
            <option key={l} value={l}>
              {languageNames[l]}
            </option>
          ))}
        </select>
      </label>
      <label>
        {t('settings.theme')}{' '}
        <select
          value={settings.theme}
          onChange={(e) => settings.set({ theme: e.target.value as Theme })}
        >
          {themes.map((th) => (
            <option key={th.value} value={th.value}>
              {t(th.key)}
            </option>
          ))}
        </select>
      </label>
      {toggles.map(({ field, key }) => (
        <label key={field}>
          <input
            type="checkbox"
            checked={settings[field]}
            onChange={(e) => settings.set({ [field]: e.target.checked })}
          />{' '}
          {t(key)}
        </label>
      ))}
    </section>
  )
}
