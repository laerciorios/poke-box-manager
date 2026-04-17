"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { useTranslations } from "next-intl"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useBoxStore } from "@/stores/useBoxStore"
import { BOX_LABEL_COLORS } from "@/lib/box-label-colors"
import { BoxColorPicker } from "./BoxColorPicker"

interface BoxNavigationProps {
  boxId: string
  boxName: string
  boxLabel?: string
  currentIndex: number
  totalBoxes: number
  onPrevious: () => void
  onNext: () => void
  onAddBox?: () => void
  addBoxDisabled?: boolean
  onKeyboardPrev?: () => void
  onKeyboardNext?: () => void
  className?: string
}

export function BoxNavigation({
  boxId,
  boxName,
  boxLabel,
  currentIndex,
  totalBoxes,
  onPrevious,
  onNext,
  onAddBox,
  addBoxDisabled = false,
  onKeyboardPrev,
  onKeyboardNext,
  className,
}: BoxNavigationProps) {
  const t = useTranslations("Boxes")
  const renameBox = useBoxStore((s) => s.renameBox)
  const isFirst = currentIndex === 0
  const isLast = currentIndex === totalBoxes - 1

  const [isEditing, setIsEditing] = useState(false)
  const [draftName, setDraftName] = useState(boxName)
  const inputRef = useRef<HTMLInputElement>(null)

  // Sync draftName when boxName changes externally
  useEffect(() => {
    if (!isEditing) setDraftName(boxName)
  }, [boxName, isEditing])

  const enterEditMode = () => {
    setDraftName(boxName)
    setIsEditing(true)
    setTimeout(() => inputRef.current?.select(), 0)
  }

  const commitEdit = () => {
    const trimmed = draftName.trim()
    if (trimmed) {
      renameBox(boxId, trimmed)
    } else {
      setDraftName(boxName)
    }
    setIsEditing(false)
  }

  const cancelEdit = () => {
    setDraftName(boxName)
    setIsEditing(false)
  }

  const colorDotClass = boxLabel ? BOX_LABEL_COLORS[boxLabel] : undefined

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4",
        className
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={onPrevious}
        disabled={isFirst}
        aria-label="Previous box"
        className="max-md:min-h-[44px] max-md:min-w-[44px]"
      >
        <ChevronLeft />
      </Button>

      <div className="flex flex-col items-center gap-0.5">
        <div className="flex items-center gap-1.5">
          {colorDotClass && (
            <span className={cn("size-2.5 rounded-full shrink-0", colorDotClass)} />
          )}

          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={draftName}
              aria-label={t("editBoxName")}
              className="w-40 rounded border border-input bg-background px-2 py-0.5 text-center text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-ring"
              onChange={(e) => setDraftName(e.target.value)}
              onBlur={commitEdit}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  commitEdit()
                } else if (e.key === "Escape") {
                  e.preventDefault()
                  cancelEdit()
                }
              }}
            />
          ) : (
            <span
              className="cursor-text text-lg font-semibold select-none"
              onDoubleClick={enterEditMode}
              title={t("editBoxName")}
            >
              {boxName}
            </span>
          )}

          <BoxColorPicker boxId={boxId} currentLabel={boxLabel} />
        </div>
        <span className="text-xs text-muted-foreground">
          {currentIndex + 1} / {totalBoxes}
        </span>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={onNext}
          disabled={isLast}
          aria-label="Next box"
          className="max-md:min-h-[44px] max-md:min-w-[44px]"
        >
          <ChevronRight />
        </Button>

        {onAddBox && (
          addBoxDisabled ? (
            <Tooltip>
              <TooltipTrigger render={<span />}>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled
                  aria-label={t("addBox")}
                  className="max-md:min-h-[44px] max-md:min-w-[44px]"
                >
                  <Plus />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t("boxLimitReached")}</TooltipContent>
            </Tooltip>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={onAddBox}
              aria-label={t("addBox")}
              className="max-md:min-h-[44px] max-md:min-w-[44px]"
            >
              <Plus />
            </Button>
          )
        )}
      </div>
    </div>
  )
}
