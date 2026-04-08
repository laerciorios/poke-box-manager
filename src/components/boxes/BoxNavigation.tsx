"use client"

import { useCallback, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface BoxNavigationProps {
  boxName: string
  currentIndex: number
  totalBoxes: number
  onPrevious: () => void
  onNext: () => void
  className?: string
}

export function BoxNavigation({
  boxName,
  currentIndex,
  totalBoxes,
  onPrevious,
  onNext,
  className,
}: BoxNavigationProps) {
  const isFirst = currentIndex === 0
  const isLast = currentIndex === totalBoxes - 1

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && !isFirst) {
        onPrevious()
      } else if (e.key === "ArrowRight" && !isLast) {
        onNext()
      }
    },
    [isFirst, isLast, onPrevious, onNext]
  )

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

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
      >
        <ChevronLeft />
      </Button>

      <div className="flex flex-col items-center gap-0.5">
        <span className="text-lg font-semibold">{boxName}</span>
        <span className="text-xs text-muted-foreground">
          {currentIndex + 1} / {totalBoxes}
        </span>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={onNext}
        disabled={isLast}
        aria-label="Next box"
      >
        <ChevronRight />
      </Button>
    </div>
  )
}
