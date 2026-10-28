import { useLiveQuery } from 'dexie-react-hooks'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { layouts, type KeyDef, type LayoutId } from '../../core/layouts'
import { heatLevel, physicalKeyStat, summarize } from '../../core/stats/summary'
import { weakKeys } from '../../core/stats/weakKeys'
import { db } from '../../storage/db'
import { useSettings } from '../../store/settings'
import { KeyboardView } from '../KeyboardView/KeyboardView'
import { LineChart } from '../Stats/LineChart'
import s from '../Stats/Stats.module.css'
import { useKeyStats } from '../useKeyStats'

type HeatMetric = 'errors' | 'speed'

const CHART_SESSIONS = 50
// Пороги ступеней тепловой карты: доля ошибок и средняя задержка, мс
const HEAT = {
  errors: [0.01, 0.03, 0.06, 0.1],
  speed: [200, 300, 400, 550],
}
const heatClass = [s.heat0, s.heat1, s.heat2, s.heat3, s.heat4, s.heat5]

const pct = (v: number) => `${Math.round(v * 100)}%`

export function StatsScreen() {
  const { t, i18n } = useTranslation()
  const { keyboardLayout, set } = useSettings()
  const [metric, setMetric] = useState<HeatMetric>('errors')
  const sessions = useLiveQuery(() => db.sessions.orderBy('finishedAt').toArray(), [])
  const keyStats = useKeyStats(keyboardLayout)
  const layout = layouts[keyboardLayout]

  if (!sessions || !keyStats) return null

  const summary = summarize(sessions)
  const recent = sessions.filter((x) => x.layout === keyboardLayout).slice(-CHART_SESSIONS)
  const date = new Intl.DateTimeFormat(i18n.language, { day: 'numeric', month: 'short' })
  const label = (at: number) => date.format(at)
  const minutes = Math.round(summary.totalMs / 60000)
  const weak = weakKeys(keyStats, 8)

  const accMin = Math.min(...recent.map((x) => x.accuracy), 0.9)
  const accDomain: [number, number] = [Math.floor(accMin * 20) / 20, 1]
  const cpmMax = Math.max(...recent.map((x) => x.cpm), 100)
  const cpmDomain: [number, number] = [0, Math.ceil(cpmMax / 50) * 50]

  const keyValue = (k: KeyDef) => {
    const st = physicalKeyStat(keyStats, k.base === k.shift ? [k.base] : [k.base, k.shift])
    if (!st || st.hits < 5 || k.code === 'Space') return undefined
    if (metric === 'errors') return st.errors / st.hits
    return st.latencyCount ? st.latencyMs / st.latencyCount : undefined
  }
  const format = (v: number) => (metric === 'errors' ? pct(v) : `${Math.round(v)} ${t('stats.ms')}`)
  const thresholds = HEAT[metric]
  const legend = [
    `< ${format(thresholds[0])}`,
    ...thresholds.slice(1).map((v, i) => `${format(thresholds[i])} – ${format(v)}`),
    `≥ ${format(thresholds[thresholds.length - 1])}`,
  ]

  return (
    <section className={s.screen}>
      <h1 style={{ margin: 0 }}>{t('nav.stats')}</h1>

      <div className={s.tiles}>
        <Tile
          value={
            minutes >= 60
              ? t('stats.hoursMinutes', { h: Math.floor(minutes / 60), m: minutes % 60 })
              : t('stats.minutes', { m: minutes })
          }
          label={t('stats.totalTime')}
        />
        <Tile
          value={summary.totalChars.toLocaleString(i18n.language)}
          label={t('stats.totalChars')}
        />
        <Tile value={String(summary.sessions)} label={t('stats.sessions')} />
        <Tile value={`${summary.bestCpm} ${t('practice.cpmUnit')}`} label={t('stats.bestSpeed')} />
        <Tile
          value={summary.sessions ? pct(summary.recentAccuracy) : '—'}
          label={t('stats.recentAccuracy')}
        />
      </div>

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

      {recent.length === 0 ? (
        <p className={s.muted}>{t('stats.empty')}</p>
      ) : (
        <div className={s.charts}>
          <div className={s.card}>
            <div className={s.cardHeader}>
              <h2>{t('stats.speedChart')}</h2>
              <p className={s.muted}>{t('stats.lastSessions', { count: recent.length })}</p>
            </div>
            <LineChart
              title={t('stats.speedChart')}
              points={recent.map((x) => ({ y: x.cpm, label: label(x.finishedAt) }))}
              domain={cpmDomain}
              format={(v) => String(Math.round(v))}
            />
          </div>
          <div className={s.card}>
            <div className={s.cardHeader}>
              <h2>{t('stats.accuracyChart')}</h2>
              <p className={s.muted}>{t('stats.lastSessions', { count: recent.length })}</p>
            </div>
            <LineChart
              title={t('stats.accuracyChart')}
              points={recent.map((x) => ({ y: x.accuracy, label: label(x.finishedAt) }))}
              domain={accDomain}
              format={pct}
            />
          </div>
        </div>
      )}

      <div className={s.card}>
        <div className={s.cardHeader}>
          <h2>{t('stats.heatmap')}</h2>
          <div className={s.segmented} role="group">
            {(['errors', 'speed'] as const).map((m) => (
              <button key={m} aria-pressed={metric === m} onClick={() => setMetric(m)}>
                {t(m === 'errors' ? 'stats.heatErrors' : 'stats.heatSpeed')}
              </button>
            ))}
          </div>
        </div>
        <KeyboardView
          layout={layout}
          keyClass={(k) => {
            const v = keyValue(k)
            return heatClass[v === undefined ? 0 : heatLevel(v, thresholds)]
          }}
          keyTitle={(k) => {
            const v = keyValue(k)
            return v === undefined ? undefined : `${k.base.toUpperCase()}: ${format(v)}`
          }}
        />
        <ul className={s.legend}>
          {legend.map((text, i) => (
            <li key={text}>
              <span className={`${s.swatch} ${heatClass[i + 1]}`} />
              {text}
            </li>
          ))}
          <li>
            <span className={`${s.swatch} ${s.heat0}`} />
            {t('stats.noData')}
          </li>
        </ul>
      </div>

      <div className={s.card}>
        <div className={s.cardHeader}>
          <h2>{t('stats.weakTitle')}</h2>
          {weak.length > 0 && (
            <Link className="btn btn-primary" to="/practice?mode=weak">
              {t('stats.trainWeak')}
            </Link>
          )}
        </div>
        {weak.length === 0 ? (
          <p className={s.muted}>{t('stats.weakEmpty')}</p>
        ) : (
          <table className={s.table}>
            <thead>
              <tr>
                <th>{t('stats.colKey')}</th>
                <th>{t('stats.colHits')}</th>
                <th>{t('stats.colErrors')}</th>
                <th>{t('stats.colLatency')}</th>
              </tr>
            </thead>
            <tbody>
              {weak.map((k) => (
                <tr key={k.char}>
                  <td className={s.keyChar}>{k.char}</td>
                  <td>{k.hits}</td>
                  <td>{pct(k.errorRate)}</td>
                  <td>
                    {k.latencyMs === undefined
                      ? '—'
                      : `${Math.round(k.latencyMs)} ${t('stats.ms')}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  )
}

function Tile({ value, label }: { value: string; label: string }) {
  return (
    <div className={s.tile}>
      <span className={s.tileValue}>{value}</span>
      <span className={s.tileLabel}>{label}</span>
    </div>
  )
}
