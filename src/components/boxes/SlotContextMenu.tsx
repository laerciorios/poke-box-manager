"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useTranslations } from "next-intl"

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { PokemonPickerDialog } from "./PokemonPickerDialog"
import { MoveToDialog } from "./MoveToDialog"
import type { BoxSlot } from "@/types/box"
import { useBoxStore } from "@/stores/useBoxStore"

interface SlotContextMenuProps {
  children: React.ReactNode
  boxId: string
  slotIndex: number
  slot: BoxSlot | null
  getSpriteUrl?: (slot: BoxSlot) => string | undefined
}

const LONG_PRESS_MS = 500
const MOVE_THRESHOLD_PX = 5

export function SlotContextMenu({
  children,
  boxId,
  slotIndex,
  slot,
  getSpriteUrl,
}: SlotContextMenuProps) {
  const t = useTranslations("Boxes")
  const clearSlot = useBoxStore((s) => s.clearSlot)
  const setSlot = useBoxStore((s) => s.setSlot)

  const [pickerOpen, setPickerOpen] = useState(false)
  const [moveOpen, setMoveOpen] = useState(false)

  // Long-press state for mobile context menu trigger
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const startPos = useRef<{ x: number; y: number } | null>(null)
  const [longPressOpen, setLongPressOpen] = useState(false)

  const cancelLongPress = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
    startPos.current = null
  }, [])

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (e.pointerType === "mouse") return
    startPos.current = { x: e.clientX, y: e.clientY }
    longPressTimer.current = setTimeout(() => {
      setLongPressOpen(true)
      longPressTimer.current = null
    }, LONG_PRESS_MS)
  }, [])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!startPos.current) return
    const dx = Math.abs(e.clientX - startPos.current.x)
    const dy = Math.abs(e.clientY - startPos.current.y)
    if (dx > MOVE_THRESHOLD_PX || dy > MOVE_THRESHOLD_PX) {
      cancelLongPress()
    }
  }, [cancelLongPress])

  const handlePointerUp = useCallback(() => {
    cancelLongPress()
  }, [cancelLongPress])

  useEffect(() => () => cancelLongPress(), [cancelLongPress])

  function handleSelect(item: { pokemonId: number; formId?: string }) {
    setSlot(boxId, slotIndex, { pokemonId: item.pokemonId, formId: item.formId, registered: false })
  }

  return (
    <>
      <ContextMenu open={longPressOpen || undefined} onOpenChange={(o) => {
        if (!o) setLongPressOpen(false)
      }}>
        <ContextMenuTrigger
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={cancelLongPress}
          className="contents"
        >
          {children}
        </ContextMenuTrigger>

        <ContextMenuContent>
          {slot ? (
            <>
              <ContextMenuItem onClick={() => setPickerOpen(true)}>
                {t("changePokemon")}
              </ContextMenuItem>
              <ContextMenuItem onClick={() => clearSlot(boxId, slotIndex)}>
                {t("clearSlot")}
              </ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem onClick={() => setMoveOpen(true)}>
                {t("moveTo")}
              </ContextMenuItem>
            </>
          ) : (
            <ContextMenuItem onClick={() => setPickerOpen(true)}>
              {t("placePokemon")}
            </ContextMenuItem>
          )}
        </ContextMenuContent>
      </ContextMenu>

      <PokemonPickerDialog
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={handleSelect}
      />

      <MoveToDialog
        open={moveOpen}
        onClose={() => setMoveOpen(false)}
        fromBoxId={boxId}
        fromIndex={slotIndex}
        getSpriteUrl={getSpriteUrl}
      />
    </>
  )
}
