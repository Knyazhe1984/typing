import { useTranslation } from 'react-i18next'
import { Link, NavLink, Outlet } from 'react-router-dom'
import s from './Layout.module.css'

const links = [
  { to: '/course', key: 'nav.course' },
  { to: '/practice', key: 'nav.practice' },
  { to: '/stats', key: 'nav.stats' },
  { to: '/settings', key: 'nav.settings' },
]

export function Layout() {
  const { t } = useTranslation()
  return (
    <>
      <header className={s.header}>
        <Link to="/" className={s.logo}>
          ⌨ {t('app.title')}
        </Link>
        <nav className={s.nav}>
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) => (isActive ? `${s.link} ${s.active}` : s.link)}
            >
              {t(l.key)}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className={s.main}>
        <Outlet />
      </main>
    </>
  )
}
