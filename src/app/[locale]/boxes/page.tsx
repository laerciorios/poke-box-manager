'use client'

import * as React from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type Announcements,
  type ScreenReaderInstructions,
} from '@dnd-kit/core'
import { SortableContext, rectSortingStrategy, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { Plus, Grid3x3, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useBoxStore } from '@/stores/useBoxStore'
import { usePokedexStore } from '@/stores/usePokedexStore'
import { useSettingsStore } from '@/stores/useSettingsStore'
import type { BoxSlot } from '@/types/box'
import { Button } from '@/components/ui/button'
import { BoxView } from '@/components/boxes/BoxView'
import { BoxSlotPreview } from '@/components/boxes/BoxSlot'
import { MoveToDialog } from '@/components/boxes/MoveToDialog'
import { FloatingActionBar } from '@/components/boxes/FloatingActionBar'
import { FadeIn } from '@/components/motion'
import { toSlotId, fromSlotId } from '@/lib/dnd-utils'
import { applyAutoFill } from '@/lib/auto-fill'
import pokemonData from '@/data/pokemon.json'
import type { PokemonEntry } from '@/types/pokemon'
import { getPokemonName } from '@/lib/pokemon-names'

const POKEMON_INDEX = new Map<number, PokemonEntry>(
  (pokemonData as PokemonEntry[]).map((p) => [p.id, p]),
)

interface MoveRequest {
  fromBoxId: string
  fromIndex: number
}

export default function BoxesPage() {
  const t = useTranslations('Boxes')
  const tDnd = useTranslations('Boxes.dnd')
  const boxes = useBoxStore((s) => s.boxes)
  const addBox = useBoxStore((s) => s.addBox)
  const moveSlot = useBoxStore((s) => s.moveSlot)
  const reorderSlots = useBoxStore((s) => s.reorderSlots)
  const setBoxes = useBoxStore((s) => s.setBoxes)
  const setSlot = useBoxStore((s) => s.setSlot)
  const clearSlot = useBoxStore((s) => s.clearSlot)
  const variations = useSettingsStore((s) => s.variations)
  const activeGenerations = useSettingsStore((s) => s.activeGenerations)
  const locale = useSettingsStore((s) => s.locale)
  const isRegistered = usePokedexStore((s) => s.isRegistered)
  const toggleRegistered = usePokedexStore((s) => s.toggleRegistered)
  const reduce = useReducedMotion()

  const [activeId, setActiveId] = React.useState<string | null>(null)
  const [moveRequest, setMoveRequest] = React.useState<MoveRequest | null>(null)
  const [selection, setSelection] = React.useState<Record<string, Set<number>>>({})
  const [focusedBox, setFocusedBox] = React.useState<number>(0)

  // Reset focus if boxes shrink
  React.useEffect(() => {
    if (focusedBox >= boxes.length) setFocusedBox(Math.max(0, boxes.length - 1))
  }, [boxes.length, focusedBox])

  // Keyboard navigation between boxes
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return
      if (target?.isContentEditable) return
      if (boxes.length < 2) return
      const navKeys = ['ArrowLeft', 'ArrowRight', 'PageUp', 'PageDown', 'j', 'k', 'J', 'K']
      if (!navKeys.includes(e.key)) return
      e.preventDefault()
      setFocusedBox((prev) => {
        const left = e.key === 'ArrowLeft' || e.key === 'PageUp' || e.key === 'k' || e.key === 'K'
        const right = e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === 'j' || e.key === 'J'
        if (left) return (prev - 1 + boxes.length) % boxes.length
        if (right) return (prev + 1) % boxes.length
        return prev
      })
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [boxes.length])

  // Scroll focused box into view
  React.useEffect(() => {
    const box = boxes[focusedBox]
    if (!box) return
    const el = document.querySelector(`[data-box-id="${box.id}"]`)
    el?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'nearest' })
  }, [focusedBox, boxes, reduce])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const activeSlot = React.useMemo(() => {
    if (!activeId) return null
    const { boxId, slotIndex } = fromSlotId(activeId)
    return boxes.find((b) => b.id === boxId)?.slots[slotIndex] ?? null
  }, [activeId, boxes])

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null)
    const overId = event.over?.id ? String(event.over.id) : null
    if (!overId || overId === event.active.id) return
    const from = fromSlotId(String(event.active.id))
    const to = fromSlotId(overId)
    if (from.boxId === to.boxId) {
      reorderSlots(from.boxId, from.slotIndex, to.slotIndex)
    } else {
      moveSlot(from.boxId, from.slotIndex, to.boxId, to.slotIndex)
    }
  }

  const handleDragCancel = () => {
    setActiveId(null)
  }

  const selectionTotal = React.useMemo(
    () => Object.values(selection).reduce((sum, s) => sum + s.size, 0),
    [selection],
  )

  const toggleSelection = (boxId: string, slotIndex: number, additive: boolean) => {
    setSelection((prev) => {
      const next = additive ? { ...prev } : {}
      const set = new Set(next[boxId] ?? [])
      if (set.has(slotIndex)) set.delete(slotIndex)
      else set.add(slotIndex)
      if (set.size === 0) {
        delete next[boxId]
      } else {
        next[boxId] = set
      }
      return next
    })
  }

  const clearSelection = () => setSelection({})

  const selectionForBox = (boxId: string) => selection[boxId] ?? new Set<number>()

  const handleAutoFill = () => {
    if (boxes.length === 0) return
    const next = applyAutoFill(boxes, { variations, activeGenerations }, (id, formId) =>
      isRegistered(id, formId),
    )
    setBoxes(next)
  }

  const handleConfirmMove = (toBoxId: string, toIndex: number) => {
    if (!moveRequest) return
    moveSlot(moveRequest.fromBoxId, moveRequest.fromIndex, toBoxId, toIndex)
  }

  const applyToSelection = (fn: (boxId: string, index: number, slot: BoxSlot | null) => void) => {
    for (const [boxId, set] of Object.entries(selection)) {
      const box = boxes.find((b) => b.id === boxId)
      if (!box) continue
      for (const slotIndex of set) {
        fn(boxId, slotIndex, box.slots[slotIndex] ?? null)
      }
    }
  }

  const handleSelectionMarkRegistered = () => {
    applyToSelection((boxId, index, slot) => {
      if (!slot || slot.registered) return
      setSlot(boxId, index, { ...slot, registered: true })
      if (!isRegistered(slot.pokemonId, slot.formId)) {
        toggleRegistered(slot.pokemonId, slot.formId)
      }
    })
    clearSelection()
  }

  const handleSelectionUnmarkRegistered = () => {
    applyToSelection((boxId, index, slot) => {
      if (!slot || !slot.registered) return
      setSlot(boxId, index, { ...slot, registered: false })
    })
    clearSelection()
  }

  const handleSelectionClear = () => {
    applyToSelection((boxId, index, slot) => {
      if (slot) clearSlot(boxId, index)
    })
    clearSelection()
  }

  const handleSelectionMoveTo = () => {
    // Use the first selected slot as the origin reference for the dialog.
    const firstBoxId = Object.keys(selection)[0]
    if (!firstBoxId) return
    const firstIndex = [...selection[firstBoxId]][0]
    setMoveRequest({ fromBoxId: firstBoxId, fromIndex: firstIndex })
  }

  // Compute all sortable IDs flat for SortableContext
  const allIds = React.useMemo(
    () => boxes.flatMap((b) => b.slots.map((_, i) => toSlotId(b.id, i))),
    [boxes],
  )

  const screenReaderInstructions: ScreenReaderInstructions = {
    draggable: 'Press space or enter to pick up a slot, arrow keys to move, space to drop, escape to cancel.',
  }

  const announceFor = (id: string, kind: 'pickup' | 'over' | 'drop'): string => {
    const { boxId, slotIndex } = fromSlotId(id)
    const box = boxes.find((b) => b.id === boxId)
    if (!box) return ''
    const slot = box.slots[slotIndex]
    if (kind === 'pickup') {
      if (!slot) return tDnd('pickupEmpty', { index: slotIndex + 1, box: box.name })
      const pokemon = POKEMON_INDEX.get(slot.pokemonId)
      const name = pokemon ? getPokemonName(pokemon, locale) : String(slot.pokemonId)
      return tDnd('pickup', { name, index: slotIndex + 1, box: box.name })
    }
    if (kind === 'over') return tDnd('over', { index: slotIndex + 1, box: box.name })
    return tDnd('drop', { index: slotIndex + 1, box: box.name })
  }

  const announcements: Announcements = {
    onDragStart({ active }) {
      return announceFor(String(active.id), 'pickup')
    },
    onDragOver({ over }) {
      if (!over) return ''
      return announceFor(String(over.id), 'over')
    },
    onDragEnd({ active, over }) {
      if (!over) return tDnd('cancel')
      if (over.id === active.id) return tDnd('cancel')
      return announceFor(String(over.id), 'drop')
    },
    onDragCancel() {
      return tDnd('cancel')
    },
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <FadeIn>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[var(--muted-foreground)] mb-2">
              {t('eyebrow')}
            </p>
            <h1 className="font-display text-3xl md:text-4xl font-semibold tracking-tight">
              {t('title')}
            </h1>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">{t('subtitle')}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {boxes.length > 0 && (
              <Button
                variant="outline"
                onClick={handleAutoFill}
                title={t('autoFillTitle')}
              >
                <Sparkles className="size-4" />
                {t('autoFill')}
              </Button>
            )}
            <Button variant="accent" onClick={addBox}>
              <Plus className="size-4" />
              {t('addBox')}
            </Button>
          </div>
        </div>
      </FadeIn>

      {boxes.length === 0 ? (
        <FadeIn delay={0.1}>
          <div className="rounded-(--radius-xl) border border-dashed border-[var(--border)] bg-[var(--surface)] p-12 text-center">
            <div className="mx-auto size-12 rounded-md bg-[var(--accent-soft)] grid place-items-center text-[var(--accent)] mb-4">
              <Grid3x3 className="size-6" />
            </div>
            <h2 className="font-display text-xl font-semibold mb-2">{t('emptyTitle')}</h2>
            <p className="text-sm text-[var(--muted-foreground)] max-w-md mx-auto mb-6">
              {t('emptyDescription')}
            </p>
            <Button variant="accent" onClick={addBox}>
              <Plus className="size-4" />
              {t('createFirst')}
            </Button>
          </div>
        </FadeIn>
      ) : (
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
          accessibility={{ announcements, screenReaderInstructions }}
        >
          <SortableContext items={allIds} strategy={rectSortingStrategy}>
            <div className="space-y-6">
              <AnimatePresence initial={false}>
                {boxes.map((box, idx) => (
                  <motion.div
                    key={box.id}
                    layout={!reduce}
                    initial={reduce ? { opacity: 1 } : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
                    transition={reduce ? { duration: 0 } : { duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <BoxView
                      box={box}
                      index={idx}
                      total={boxes.length}
                      selectedSlots={selectionForBox(box.id)}
                      onToggleSelection={(slotIndex, additive) =>
                        toggleSelection(box.id, slotIndex, additive)
                      }
                      onRequestMove={(slotIndex) =>
                        setMoveRequest({ fromBoxId: box.id, fromIndex: slotIndex })
                      }
                      focused={idx === focusedBox && boxes.length > 1}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </SortableContext>

          <DragOverlay dropAnimation={null}>
            {activeId ? <BoxSlotPreview slot={activeSlot} /> : null}
          </DragOverlay>
        </DndContext>
      )}

      {boxes.length > 1 && (
        <div className="hidden md:flex fixed bottom-6 right-6 z-30 gap-1 rounded-md border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow-soft)] p-1">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setFocusedBox((p) => (p - 1 + boxes.length) % boxes.length)}
            aria-label={t('navigation.previous')}
            title={t('navigation.previous')}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <span className="text-[11px] font-mono tabular-nums text-[var(--muted-foreground)] grid place-items-center px-2">
            {focusedBox + 1} / {boxes.length}
          </span>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setFocusedBox((p) => (p + 1) % boxes.length)}
            aria-label={t('navigation.next')}
            title={t('navigation.next')}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      )}

      {moveRequest && (
        <MoveToDialog
          open
          onClose={() => setMoveRequest(null)}
          boxes={boxes}
          fromBoxId={moveRequest.fromBoxId}
          fromIndex={moveRequest.fromIndex}
          onConfirm={handleConfirmMove}
        />
      )}

      <FloatingActionBar
        count={selectionTotal}
        onClear={clearSelection}
        onMarkRegistered={handleSelectionMarkRegistered}
        onUnmarkRegistered={handleSelectionUnmarkRegistered}
        onClearSlots={handleSelectionClear}
        onMoveTo={handleSelectionMoveTo}
      />
    </div>
  )
}
