'use client'

import { useState, useCallback } from 'react'
import type { BoxSlot } from '@/types/box'
import { usePokedexStore } from '@/stores/usePokedexStore'
import { useBoxStore } from '@/stores/useBoxStore'

function makePokedexKey(slot: BoxSlot): string {
  return slot.formId ? `${slot.pokemonId}:${slot.formId}` : String(slot.pokemonId)
}

export interface RegistrationModeState {
  isActive: boolean
  selectedKeys: Set<string>
  lastClickedKey: string | null
  toggleMode: () => void
  clearSelection: () => void
  handleSlotClick: (
    boxId: string,
    slotIndex: number,
    event: React.MouseEvent,
    slot: BoxSlot | null,
  ) => void
  markSelected: (registered: boolean) => void
}

export function useRegistrationMode(): RegistrationModeState {
  const [isActive, setIsActive] = useState(false)
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set())
  const [lastClickedKey, setLastClickedKey] = useState<string | null>(null)

  const toggleRegistered = usePokedexStore((s) => s.toggleRegistered)
  const registerAll = usePokedexStore((s) => s.registerAll)
  const unregisterAll = usePokedexStore((s) => s.unregisterAll)
  const boxes = useBoxStore((s) => s.boxes)

  const toggleMode = useCallback(() => {
    setIsActive((prev) => !prev)
    setSelectedKeys(new Set())
    setLastClickedKey(null)
  }, [])

  const clearSelection = useCallback(() => {
    setSelectedKeys(new Set())
    setLastClickedKey(null)
  }, [])

  // Tasks 1.2–1.4: handle single click, Ctrl+Click, Shift+Click
  const handleSlotClick = useCallback(
    (
      boxId: string,
      slotIndex: number,
      event: React.MouseEvent,
      slot: BoxSlot | null,
    ) => {
      if (!isActive || !slot) return

      const locationKey = `${boxId}:${slotIndex}`
      const isCtrl = event.ctrlKey || event.metaKey
      const isShift = event.shiftKey

      if (isCtrl) {
        // Task 1.3: multi-select toggle
        setSelectedKeys((prev) => {
          const next = new Set(prev)
          if (next.has(locationKey)) {
            next.delete(locationKey)
          } else {
            next.add(locationKey)
          }
          return next
        })
        setLastClickedKey(locationKey)
      } else if (isShift && lastClickedKey) {
        // Task 1.4: range selection within the same box
        const colonIdx = lastClickedKey.indexOf(':')
        const anchorBoxId = lastClickedKey.slice(0, colonIdx)
        const anchorIdx = parseInt(lastClickedKey.slice(colonIdx + 1), 10)

        if (anchorBoxId === boxId) {
          const box = boxes.find((b) => b.id === boxId)
          if (box) {
            const min = Math.min(anchorIdx, slotIndex)
            const max = Math.max(anchorIdx, slotIndex)
            const rangeKeys: string[] = []
            for (let i = min; i <= max; i++) {
              if (box.slots[i] !== null) {
                rangeKeys.push(`${boxId}:${i}`)
              }
            }
            setSelectedKeys((prev) => {
              const next = new Set(prev)
              for (const key of rangeKeys) next.add(key)
              return next
            })
          }
        }
        setLastClickedKey(locationKey)
      } else {
        // Task 1.2: plain click — toggle registration immediately
        toggleRegistered(slot.pokemonId, slot.formId)
        setSelectedKeys(new Set())
        setLastClickedKey(locationKey)
      }
    },
    [isActive, lastClickedKey, boxes, toggleRegistered],
  )

  // Task 1.5: bulk mark/unmark selected slots
  const markSelected = useCallback(
    (registered: boolean) => {
      const pokedexKeys: string[] = []
      for (const locationKey of selectedKeys) {
        const colonIdx = locationKey.indexOf(':')
        const boxId = locationKey.slice(0, colonIdx)
        const slotIndex = parseInt(locationKey.slice(colonIdx + 1), 10)
        const box = boxes.find((b) => b.id === boxId)
        const slot = box?.slots[slotIndex]
        if (slot) {
          pokedexKeys.push(makePokedexKey(slot))
        }
      }
      if (pokedexKeys.length > 0) {
        if (registered) {
          registerAll(pokedexKeys)
        } else {
          unregisterAll(pokedexKeys)
        }
      }
      clearSelection()
    },
    [selectedKeys, boxes, registerAll, unregisterAll, clearSelection],
  )

  return {
    isActive,
    selectedKeys,
    lastClickedKey,
    toggleMode,
    clearSelection,
    handleSlotClick,
    markSelected,
  }
}
