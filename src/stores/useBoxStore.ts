import { arrayMove } from '@dnd-kit/sortable'
import { createPersistedStore } from '@/lib/store'
import type { Box, BoxSlot } from '@/types/box'
import { BOX_SIZE } from '@/types/box'

interface BoxState {
  boxes: Box[]
  createBox: (name: string) => void
  deleteBox: (boxId: string) => void
  renameBox: (boxId: string, newName: string) => void
  setBoxLabel: (boxId: string, label: string | undefined) => void
  setSlot: (boxId: string, slotIndex: number, slot: BoxSlot) => void
  clearSlot: (boxId: string, slotIndex: number) => void
  moveSlot: (
    fromBoxId: string,
    fromIndex: number,
    toBoxId: string,
    toIndex: number,
  ) => void
  reorderSlots: (boxId: string, fromIndex: number, toIndex: number) => void
  reorderBox: (boxId: string, newIndex: number) => void
  setBoxes: (boxes: Box[]) => void
  toggleShiny: (boxId: string, slotIndex: number) => void
}

export const useBoxStore = createPersistedStore<BoxState>(
  'boxes',
  (set, get) => ({
    boxes: [],

    createBox: (name) => {
      const newBox: Box = {
        id: crypto.randomUUID(),
        name,
        slots: Array.from({ length: BOX_SIZE }, () => null),
      }
      set({ boxes: [...get().boxes, newBox] })
    },

    deleteBox: (boxId) => {
      set({ boxes: get().boxes.filter((b) => b.id !== boxId) })
    },

    renameBox: (boxId, newName) => {
      set({
        boxes: get().boxes.map((b) =>
          b.id === boxId ? { ...b, name: newName } : b,
        ),
      })
    },

    setBoxLabel: (boxId, label) => {
      set({
        boxes: get().boxes.map((b) =>
          b.id === boxId ? { ...b, label } : b,
        ),
      })
    },

    setSlot: (boxId, slotIndex, slot) => {
      set({
        boxes: get().boxes.map((b) => {
          if (b.id !== boxId) return b
          const slots = [...b.slots]
          slots[slotIndex] = slot
          return { ...b, slots }
        }),
      })
    },

    clearSlot: (boxId, slotIndex) => {
      set({
        boxes: get().boxes.map((b) => {
          if (b.id !== boxId) return b
          const slots = [...b.slots]
          slots[slotIndex] = null
          return { ...b, slots }
        }),
      })
    },

    moveSlot: (fromBoxId, fromIndex, toBoxId, toIndex) => {
      const boxes = get().boxes.map((b) => ({ ...b, slots: [...b.slots] }))
      const fromBox = boxes.find((b) => b.id === fromBoxId)
      const toBox = boxes.find((b) => b.id === toBoxId)
      if (!fromBox || !toBox) return

      const temp = toBox.slots[toIndex]
      toBox.slots[toIndex] = fromBox.slots[fromIndex]
      fromBox.slots[fromIndex] = temp ?? null

      set({ boxes })
    },

    reorderSlots: (boxId, fromIndex, toIndex) => {
      set({
        boxes: get().boxes.map((b) =>
          b.id !== boxId ? b : { ...b, slots: arrayMove(b.slots, fromIndex, toIndex) },
        ),
      })
    },

    reorderBox: (boxId, newIndex) => {
      const boxes = [...get().boxes]
      const currentIndex = boxes.findIndex((b) => b.id === boxId)
      if (currentIndex === -1) return
      const [box] = boxes.splice(currentIndex, 1)
      boxes.splice(newIndex, 0, box)
      set({ boxes })
    },

    setBoxes: (boxes) => {
      set({ boxes })
    },

    toggleShiny: (boxId, slotIndex) => {
      set({
        boxes: get().boxes.map((b) => {
          if (b.id !== boxId) return b
          const slots = [...b.slots]
          const slot = slots[slotIndex]
          if (!slot) return b
          slots[slotIndex] = { ...slot, shiny: !slot.shiny }
          return { ...b, slots }
        }),
      })
    },
  }),
  { version: 1 },
)
