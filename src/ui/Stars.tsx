export function Stars({ count, size = 18 }: { count: number; size?: number }) {
  return (
    <span
      aria-label={`${count}/3`}
      style={{ fontSize: size, letterSpacing: 2, whiteSpace: 'nowrap' }}
    >
      {[0, 1, 2].map((i) => (
        <span key={i} style={{ color: i < count ? '#f2b705' : 'var(--border)' }}>
          ★
        </span>
      ))}
    </span>
  )
}
