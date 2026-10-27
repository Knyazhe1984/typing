import { useEffect, useEffectEvent, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { isFinished, metrics, type Metrics, type Session } from '../../core/engine/session'
import type { Finger, Layout, LayoutId } from '../../core/layouts'
import { useSettings } from '../../store/settings'
import { HandsView } from '../HandsView/HandsView'
import { KeyboardView } from '../KeyboardView/KeyboardView'
import { TypingArea } from '../TypingArea/TypingArea'
import { useTicker, useTypingSession } from '../hooks/useTypingSession'
import { StatsBar } from './StatsBar'
import s from './Trainer.module.css'

const homeRowLabel: Record<LayoutId, string> = { ru: 'ФЫВА ОЛДЖ', en: 'ASDF JKL;' }

interface Props {
  text: string
  layout: Layout
  /** Изученные символы: остальные клавиши приглушены */
  enabledChars?: Set<string>
  onFinish: (session: Session, m: Metrics) => void
}

/**
 * Набор одного текста: живые метрики, поле набора, руки и клавиатура.
 * Новый текст — новый экземпляр (через key).
 */
export function Trainer({ text, layout, enabledChars, onFinish }: Props) {
  const { t } = useTranslation()
  const { stopOnError, showKeyboard, showHands, animations } = useSettings()
  const { session, target, errorTick, errorCode, wrongLayout } = useTypingSession(
    text,
    layout,
    stopOnError,
  )
  const finished = isFinished(session)
  const now = useTicker(session.startedAt !== null && !finished)

  const finish = useEffectEvent((done: Session) => onFinish(done, metrics(done, 0)))
  // После завершения сессия больше не меняется, так что срабатывает ровно один раз
  useEffect(() => {
    if (finished) finish(session)
  }, [finished, session])

  const activeFingers = useMemo(() => {
    if (!target) return []
    const fingers: Finger[] = [target.key.finger]
    if (target.shiftCode) fingers.push(target.shiftCode === 'ShiftLeft' ? 'L5' : 'R5')
    return fingers
  }, [target])

  return (
    <>
      <StatsBar m={metrics(session, now)} />
      {wrongLayout && (
        <p className={s.warning}>{t('practice.wrongLayout', { layout: layout.name })}</p>
      )}
      {session.startedAt === null && !wrongLayout && (
        <p className={s.hint}>{t('practice.hintStart', { home: homeRowLabel[layout.id] })}</p>
      )}
      <TypingArea session={session} errorTick={errorTick} animations={animations} />
      {showHands && <HandsView active={activeFingers} />}
      {showKeyboard && (
        <KeyboardView
          layout={layout}
          target={target}
          errorCode={errorCode}
          enabledChars={enabledChars}
        />
      )}
    </>
  )
}
