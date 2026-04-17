import { arrayMove } from '@dnd-kit/sortable'
import { createPersistedStore } from '@/lib/store'
import type { Box, BoxSlot } from '@/types/box'
import { BOX_SIZE } from '@/types/box'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { useHistoryStore } from '@/stores/useHistoryStore'
import { buildDescription } from '@/lib/history-descriptions'

const MAX_BOXES = 200

interface BoxState {
  boxes: Box[]
  addBox: () => void
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
  setSlotNote: (boxId: string, slotIndex: number, note: string) => void
  addTagToSlot: (boxId: string, slotIndex: number, tagId: string) => void
  removeTagFromSlot: (boxId: string, slotIndex: number, tagId: string) => void
  purgeTagId: (tagId: string) => void
}

export const useBoxStore = createPersistedStore<BoxState>(
  'boxes',
  (set, get) => ({
    boxes: [],

    addBox: () => {
      const current = get().boxes
      if (current.length >= MAX_BOXES) return
      const newBox: Box = {
        id: crypto.randomUUID(),
        name: `Box ${current.length + 1}`,
        slots: Array.from({ length: BOX_SIZE }, () => null),
      }
      set({ boxes: [...current, newBox] })
      useSettingsStore.getState().recordChange()
    },

    createBox: (name) => {
      const newBox: Box = {
        id: crypto.randomUUID(),
        name,
        slots: Array.from({ length: BOX_SIZE }, () => null),
      }
      set({ boxes: [...get().boxes, newBox] })
      useSettingsStore.getState().recordChange()
    },

    deleteBox: (boxId) => {
      set({ boxes: get().boxes.filter((b) => b.id !== boxId) })
      useSettingsStore.getState().recordChange()
    },

    renameBox: (boxId, newName) => {
      set({
        boxes: get().boxes.map((b) =>
          b.id === boxId ? { ...b, name: newName } : b,
        ),
      })
      useSettingsStore.getState().recordChange()
    },

    setBoxLabel: (boxId, label) => {
      set({
        boxes: get().boxes.map((b) =>
          b.id === boxId ? { ...b, label } : b,
        ),
      })
      useSettingsStore.getState().recordChange()
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
      useSettingsStore.getState().recordChange()
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
      useSettingsStore.getState().recordChange()
    },

    moveSlot: (fromBoxId, fromIndex, toBoxId, toIndex) => {
      const current = get().boxes
      const fromBoxBefore = current.find((b) => b.id === fromBoxId)
      const toBoxBefore = current.find((b) => b.id === toBoxId)
      const fromSlotSnapshot = fromBoxBefore?.slots[fromIndex] ?? null
      const toSlotSnapshot = toBoxBefore?.slots[toIndex] ?? null

      const boxes = current.map((b) => ({ ...b, slots: [...b.slots] }))
      const fromBox = boxes.find((b) => b.id === fromBoxId)
      const toBox = boxes.find((b) => b.id === toBoxId)
      if (!fromBox || !toBox) return

      const temp = toBox.slots[toIndex]
      toBox.slots[toIndex] = fromBox.slots[fromIndex]
      fromBox.slots[fromIndex] = temp ?? null

      set({ boxes })
      useSettingsStore.getState().recordChange()

      const undoPayload = {
        type: 'move-slot',
        fromBoxId,
        fromIndex,
        toBoxId,
        toIndex,
        fromSlot: fromSlotSnapshot,
        toSlot: toSlotSnapshot,
      } as const
      const locale = useSettingsStore.getState().locale
      useHistoryStore.getState().pushEntry({
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        actionType: 'move-slot',
        description: buildDescription('move-slot', undoPayload, locale),
        undoPayload,
      })
    },

    reorderSlots: (boxId, fromIndex, toIndex) => {
      set({
        boxes: get().boxes.map((b) =>
          b.id !== boxId ? b : { ...b, slots: arrayMove(b.slots, fromIndex, toIndex) },
        ),
      })
      useSettingsStore.getState().recordChange()
    },

    reorderBox: (boxId, newIndex) => {
      const boxes = [...get().boxes]
      const currentIndex = boxes.findIndex((b) => b.id === boxId)
      if (currentIndex === -1) return
      const [box] = boxes.splice(currentIndex, 1)
      boxes.splice(newIndex, 0, box)
      set({ boxes })
      useSettingsStore.getState().recordChange()

      const undoPayload = { type: 'reorder-box', boxId, previousIndex: currentIndex } as const
      const locale = useSettingsStore.getState().locale
      useHistoryStore.getState().pushEntry({
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        actionType: 'reorder-box',
        description: buildDescription('reorder-box', undoPayload, locale),
        undoPayload,
      })
    },

    setBoxes: (boxes) => {
      const previousBoxes = structuredClone(get().boxes)
      const clamped = boxes.length > MAX_BOXES ? boxes.slice(0, MAX_BOXES) : boxes
      set({ boxes: clamped })
      useSettingsStore.getState().recordChange()

      const undoPayload = { type: 'preset-apply', previousBoxes } as const
      const locale = useSettingsStore.getState().locale
      useHistoryStore.getState().pushEntry({
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        actionType: 'preset-apply',
        description: buildDescription('preset-apply', undoPayload, locale),
        undoPayload,
      })
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
      useSettingsStore.getState().recordChange()
    },

    setSlotNote: (boxId, slotIndex, note) => {
      set({
        boxes: get().boxes.map((b) => {
          if (b.id !== boxId) return b
          const slots = [...b.slots]
          const slot = slots[slotIndex]
          if (!slot) return b
          const trimmed = note.trim().slice(0, 500)
          slots[slotIndex] = { ...slot, note: trimmed || undefined }
          return { ...b, slots }
        }),
      })
      useSettingsStore.getState().recordChange()
    },

    addTagToSlot: (boxId, slotIndex, tagId) => {
      set({
        boxes: get().boxes.map((b) => {
          if (b.id !== boxId) return b
          const slots = [...b.slots]
          const slot = slots[slotIndex]
          if (!slot) return b
          const existing = slot.tagIds ?? []
          if (existing.includes(tagId)) return b
          slots[slotIndex] = { ...slot, tagIds: [...existing, tagId] }
          return { ...b, slots }
        }),
      })
      useSettingsStore.getState().recordChange()
    },

    removeTagFromSlot: (boxId, slotIndex, tagId) => {
      set({
        boxes: get().boxes.map((b) => {
          if (b.id !== boxId) return b
          const slots = [...b.slots]
          const slot = slots[slotIndex]
          if (!slot) return b
          const filtered = (slot.tagIds ?? []).filter((id) => id !== tagId)
          slots[slotIndex] = { ...slot, tagIds: filtered.length ? filtered : undefined }
          return { ...b, slots }
        }),
      })
      useSettingsStore.getState().recordChange()
    },

    purgeTagId: (tagId) => {
      set({
        boxes: get().boxes.map((b) => ({
          ...b,
          slots: b.slots.map((slot) => {
            if (!slot?.tagIds?.includes(tagId)) return slot
            const filtered = slot.tagIds.filter((id) => id !== tagId)
            return { ...slot, tagIds: filtered.length ? filtered : undefined }
          }),
        })),
      })
      useSettingsStore.getState().recordChange()
    },
  }),
  {
    version: 2,
    migrate: (state) => state as BoxState,
    partialize: (state) => ({ boxes: state.boxes }) as BoxState,
  },
)
