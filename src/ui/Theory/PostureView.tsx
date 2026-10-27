/** Схематичная посадка за компьютером: прямая спина, прямые углы в локтях и коленях. */
export function PostureView() {
  const stroke = 'var(--text-muted)'
  return (
    <svg
      viewBox="0 0 320 200"
      width="100%"
      style={{ maxWidth: 360, display: 'block', margin: '0 auto' }}
      role="img"
      aria-label="posture"
    >
      <g fill="none" stroke={stroke} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round">
        {/* стол и монитор */}
        <path d="M150 112 H300 M290 112 V190" />
        <rect x={238} y={40} width={50} height={40} rx={4} />
        <path d="M263 80 V112" />
        {/* стул */}
        <path d="M58 60 V140 H120 M66 140 V190 M114 140 V190" />
        {/* человек: голова, спина, бедро, голень, плечо, предплечье */}
        <circle cx={82} cy={36} r={14} fill="var(--finger-thumb)" />
        <path d="M80 52 V132 H140 V188" stroke="var(--accent)" strokeWidth={6} />
        <path d="M80 70 L96 108 H166" stroke="var(--accent)" strokeWidth={6} />
        {/* линия взгляда */}
        <path d="M96 38 L238 52" strokeDasharray="4 6" strokeWidth={2} />
      </g>
      <g fill="var(--text-muted)" fontSize={12} fontFamily="var(--font-ui)">
        <text x={100} y={128}>
          90°
        </text>
        <text x={146} y={160}>
          90°
        </text>
        <text x={84} y={102}>
          90°
        </text>
      </g>
    </svg>
  )
}
