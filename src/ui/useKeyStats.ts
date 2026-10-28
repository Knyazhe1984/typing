import { useLiveQuery } from 'dexie-react-hooks'
import { useMemo } from 'react'
import type { LayoutId } from '../core/layouts'
import type { KeyStat } from '../core/stats/keyStats'
import { db } from '../storage/db'

/** Статистика по символам раскладки; undefined — ещё загружается. */
export function useKeyStats(layout: LayoutId): Map<string, KeyStat> | undefined {
  const rows = useLiveQuery(() => db.keyStats.where('layout').equals(layout).toArray(), [layout])
  return useMemo(() => rows && new Map(rows.map(({ char, ...stat }) => [char, stat])), [rows])
}
