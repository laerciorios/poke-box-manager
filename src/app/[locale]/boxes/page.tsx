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
import { Plus, Grid3x3, Sparkles, ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useBoxStore } from '@/stores/useBoxStore'
import { usePokedexStore } from '@/stores/usePokedexStore'
import { useSettingsStore } from '@/stores/useSettingsStore'
import type { BoxSlot } from '@/types/box'
import { Button } from '@/components/ui/button'
import { BoxView } from '@/components/boxes/BoxView'
import { BoxSlotPreview } from '@/components/boxes/BoxSlot'
import { BoxTabStrip } from '@/components/boxes/BoxTabStrip'
import { BoxOverviewDrawer } from '@/components/boxes/BoxOverviewDrawer'
import { MoveToDialog } from '@/components/boxes/MoveToDialog'
import { FloatingActionBar } from '@/components/boxes/FloatingActionBar'
import { TagFilterBar } from '@/components/tags/TagFilterBar'
import { useToast } from '@/components/ui/toast'
import { FadeIn } from '@/components/motion'
import { toSlotId, fromSlotId } from '@/lib/dnd-utils'
import { applyAutoFill, buildOverflowBoxes } from '@/lib/auto-fill'
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
  const insertBoxAfter = useBoxStore((s) => s.insertBoxAfter)
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
  const tToast = useTranslations('Toasts')
  const { push: pushToast } = useToast()

  const [activeId, setActiveId] = React.useState<string | null>(null)
  const [moveRequest, setMoveRequest] = React.useState<MoveRequest | null>(null)
  const [selection, setSelection] = React.useState<Record<string, Set<number>>>({})
  const [focusedBox, setFocusedBox] = React.useState<number>(0)
  const [tagFilter, setTagFilter] = React.useState<string[]>([])
  const [overviewOpen, setOverviewOpen] = React.useState(false)

  // Compute which slot indices to dim per box, given the active tag filter.
  // A slot is dimmed if at least one filter tag isn't on its `tagIds`.
  const dimmedByBox = React.useMemo(() => {
    if (tagFilter.length === 0) return new Map<string, Set<number>>()
    const filterSet = new Set(tagFilter)
    const result = new Map<string, Set<number>>()
    for (const box of boxes) {
      const dimmed = new Set<number>()
      box.slots.forEach((slot, i) => {
        if (!slot) {
          dimmed.add(i)
          return
        }
        const slotTags = new Set(slot.tagIds ?? [])
        const hasAll = [...filterSet].every((t) => slotTags.has(t))
        if (!hasAll) dimmed.add(i)
      })
      result.set(box.id, dimmed)
    }
    return result
  }, [boxes, tagFilter])

  // Reset focus if boxes shrink
  React.useEffect(() => {
    if (focusedBox >= boxes.length) setFocusedBox(Math.max(0, boxes.length - 1))
  }, [boxes.length, focusedBox])

  // Deep-link by hash: /boxes#<boxId> focuses that box on mount and on hash change.
  React.useEffect(() => {
    const resolveHash = () => {
      const hash = typeof window !== 'undefined' ? window.location.hash.slice(1) : ''
      if (!hash) return
      const idx = boxes.findIndex((b) => b.id === hash)
      if (idx >= 0) setFocusedBox(idx)
    }
    resolveHash()
    window.addEventListener('hashchange', resolveHash)
    return () => window.removeEventListener('hashchange', resolveHash)
  }, [boxes])

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

  // (Removed: previously scrolled the focused box into view in a long
  // stacked layout. Single-box view doesn't need it — focus is the
  // only thing rendered.)

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

  const [autoFillToast, setAutoFillToast] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!autoFillToast) return
    const id = window.setTimeout(() => setAutoFillToast(null), 3500)
    return () => window.clearTimeout(id)
  }, [autoFillToast])

  const handleAutoFill = () => {
    const startingBoxes = boxes.length === 0 ? [{
      id: crypto.randomUUID(),
      name: 'Box 1',
      slots: Array.from({ length: 30 }, () => null),
    }] : boxes
    const result = applyAutoFill(
      startingBoxes,
      { variations, activeGenerations },
      (id, formId) => isRegistered(id, formId),
    )

    // Materialize any candidates that didn't fit into the existing layout
    // by appending new boxes. This is what the user expects when they hit
    // "Preencher" on an empty grid or a grid that's already half-full.
    const overflowBoxes =
      result.remaining.length > 0
        ? buildOverflowBoxes(result.remaining, result.boxes.length, (id, formId) =>
            isRegistered(id, formId),
          )
        : []

    const next = [...result.boxes, ...overflowBoxes]
    const totalFilled = result.filledCount + result.remaining.length

    if (totalFilled === 0) {
      setAutoFillToast(t('autoFillNoop'))
      return
    }

    setBoxes(next)
    setAutoFillToast(t('autoFillDone', { count: totalFilled, boxes: overflowBoxes.length }))
  }

  /**
   * Adds a new box right after the currently focused one and focuses it.
   * On an empty state, falls back to appending and focusing the first box.
   */
  const handleAddBox = () => {
    if (boxes.length === 0) {
      addBox()
      setFocusedBox(0)
      return
    }
    const newId = insertBoxAfter(focusedBox)
    if (newId) {
      // Position is focusedBox + 1 by definition of insertBoxAfter.
      setFocusedBox(focusedBox + 1)
    }
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
    let cleared = 0
    applyToSelection((boxId, index, slot) => {
      if (slot) {
        clearSlot(boxId, index)
        cleared++
      }
    })
    clearSelection()
    if (cleared > 0) {
      pushToast({ title: tToast('slotsCleared', { count: cleared }) })
    }
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

  // Render layout server-side; once boxes hydrate from IndexedDB the UI updates
  // in place. Avoiding a skeleton gate keeps LCP cheap and the SSR honest.
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
              <>
                <Button
                  variant="outline"
                  onClick={() => setOverviewOpen(true)}
                  title={t('overview.open')}
                >
                  <LayoutGrid className="size-4" />
                  {t('overview.button')}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleAutoFill}
                  title={t('autoFillTitle')}
                >
                  <Sparkles className="size-4" />
                  {t('autoFill')}
                </Button>
              </>
            )}
            <Button variant="accent" onClick={handleAddBox}>
              <Plus className="size-4" />
              {t('addBox')}
            </Button>
          </div>
        </div>
      </FadeIn>

      {boxes.length > 0 && (
        <div className="mb-4 space-y-3">
          <BoxTabStrip
            boxes={boxes}
            activeIndex={focusedBox}
            onSelect={setFocusedBox}
          />
          <TagFilterBar selected={tagFilter} onChange={setTagFilter} />
        </div>
      )}

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
            <Button variant="accent" onClick={handleAddBox}>
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
          {/*
            Single-box view: only the focused box is mounted. Switching tabs
            triggers AnimatePresence crossfade. SortableContext keeps every
            slot id flat so cross-box drag would still work — but DnD across
            boxes now happens via the MoveTo dialog since other boxes aren't
            visible. Within the focused box drag still swaps/reorders.
          */}
          <SortableContext items={allIds} strategy={rectSortingStrategy}>
            <AnimatePresence mode="wait" initial={false}>
              {(() => {
                const box = boxes[focusedBox]
                if (!box) return null
                return (
                  <motion.div
                    key={box.id}
                    initial={reduce ? { opacity: 1 } : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? { opacity: 0 } : { opacity: 0, y: -4 }}
                    transition={
                      reduce ? { duration: 0 } : { duration: 0.25, ease: [0.22, 1, 0.36, 1] }
                    }
                  >
                    <BoxView
                      box={box}
                      index={focusedBox}
                      total={boxes.length}
                      selectedSlots={selectionForBox(box.id)}
                      dimmedSlots={dimmedByBox.get(box.id)}
                      onToggleSelection={(slotIndex, additive) =>
                        toggleSelection(box.id, slotIndex, additive)
                      }
                      onRequestMove={(slotIndex) =>
                        setMoveRequest({ fromBoxId: box.id, fromIndex: slotIndex })
                      }
                      focused={boxes.length > 1}
                    />
                  </motion.div>
                )
              })()}
            </AnimatePresence>
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

      <BoxOverviewDrawer
        open={overviewOpen}
        onClose={() => setOverviewOpen(false)}
        boxes={boxes}
        activeIndex={focusedBox}
        onSelect={setFocusedBox}
      />

      <AnimatePresence>
        {autoFillToast && (
          <motion.div
            role="status"
            aria-live="polite"
            initial={reduce ? { opacity: 1 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
            transition={reduce ? { duration: 0 } : { duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 rounded-md border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow-pop)] px-4 py-2 text-sm font-medium"
          >
            {autoFillToast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
