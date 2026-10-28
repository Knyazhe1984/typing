// Значки интерфейса в SVG: эмодзи есть не во всех системах (например, в части Linux).

interface IconProps {
  size?: number
}

const svg = (size: number, children: React.ReactNode, fill = 'none') => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill}
    stroke="currentColor"
    strokeWidth={2.2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
)

export const LockIcon = ({ size = 22 }: IconProps) =>
  svg(
    size,
    <>
      <rect x={5} y={11} width={14} height={10} rx={2} />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </>,
  )

export const BookIcon = ({ size = 22 }: IconProps) =>
  svg(
    size,
    <>
      <path d="M4 5a2 2 0 0 1 2-2h5v17H6a2 2 0 0 0-2 2z" />
      <path d="M20 5a2 2 0 0 0-2-2h-5v17h5a2 2 0 0 1 2 2z" />
    </>,
  )

export const CheckIcon = ({ size = 22 }: IconProps) => svg(size, <path d="M5 12.5l4.5 4.5L19 7" />)

export function FlameIcon({ size = 18, active = true }: IconProps & { active?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 2c1 4 5 6 5 11a5 5 0 0 1-10 0c0-2 1-3.5 2-4.5 0 2 1 3 2 3-1-4 1-7 1-9.5z"
        fill={active ? '#f28c38' : 'var(--border)'}
      />
      <path
        d="M12 13c.8 1.6 2.2 2.4 2.2 4.2a2.2 2.2 0 0 1-4.4 0c0-1 .6-1.8 1.2-2.4.2 1 .6 1.3 1 1.3-.4-1.3 0-2.3 0-3.1z"
        fill={active ? '#f2b705' : 'var(--bg)'}
      />
    </svg>
  )
}
