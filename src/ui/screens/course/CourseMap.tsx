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

/** Точка узла: x в процентах ширины, y в пикселях — тропинка виляет из стороны в сторону. */
const point = (i: number) => ({ x: 50 + 30 * Math.sin(i * 1.2), y: TOP + i * ROW })

interface Props {
  course: Course
  progress: Map<string, LessonProgress>
}

export function CourseMap({ course, progress }: Props) {
  const { t } = useTranslation()
  const l = useL10n()
  const { gamification, animations } = useSettings()
  const lessons = course.lessons
  const height = TOP + (lessons.length - 1) * ROW + 110
  const current = lessons.findIndex((x) => !progress.get(x.id)?.completed)
  const points = lessons.map((_, i) => point(i))
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
        return unlocked ? (
          <Link
            key={lesson.id}
            to={`/course/${lesson.id}`}
            className={cls.join(' ')}
            style={style}
            aria-label={`${t('course.lesson', { n: i })}: ${l(lesson.title)}`}
          >
            {content}
          </Link>
        ) : (
          <div key={lesson.id} className={cls.join(' ')} style={style} title={t('course.locked')}>
            {content}
          </div>
        )
      })}
    </div>
  )
}
