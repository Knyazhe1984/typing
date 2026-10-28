import { useTranslation } from 'react-i18next'
import { courses } from '../../../content/course'
import { layouts, type LayoutId } from '../../../core/layouts'
import { useSettings } from '../../../store/settings'
import { useProgressMap } from '../../useProgress'
import { CourseMap } from './CourseMap'
import s from './CourseScreen.module.css'

export function CourseScreen() {
  const { t } = useTranslation()
  const { keyboardLayout, set } = useSettings()
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
      <CourseMap course={courses[keyboardLayout]} progress={progress} />
    </section>
  )
}
