"use client"

import { cn } from "@/lib/utils"
import type { Box } from "@/types/box"
import { BOX_SIZE } from "@/types/box"

interface BoxOverviewProps {
  boxes: Box[]
  activeBoxIndex: number
  onSelectBox: (index: number) => void
  className?: string
}

function MiniGrid({ box, isActive }: { box: Box; isActive: boolean }) {
  const slots = box.slots.length >= BOX_SIZE
    ? box.slots.slice(0, BOX_SIZE)
    : [...box.slots, ...Array<null>(BOX_SIZE - box.slots.length).fill(null)]

  return (
    <div
      className={cn(
        "grid grid-cols-6 gap-px rounded-md border p-1 transition-colors",
        isActive
          ? "border-accent bg-accent/10"
          : "border-border bg-card hover:border-muted-foreground/30"
      )}
    >
      {slots.map((slot, i) => (
        <div
          key={i}
          className={cn(
            "size-1.5 rounded-full",
            slot === null
              ? "bg-transparent"
              : slot.registered
                ? "bg-green-500"
                : "bg-orange-400"
          )}
        />
      ))}
    </div>
  )
}

export function BoxOverview({
  boxes,
  activeBoxIndex,
  onSelectBox,
  className,
}: BoxOverviewProps) {
  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      {boxes.map((box, index) => (
        <button
          key={box.id}
          type="button"
          className="flex cursor-pointer flex-col items-center gap-1"
          onClick={() => onSelectBox(index)}
        >
          <MiniGrid box={box} isActive={index === activeBoxIndex} />
          <span
            className={cn(
              "text-[10px] leading-tight",
              index === activeBoxIndex
                ? "font-medium text-accent"
                : "text-muted-foreground"
            )}
          >
            {box.name}
          </span>
        </button>
      ))}
    </div>
  )
}
