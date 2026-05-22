'use client'

import * as React from 'react'
import { motion, useReducedMotion } from 'motion/react'
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCenter,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Box } from '@/types/box'
import { useBoxStore } from '@/stores/useBoxStore'
import { BOX_LABEL_COLORS } from '@/lib/box-label-colors'
import { cn } from '@/lib/utils'

interface Props {
  boxes: Box[]
  activeIndex: number
  onSelect: (index: number) => void
}

/**
 * Horizontal tab strip listing all boxes. Click on a tab focuses that box.
 * Active tab is highlighted with a layoutId animation, similar to the
 * sidebar navigation indicator.
 *
 * Drag-and-drop reorder: each tab is a sortable. Drag activates after 6px
 * movement so a normal click still selects. Keyboard reorder works via
 * dnd-kit (Space picks up, arrows move, Space drops).
 *
 * Scroll behavior: when activeIndex changes, the tab is scrolled into view.
 */
export function BoxTabStrip({ boxes, activeIndex, onSelect }: Props) {
  const reduce = useReducedMotion()
  const containerRef = React.useRef<HTMLDivElement>(null)
  const tabRefs = React.useRef<Record<string, HTMLButtonElement | null>>({})
  const reorderBox = useBoxStore((s) => s.reorderBox)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  React.useEffect(() => {
    const id = boxes[activeIndex]?.id
    if (!id) return
    const el = tabRefs.current[id]
    if (!el) return
    el.scrollIntoView({
      behavior: reduce ? 'auto' : 'smooth',
      block: 'nearest',
      inline: 'center',
    })
  }, [activeIndex, boxes, reduce])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const fromIndex = boxes.findIndex((b) => b.id === active.id)
    const toIndex = boxes.findIndex((b) => b.id === over.id)
    if (fromIndex < 0 || toIndex < 0) return
    // arrayMove is just for prediction; actual state update goes through the
    // store. Keep onSelect in sync with the visual movement of the focused
    // tab so the box content doesn't desync.
    const wasActive = fromIndex === activeIndex
    reorderBox(boxes[fromIndex].id, toIndex)
    if (wasActive) {
      onSelect(toIndex)
    } else {
      // If active box was passed over during the move, its index may have
      // shifted by one. arrayMove on a length-N array reflects the same shift.
      const newOrder = arrayMove(boxes, fromIndex, toIndex)
      const newActive = newOrder.findIndex((b) => b.id === boxes[activeIndex]?.id)
      if (newActive >= 0 && newActive !== activeIndex) onSelect(newActive)
    }
  }

  if (boxes.length === 0) return null

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={boxes.map((b) => b.id)} strategy={horizontalListSortingStrategy}>
        <div
          ref={containerRef}
          className={cn(
            'flex gap-1 overflow-x-auto overflow-y-hidden pb-1.5 -mx-1 px-1',
            'scrollbar-thin [scrollbar-width:thin]',
          )}
          role="tablist"
          aria-label="Boxes"
        >
          {boxes.map((box, idx) => (
            <SortableTab
              key={box.id}
              box={box}
              isActive={idx === activeIndex}
              onSelect={() => onSelect(idx)}
              registerRef={(el) => {
                tabRefs.current[box.id] = el
              }}
              reduceMotion={!!reduce}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}

function SortableTab({
  box,
  isActive,
  onSelect,
  registerRef,
  reduceMotion,
}: {
  box: Box
  isActive: boolean
  onSelect: () => void
  registerRef: (el: HTMLButtonElement | null) => void
  reduceMotion: boolean
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: box.id,
  })
  const filled = box.slots.filter(Boolean).length
  const ringClass = box.label ? BOX_LABEL_COLORS[box.label] : ''
  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  }

  return (
    <button
      ref={(el) => {
        setNodeRef(el)
        registerRef(el)
      }}
      style={style}
      type="button"
      {...attributes}
      {...listeners}
      role="tab"
      aria-selected={isActive}
      tabIndex={isActive ? 0 : -1}
      onClick={onSelect}
      className={cn(
        'relative flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap shrink-0 cursor-grab active:cursor-grabbing',
        'transition-colors duration-150 ease-out touch-none',
        isActive
          ? 'text-[var(--foreground)]'
          : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--surface-2)]',
      )}
    >
      {isActive && (
        <motion.span
          layoutId="box-tab-active"
          className="absolute inset-0 rounded-md bg-[var(--surface-2)] border border-[var(--border)]"
          transition={
            reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 30 }
          }
          aria-hidden
        />
      )}
      {box.label && (
        <span
          className={cn('relative z-10 size-1.5 rounded-full', ringClass)}
          style={{ backgroundColor: 'currentColor' }}
          aria-hidden
        />
      )}
      <span className="relative z-10 max-w-[14rem] truncate">{box.name}</span>
      <span className="relative z-10 text-[10px] font-mono text-[var(--muted-foreground)] tabular-nums shrink-0">
        {filled}/30
      </span>
    </button>
  )
}
