'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { BOX_LABEL_COLORS, BOX_LABEL_BORDER_COLORS } from '@/lib/box-label-colors'
import { usePokedexStore } from '@/stores/usePokedexStore'
import { useModalStack } from '@/contexts/ModalStackContext'
import type { Box } from '@/types/box'
import { BOX_SIZE } from '@/types/box'

interface BoxOverviewProps {
  boxes: Box[]
  activeBoxIndex: number
  onSelectBox: (index: number) => void
  onAddBox: () => void
  onDeleteBox: (boxId: string) => void
  addBoxLabel: string
  deleteBoxLabel: string
  confirmDeleteTitle: string
  confirmDeleteDescription: string
  confirmDeleteActionLabel: string
  cancelLabel: string
  className?: string
}

function makeKey(pokemonId: number, formId?: string): string {
  return formId ? `${pokemonId}:${formId}` : `${pokemonId}`
}

function getDotClass(
  slot: Box['slots'][number],
  label: string | undefined,
  registeredSet: Set<string>,
): string {
  if (!slot) return 'invisible'

  const isRegistered = registeredSet.has(makeKey(slot.pokemonId, slot.formId))

  if (label && BOX_LABEL_COLORS[label]) {
    return isRegistered
      ? BOX_LABEL_COLORS[label]
      : cn('border bg-transparent', BOX_LABEL_BORDER_COLORS[label])
  }

  return isRegistered ? 'bg-green-500' : 'border border-muted-foreground/40 bg-transparent'
}

function MiniGrid({
  box,
  isActive,
  registeredSet,
}: {
  box: Box
  isActive: boolean
  registeredSet: Set<string>
}) {
  const slots =
    box.slots.length >= BOX_SIZE
      ? box.slots.slice(0, BOX_SIZE)
      : [...box.slots, ...Array<null>(BOX_SIZE - box.slots.length).fill(null)]

  return (
    <div
      className={cn(
        'grid grid-cols-6 gap-px rounded-md border p-1 transition-colors motion-reduce:transition-none',
        isActive
          ? 'border-accent bg-accent/10'
          : 'border-border bg-card hover:border-muted-foreground/30',
      )}
    >
      {slots.map((slot, i) => (
        <div
          key={i}
          className={cn('size-1.5 rounded-full', getDotClass(slot, box.label, registeredSet))}
        />
      ))}
    </div>
  )
}

function AddBoxGrid() {
  return (
    <div className="relative">
      <div className="grid grid-cols-6 gap-px rounded-md border border-dashed border-border bg-card p-1 transition-colors motion-reduce:transition-none hover:border-accent/50">
        {Array.from({ length: BOX_SIZE }, (_, i) => (
          <div key={i} className="size-1.5 rounded-full bg-muted/40" />
        ))}
      </div>
      <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <span className="rounded-full border border-border bg-background/95 p-1.5 text-accent shadow-sm">
          <Plus className="size-3" />
        </span>
      </span>
    </div>
  )
}

export function BoxOverview({
  boxes,
  activeBoxIndex,
  onSelectBox,
  onAddBox,
  onDeleteBox,
  addBoxLabel,
  deleteBoxLabel,
  confirmDeleteTitle,
  confirmDeleteDescription,
  confirmDeleteActionLabel,
  cancelLabel,
  className,
}: BoxOverviewProps) {
  const registered = usePokedexStore((s) => s.registered)
  const registeredSet = new Set(registered)
  const [pendingDeleteBox, setPendingDeleteBox] = useState<Box | null>(null)
  const { push, pop } = useModalStack()

  useEffect(() => {
    if (pendingDeleteBox) {
      push('box-delete-confirm', () => setPendingDeleteBox(null))
    } else {
      pop('box-delete-confirm')
    }
  }, [pendingDeleteBox, push, pop])

  function requestDeleteBox(box: Box) {
    const hasPokemon = box.slots.some(Boolean)
    if (hasPokemon) {
      setPendingDeleteBox(box)
      return
    }
    onDeleteBox(box.id)
  }

  return (
    <div className={cn('flex flex-wrap gap-3', className)}>
      {boxes.map((box, index) => (
        <div key={box.id} className="group relative">
          <button
            type="button"
            className="flex cursor-pointer flex-col items-center gap-1"
            onClick={() => onSelectBox(index)}
          >
            <MiniGrid box={box} isActive={index === activeBoxIndex} registeredSet={registeredSet} />
            <span
              className={cn(
                'text-[10px] leading-tight',
                index === activeBoxIndex ? 'font-medium text-accent' : 'text-muted-foreground',
              )}
            >
              {box.name}
            </span>
          </button>

          <button
            type="button"
            aria-label={deleteBoxLabel}
            title={deleteBoxLabel}
            className="absolute -top-2 -right-2 z-10 inline-flex size-6 max-md:min-h-[44px] max-md:min-w-[44px] cursor-pointer items-center justify-center rounded-full bg-card/95 text-muted-foreground opacity-0 ring-1 ring-border/70 shadow-sm transition-all motion-reduce:transition-none hover:bg-destructive/15 hover:text-destructive hover:ring-destructive/40 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring group-hover:translate-y-0 group-hover:opacity-100 translate-y-0.5"
            onClick={(event) => {
              event.stopPropagation()
              requestDeleteBox(box)
            }}
          >
            <Trash2 className="size-3" />
          </button>
        </div>
      ))}

      <button
        type="button"
        className="flex cursor-pointer flex-col items-center gap-1"
        onClick={onAddBox}
      >
        <AddBoxGrid />
        <span className="text-[10px] leading-tight text-accent">{addBoxLabel}</span>
      </button>

      <Dialog
        open={Boolean(pendingDeleteBox)}
        onOpenChange={(open) => !open && setPendingDeleteBox(null)}
      >
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>{confirmDeleteTitle}</DialogTitle>
            <DialogDescription>{confirmDeleteDescription}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={() => setPendingDeleteBox(null)}
            >
              {cancelLabel}
            </Button>
            <Button
              variant="destructive"
              className="cursor-pointer"
              onClick={() => {
                if (!pendingDeleteBox) return
                onDeleteBox(pendingDeleteBox.id)
                setPendingDeleteBox(null)
              }}
            >
              {confirmDeleteActionLabel}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
