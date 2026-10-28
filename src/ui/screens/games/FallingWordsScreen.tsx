import { useLiveQuery } from 'dexie-react-hooks'
import { useEffect, useEffectEvent, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { courses } from '../../../content/course'
import {
  createFalling,
  fallingDictionary,
  level,
  LIVES,
  stepFalling,
  typeFalling,
  type Difficulty,
  type FallingState,
} from '../../../core/games/falling'
import { createRng } from '../../../core/generator/random'
import { isWrongLayout, layouts, type LayoutId } from '../../../core/layouts'
import { db } from '../../../storage/db'
import { recordGame } from '../../../storage/progress'
import { useSettings } from '../../../store/settings'
import { XpGain } from '../../Game/Celebration'
import { play } from '../../sound'
import { useAnnounceRewards } from '../../useAnnounceRewards'
import t_ from '../../Trainer/Trainer.module.css'
import s from './Games.module.css'

const difficulties: Difficulty[] = ['easy', 'normal', 'hard']

interface Result {
  score: number
  prevBest: number
  xp?: number
}

export function FallingWordsScreen() {
  const { t } = useTranslation()
  const settings = useSettings()
  const layout = layouts[settings.keyboardLayout]
  const [difficulty, setDifficulty] = useState<Difficulty>('normal')
  const [game, setGame] = useState<FallingState>()
  const [paused, setPaused] = useState(false)
  const [wrongLayout, setWrongLayout] = useState(false)
  const [result, setResult] = useState<Result>()
  const announce = useAnnounceRewards()
  const rng = useRef(createRng(1))
  const bestAtStart = useRef(0)

  const dictionary = useMemo(
    () => fallingDictionary(courses[layout.id].dictionary, difficulty),
    [layout.id, difficulty],
  )
  const best = useLiveQuery(async () => {
    let max = 0
    await db.sessions
      .where('lessonId')
      .equals('game:falling')
      .each((x) => {
        if (x.layout === layout.id) max = Math.max(max, x.score ?? 0)
      })
    return max
  }, [layout.id])

  const playing = !!game && !game.over

  function start() {
    rng.current = createRng(Math.floor(Math.random() * 2 ** 32))
    bestAtStart.current = best ?? 0
    setResult(undefined)
    setPaused(false)
    setWrongLayout(false)
    setGame(createFalling(difficulty))
  }

  // Игровой цикл: шаг на каждый кадр; после паузы вкладки шаг не больше 100 мс
  useEffect(() => {
    if (!playing || paused) return
    let last = performance.now()
    let id = requestAnimationFrame(function frame(now) {
      const dt = Math.min(100, now - last)
      last = now
      setGame((g) => g && stepFalling(g, dt, dictionary, rng.current))
      id = requestAnimationFrame(frame)
    })
    return () => cancelAnimationFrame(id)
  }, [playing, paused, dictionary])

  useEffect(() => {
    if (!playing) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.repeat || e.ctrlKey || e.metaKey || e.altKey) return
      if (e.key === 'Escape') {
        setPaused((p) => !p)
        return
      }
      if (e.key.length !== 1) return
      const el = e.target as HTMLElement
      if (el !== document.body) el.blur()
      e.preventDefault()
      if (paused) {
        setPaused(false)
        return
      }
      if (e.key === ' ') return
      if (isWrongLayout(layout, e.key)) {
        setWrongLayout(true)
        return
      }
      setWrongLayout(false)
      setGame((g) => g && typeFalling(g, e.key))
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [playing, paused, layout])

  // Звуки по изменению счётчиков
  const errors = game?.keystrokes.filter((k) => !k.correct).length ?? 0
  useEffect(() => {
    if (errors) play('error')
  }, [errors])
  useEffect(() => {
    if (game?.correctChars) play('key')
  }, [game?.correctChars])
  useEffect(() => {
    if (game?.destroyed) play('star')
  }, [game?.destroyed])
  useEffect(() => {
    if (game?.missed) play('fail')
  }, [game?.missed])

  const finish = useEffectEvent(async (g: FallingState) => {
    const prevBest = bestAtStart.current
    setResult({ score: g.score, prevBest })
    const minutes = g.elapsedMs / 60000
    const keystrokes = g.keystrokes.length
    const errorCount = g.keystrokes.filter((k) => !k.correct).length
    const cpm = minutes > 0 ? g.correctChars / minutes : 0
    const rewards = await recordGame({
      game: 'falling',
      layout: layout.id,
      chars: g.correctChars,
      keystrokes: g.keystrokes,
      score: g.score,
      m: {
        elapsedMs: g.elapsedMs,
        cpm,
        wpm: cpm / 5,
        accuracy: keystrokes ? 1 - errorCount / keystrokes : 1,
        errors: errorCount,
      },
    })
    setResult({ score: g.score, prevBest, xp: rewards.xp })
    announce(rewards)
  })
  const over = !!game?.over
  useEffect(() => {
    if (over && game) finish(game)
    // game меняется после окончания только здесь, поэтому достаточно over
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [over])

  return (
    <section className={s.screen}>
      <p style={{ margin: 0 }}>
        <Link to="/games">← {t('games.title')}</Link>
      </p>
      <h1 style={{ margin: 0 }}>{t('games.falling.title')}</h1>

      {!playing && (
        <div className={s.toolbar}>
          <label>
            {t('practice.layout')}{' '}
            <select
              value={layout.id}
              onChange={(e) => settings.set({ keyboardLayout: e.target.value as LayoutId })}
            >
              {Object.values(layouts).map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            {t('games.difficulty')}{' '}
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty)}
            >
              {difficulties.map((d) => (
                <option key={d} value={d}>
                  {t(`games.${d}`)}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}

      <div className={s.hud}>
        <span>
          {t('games.score')}: <strong data-testid="falling-score">{game?.score ?? 0}</strong>
        </span>
        <span>
          {t('games.level')}: <strong>{game ? level(game) : 1}</strong>
        </span>
        <span className={s.lives} aria-label={t('games.lives', { n: game?.lives ?? LIVES })}>
          {Array.from({ length: LIVES }, (_, i) => (
            <span key={i} className={i < (game?.lives ?? LIVES) ? undefined : s.livesLost}>
              ♥
            </span>
          ))}
        </span>
        <span>
          {t('games.best')}: <strong>{best ?? 0}</strong>
        </span>
      </div>
      {wrongLayout && (
        <p className={t_.warning}>{t('practice.wrongLayout', { layout: layout.name })}</p>
      )}

      <div className={s.arena} data-testid="falling-arena">
        {game?.words.map((w) => (
          <span
            key={w.id}
            className={w.id === game.target ? `${s.word} ${s.activeWord}` : s.word}
            style={{ left: `${w.x * 100}%`, top: `calc(${w.y} * (100% - 40px))` }}
          >
            <span className={s.typed}>{w.text.slice(0, w.typed)}</span>
            {w.text.slice(w.typed)}
          </span>
        ))}
        <div className={s.ground} />

        {!game && (
          <div className={s.overlay}>
            <p>{t('games.falling.rules')}</p>
            <button className="btn btn-primary" onClick={start}>
              {t('games.start')}
            </button>
          </div>
        )}
        {playing && paused && (
          <div className={s.overlay}>
            <h2>{t('games.paused')}</h2>
            <p>{t('games.resumeHint')}</p>
          </div>
        )}
        {game?.over && (
          <div className={s.overlay}>
            <h2>{t('games.over')}</h2>
            <span className={s.bigScore}>{game.score}</span>
            {result && result.score > result.prevBest && result.prevBest > 0 && (
              <p>{t('lesson.newBest')}</p>
            )}
            {settings.gamification && result?.xp !== undefined && (
              <XpGain text={t('game.xpGained', { xp: result.xp })} animate={settings.animations} />
            )}
            <button className="btn btn-primary" onClick={start}>
              {t('games.playAgain')}
            </button>
          </div>
        )}
      </div>
      {playing && !paused && <p className={t_.hint}>{t('games.pauseHint')}</p>}
    </section>
  )
}
