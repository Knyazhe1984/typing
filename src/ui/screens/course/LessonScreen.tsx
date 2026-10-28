import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { findLesson } from '../../../content/course'
import { exerciseText } from '../../../core/course/exercises'
import type { Course, Lesson } from '../../../core/course/types'
import { combinedMetrics, type Metrics, type Session } from '../../../core/engine/session'
import { createRng } from '../../../core/generator/random'
import { layouts } from '../../../core/layouts'
import { defaultThresholds, starsFor } from '../../../core/progress/stars'
import type { LessonProgress } from '../../../storage/db'
import { completeTheoryLesson, recordLesson, type Rewards } from '../../../storage/progress'
import { useSettings } from '../../../store/settings'
import { AnimatedStars, Confetti, XpGain } from '../../Game/Celebration'
import { play } from '../../sound'
import { useAnnounceRewards } from '../../useAnnounceRewards'
import { TheoryView } from '../../Theory/TheoryView'
import { StatsBar } from '../../Trainer/StatsBar'
import { Trainer } from '../../Trainer/Trainer'
import t_ from '../../Trainer/Trainer.module.css'
import { ViewToggles } from '../../Trainer/ViewToggles'
import { useL10n } from '../../useL10n'
import s from './CourseScreen.module.css'

type Phase =
  | { type: 'theory'; page: number }
  | { type: 'exercises'; index: number; texts: string[]; sessions: Session[] }
  | { type: 'result'; m: Metrics; stars: number; prev?: LessonProgress; rewards: Rewards }

/** Ключ по id урока: при переходе к следующему уроку состояние начинается заново. */
export function LessonRoute() {
  const { lessonId = '' } = useParams()
  const { t } = useTranslation()
  const found = findLesson(lessonId)
  if (!found) return <p>{t('lesson.notFound')}</p>
  return <LessonScreen key={lessonId} course={found.course} lesson={found.lesson} />
}

function generateTexts(lesson: Lesson, course: Course) {
  const rng = createRng(Math.floor(Math.random() * 2 ** 32))
  return (lesson.exercises ?? []).map((ex) => exerciseText(ex, lesson, course, rng))
}

function LessonScreen({ course, lesson }: { course: Course; lesson: Lesson }) {
  const { t } = useTranslation()
  const l = useL10n()
  const navigate = useNavigate()
  const stopOnError = useSettings((st) => st.stopOnError)
  const layout = layouts[lesson.layout]
  const theory = lesson.theory ?? []
  const hasExercises = !!lesson.exercises?.length
  const nextLesson = course.lessons[lesson.index + 1]
  const thresholds = lesson.thresholds ?? defaultThresholds
  const announce = useAnnounceRewards()

  const [phase, setPhase] = useState<Phase>(() =>
    theory.length
      ? { type: 'theory', page: 0 }
      : { type: 'exercises', index: 0, texts: generateTexts(lesson, course), sessions: [] },
  )

  function startExercises() {
    setPhase({ type: 'exercises', index: 0, texts: generateTexts(lesson, course), sessions: [] })
  }

  async function finishTheory() {
    announce({ achievements: await completeTheoryLesson(lesson.id) })
    navigate(nextLesson ? `/course/${nextLesson.id}` : '/course')
  }

  async function onExerciseDone(session: Session) {
    if (phase.type !== 'exercises') return
    const sessions = [...phase.sessions, session]
    if (sessions.length < phase.texts.length) {
      setPhase({ ...phase, index: phase.index + 1, sessions })
      return
    }
    const m = combinedMetrics(sessions)
    const stars = starsFor(m, thresholds)
    const { prev, rewards } = await recordLesson(lesson.id, lesson.layout, sessions, m, stars)
    play(stars > 0 ? 'success' : 'fail')
    setPhase({ type: 'result', m, stars, prev, rewards })
    announce(rewards)
  }

  return (
    <section className={s.screen}>
      <div style={{ display: 'flex', gap: 16, alignItems: 'baseline', flexWrap: 'wrap' }}>
        <Link to="/course">← {t('lesson.toCourse')}</Link>
        <span className={s.meta}>{t('course.lesson', { n: lesson.index })}</span>
      </div>
      <h1 style={{ margin: 0 }}>{l(lesson.title)}</h1>

      {phase.type === 'theory' && (
        <>
          <TheoryView page={theory[phase.page]} lesson={lesson} />
          <div className={t_.actions}>
            {phase.page > 0 && (
              <button className="btn" onClick={() => setPhase({ ...phase, page: phase.page - 1 })}>
                {t('lesson.back')}
              </button>
            )}
            {phase.page < theory.length - 1 ? (
              <button
                className="btn btn-primary"
                onClick={() => setPhase({ ...phase, page: phase.page + 1 })}
              >
                {t('lesson.next')}
              </button>
            ) : hasExercises ? (
              <button className="btn btn-primary" onClick={startExercises}>
                {t('lesson.toExercises')}
              </button>
            ) : (
              <button className="btn btn-primary" onClick={finishTheory}>
                {t('lesson.finishTheory')}
              </button>
            )}
          </div>
        </>
      )}

      {phase.type === 'exercises' && (
        <>
          <div
            className={s.toolbar}
            style={{ display: 'flex', gap: '12px 20px', flexWrap: 'wrap' }}
          >
            <strong style={{ color: 'var(--text)' }}>
              {t('lesson.exercise', { n: phase.index + 1, total: phase.texts.length })}
            </strong>
            <ViewToggles />
          </div>
          <Trainer
            key={`${phase.index}:${phase.texts[phase.index]}:${stopOnError}`}
            text={phase.texts[phase.index]}
            layout={layout}
            enabledChars={new Set(lesson.keys)}
            onFinish={(session) => void onExerciseDone(session)}
          />
        </>
      )}

      {phase.type === 'result' && (
        <Result
          phase={phase}
          minAccuracy={thresholds.accuracy[0]}
          nextStar={
            phase.stars === 1
              ? { acc: thresholds.accuracy[1], cpm: thresholds.cpm[0] }
              : phase.stars === 2
                ? { acc: thresholds.accuracy[2], cpm: thresholds.cpm[1] }
                : undefined
          }
          onRetry={startExercises}
          nextLessonId={phase.stars > 0 ? nextLesson?.id : undefined}
        />
      )}
    </section>
  )
}

interface ResultProps {
  phase: Extract<Phase, { type: 'result' }>
  minAccuracy: number
  nextStar?: { acc: number; cpm: number }
  nextLessonId?: string
  onRetry: () => void
}

function Result({ phase, minAccuracy, nextStar, nextLessonId, onRetry }: ResultProps) {
  const { t } = useTranslation()
  const { gamification, animations } = useSettings()
  const { m, stars, prev, rewards } = phase
  const passed = stars > 0
  const newBest = passed && !!prev && (stars > prev.bestStars || m.cpm > prev.bestCpm)
  const pct = (x: number) => Math.round(x * 100)
  return (
    <div className={t_.result} style={{ borderColor: passed ? 'var(--ok)' : 'var(--error)' }}>
      {gamification && animations && stars === 3 && <Confetti />}
      <h2>{passed ? t('lesson.resultTitle') : t('lesson.failedTitle')}</h2>
      {gamification && (
        <>
          <AnimatedStars count={stars} animate={animations} />
          <XpGain text={t('game.xpGained', { xp: rewards.xp })} animate={animations} />
        </>
      )}
      {newBest && <strong style={{ color: 'var(--ok)' }}>{t('lesson.newBest')}</strong>}
      <StatsBar m={m} />
      {!passed && <p className={t_.hint}>{t('lesson.failedHint', { min: pct(minAccuracy) })}</p>}
      {passed && gamification && nextStar && (
        <p className={t_.hint}>
          {t('lesson.nextStar', { acc: pct(nextStar.acc), cpm: nextStar.cpm })}
        </p>
      )}
      <div className={t_.actions}>
        {nextLessonId && (
          <Link to={`/course/${nextLessonId}`} className="btn btn-primary">
            {t('lesson.nextLesson')}
          </Link>
        )}
        <button className={nextLessonId ? 'btn' : 'btn btn-primary'} onClick={onRetry}>
          {t('lesson.retry')}
        </button>
        <Link to="/course" className="btn">
          {t('lesson.toCourse')}
        </Link>
      </div>
    </div>
  )
}
