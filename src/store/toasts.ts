import { create } from 'zustand'

export interface Toast {
  id: number
  icon: string
  title: string
  text?: string
}

interface Toasts {
  items: Toast[]
  push: (t: Omit<Toast, 'id'>) => void
  dismiss: (id: number) => void
}

let nextId = 1

export const useToasts = create<Toasts>()((set) => ({
  items: [],
  push: (t) => {
    const id = nextId++
    set((s) => ({ items: [...s.items, { ...t, id }] }))
    setTimeout(() => set((s) => ({ items: s.items.filter((x) => x.id !== id) })), 5000)
  },
  dismiss: (id) => set((s) => ({ items: s.items.filter((x) => x.id !== id) })),
}))
