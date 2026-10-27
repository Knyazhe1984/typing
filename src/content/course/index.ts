import type { Course } from '../../core/course/types'
import type { LayoutId } from '../../core/layouts'
import { enCourse } from './en'
import { ruCourse } from './ru'

export const courses: Record<LayoutId, Course> = { ru: ruCourse, en: enCourse }

export function findLesson(id: string) {
  for (const course of Object.values(courses)) {
    const lesson = course.lessons.find((l) => l.id === id)
    if (lesson) return { course, lesson }
  }
  return undefined
}
