import type { Metrics } from '../engine/session'

export interface StarThresholds {
  /** Точность для 1, 2 и 3 звёзд */
  accuracy: [number, number, number]
  /** Скорость (зн/мин) для 2 и 3 звёзд; для 1 звезды скорость не важна */
  cpm: [number, number]
}

export const defaultThresholds: StarThresholds = {
  accuracy: [0.9, 0.94, 0.97],
  cpm: [80, 120],
}

/** 0 — урок не пройден: точность важнее скорости. */
export function starsFor(m: Metrics, t: StarThresholds = defaultThresholds): 0 | 1 | 2 | 3 {
  if (m.accuracy < t.accuracy[0]) return 0
  if (m.accuracy >= t.accuracy[2] && m.cpm >= t.cpm[1]) return 3
  if (m.accuracy >= t.accuracy[1] && m.cpm >= t.cpm[0]) return 2
  return 1
}
