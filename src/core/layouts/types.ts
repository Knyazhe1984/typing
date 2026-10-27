/** Пальцы: L/R — рука, 2 — указательный … 5 — мизинец, TH — большие пальцы. */
export type Finger = 'L5' | 'L4' | 'L3' | 'L2' | 'R2' | 'R3' | 'R4' | 'R5' | 'TH'

export type LayoutId = 'ru' | 'en'

/** Физическая клавиша: положение и палец не зависят от раскладки. */
export interface PhysicalKey {
  code: string
  finger: Finger
  /** Ширина в долях стандартной клавиши */
  width: number
  /** Служебная клавиша без символа (Shift, Tab, Enter…) */
  label?: string
}

export interface KeyDef extends PhysicalKey {
  /** Символ без Shift и с Shift; у служебных клавиш — пустые строки */
  base: string
  shift: string
}

export interface Layout {
  id: LayoutId
  name: string
  rows: KeyDef[][]
}

/** Как набрать символ: основная клавиша и, если нужно, Shift на противоположной руке. */
export interface KeyStroke {
  key: KeyDef
  shiftCode?: 'ShiftLeft' | 'ShiftRight'
}
