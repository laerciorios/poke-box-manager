'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useInViewport } from '@/hooks/useInViewport'
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'
import { Type } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { PokemonTooltip } from '@/components/pokemon'
import { BoxSlotCell } from './BoxSlotCell'
import { RegistrationModeToggle } from './RegistrationModeToggle'
import { FloatingActionBar } from './FloatingActionBar'
import type { Box, BoxSlot } from '@/types/box'
import type { Tag } from '@/types/tags'
import { BOX_SIZE } from '@/types/box'
import { usePokedexStore } from '@/stores/usePokedexStore'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { toSlotId } from '@/lib/dnd-utils'

const GRID_COLS = 6
const GRID_ROWS = 5

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
  onShinyToggle: (boxId: string, slotIndex: number, slot: BoxSlot) => void
}

interface BoxGridProps {
  box: Box
  registrationMode?: RegistrationModeProps
  selectedSlotIndex?: number | null
  keyboardFocusIndex?: number | null
  onSlotClick?: (index: number) => void
  getPokemonName?: (slot: { pokemonId: number; formId?: string }) => string | undefined
  getSpriteUrl?: (slot: { pokemonId: number; formId?: string; shiny?: boolean }) => string | undefined
  hasShinySprite?: (slot: { pokemonId: number; formId?: string }) => boolean
  className?: string
  dndEnabled?: boolean
  showPokemonNames?: boolean
  onToggleShowNames?: () => void
  getSlotTags?: (slot: BoxSlot) => Tag[]
  isSlotDimmed?: (slotIndex: number) => boolean
}

export function BoxGrid({
  box,
  registrationMode,
  selectedSlotIndex,
  keyboardFocusIndex,
  onSlotClick,
  getPokemonName,
  getSpriteUrl,
  hasShinySprite,
  className,
  dndEnabled = false,
  showPokemonNames = false,
  onToggleShowNames,
  getSlotTags,
  isSlotDimmed,
}: BoxGridProps) {
  const t = useTranslations('Boxes')
  const tA11y = useTranslations('accessibility')
  const isRegistered = usePokedexStore((s) => s.isRegistered)
  const shinyTrackerEnabled = useSettingsStore((s) => s.shinyTrackerEnabled)

  // Roving tabindex — track the active slot index within the grid
  const [activeIndex, setActiveIndex] = useState(0)
  const activeIndexRef = useRef(0)
  const [gridRef, gridVisible] = useInViewport<HTMLDivElement>()

  // Sync active index when the external keyboardFocusIndex prop changes
  // (e.g. navigating to a specific slot from search)
  useEffect(() => {
    if (keyboardFocusIndex !== null && keyboardFocusIndex !== undefined && keyboardFocusIndex >= 0) {
      setActiveIndex(keyboardFocusIndex)
      activeIndexRef.current = keyboardFocusIndex
      // Programmatically focus the target slot
      const grid = gridRef.current
      if (grid) {
        const cells = grid.querySelectorAll<HTMLElement>('[role="gridcell"]')
        cells[keyboardFocusIndex]?.focus()
      }
    }
  }, [keyboardFocusIndex])

  const focusSlot = useCallback((index: number) => {
    const grid = gridRef.current
    if (!grid) return
    const cells = grid.querySelectorAll<HTMLElement>('[role="gridcell"]')
    cells[index]?.focus()
  }, [])

  function handleGridKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']
    if (!arrowKeys.includes(e.key)) return

    e.preventDefault()
    // Stop native event from bubbling to the window-level keyboard shortcut handler
    e.nativeEvent.stopPropagation()

    let newIndex = activeIndexRef.current

    if (e.key === 'ArrowRight') {
      newIndex = Math.min(BOX_SIZE - 1, newIndex + 1)
    } else if (e.key === 'ArrowLeft') {
      newIndex = Math.max(0, newIndex - 1)
    } else if (e.key === 'ArrowDown') {
      newIndex = Math.min(BOX_SIZE - 1, newIndex + GRID_COLS)
    } else if (e.key === 'ArrowUp') {
      newIndex = Math.max(0, newIndex - GRID_COLS)
    }

    setActiveIndex(newIndex)
    activeIndexRef.current = newIndex
    focusSlot(newIndex)
  }

  const slots =
    box.slots.length >= BOX_SIZE
      ? box.slots.slice(0, BOX_SIZE)
      : [...box.slots, ...Array<null>(BOX_SIZE - box.slots.length).fill(null)]

  const sortableItems = slots.map((_, i) => toSlotId(box.id, i))

  const gridContent = (
    <div
      ref={gridRef}
      role="grid"
      aria-label={tA11y('boxGrid', { boxName: box.name })}
      data-box-grid
      className="mx-auto grid grid-cols-6 gap-1.5 w-[336px] sm:w-[414px] md:w-[510px] lg:w-[630px] xl:w-[750px] max-w-full"
      onKeyDown={handleGridKeyDown}
    >
      {slots.map((slot, index) => {
        const slotWithLiveRegistered = slot
          ? { ...slot, registered: isRegistered(slot.pokemonId, slot.formId) }
          : null

        const locationKey = `${box.id}:${index}`
        const isSelected = registrationMode
          ? registrationMode.selectedKeys.has(locationKey)
          : selectedSlotIndex === index
        const isKeyboardFocused = keyboardFocusIndex === index

        const handleClick = registrationMode
          ? (e?: React.MouseEvent) => registrationMode.handleSlotClick(box.id, index, e!, slot)
          : () => onSlotClick?.(index)

        const useTooltip = !!slot && !registrationMode?.isActive

        const slotIsShiny = shinyTrackerEnabled && !!slot?.shiny

        // Roving tabindex: active slot gets 0, all others get -1
        const tabIndexValue = index === activeIndex ? 0 : -1

        const slotTags = slot && getSlotTags ? getSlotTags(slot) : undefined
        const dimmed = isSlotDimmed ? isSlotDimmed(index) : false

        const cell = (
          <BoxSlotCell
            key={toSlotId(box.id, index)}
            slot={slotWithLiveRegistered}
            selected={isSelected}
            keyboardFocused={isKeyboardFocused}
            pokemonName={slot ? getPokemonName?.(slot) : undefined}
            spriteUrl={slotWithLiveRegistered ? getSpriteUrl?.(slotWithLiveRegistered) : undefined}
            onClick={handleClick}
            sortableId={dndEnabled ? toSlotId(box.id, index) : undefined}
            showName={showPokemonNames}
            suppressTooltip={useTooltip}
            registrationModeActive={registrationMode?.isActive}
            hasShinySprite={slot ? hasShinySprite?.(slot) : undefined}
            isShiny={slotIsShiny}
            onShinyToggle={shinyTrackerEnabled && registrationMode && slot ? (e) => {
              e.stopPropagation()
              registrationMode.onShinyToggle(box.id, index, slot)
            } : undefined}
            tabIndexValue={tabIndexValue}
            visible={gridVisible}
            tags={slotTags}
            dimmed={dimmed}
          />
        )

        return useTooltip ? (
          <PokemonTooltip key={toSlotId(box.id, index)} pokemonId={slot.pokemonId} boxId={box.id} slotIndex={index}>
            {cell}
          </PokemonTooltip>
        ) : (
          cell
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

      <div className="max-md:overflow-x-auto max-md:-mx-4 max-md:px-4 max-md:[touch-action:manipulation]">
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
