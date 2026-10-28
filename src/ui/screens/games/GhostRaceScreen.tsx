import { useLiveQuery } from 'dexie-react-hooks'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { practiceTexts } from '../../../content/practiceTexts'
import type { Metrics, Session } from '../../../core/engine/session'
import { ghostPosition, paceTimeline, timelineFromProgress } from '../../../core/games/ghost'
import { layouts, type LayoutId } from '../../../core/layouts'
import { db } from '../../../storage/db'
import { recordGame } from '../../../storage/progress'
import { useSettings } from '../../../store/settings'
import { Confetti, XpGain } from '../../Game/Celebration'
import { useTicker } from '../../hooks/useTypingSession'
import { play } from '../../sound'
import { StatsBar } from '../../Trainer/StatsBar'
import { Trainer } from '../../Trainer/Trainer'
import t_ from '../../Trainer/Trainer.module.css'
import { ViewToggles } from '../../Trainer/ViewToggles'
import { useAnnounceRewards } from '../../useAnnounceRewards'
import s from './Games.module.css'

/** Скорость соперника-тренера, пока своего призрака нет */
const DEFAULT_PACE = 100
const MIN_ACCURACY = 0.9

interface Opponent {
  timeline: number[]
  cpm: number
  isGhost: boolean
}

interface Race {
  startedAt: number | null
  position: number
  /** Соперник фиксируется на старте: сохранённый после заезда призрак не должен его подменить */
  opponent?: Opponent
}

interface Result {
  m: Metrics
  /** На сколько мс быстрее соперника; отрицательное — медленнее */
  marginMs: number
  hadGhost: boolean
  saved: boolean
  xp?: number
}

export function GhostRaceScreen() {
  const { t } = useTranslation()
  const settings = useSettings()
  const layout = layouts[settings.keyboardLayout]
  const texts = practiceTexts[layout.id]
  const [textId, setTextId] = useState(texts[2]?.id ?? texts[0].id)
  const text = (texts.find((x) => x.id === textId) ?? texts[0]).text
  const [attempt, setAttempt] = useState(0)
  const [result, setResult] = useState<Result>()
  const [race, setRace] = useState<Race>({ startedAt: null, position: 0 })
  const progress = useRef<{ position: number; at: number }[]>([])
  const announce = useAnnounceRewards()

  const ghost = useLiveQuery(
    async () => (await db.ghosts.get([layout.id, textId])) ?? null,
    [layout.id, textId],
  )
  // Тренер едет со средней скоростью последних хороших попыток
  const pace = useLiveQuery(async () => {
    const recent = (
      await db.sessions
        .orderBy('finishedAt')
        .filter((x) => x.layout === layout.id && x.accuracy >= MIN_ACCURACY && x.chars >= 30)
        .toArray()
    ).slice(-10)
    if (!recent.length) return DEFAULT_PACE
    return Math.max(40, Math.round(recent.reduce((a, x) => a + x.cpm, 0) / recent.length))
  }, [layout.id])

  const live: Opponent = ghost
    ? { timeline: ghost.timeline, cpm: ghost.cpm, isGhost: true }
    : {
        timeline: paceTimeline(text.length, pace ?? DEFAULT_PACE),
        cpm: pace ?? DEFAULT_PACE,
        isGhost: false,
      }
  const rival = race.opponent ?? live
  const opponent = rival.timeline
  const running = race.startedAt !== null && !result
  const now = useTicker(running, 100)
  const elapsed = race.startedAt === null ? 0 : now - race.startedAt
  const opponentPos = result
    ? Math.min(opponent.length, ghostPosition(opponent, result.m.elapsedMs))
    : ghostPosition(opponent, elapsed)

  function reset(nextTextId = textId) {
    progress.current = []
    setRace({ startedAt: null, position: 0 })
    setResult(undefined)
    setTextId(nextTextId)
    setAttempt((a) => a + 1)
  }

  function onProgress(session: Session) {
    const startedAt = session.startedAt ?? performance.now()
    progress.current.push({ position: session.position, at: performance.now() - startedAt })
    setRace((r) => ({ startedAt, position: session.position, opponent: r.opponent ?? live }))
  }

  async function onFinish(session: Session, m: Metrics) {
    const timeline = timelineFromProgress(text.length, progress.current)
    const opponentMs = opponent[opponent.length - 1]
    const marginMs = opponentMs - m.elapsedMs
    const faster = marginMs > 0
    // Призраком становится только быстрый и аккуратный заезд
    const hadGhost = rival.isGhost
    const saved = (!hadGhost || faster) && m.accuracy >= MIN_ACCURACY
    const won = hadGhost && faster
    setResult({ m, marginMs, hadGhost, saved })
    play(faster ? 'success' : 'fail')
    if (saved) {
      await db.ghosts.put({
        layout: layout.id,
        textId,
        timeline,
        cpm: m.cpm,
        recordedAt: Date.now(),
      })
    }
    const rewards = await recordGame({
      game: 'ghost',
      layout: layout.id,
      chars: text.length,
      keystrokes: session.keystrokes,
      m,
      won,
    })
    setResult({ m, marginMs, hadGhost, saved, xp: rewards.xp })
    announce(rewards)
  }

  const seconds = (ms: number) => (Math.abs(ms) / 1000).toFixed(1)
  const opponentName = rival.isGhost ? t('games.ghost.ghost') : t('games.ghost.pacer')
  const youPct = race.position / text.length
  const opponentPct = opponentPos / text.length

  return (
    <section className={s.screen}>
      <p style={{ margin: 0 }}>
        <Link to="/games">← {t('games.title')}</Link>
      </p>
      <h1 style={{ margin: 0 }}>{t('games.ghost.title')}</h1>
      <div className={s.toolbar}>
        <label>
          {t('practice.layout')}{' '}
          <select
            value={layout.id}
            disabled={running}
            onChange={(e) => {
              const id = e.target.value as LayoutId
              settings.set({ keyboardLayout: id })
              reset(practiceTexts[id][2]?.id ?? practiceTexts[id][0].id)
            }}
          >
            {Object.values(layouts).map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          {t('practice.text')}{' '}
          <select value={textId} disabled={running} onChange={(e) => reset(e.target.value)}>
            {texts.map((x) => (
              <option key={x.id} value={x.id}>
                {x.title}
              </option>
            ))}
          </select>
        </label>
        <ViewToggles />
      </div>

      <div className={s.track}>
        <p className={t_.hint} style={{ margin: 0 }}>
          {rival.isGhost
            ? t('games.ghost.vsGhost', { cpm: Math.round(rival.cpm) })
            : t('games.ghost.vsPacer', { cpm: rival.cpm })}
        </p>
        <Lane name={t('games.ghost.you')} pct={youPct} />
        <Lane name={opponentName} pct={opponentPct} ghost />
      </div>

      {result ? (
        <div className={t_.result}>
          {result.marginMs > 0 && settings.animations && <Confetti />}
          <p className={s.raceResult}>
            {result.marginMs > 0
              ? t(result.hadGhost ? 'games.ghost.wonGhost' : 'games.ghost.wonPacer', {
                  s: seconds(result.marginMs),
                })
              : t('games.ghost.lost', { name: opponentName, s: seconds(result.marginMs) })}
          </p>
          {result.saved && <p className={t_.hint}>{t('games.ghost.saved')}</p>}
          {!result.saved && result.m.accuracy < MIN_ACCURACY && (
            <p className={t_.hint}>{t('games.ghost.lowAccuracy')}</p>
          )}
          {settings.gamification && result.xp !== undefined && (
            <XpGain text={t('game.xpGained', { xp: result.xp })} animate={settings.animations} />
          )}
          <StatsBar m={result.m} />
          <div className={t_.actions}>
            <button className="btn btn-primary" onClick={() => reset()}>
              {t('games.playAgain')}
            </button>
          </div>
        </div>
      ) : (
        <Trainer
          key={`${layout.id}:${textId}:${settings.stopOnError}:${attempt}`}
          text={text}
          layout={layout}
          onProgress={onProgress}
          onFinish={onFinish}
        />
      )}
    </section>
  )
}

function Lane({ name, pct, ghost }: { name: string; pct: number; ghost?: boolean }) {
  return (
    <div className={s.lane}>
      <span>{name}</span>
      <div
        className={s.laneBar}
        role="progressbar"
        aria-label={name}
        aria-valuenow={Math.round(pct * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={ghost ? `${s.laneFill} ${s.ghostFill}` : s.laneFill}
          style={{ width: `${Math.min(1, pct) * 100}%` }}
        />
      </div>
      <span className={s.lanePct}>{Math.round(Math.min(1, pct) * 100)}%</span>
    </div>
  )
}
