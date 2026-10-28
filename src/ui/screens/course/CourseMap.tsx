import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import type { Course } from '../../../core/course/types'
import type { LessonProgress } from '../../../storage/db'
import { useSettings } from '../../../store/settings'
import { BookIcon, CheckIcon, LockIcon } from '../../icons'
import { Stars } from '../../Stars'
import { isUnlocked } from '../../useProgress'
import { useL10n } from '../../useL10n'
import s from './CourseMap.module.css'

const ROW = 130
const TOP = 40
/** Дополнительный отступ перед заголовком раздела */
const SECTION = 70

/** Точки узлов: x в процентах ширины, y в пикселях — тропинка виляет из стороны в сторону. */
function layoutPoints(lessons: Course['lessons']) {
  let y = TOP
  return lessons.map((lesson, i) => {
    if (lesson.section) y += SECTION
    const p = { x: 50 + 30 * Math.sin(i * 1.2), y }
    y += ROW
    return p
  })
}

interface Props {
  course: Course
  progress: Map<string, LessonProgress>
}

export function CourseMap({ course, progress }: Props) {
  const { t } = useTranslation()
  const l = useL10n()
  const { gamification, animations } = useSettings()
  const lessons = course.lessons
  const current = lessons.findIndex((x) => !progress.get(x.id)?.completed)
  const points = layoutPoints(lessons)
  const height = points[points.length - 1].y + 110
  const currentRef = useRef<HTMLAnchorElement>(null)
  const scrolledTo = useRef<string>(undefined)

  // Длинный курс: при открытии карты сразу показываем текущий урок
  useEffect(() => {
    const el = currentRef.current
    if (!el || scrolledTo.current === course.layout || current < 3) return
    scrolledTo.current = course.layout
    el.scrollIntoView({ block: 'center' })
  }, [course.layout, current])
  const polyline = (pts: typeof points) => pts.map((p) => `${p.x},${p.y}`).join(' ')
  const doneUntil = current === -1 ? lessons.length : current + 1

  return (
    <div className={`${s.map} ${animations ? s.animated : ''}`} style={{ height }}>
      <svg className={s.path} viewBox={`0 0 100 ${height}`} preserveAspectRatio="none">
        <polyline
          points={polyline(points)}
          fill="none"
          stroke="var(--border)"
          strokeWidth={6}
          strokeDasharray="2 12"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        <polyline
          points={polyline(points.slice(0, doneUntil))}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={6}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {lessons.map((lesson, i) => {
        const p = progress.get(lesson.id)
        const unlocked = isUnlocked(lessons, i, progress)
        const isTheory = !lesson.exercises?.length
        const cls = [s.node]
        if (p?.completed) cls.push(s.done)
        else if (i === current) cls.push(s.current)
        if (!unlocked) cls.push(s.locked)
        const label = !unlocked ? (
          <LockIcon />
        ) : isTheory ? (
          <BookIcon />
        ) : p?.completed ? (
          <CheckIcon size={26} />
        ) : (
          i
        )
        const content = (
          <>
            <span className={s.circle}>{label}</span>
            <span className={s.caption}>
              <span className={s.title}>{l(lesson.title)}</span>
              {!isTheory && gamification && <Stars count={p?.bestStars ?? 0} size={16} />}
            </span>
          </>
        )
        const style = { left: `${points[i].x}%`, top: points[i].y }
        const heading = lesson.section && (
          <h2 key={`s-${lesson.id}`} className={s.section} style={{ top: points[i].y - 80 }}>
            {l(lesson.section)}
          </h2>
        )
        return unlocked
          ? [
              heading,
              <Link
                key={lesson.id}
                ref={i === current ? currentRef : undefined}
                to={`/course/${lesson.id}`}
                className={cls.join(' ')}
                style={style}
                aria-label={`${t('course.lesson', { n: i })}: ${l(lesson.title)}`}
              >
                {content}
              </Link>,
            ]
          : [
              heading,
              <div
                key={lesson.id}
                className={cls.join(' ')}
                style={style}
                title={t('course.locked')}
              >
                {content}
              </div>,
            ]
      })}
    </div>
  )
}
