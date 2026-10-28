import { useTranslation } from 'react-i18next'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { useSettings } from '../../store/settings'
import { HeaderStats } from '../Game/GameWidgets'
import { Toasts } from '../Toasts/Toasts'
import { useGameStats } from '../useGameStats'
import s from './Layout.module.css'

const links = [
  { to: '/course', key: 'nav.course' },
  { to: '/practice', key: 'nav.practice' },
  { to: '/achievements', key: 'nav.achievements', game: true },
  { to: '/stats', key: 'nav.stats' },
  { to: '/settings', key: 'nav.settings' },
]

export function Layout() {
  const { t } = useTranslation()
  const gamification = useSettings((st) => st.gamification)
  const stats = useGameStats()
  return (
    <>
      <header className={s.header}>
        <Link to="/" className={s.logo}>
          ⌨ {t('app.title')}
        </Link>
        <nav className={s.nav}>
          {links
            .filter((l) => gamification || !l.game)
            .map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) => (isActive ? `${s.link} ${s.active}` : s.link)}
              >
                {t(l.key)}
              </NavLink>
            ))}
        </nav>
        {gamification && stats && <HeaderStats stats={stats} />}
      </header>
      <main className={s.main}>
        <Outlet />
      </main>
      <Toasts />
    </>
  )
}
