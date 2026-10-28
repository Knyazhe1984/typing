import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { LayoutId } from '../core/layouts'
import { detectUiLanguage, type UiLanguage } from '../i18n'

export type Theme = 'system' | 'light' | 'dark'

interface Settings {
  uiLanguage: UiLanguage
  theme: Theme
  sound: boolean
  animations: boolean
  gamification: boolean
  /** Раскладка для тренировок */
  keyboardLayout: LayoutId
  /** Курсор ждёт верную клавишу; иначе ошибки исправляются Backspace */
  stopOnError: boolean
  showKeyboard: boolean
  showHands: boolean
  /** Тихий щелчок на каждое нажатие (отдельно от остальных звуков) */
  keyClicks: boolean
  dailyGoalMinutes: number
  set: (patch: Partial<Omit<Settings, 'set'>>) => void
}

// Настройки — мелкие и синхронные, поэтому localStorage; прогресс уйдёт в IndexedDB.
export const useSettings = create<Settings>()(
  persist(
    (set) => ({
      uiLanguage: detectUiLanguage(),
      theme: 'system',
      sound: true,
      animations: true,
      gamification: true,
      keyboardLayout: detectUiLanguage(),
      stopOnError: true,
      showKeyboard: true,
      showHands: true,
      keyClicks: false,
      dailyGoalMinutes: 10,
      set: (patch) => set(patch),
    }),
    { name: 'settings', storage: createJSONStorage(() => localStorage) },
  ),
)
