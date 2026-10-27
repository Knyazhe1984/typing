import type { Finger } from '../../core/layouts'
import { fingerColor } from '../fingers'

type HandFinger = 5 | 4 | 3 | 2 | 1

// Левая рука; правая рисуется зеркально. 1 — большой палец.
const fingerShapes: { n: HandFinger; x: number; y: number; h: number; rotate?: string }[] = [
  { n: 5, x: 22, y: 52, h: 58 },
  { n: 4, x: 54, y: 28, h: 82 },
  { n: 3, x: 88, y: 16, h: 94 },
  { n: 2, x: 122, y: 30, h: 80 },
  { n: 1, x: 137, y: 86, h: 58, rotate: 'rotate(40 150 144)' },
]

function toFinger(side: 'L' | 'R', n: HandFinger): Finger {
  return n === 1 ? 'TH' : (`${side}${n}` as Finger)
}

interface Props {
  /** Пальцы, которыми нужно нажать (основная клавиша и Shift) */
  active: Finger[]
}

function Hand({ side, active }: { side: 'L' | 'R'; active: Finger[] }) {
  const hasActive = active.length > 0
  return (
    <g transform={side === 'R' ? 'translate(420 0) scale(-1 1)' : undefined}>
      <rect
        x={20}
        y={92}
        width={134}
        height={70}
        rx={26}
        fill="var(--finger-thumb)"
        opacity={0.6}
      />
      {fingerShapes.map(({ n, x, y, h, rotate }) => {
        const finger = toFinger(side, n)
        const isActive = active.includes(finger)
        return (
          <rect
            key={n}
            x={x}
            y={y}
            width={n === 1 ? 26 : 28}
            height={h}
            rx={13}
            transform={rotate}
            fill={isActive ? 'var(--accent)' : fingerColor[finger]}
            stroke={isActive ? 'var(--text)' : 'var(--border)'}
            strokeWidth={isActive ? 2 : 1}
            opacity={hasActive && !isActive ? 0.55 : 1}
          />
        )
      })}
    </g>
  )
}

export function HandsView({ active }: Props) {
  return (
    <svg
      viewBox="0 0 420 170"
      width="100%"
      style={{ maxWidth: 420, display: 'block', margin: '0 auto' }}
      role="img"
      aria-label="hands"
    >
      <Hand side="L" active={active} />
      <Hand side="R" active={active} />
    </svg>
  )
}
