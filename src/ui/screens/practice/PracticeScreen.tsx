import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Metrics } from '../../../core/engine/session'
import { layouts, type LayoutId } from '../../../core/layouts'
import { normalizeText } from '../../../core/text/normalize'
import { practiceTexts } from '../../../content/practiceTexts'
import { recordPractice } from '../../../storage/progress'
import { useSettings } from '../../../store/settings'
import { XpGain } from '../../Game/Celebration'
import { play } from '../../sound'
import { StatsBar } from '../../Trainer/StatsBar'
import { Trainer } from '../../Trainer/Trainer'
import t_ from '../../Trainer/Trainer.module.css'
import { ViewToggles } from '../../Trainer/ViewToggles'
import { useAnnounceRewards } from '../../useAnnounceRewards'
import s from './PracticeScreen.module.css'

const CUSTOM = 'custom'

export function PracticeScreen() {
  const { t } = useTranslation()
  const settings = useSettings()
  const layout = layouts[settings.keyboardLayout]
  const texts = practiceTexts[layout.id]

  const [textId, setTextId] = useState(texts[0].id)
  const [customDraft, setCustomDraft] = useState('')
  const [custom, setCustom] = useState<{ text: string; removed: string[] }>()
  const [result, setResult] = useState<{ m: Metrics; xp?: number }>()
  const announce = useAnnounceRewards()
  // Растёт при «Ещё раз» — пересоздаёт тренажёр с тем же текстом
  const [attempt, setAttempt] = useState(0)

  const selected = texts.find((x) => x.id === textId)
  const text = textId === CUSTOM ? (custom?.text ?? '') : (selected?.text ?? texts[0].text)

  function changeLayout(id: LayoutId) {
    settings.set({ keyboardLayout: id })
    setTextId(practiceTexts[id][0].id)
    setCustom(undefined)
    setResult(undefined)
  }

  function changeText(id: string) {
    setTextId(id)
    setResult(undefined)
  }

  function nextText() {
    if (textId === CUSTOM) setCustom(undefined)
    else {
      const i = texts.findIndex((x) => x.id === textId)
      setTextId(texts[(i + 1) % texts.length].id)
    }
    setResult(undefined)
  }

  function again() {
    setAttempt((a) => a + 1)
    setResult(undefined)
  }

  return (
    <section className={s.screen}>
      <h1 style={{ margin: 0 }}>{t('nav.practice')}</h1>
      <div className={s.toolbar}>
        <label>
          {t('practice.layout')}{' '}
          <select value={layout.id} onChange={(e) => changeLayout(e.target.value as LayoutId)}>
            {Object.values(layouts).map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          {t('practice.text')}{' '}
          <select value={textId} onChange={(e) => changeText(e.target.value)}>
            {texts.map((x) => (
              <option key={x.id} value={x.id}>
                {x.title}
              </option>
            ))}
            <option value={CUSTOM}>{t('practice.customText')}</option>
          </select>
        </label>
        <ViewToggles />
      </div>

      {result ? (
        <div className={t_.result}>
          <h2>{t('practice.done')}</h2>
          {settings.gamification && result.xp !== undefined && (
            <XpGain text={t('game.xpGained', { xp: result.xp })} animate={settings.animations} />
          )}
          <StatsBar m={result.m} />
          <div className={t_.actions}>
            <button className="btn btn-primary" onClick={again}>
              {t('practice.again')}
            </button>
            <button className="btn" onClick={nextText}>
              {t('practice.next')}
            </button>
          </div>
        </div>
      ) : textId === CUSTOM && !custom?.text ? (
        <div className={s.custom}>
          <textarea
            value={customDraft}
            placeholder={t('practice.customPlaceholder')}
            onChange={(e) => setCustomDraft(e.target.value)}
          />
          <div>
            <button
              className="btn btn-primary"
              disabled={!customDraft.trim()}
              onClick={() => setCustom(normalizeText(customDraft, layout))}
            >
              {t('practice.start')}
            </button>
          </div>
        </div>
      ) : (
        <>
          {textId === CUSTOM && custom && custom.removed.length > 0 && (
            <p className={t_.hint}>
              {t('practice.removedChars', { chars: custom.removed.join(' ') })}
            </p>
          )}
          <Trainer
            key={`${layout.id}:${text}:${settings.stopOnError}:${attempt}`}
            text={text}
            layout={layout}
            onFinish={async (session, m) => {
              setResult({ m })
              play('success')
              const rewards = await recordPractice(layout.id, session, m)
              setResult({ m, xp: rewards.xp })
              announce(rewards)
            }}
          />
        </>
      )}
    </section>
  )
}
