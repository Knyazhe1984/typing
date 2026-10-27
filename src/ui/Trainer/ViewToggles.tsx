import { useTranslation } from 'react-i18next'
import { useSettings } from '../../store/settings'

/** Переключатели режима и подсказок — общие для тренировки и уроков. */
export function ViewToggles() {
  const { t } = useTranslation()
  const settings = useSettings()
  return (
    <>
      {(['stopOnError', 'showKeyboard', 'showHands'] as const).map((field) => (
        <label key={field}>
          <input
            type="checkbox"
            checked={settings[field]}
            onChange={(e) => settings.set({ [field]: e.target.checked })}
          />{' '}
          {t(`practice.${field}`)}
        </label>
      ))}
    </>
  )
}
