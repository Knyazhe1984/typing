import { useLayoutEffect, useRef, useState } from 'react'
import s from './Stats.module.css'

export interface Point {
  y: number
  /** Подпись точки в подсказке и на оси X (например, дата) */
  label: string
}

interface Props {
  points: Point[]
  /** Границы оси Y */
  domain: [number, number]
  format: (y: number) => string
  /** Название графика для скринридеров */
  title: string
  height?: number
}

const PAD = { top: 16, right: 48, bottom: 26, left: 40 }

/** Ровные значения для сетки: 0, 50, 100… */
function ticks([min, max]: [number, number], count = 4): number[] {
  const raw = (max - min) / count
  const mag = 10 ** Math.floor(Math.log10(raw))
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((st) => st >= raw) ?? raw
  const out: number[] = []
  for (let v = Math.ceil(min / step) * step; v <= max + 1e-9; v += step) out.push(v)
  return out
}

/** Одна линия с перекрестием и подсказкой при наведении. */
export function LineChart({ points, domain, format, title, height = 180 }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(600)
  const [hover, setHover] = useState<number>()

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const plotW = Math.max(10, width - PAD.left - PAD.right)
  const plotH = height - PAD.top - PAD.bottom
  const n = points.length
  const x = (i: number) => PAD.left + (n === 1 ? plotW / 2 : (i / (n - 1)) * plotW)
  const y = (v: number) =>
    PAD.top +
    plotH -
    ((Math.min(Math.max(v, domain[0]), domain[1]) - domain[0]) / (domain[1] - domain[0])) * plotH
  const path = points.map((p, i) => `${i ? 'L' : 'M'}${x(i)},${y(p.y)}`).join('')
  const last = points[n - 1]

  function onMove(e: React.PointerEvent<SVGRectElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const rel = (e.clientX - rect.left) / rect.width
    setHover(n === 1 ? 0 : Math.round(rel * (n - 1)))
  }

  const h = hover !== undefined ? points[hover] : undefined

  return (
    <div ref={ref} className={s.chart}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height={height}
        role="img"
        aria-label={title}
      >
        {ticks(domain).map((v) => (
          <g key={v}>
            <line x1={PAD.left} x2={PAD.left + plotW} y1={y(v)} y2={y(v)} className={s.grid} />
            <text x={PAD.left - 6} y={y(v)} className={s.axisLabel} textAnchor="end" dy="0.32em">
              {format(v)}
            </text>
          </g>
        ))}
        {n > 1 && (
          <>
            <text x={PAD.left} y={height - 6} className={s.axisLabel}>
              {points[0].label}
            </text>
            <text x={PAD.left + plotW} y={height - 6} className={s.axisLabel} textAnchor="end">
              {last.label}
            </text>
          </>
        )}
        <path d={path} className={s.line} />
        {/* Последнее значение подписываем прямо на графике */}
        <circle cx={x(n - 1)} cy={y(last.y)} r={4} className={s.dot} />
        <text x={x(n - 1) + 8} y={y(last.y)} dy="0.32em" className={s.directLabel}>
          {format(last.y)}
        </text>
        {h && hover !== undefined && (
          <>
            <line
              x1={x(hover)}
              x2={x(hover)}
              y1={PAD.top}
              y2={PAD.top + plotH}
              className={s.crosshair}
            />
            <circle cx={x(hover)} cy={y(h.y)} r={5} className={s.dot} />
          </>
        )}
        <rect
          x={PAD.left - 8}
          y={0}
          width={plotW + 16}
          height={height}
          fill="transparent"
          onPointerMove={onMove}
          onPointerLeave={() => setHover(undefined)}
        />
      </svg>
      {h && hover !== undefined && (
        <div
          className={s.tooltip}
          style={{
            left: Math.min(Math.max(x(hover), 60), width - 60),
            top: Math.max(y(h.y) - 12, 0),
          }}
        >
          <span className={s.tooltipLabel}>{h.label}</span>
          <strong>{format(h.y)}</strong>
        </div>
      )}
    </div>
  )
}
