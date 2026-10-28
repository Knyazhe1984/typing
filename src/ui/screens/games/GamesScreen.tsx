import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import s from './Games.module.css'

/** Маленькие картинки к играм — чистый SVG, без файлов. */
function FallingArt() {
  const words = [
    { x: 20, y: 18, w: 46 },
    { x: 120, y: 46, w: 60 },
    { x: 210, y: 10, w: 40 },
  ]
  return (
    <svg
      className={s.cardArt}
      viewBox="0 0 280 90"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {words.map((w) => (
        <rect
          key={w.x}
          x={w.x}
          y={w.y}
          width={w.w}
          height={18}
          rx={5}
          fill="var(--surface)"
          stroke="var(--border)"
        />
      ))}
      <rect x={120} y={46} width={24} height={18} rx={5} fill="var(--accent)" opacity={0.35} />
      <rect x={0} y={86} width={280} height={4} fill="var(--error)" opacity={0.6} />
    </svg>
  )
}

function GhostArt() {
  return (
    <svg
      className={s.cardArt}
      viewBox="0 0 280 90"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <rect
        x={20}
        y={26}
        width={240}
        height={10}
        rx={5}
        fill="var(--surface)"
        stroke="var(--border)"
      />
      <rect x={20} y={26} width={170} height={10} rx={5} fill="var(--accent)" />
      <rect
        x={20}
        y={54}
        width={240}
        height={10}
        rx={5}
        fill="var(--surface)"
        stroke="var(--border)"
      />
      <rect x={20} y={54} width={140} height={10} rx={5} fill="var(--text-muted)" opacity={0.6} />
    </svg>
  )
}

export function GamesScreen() {
  const { t } = useTranslation()
  return (
    <section className={s.screen}>
      <h1 style={{ margin: 0 }}>{t('games.title')}</h1>
      <div className={s.cards}>
        <Link to="/games/falling" className={s.card}>
          <FallingArt />
          <h2>{t('games.falling.title')}</h2>
          <p>{t('games.falling.description')}</p>
        </Link>
        <Link to="/games/ghost" className={s.card}>
          <GhostArt />
          <h2>{t('games.ghost.title')}</h2>
          <p>{t('games.ghost.description')}</p>
        </Link>
      </div>
    </section>
  )
}
