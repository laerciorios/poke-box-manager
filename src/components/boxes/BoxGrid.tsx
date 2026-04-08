"use client"

import { cn } from "@/lib/utils"
import { BoxSlotCell } from "./BoxSlotCell"
import type { Box } from "@/types/box"
import { BOX_SIZE } from "@/types/box"

interface BoxGridProps {
  box: Box
  selectedSlotIndex?: number | null
  onSlotClick?: (index: number) => void
  getPokemonName?: (slot: { pokemonId: number; formId?: string }) => string | undefined
  getSpriteUrl?: (slot: { pokemonId: number; formId?: string }) => string | undefined
  className?: string
}

export function BoxGrid({
  box,
  selectedSlotIndex,
  onSlotClick,
  getPokemonName,
  getSpriteUrl,
  className,
}: BoxGridProps) {
  const slots = box.slots.length >= BOX_SIZE
    ? box.slots.slice(0, BOX_SIZE)
    : [...box.slots, ...Array<null>(BOX_SIZE - box.slots.length).fill(null)]

  return (
    <div
      className={cn(
        "max-md:overflow-x-auto max-md:-mx-4 max-md:px-4",
        className
      )}
    >
      <div className="grid grid-cols-6 gap-2 max-md:w-[360px]">
        {slots.map((slot, index) => (
          <BoxSlotCell
            key={index}
            slot={slot}
            selected={selectedSlotIndex === index}
            pokemonName={slot ? getPokemonName?.(slot) : undefined}
            spriteUrl={slot ? getSpriteUrl?.(slot) : undefined}
            onClick={() => onSlotClick?.(index)}
          />
        ))}
      </div>
    </div>
  )
}
