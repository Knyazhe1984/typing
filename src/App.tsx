import { useEffect } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import i18n from './i18n'
import { useSettings } from './store/settings'
import { Layout } from './ui/Layout/Layout'
import { HomeScreen } from './ui/screens/HomeScreen'
import { SettingsScreen } from './ui/screens/SettingsScreen'
import { StatsScreen } from './ui/screens/StatsScreen'
import { AchievementsScreen } from './ui/screens/AchievementsScreen'
import { CourseScreen } from './ui/screens/course/CourseScreen'
import { LessonRoute } from './ui/screens/course/LessonScreen'
import { PracticeScreen } from './ui/screens/practice/PracticeScreen'
import { FallingWordsScreen } from './ui/screens/games/FallingWordsScreen'
import { GamesScreen } from './ui/screens/games/GamesScreen'
import { GhostRaceScreen } from './ui/screens/games/GhostRaceScreen'

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
          <Route path="games" element={<GamesScreen />} />
          <Route path="games/falling" element={<FallingWordsScreen />} />
          <Route path="games/ghost" element={<GhostRaceScreen />} />
          <Route path="achievements" element={<AchievementsScreen />} />
          <Route path="stats" element={<StatsScreen />} />
          <Route path="settings" element={<SettingsScreen />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
