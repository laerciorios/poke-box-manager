"use client"

import { cn } from "@/lib/utils"
import { BoxSlotCell } from "./BoxSlotCell"
import { RegistrationModeToggle } from "./RegistrationModeToggle"
import { FloatingActionBar } from "./FloatingActionBar"
import type { Box, BoxSlot } from "@/types/box"
import { BOX_SIZE } from "@/types/box"
import { usePokedexStore } from "@/stores/usePokedexStore"

interface RegistrationModeProps {
  isActive: boolean
  selectedKeys: Set<string>
  onToggle: () => void
  handleSlotClick: (
    boxId: string,
    slotIndex: number,
    event: React.MouseEvent,
    slot: BoxSlot | null,
  ) => void
  markSelected: (registered: boolean) => void
}

interface BoxGridProps {
  box: Box
  registrationMode?: RegistrationModeProps
  selectedSlotIndex?: number | null
  onSlotClick?: (index: number) => void
  getPokemonName?: (slot: { pokemonId: number; formId?: string }) => string | undefined
  getSpriteUrl?: (slot: { pokemonId: number; formId?: string }) => string | undefined
  className?: string
}

export function BoxGrid({
  box,
  registrationMode,
  selectedSlotIndex,
  onSlotClick,
  getPokemonName,
  getSpriteUrl,
  className,
}: BoxGridProps) {
  // Task 4.1: derive live registered state from pokedex store at render time
  const isRegistered = usePokedexStore((s) => s.isRegistered)

  const slots = box.slots.length >= BOX_SIZE
    ? box.slots.slice(0, BOX_SIZE)
    : [...box.slots, ...Array<null>(BOX_SIZE - box.slots.length).fill(null)]

  return (
    <div className={cn("space-y-3", className)}>
      {/* Task 4.3: render toggle and floating bar alongside the grid */}
      {registrationMode && (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <RegistrationModeToggle
            isActive={registrationMode.isActive}
            onToggle={registrationMode.onToggle}
          />
          <FloatingActionBar
            selectedCount={registrationMode.selectedKeys.size}
            onMarkRegistered={() => registrationMode.markSelected(true)}
            onUnmark={() => registrationMode.markSelected(false)}
          />
        </div>
      )}

      <div className="max-md:overflow-x-auto max-md:-mx-4 max-md:px-4">
        <div className="grid grid-cols-6 gap-2 max-md:w-[360px]">
          {slots.map((slot, index) => {
            // Task 4.1: override registered with live pokedex state
            const slotWithLiveRegistered = slot
              ? { ...slot, registered: isRegistered(slot.pokemonId, slot.formId) }
              : null

            // Task 4.2: compute selection state and click handler
            const locationKey = `${box.id}:${index}`
            const isSelected = registrationMode
              ? registrationMode.selectedKeys.has(locationKey)
              : selectedSlotIndex === index

            const handleClick = registrationMode
              ? (e?: React.MouseEvent) =>
                  registrationMode.handleSlotClick(box.id, index, e!, slot)
              : () => onSlotClick?.(index)

            return (
              <BoxSlotCell
                key={index}
                slot={slotWithLiveRegistered}
                selected={isSelected}
                pokemonName={slot ? getPokemonName?.(slot) : undefined}
                spriteUrl={slot ? getSpriteUrl?.(slot) : undefined}
                onClick={handleClick}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
