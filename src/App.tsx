import { useEffect } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import i18n from './i18n'
import { useSettings } from './store/settings'
import { Layout } from './ui/Layout/Layout'
import { HomeScreen } from './ui/screens/HomeScreen'
import { PlaceholderScreen } from './ui/screens/PlaceholderScreen'
import { SettingsScreen } from './ui/screens/SettingsScreen'
import { CourseScreen } from './ui/screens/course/CourseScreen'
import { LessonRoute } from './ui/screens/course/LessonScreen'
import { PracticeScreen } from './ui/screens/practice/PracticeScreen'

// HashRouter: GitHub Pages не умеет отдавать index.html на произвольные пути.
export default function App() {
  const uiLanguage = useSettings((s) => s.uiLanguage)
  const theme = useSettings((s) => s.theme)

  useEffect(() => {
    i18n.changeLanguage(uiLanguage)
    document.documentElement.lang = uiLanguage
  }, [uiLanguage])

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'system') root.removeAttribute('data-theme')
    else root.dataset.theme = theme
  }, [theme])

  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomeScreen />} />
          <Route path="course" element={<CourseScreen />} />
          <Route path="course/:lessonId" element={<LessonRoute />} />
          <Route path="practice" element={<PracticeScreen />} />
          <Route path="stats" element={<PlaceholderScreen titleKey="nav.stats" />} />
          <Route path="settings" element={<SettingsScreen />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
