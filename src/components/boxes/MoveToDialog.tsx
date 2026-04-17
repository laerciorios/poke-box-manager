"use client"

import { useState } from "react"
import Image from "next/image"
import { useTranslations } from "next-intl"

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useBoxStore } from "@/stores/useBoxStore"
import type { Box, BoxSlot } from "@/types/box"
import { BOX_SIZE } from "@/types/box"

interface MoveToDialogProps {
  open: boolean
  onClose: () => void
  fromBoxId: string
  fromIndex: number
  getSpriteUrl?: (slot: BoxSlot) => string | undefined
}

export function MoveToDialog({ open, onClose, fromBoxId, fromIndex, getSpriteUrl }: MoveToDialogProps) {
  const t = useTranslations("Boxes")
  const tCommon = useTranslations("Common")
  const boxes = useBoxStore((s) => s.boxes)
  const moveSlot = useBoxStore((s) => s.moveSlot)

  const [step, setStep] = useState<1 | 2>(1)
  const [targetBoxId, setTargetBoxId] = useState<string | null>(null)

  const targetBox = boxes.find((b) => b.id === targetBoxId) ?? null

  function handleConfirm(toIndex: number) {
    if (!targetBoxId) return
    moveSlot(fromBoxId, fromIndex, targetBoxId, toIndex)
    onClose()
    resetState()
  }

  function resetState() {
    setStep(1)
    setTargetBoxId(null)
  }

  function handleClose() {
    onClose()
    resetState()
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) handleClose() }}>
      <DialogContent className="sm:max-w-sm" showCloseButton>
        <DialogHeader>
          <DialogTitle>{t("moveToTitle")}</DialogTitle>
        </DialogHeader>

        {step === 1 ? (
          <div className="space-y-1 max-h-72 overflow-y-auto">
            <p className="text-sm text-muted-foreground mb-2">{t("moveToStep1")}</p>
            {boxes.map((box) => (
              <button
                key={box.id}
                type="button"
                onClick={() => {
                  setTargetBoxId(box.id)
                  setStep(2)
                }}
                className={cn(
                  "w-full text-left rounded-md px-3 py-2 text-sm hover:bg-accent transition-colors",
                  box.id === fromBoxId && "opacity-50"
                )}
              >
                {box.name}
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{t("moveToStep2")} — <strong>{targetBox?.name}</strong></p>
            <MiniSlotGrid
              box={targetBox}
              getSpriteUrl={getSpriteUrl}
              onSelectSlot={handleConfirm}
            />
            <DialogFooter>
              <Button variant="outline" size="sm" onClick={() => setStep(1)}>
                ← {t("moveToStep1")}
              </Button>
              <Button variant="outline" size="sm" onClick={handleClose}>
                {tCommon("cancel")}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

function MiniSlotGrid({
  box,
  getSpriteUrl,
  onSelectSlot,
}: {
  box: Box | null
  getSpriteUrl?: (slot: BoxSlot) => string | undefined
  onSelectSlot: (index: number) => void
}) {
  if (!box) return null
  const slots =
    box.slots.length >= BOX_SIZE
      ? box.slots.slice(0, BOX_SIZE)
      : [...box.slots, ...Array<null>(BOX_SIZE - box.slots.length).fill(null)]

  return (
    <div className="grid grid-cols-6 gap-1">
      {slots.map((slot, i) => {
        const sprite = slot ? getSpriteUrl?.(slot) : undefined
        return (
          <button
            key={i}
            type="button"
            title={`Slot ${i + 1}`}
            onClick={() => onSelectSlot(i)}
            className={cn(
              "flex items-center justify-center rounded size-10 border transition-colors hover:bg-accent hover:border-accent",
              slot ? "border-muted bg-card" : "border-dashed border-muted bg-muted/20"
            )}
          >
            {sprite ? (
              <Image src={sprite} alt="" width={32} height={32} className="object-contain" unoptimized />
            ) : null}
          </button>
        )
      })}
    </div>
  )
}
