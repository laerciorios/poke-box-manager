'use client'

import { useCallback, useEffect, useState } from 'react'

const COLS = 6
const ROWS = 5
const BOX_SIZE = COLS * ROWS // 30

export function useSlotFocus() {
  const [focusedSlotIndex, setFocusedSlotIndex] = useState<number | null>(null)

  // Reset slot focus when a text input gains focus
  useEffect(() => {
    function handleFocusIn(e: FocusEvent) {
      const el = e.target as HTMLElement
      if (!el) return
      const tag = el.tagName.toLowerCase()
      if (tag === 'input' || tag === 'textarea' || tag === 'select' || el.isContentEditable) {
        setFocusedSlotIndex(null)
      }
    }
    window.addEventListener('focusin', handleFocusIn)
    return () => window.removeEventListener('focusin', handleFocusIn)
  }, [])

  const moveFocus = useCallback(
    (
      direction: 'up' | 'down' | 'left' | 'right',
      totalBoxes: number,
      currentBoxIndex: number,
      onBoxChange: (index: number) => void,
    ) => {
      setFocusedSlotIndex((current) => {
        const idx = current ?? 0

        if (direction === 'left') {
          if (idx === 0) {
            // Wrap to previous box
            if (currentBoxIndex > 0) {
              onBoxChange(currentBoxIndex - 1)
              return BOX_SIZE - 1
            }
            return idx
          }
          return idx - 1
        }

        if (direction === 'right') {
          if (idx === BOX_SIZE - 1) {
            // Wrap to next box
            if (currentBoxIndex < totalBoxes - 1) {
              onBoxChange(currentBoxIndex + 1)
              return 0
            }
            return idx
          }
          return idx + 1
        }

        if (direction === 'up') {
          if (idx < COLS) {
            // Top row — wrap to previous box, bottom row same column
            if (currentBoxIndex > 0) {
              onBoxChange(currentBoxIndex - 1)
              return (ROWS - 1) * COLS + (idx % COLS)
            }
            return idx
          }
          return idx - COLS
        }

        if (direction === 'down') {
          if (idx >= (ROWS - 1) * COLS) {
            // Bottom row — wrap to next box, top row same column
            if (currentBoxIndex < totalBoxes - 1) {
              onBoxChange(currentBoxIndex + 1)
              return idx % COLS
            }
            return idx
          }
          return idx + COLS
        }

        return idx
      })
    },
    [],
  )

  return { focusedSlotIndex, setFocusedSlotIndex, moveFocus }
}
