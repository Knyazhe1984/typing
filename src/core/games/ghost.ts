/**
 * Гонка с «призраком»: призрак повторяет лучший заезд по тому же тексту.
 * Заезд — время (мс от первого нажатия), когда был набран каждый символ.
 */

/** Сколько символов набрал призрак к моменту elapsed. */
export function ghostPosition(timeline: readonly number[], elapsed: number): number {
  let lo = 0
  let hi = timeline.length
  while (lo < hi) {
    const mid = (lo + hi) >> 1
    if (timeline[mid] <= elapsed) lo = mid + 1
    else hi = mid
  }
  return lo
}

/** Ровный заезд с заданной скоростью — соперник, пока своего призрака нет. */
export function paceTimeline(length: number, cpm: number): number[] {
  const perChar = 60_000 / cpm
  return Array.from({ length }, (_, i) => Math.round((i + 1) * perChar))
}

/**
 * Собирает заезд из моментов, когда позиция курсора менялась.
 * Время каждого символа — первый момент, когда курсор оказался за ним.
 */
export function timelineFromProgress(
  length: number,
  progress: readonly { position: number; at: number }[],
): number[] {
  const out: number[] = []
  for (const { position, at } of progress) {
    while (out.length < Math.min(position, length)) out.push(at)
  }
  return out
}
