'use client'

import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'
import { Type } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { BoxSlotCell } from './BoxSlotCell'
import { RegistrationModeToggle } from './RegistrationModeToggle'
import { FloatingActionBar } from './FloatingActionBar'
import type { Box, BoxSlot } from '@/types/box'
import { BOX_SIZE } from '@/types/box'
import { usePokedexStore } from '@/stores/usePokedexStore'
import { toSlotId } from '@/lib/dnd-utils'

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
  dndEnabled?: boolean
  showPokemonNames?: boolean
  onToggleShowNames?: () => void
}

export function BoxGrid({
  box,
  registrationMode,
  selectedSlotIndex,
  onSlotClick,
  getPokemonName,
  getSpriteUrl,
  className,
  dndEnabled = false,
  showPokemonNames = false,
  onToggleShowNames,
}: BoxGridProps) {
  const t = useTranslations('Boxes')
  const isRegistered = usePokedexStore((s) => s.isRegistered)

  const slots =
    box.slots.length >= BOX_SIZE
      ? box.slots.slice(0, BOX_SIZE)
      : [...box.slots, ...Array<null>(BOX_SIZE - box.slots.length).fill(null)]

  const sortableItems = slots.map((_, i) => toSlotId(box.id, i))

  const gridContent = (
    <div className="mx-auto grid grid-cols-6 gap-1.5 w-[336px] sm:w-[414px] md:w-[510px] lg:w-[630px] xl:w-[750px] max-w-full">
      {slots.map((slot, index) => {
        const slotWithLiveRegistered = slot
          ? { ...slot, registered: isRegistered(slot.pokemonId, slot.formId) }
          : null

        const locationKey = `${box.id}:${index}`
        const isSelected = registrationMode
          ? registrationMode.selectedKeys.has(locationKey)
          : selectedSlotIndex === index

        const handleClick = registrationMode
          ? (e?: React.MouseEvent) => registrationMode.handleSlotClick(box.id, index, e!, slot)
          : () => onSlotClick?.(index)

        return (
          <BoxSlotCell
            key={toSlotId(box.id, index)}
            slot={slotWithLiveRegistered}
            selected={isSelected}
            pokemonName={slot ? getPokemonName?.(slot) : undefined}
            spriteUrl={slot ? getSpriteUrl?.(slot) : undefined}
            onClick={handleClick}
            sortableId={dndEnabled ? toSlotId(box.id, index) : undefined}
            showName={showPokemonNames}
          />
        )
      })}
    </div>
  )

  const hasTopBar = !!registrationMode || !!onToggleShowNames

  return (
    <div className={cn('space-y-3', className)}>
      {hasTopBar && (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {registrationMode && (
              <RegistrationModeToggle
                isActive={registrationMode.isActive}
                onToggle={registrationMode.onToggle}
              />
            )}
            {onToggleShowNames && (
              <Button
                variant={showPokemonNames ? 'default' : 'outline'}
                size="sm"
                onClick={onToggleShowNames}
                aria-pressed={showPokemonNames}
                aria-label={t('toggleShowNames')}
                className="gap-1.5"
              >
                <Type className="size-3.5" />
                <span>{t('toggleShowNames')}</span>
              </Button>
            )}
          </div>
          {registrationMode && (
            <FloatingActionBar
              selectedCount={registrationMode.selectedKeys.size}
              onMarkRegistered={() => registrationMode.markSelected(true)}
              onUnmark={() => registrationMode.markSelected(false)}
            />
          )}
        </div>
      )}

      <div className="max-md:overflow-x-auto max-md:-mx-4 max-md:px-4">
        {dndEnabled ? (
          <SortableContext items={sortableItems} strategy={rectSortingStrategy}>
            {gridContent}
          </SortableContext>
        ) : (
          gridContent
        )}
      </div>
    </div>
  )
}
