"use client"

import { useState } from "react"
import Image from "next/image"
import { cva, type VariantProps } from "class-variance-authority"
import { CircleHelp, Check } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { SpritePlaceholder } from "@/components/pokemon"
import type { BoxSlot } from "@/types/box"

const slotVariants = cva(
  "relative flex items-center justify-center rounded-lg transition-all outline-none",
  {
    variants: {
      state: {
        registered: "bg-card",
        missing: "bg-card",
        empty: "border-2 border-dashed border-muted bg-muted/20",
      },
      selected: {
        true: "border-2 border-accent ring-2 ring-accent/30",
        false: "",
      },
    },
    defaultVariants: {
      state: "empty",
      selected: false,
    },
  }
)

type SlotState = "registered" | "missing" | "empty"

interface BoxSlotCellProps extends VariantProps<typeof slotVariants> {
  slot: BoxSlot | null
  pokemonName?: string
  spriteUrl?: string
  selected?: boolean
  onClick?: () => void
  className?: string
}

function getSlotState(slot: BoxSlot | null): SlotState {
  if (!slot) return "empty"
  return slot.registered ? "registered" : "missing"
}

export function BoxSlotCell({
  slot,
  pokemonName,
  spriteUrl,
  selected = false,
  onClick,
  className,
}: BoxSlotCellProps) {
  const [spriteLoaded, setSpriteLoaded] = useState(false)
  const [spriteError, setSpriteError] = useState(false)
  const state = getSlotState(slot)

  const cellClassName = cn(
    slotVariants({ state, selected }),
    "aspect-square cursor-pointer hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring",
    className
  )

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      onClick?.()
    }
  }

  const cellContent = (
    <>
      {state === "empty" ? (
        <CircleHelp className="size-6 text-muted-foreground/50" />
      ) : (
        <>
          {(!spriteLoaded || spriteError) && (
            <SpritePlaceholder size={48} className="absolute" />
          )}

          {slot && !spriteError && spriteUrl && (
            <Image
              src={spriteUrl}
              alt={pokemonName ?? `#${slot.pokemonId}`}
              width={48}
              height={48}
              loading="lazy"
              className={cn(
                "relative transition-opacity duration-[var(--transition-fast)]",
                spriteLoaded ? "opacity-100" : "opacity-0",
                state === "missing" && "opacity-30"
              )}
              onLoad={() => setSpriteLoaded(true)}
              onError={() => setSpriteError(true)}
            />
          )}

          {state === "registered" && (
            <div className="absolute top-0.5 right-0.5 flex size-4 items-center justify-center rounded-full bg-green-500 text-white">
              <Check className="size-2.5" />
            </div>
          )}
        </>
      )}
    </>
  )

  if (slot && pokemonName) {
    return (
      <Tooltip>
        <TooltipTrigger
          className={cellClassName}
          onClick={onClick}
          onKeyDown={handleKeyDown}
          render={
            <div role="button" tabIndex={0} />
          }
        >
          {cellContent}
        </TooltipTrigger>
        <TooltipContent>{pokemonName}</TooltipContent>
      </Tooltip>
    )
  }

  return (
    <div
      role="button"
      tabIndex={0}
      className={cellClassName}
      onClick={onClick}
      onKeyDown={handleKeyDown}
    >
      {cellContent}
    </div>
  )
}
