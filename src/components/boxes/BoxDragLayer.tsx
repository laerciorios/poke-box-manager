"use client"

import Image from "next/image"
import { DragOverlay } from "@dnd-kit/core"
import { SpritePlaceholder } from "@/components/pokemon"
import type { BoxSlot } from "@/types/box"

interface BoxDragLayerProps {
  slot: BoxSlot | null
  pokemonName?: string
  spriteUrl?: string
}

export function BoxDragLayer({ slot, pokemonName, spriteUrl }: BoxDragLayerProps) {
  if (!slot) return null

  return (
    <DragOverlay dropAnimation={null} zIndex={100}>
      <div className="flex size-14 items-center justify-center rounded-lg bg-card drop-shadow-xl scale-[1.2] motion-reduce:transition-none motion-reduce:transform-none">
        {spriteUrl ? (
          <Image
            src={spriteUrl}
            alt={pokemonName ?? `#${slot.pokemonId}`}
            width={56}
            height={56}
            className="size-full object-contain"
          />
        ) : (
          <SpritePlaceholder size={48} />
        )}
      </div>
    </DragOverlay>
  )
}
