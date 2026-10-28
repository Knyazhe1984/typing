import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { uiLanguages } from '../../i18n'
import {
  createBackup,
  downloadBackup,
  parseBackup,
  resetProgress,
  restoreBackup,
} from '../../storage/backup'
import { useSettings, type Theme } from '../../store/settings'
import { useToasts } from '../../store/toasts'

const themes: { value: Theme; key: string }[] = [
  { value: 'system', key: 'settings.themeSystem' },
  { value: 'light', key: 'settings.themeLight' },
  { value: 'dark', key: 'settings.themeDark' },
]

const languageNames = { ru: 'Русский', en: 'English' }

export function SettingsScreen() {
  const { t } = useTranslation()
  const settings = useSettings()
  const push = useToasts((st) => st.push)
  const fileRef = useRef<HTMLInputElement>(null)

  async function exportData() {
    downloadBackup(await createBackup())
  }

  async function importData(file: File) {
    try {
      const backup = parseBackup(JSON.parse(await file.text()))
      if (!confirm(t('settings.importConfirm'))) return
      await restoreBackup(backup)
      push({ icon: '✓', title: t('settings.importDone') })
    } catch {
      push({ icon: '!', title: t('settings.importError') })
    }
  }

  async function reset() {
    if (!confirm(t('settings.resetConfirm'))) return
    await resetProgress()
    push({ icon: '✓', title: t('settings.resetDone') })
  }

  const toggles = [
    { field: 'sound', key: 'settings.sound' },
    { field: 'keyClicks', key: 'settings.keyClicks' },
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
      <label>
        {t('settings.dailyGoal')}{' '}
        <select
          value={settings.dailyGoalMinutes}
          onChange={(e) => settings.set({ dailyGoalMinutes: Number(e.target.value) })}
        >
          {[5, 10, 15, 20, 30, 45, 60].map((m) => (
            <option key={m} value={m}>
              {m}
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

      <h2 style={{ marginBottom: 0 }}>{t('settings.data')}</h2>
      <p style={{ margin: 0, color: 'var(--text-muted)' }}>{t('settings.dataHint')}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        <button className="btn" onClick={exportData}>
          {t('settings.export')}
        </button>
        <button className="btn" onClick={() => fileRef.current?.click()}>
          {t('settings.import')}
        </button>
        <button className="btn" onClick={reset}>
          {t('settings.reset')}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0]
            e.target.value = ''
            if (file) importData(file)
          }}
        />
      </div>
    </section>
  )
}
