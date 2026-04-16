import { createPersistedStore } from '@/lib/store'
import type { ActivityEntry, UndoPayload } from '@/types/history'

const MAX_ENTRIES = 100

interface HistoryState {
  entries: ActivityEntry[]
  pushEntry: (entry: ActivityEntry) => void
  undoLast: () => void
  clearHistory: () => void
}

export const useHistoryStore = createPersistedStore<HistoryState>(
  'history',
  (set, get) => ({
    entries: [],

    pushEntry: (entry) => {
      const trimmed = get().entries.slice(0, MAX_ENTRIES - 1)
      set({ entries: [entry, ...trimmed] })
    },

    undoLast: () => {
      const { entries } = get()
      if (entries.length === 0) return

      const [latest, ...rest] = entries
      set({ entries: rest })
      applyUndo(latest.undoPayload)
    },

    clearHistory: () => set({ entries: [] }),
  }),
  { version: 1 },
)

function applyUndo(payload: UndoPayload): void {
  switch (payload.type) {
    case 'register':
      import('@/stores/usePokedexStore').then(({ usePokedexStore }) => {
        const registered = usePokedexStore.getState().registered
        usePokedexStore.setState({ registered: registered.filter((k) => k !== payload.key) })
      })
      break

    case 'unregister':
      import('@/stores/usePokedexStore').then(({ usePokedexStore }) => {
        const registered = usePokedexStore.getState().registered
        if (!registered.includes(payload.key)) {
          usePokedexStore.setState({ registered: [...registered, payload.key] })
        }
      })
      break

    case 'bulk-register':
      import('@/stores/usePokedexStore').then(({ usePokedexStore }) => {
        const registered = usePokedexStore.getState().registered
        const toRemove = new Set(payload.keys)
        usePokedexStore.setState({ registered: registered.filter((k) => !toRemove.has(k)) })
      })
      break

    case 'bulk-unregister':
      import('@/stores/usePokedexStore').then(({ usePokedexStore }) => {
        const registered = usePokedexStore.getState().registered
        const toAdd = payload.keys.filter((k) => !registered.includes(k))
        usePokedexStore.setState({ registered: [...registered, ...toAdd] })
      })
      break

    case 'move-slot':
      import('@/stores/useBoxStore').then(({ useBoxStore }) => {
        const { fromBoxId, fromIndex, toBoxId, toIndex, fromSlot, toSlot } = payload
        const boxes = useBoxStore.getState().boxes.map((b) => ({ ...b, slots: [...b.slots] }))
        const fromBox = boxes.find((b) => b.id === fromBoxId)
        const toBox = boxes.find((b) => b.id === toBoxId)
        if (fromBox) fromBox.slots[fromIndex] = fromSlot
        if (toBox) toBox.slots[toIndex] = toSlot
        useBoxStore.setState({ boxes })
      })
      break

    case 'reorder-box':
      import('@/stores/useBoxStore').then(({ useBoxStore }) => {
        const { boxId, previousIndex } = payload
        const boxes = [...useBoxStore.getState().boxes]
        const currentIndex = boxes.findIndex((b) => b.id === boxId)
        if (currentIndex === -1) return
        const [box] = boxes.splice(currentIndex, 1)
        boxes.splice(previousIndex, 0, box)
        useBoxStore.setState({ boxes })
      })
      break

    case 'preset-apply':
      import('@/stores/useBoxStore').then(({ useBoxStore }) => {
        useBoxStore.setState({ boxes: payload.previousBoxes })
      })
      break
  }
}
