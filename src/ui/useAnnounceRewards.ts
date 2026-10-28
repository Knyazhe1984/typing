import { useTranslation } from 'react-i18next'
import type { Achievement } from '../core/progress/achievements'
import type { Rewards } from '../storage/progress'
import { useSettings } from '../store/settings'
import { useToasts } from '../store/toasts'
import { play } from './sound'
import { useL10n } from './useL10n'

/** Сообщает о новых достижениях и уровне. При выключенной игрофикации — молча. */
export function useAnnounceRewards() {
  const { t } = useTranslation()
  const l = useL10n()
  const push = useToasts((s) => s.push)

  return (rewards: Pick<Rewards, 'achievements'> & Partial<Rewards>) => {
    if (!useSettings.getState().gamification) return
    const list: Achievement[] = rewards.achievements
    if (rewards.levelAfter && rewards.levelBefore && rewards.levelAfter > rewards.levelBefore) {
      push({ icon: '🎉', title: t('game.levelUp', { level: rewards.levelAfter }) })
    }
    // Пачку достижений сводим в одно уведомление, чтобы не закрыть пол-экрана
    if (list.length > 2) {
      push({
        icon: list[0].icon,
        title: t('game.manyAchievements', { count: list.length }),
        text: list.map((a) => l(a.title)).join(', '),
      })
    } else {
      for (const a of list) push({ icon: a.icon, title: l(a.title), text: l(a.description) })
    }
    if (list.length || (rewards.levelAfter ?? 0) > (rewards.levelBefore ?? 0)) {
      setTimeout(() => play('achievement'), 400)
    }
  }
}
