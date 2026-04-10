'use client'

import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import {
  DndContext,
  type DragEndEvent,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
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
  const registration = useRegistrationMode()

  const safeIndex = Math.min(activeBoxIndex, Math.max(0, boxes.length - 1))
  const activeBox = boxes[safeIndex] ?? null

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  )

  function handleDragStart(event: DragStartEvent) {
    const { boxId, slotIndex } = fromSlotId(String(event.active.id))
    const box = boxes.find((b) => b.id === boxId)
    const slot = box?.slots[slotIndex] ?? null
    setActiveDrag({ boxId, slotIndex, slot })
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
  }

  function handlePrevious() {
    setActiveBoxIndex((i) => Math.max(0, i - 1))
  }

  function handleNext() {
    setActiveBoxIndex((i) => Math.min(boxes.length - 1, i + 1))
  }

  function handleAddBox() {
    createBox(`Box ${boxes.length + 1}`)
  }

  function handleShinyToggle(boxId: string, slotIndex: number, slot: BoxSlot) {
    if (!slot.shiny && !isRegistered(slot.pokemonId, slot.formId)) {
      toggleRegistered(slot.pokemonId, slot.formId)
    }
    toggleShiny(boxId, slotIndex)
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

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
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
                <BoxNavigation
                  boxId={activeBox.id}
                  boxName={activeBox.name}
                  boxLabel={activeBox.label}
                  currentIndex={safeIndex}
                  totalBoxes={boxes.length}
                  onPrevious={handlePrevious}
                  onNext={handleNext}
                />
                <BoxGrid
                  box={activeBox}
                  registrationMode={{
                    isActive: registration.isActive,
                    selectedKeys: registration.selectedKeys,
                    onToggle: registration.toggleMode,
                    handleSlotClick: registration.handleSlotClick,
                    markSelected: registration.markSelected,
                    onShinyToggle: handleShinyToggle,
                  }}
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
