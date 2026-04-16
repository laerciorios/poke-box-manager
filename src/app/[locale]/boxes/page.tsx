'use client'

import { useEffect, useRef, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type Announcements,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { Button } from '@/components/ui/button'
import { BoxGrid } from '@/components/boxes/BoxGrid'
import { BoxNavigation } from '@/components/boxes/BoxNavigation'
import { BoxOverview } from '@/components/boxes/BoxOverview'
import { BoxDragLayer } from '@/components/boxes/BoxDragLayer'
import { AutoFillButton } from '@/components/boxes/AutoFillButton'
import { useBoxStore } from '@/stores/useBoxStore'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { usePokedexStore } from '@/stores/usePokedexStore'
import { useRegistrationMode } from '@/hooks/useRegistrationMode'
import { useSlotFocus } from '@/hooks/useSlotFocus'
import { useSwipeGesture } from '@/hooks/useSwipeGesture'
import { useKeyboardShortcut } from '@/contexts/KeyboardShortcutContext'
import { useAnnounce } from '@/contexts/AnnouncerContext'
import { fromSlotId } from '@/lib/dnd-utils'
import { getPokemonName, getFormName } from '@/lib/pokemon-names'
import pokemonData from '@/data/pokemon.json'
import formsData from '@/data/forms.json'
import type { PokemonEntry, PokemonForm } from '@/types/pokemon'
import type { BoxSlot } from '@/types/box'
import type { Locale } from '@/types/locale'

const pokemonById = new Map((pokemonData as unknown as PokemonEntry[]).map((p) => [p.id, p]))
const formsById = formsData as unknown as Record<string, PokemonForm>

function getSlotName(
  slot: { pokemonId: number; formId?: string },
  locale: Locale,
): string | undefined {
  if (slot.formId) {
    const form = formsById[slot.formId]
    return form ? getFormName(form, locale) : undefined
  }
  const pokemon = pokemonById.get(slot.pokemonId)
  return pokemon ? getPokemonName(pokemon, locale) : undefined
}

function getSpriteUrl(slot: { pokemonId: number; formId?: string; shiny?: boolean }): string | undefined {
  if (slot.formId) return formsById[slot.formId]?.sprite
  const pokemon = pokemonById.get(slot.pokemonId)
  if (!pokemon) return undefined
  if (slot.shiny && pokemon.spriteShiny) return pokemon.spriteShiny
  return pokemon.sprite
}

function hasShinySprite(slot: { pokemonId: number; formId?: string }): boolean {
  if (slot.formId) return false
  return !!pokemonById.get(slot.pokemonId)?.spriteShiny
}

interface ActiveDrag {
  boxId: string
  slotIndex: number
  slot: BoxSlot | null
}

export default function BoxesPage() {
  const t = useTranslations('Boxes')
  const tCommon = useTranslations('Common')
  const tA11y = useTranslations('accessibility')
  const locale = useLocale() as Locale
  const boxes = useBoxStore((s) => s.boxes)
  const createBox = useBoxStore((s) => s.createBox)
  const deleteBox = useBoxStore((s) => s.deleteBox)
  const moveSlot = useBoxStore((s) => s.moveSlot)
  const reorderSlots = useBoxStore((s) => s.reorderSlots)
  const toggleShiny = useBoxStore((s) => s.toggleShiny)
  const isRegistered = usePokedexStore((s) => s.isRegistered)
  const toggleRegistered = usePokedexStore((s) => s.toggleRegistered)
  const showPokemonNamesInBox = useSettingsStore((s) => s.showPokemonNamesInBox)
  const setShowPokemonNamesInBox = useSettingsStore((s) => s.setShowPokemonNamesInBox)
  const [activeBoxIndex, setActiveBoxIndex] = useState(0)
  const [activeDrag, setActiveDrag] = useState<ActiveDrag | null>(null)
  const [highlightSlotIndex, setHighlightSlotIndex] = useState<number | null>(null)
  const registration = useRegistrationMode()
  const announce = useAnnounce()
  const { focusedSlotIndex, moveFocus } = useSlotFocus()
  const isDraggingRef = useRef(false)
  const swipeContainerRef = useRef<HTMLDivElement>(null)

  // Navigate to a specific box+slot from ?box=<id>&slot=<index> URL params (set by search result click)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const boxId = params.get('box')
    const slotParam = params.get('slot')
    if (boxId && boxes.length > 0) {
      const idx = boxes.findIndex((b) => b.id === boxId)
      if (idx !== -1) {
        setActiveBoxIndex(idx)
        if (slotParam !== null) {
          const slotIndex = parseInt(slotParam, 10)
          setHighlightSlotIndex(Number.isFinite(slotIndex) ? slotIndex : null)
          // Clear highlight after 2s
          setTimeout(() => setHighlightSlotIndex(null), 2000)
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boxes.length])

  const safeIndex = Math.min(activeBoxIndex, Math.max(0, boxes.length - 1))
  const activeBox = boxes[safeIndex] ?? null

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8, delay: 150, tolerance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  function handleDragStart(event: DragStartEvent) {
    const { boxId, slotIndex } = fromSlotId(String(event.active.id))
    const box = boxes.find((b) => b.id === boxId)
    const slot = box?.slots[slotIndex] ?? null
    setActiveDrag({ boxId, slotIndex, slot })
    isDraggingRef.current = true
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const from = fromSlotId(String(active.id))
      const to = fromSlotId(String(over.id))
      if (from.boxId === to.boxId) {
        reorderSlots(from.boxId, from.slotIndex, to.slotIndex)
      } else {
        moveSlot(from.boxId, from.slotIndex, to.boxId, to.slotIndex)
      }
    }
    setActiveDrag(null)
    isDraggingRef.current = false
  }

  function handlePrevious() {
    setActiveBoxIndex((i) => Math.max(0, i - 1))
  }

  function handleNext() {
    setActiveBoxIndex((i) => Math.min(boxes.length - 1, i + 1))
  }

  // Swipe gesture for touch box navigation (guarded against active drag)
  useSwipeGesture(swipeContainerRef, {
    onSwipeLeft: () => { if (!isDraggingRef.current) handleNext() },
    onSwipeRight: () => { if (!isDraggingRef.current) handlePrevious() },
  })

  // Enter: toggle registration for the keyboard-focused slot (registration mode only)
  useKeyboardShortcut('box-enter-register', (e: KeyboardEvent) => {
    if (e.key !== 'Enter') return
    if (!registration.isActive) return
    if (focusedSlotIndex === null) return
    const slot = activeBox?.slots[focusedSlotIndex]
    if (!slot) return
    toggleRegistered(slot.pokemonId, slot.formId)
  })

  // Arrow-key slot navigation (suppressed during drag)
  useKeyboardShortcut('box-arrow-nav', (e: KeyboardEvent) => {
    if (isDraggingRef.current) return
    const arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']
    if (!arrowKeys.includes(e.key)) return
    e.preventDefault()
    const dirMap: Record<string, 'up' | 'down' | 'left' | 'right'> = {
      ArrowUp: 'up',
      ArrowDown: 'down',
      ArrowLeft: 'left',
      ArrowRight: 'right',
    }
    moveFocus(dirMap[e.key], boxes.length, safeIndex, setActiveBoxIndex)
  })

  function handleAddBox() {
    createBox(`Box ${boxes.length + 1}`)
  }

  function handleShinyToggle(boxId: string, slotIndex: number, slot: BoxSlot) {
    if (!slot.shiny && !isRegistered(slot.pokemonId, slot.formId)) {
      toggleRegistered(slot.pokemonId, slot.formId)
    }
    toggleShiny(boxId, slotIndex)
  }

  // Wraps single-slot registration click with screen reader announcement (task 5.1)
  function handleRegistrationSlotClick(
    boxId: string,
    slotIndex: number,
    event: React.MouseEvent,
    slot: BoxSlot | null,
  ) {
    const isPlainClick = !event.ctrlKey && !event.metaKey && !event.shiftKey
    const wasRegistered = slot ? isRegistered(slot.pokemonId, slot.formId) : false
    registration.handleSlotClick(boxId, slotIndex, event, slot)
    if (isPlainClick && slot) {
      const name = getSlotName(slot, locale) ?? `#${slot.pokemonId}`
      announce(
        wasRegistered
          ? tA11y('unregistered', { name })
          : tA11y('registered', { name }),
      )
    }
  }

  // Wraps bulk registration action with screen reader announcement (task 5.2)
  function handleMarkSelected(registered: boolean) {
    const count = registration.selectedKeys.size
    registration.markSelected(registered)
    if (count > 0) {
      announce(
        registered
          ? tA11y('bulkRegistered', { count })
          : tA11y('bulkUnregistered', { count }),
      )
    }
  }

  function handleDeleteBox(boxId: string) {
    const currentIndex = boxes.findIndex((box) => box.id === boxId)
    if (currentIndex === -1) return

    deleteBox(boxId)
    setActiveBoxIndex((prev) => {
      if (prev > currentIndex) return prev - 1
      if (prev === currentIndex) return Math.max(0, prev - 1)
      return prev
    })
  }

  const activeDragSlot = activeDrag?.slot ?? null
  const activeDragName = activeDragSlot ? getSlotName(activeDragSlot, locale) : undefined
  const activeDragSprite = activeDragSlot ? getSpriteUrl(activeDragSlot) : undefined

  const dndAnnouncements: Announcements = {
    onDragStart({ active }) {
      const { boxId, slotIndex } = fromSlotId(String(active.id))
      const box = boxes.find((b) => b.id === boxId)
      const slot = box?.slots[slotIndex] ?? null
      const name = slot ? (getSlotName(slot, locale) ?? `#${slot.pokemonId}`) : String(slotIndex + 1)
      return tA11y('dragStart', { name, position: slotIndex + 1 })
    },
    onDragOver({ active, over }) {
      if (!over) return undefined
      const { slotIndex } = fromSlotId(String(over.id))
      const name = activeDragName ?? String(active.id)
      return tA11y('dragOver', { name, position: slotIndex + 1 })
    },
    onDragEnd({ active, over }) {
      if (!over) return undefined
      const { slotIndex } = fromSlotId(String(over.id))
      const name = activeDragName ?? String(active.id)
      return tA11y('dragEnd', { name, position: slotIndex + 1 })
    },
    onDragCancel() {
      return tA11y('dragCancel')
    },
  }

  return (
    <DndContext
      sensors={sensors}
      accessibility={{ announcements: dndAnnouncements }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold">{t('pageTitle')}</h1>
          <div className="flex items-center gap-2">
            <AutoFillButton />
          </div>
        </div>

        {boxes.length === 0 ? (
          <div className="rounded-lg border border-dashed p-12 text-center">
            <p className="mb-4 text-muted-foreground">{t('emptyState')}</p>
            <Button onClick={() => createBox('Box 1')}>{t('createFirstBox')}</Button>
          </div>
        ) : (
          <>
            <BoxOverview
              boxes={boxes}
              activeBoxIndex={safeIndex}
              onSelectBox={setActiveBoxIndex}
              onAddBox={handleAddBox}
              onDeleteBox={handleDeleteBox}
              addBoxLabel={t('newBox')}
              deleteBoxLabel={tCommon('delete')}
              confirmDeleteTitle={
                t.has('confirmDeleteTitle') ? t('confirmDeleteTitle') : tCommon('confirm')
              }
              confirmDeleteDescription={t('confirmDeleteBoxWithPokemon')}
              confirmDeleteActionLabel={tCommon('delete')}
              cancelLabel={tCommon('cancel')}
            />

            {activeBox && (
              <div className="space-y-4">
                {/* swipeContainerRef on the navigation area keeps swipe away from the scrollable grid */}
                <div ref={swipeContainerRef}>
                  <BoxNavigation
                    boxId={activeBox.id}
                    boxName={activeBox.name}
                    boxLabel={activeBox.label}
                    currentIndex={safeIndex}
                    totalBoxes={boxes.length}
                    onPrevious={handlePrevious}
                    onNext={handleNext}
                    onKeyboardPrev={handlePrevious}
                    onKeyboardNext={handleNext}
                  />
                </div>
                <BoxGrid
                  box={activeBox}
                  registrationMode={{
                    isActive: registration.isActive,
                    selectedKeys: registration.selectedKeys,
                    onToggle: registration.toggleMode,
                    handleSlotClick: handleRegistrationSlotClick,
                    markSelected: handleMarkSelected,
                    onShinyToggle: handleShinyToggle,
                  }}
                  selectedSlotIndex={highlightSlotIndex}
                  keyboardFocusIndex={focusedSlotIndex}
                  getPokemonName={(slot) => getSlotName(slot, locale)}
                  getSpriteUrl={getSpriteUrl}
                  hasShinySprite={hasShinySprite}
                  dndEnabled={!registration.isActive}
                  showPokemonNames={showPokemonNamesInBox}
                  onToggleShowNames={() => setShowPokemonNamesInBox(!showPokemonNamesInBox)}
                />
              </div>
            )}
          </>
        )}
      </div>

      <BoxDragLayer
        slot={activeDragSlot}
        pokemonName={activeDragName}
        spriteUrl={activeDragSprite}
      />
    </DndContext>
  )
}
