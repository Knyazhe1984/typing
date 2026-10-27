import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { courses } from '../../../content/course'
import { layouts, type LayoutId } from '../../../core/layouts'
import { useSettings } from '../../../store/settings'
import { Stars } from '../../Stars'
import { isUnlocked, useProgressMap } from '../../useProgress'
import { useL10n } from '../../useL10n'
import s from './CourseScreen.module.css'

export function CourseScreen() {
  const { t } = useTranslation()
  const l = useL10n()
  const { keyboardLayout, set } = useSettings()
  const course = courses[keyboardLayout]
  const progress = useProgressMap()

  return (
    <section className={s.screen}>
      <h1 style={{ margin: 0 }}>{t('nav.course')}</h1>
      <label className={s.toolbar}>
        {t('practice.layout')}{' '}
        <select
          value={keyboardLayout}
          onChange={(e) => set({ keyboardLayout: e.target.value as LayoutId })}
        >
          {Object.values(layouts).map((x) => (
            <option key={x.id} value={x.id}>
              {x.name}
            </option>
          ))}
        </select>
      </label>
      <ol className={s.list}>
        {course.lessons.map((lesson, i) => {
          const p = progress.get(lesson.id)
          const unlocked = isUnlocked(course.lessons, i, progress)
          const isTheory = !lesson.exercises?.length
          const content = (
            <>
              <span className={s.number}>{t('course.lesson', { n: i })}</span>
              <span className={s.title}>{l(lesson.title)}</span>
              {p && p.bestCpm > 0 && (
                <span className={s.meta}>{t('course.best', { cpm: Math.round(p.bestCpm) })}</span>
              )}
              {isTheory ? (
                <span className={s.meta}>
                  {t('course.theoryOnly')} {p?.completed ? '✓' : ''}
                </span>
              ) : (
                <Stars count={p?.bestStars ?? 0} />
              )}
            </>
          )
          return (
            <li key={lesson.id}>
              {unlocked ? (
                <Link to={`/course/${lesson.id}`} className={s.item}>
                  {content}
                </Link>
              ) : (
                <div className={`${s.item} ${s.locked}`} title={t('course.locked')}>
                  {content}
                </div>
              )}
            </li>
          )
        })}
      </ol>
    </section>
  )
}
