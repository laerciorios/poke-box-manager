'use client'

import * as React from 'react'
import { motion } from 'motion/react'
import { useTranslations } from 'next-intl'
import { Trash2, Edit2, Check, X, Sparkles, Eraser, MoveRight, ImagePlus, Tags as TagsIcon } from 'lucide-react'
import type { Box } from '@/types/box'
import { useBoxStore } from '@/stores/useBoxStore'
import { usePokedexStore } from '@/stores/usePokedexStore'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { BoxSlotCell } from './BoxSlot'
import { BoxColorPicker } from './BoxColorPicker'
import { BoxActionsMenu } from './BoxActionsMenu'
import { ContextMenu, type ContextMenuItem } from './ContextMenu'
import { PokemonPicker } from '@/components/pokemon/PokemonPicker'
import { TagSlotPicker } from '@/components/tags/TagSlotPicker'
import { Dialog } from '@/components/ui/dialog'
import { BOX_LABEL_COLORS } from '@/lib/box-label-colors'
import { cn } from '@/lib/utils'

interface Props {
  box: Box
  index: number
  total: number
  selectedSlots: Set<number>
  dimmedSlots?: Set<number>
  onToggleSelection: (slotIndex: number, additive: boolean) => void
  onRequestMove: (slotIndex: number) => void
  focused?: boolean
}

export function BoxView({
  box,
  index,
  total,
  selectedSlots,
  dimmedSlots,
  onToggleSelection,
  onRequestMove,
  focused,
}: Props) {
  const t = useTranslations('Boxes')
  const tMenu = useTranslations('Boxes.slotMenu')
  const renameBox = useBoxStore((s) => s.renameBox)
  const deleteBox = useBoxStore((s) => s.deleteBox)
  const setSlot = useBoxStore((s) => s.setSlot)
  const clearSlot = useBoxStore((s) => s.clearSlot)
  const toggleShiny = useBoxStore((s) => s.toggleShiny)
  const setBoxLabel = useBoxStore((s) => s.setBoxLabel)
  const reorderBox = useBoxStore((s) => s.reorderBox)
  const toggleRegistered = usePokedexStore((s) => s.toggleRegistered)
  const isRegistered = usePokedexStore((s) => s.isRegistered)
  const shinyTrackerEnabled = useSettingsStore((s) => s.shinyTrackerEnabled)

  const [editing, setEditing] = React.useState(false)
  const [draftName, setDraftName] = React.useState(box.name)
  const [pickerOpen, setPickerOpen] = React.useState(false)
  const [activeSlot, setActiveSlot] = React.useState<number | null>(null)
  const [menu, setMenu] = React.useState<{ x: number; y: number; slotIndex: number } | null>(null)
  const [tagPicker, setTagPicker] = React.useState<{ x: number; y: number; slotIndex: number } | null>(null)
  const [deleteOpen, setDeleteOpen] = React.useState(false)

  const filled = box.slots.filter(Boolean).length
  const ringClass = box.label ? BOX_LABEL_COLORS[box.label] : ''

  function openPicker(slotIndex: number) {
    setActiveSlot(slotIndex)
    setPickerOpen(true)
  }

  function handleSlotActivate(slotIndex: number) {
    const slot = box.slots[slotIndex]
    if (!slot) {
      openPicker(slotIndex)
    } else {
      openPicker(slotIndex) // Click on filled slot opens picker for swap; clearing is via context menu.
    }
  }

  function handleToggleRegistered(slotIndex: number) {
    const slot = box.slots[slotIndex]
    if (!slot) return
    // The Pokédex store is the source of truth. toggleRegistered also
    // mirrors the new state back into slot.registered via syncRegistration,
    // so we never need to touch the slot here.
    toggleRegistered(slot.pokemonId, slot.formId)
  }

  function openContextMenu(
    e: React.MouseEvent | React.TouchEvent,
    anchor: { x: number; y: number },
    slotIndex: number,
  ) {
    e.preventDefault?.()
    setMenu({ x: anchor.x, y: anchor.y, slotIndex })
  }

  const buildMenuItems = (slotIndex: number): ContextMenuItem[] => {
    const slot = box.slots[slotIndex] ?? null
    const isSelected = selectedSlots.has(slotIndex)
    const items: ContextMenuItem[] = []
    items.push({
      label: slot ? tMenu('change') : t('emptySlot', { index: slotIndex + 1 }),
      icon: <ImagePlus />,
      onSelect: () => openPicker(slotIndex),
    })
    if (slot) {
      items.push({
        label: tMenu('clear'),
        icon: <Eraser />,
        destructive: true,
        onSelect: () => clearSlot(box.id, slotIndex),
      })
      if (shinyTrackerEnabled) {
        items.push({
          label: slot.shiny ? tMenu('untoggleShiny') : tMenu('toggleShiny'),
          icon: <Sparkles />,
          onSelect: () => toggleShiny(box.id, slotIndex),
        })
      }
      items.push({
        label: slot.registered ? tMenu('untoggleRegistered') : tMenu('toggleRegistered'),
        icon: <Check />,
        onSelect: () => handleToggleRegistered(slotIndex),
      })
      items.push({
        label: tMenu('moveTo'),
        icon: <MoveRight />,
        onSelect: () => onRequestMove(slotIndex),
      })
      items.push({
        label: tMenu('tags'),
        icon: <TagsIcon />,
        onSelect: () => {
          // Anchor the picker at the menu position.
          if (menu) setTagPicker({ x: menu.x, y: menu.y, slotIndex })
        },
      })
    }
    items.push({
      label: isSelected ? tMenu('deselect') : tMenu('select'),
      onSelect: () => onToggleSelection(slotIndex, true),
    })
    return items
  }

  return (
    <motion.section
      layout
      className={cn(
        'relative rounded-(--radius-xl) border border-[var(--border)] bg-[var(--card)] p-5 md:p-6 overflow-hidden',
        focused && 'ring-2 ring-[var(--accent)] ring-offset-2 ring-offset-[var(--background)]',
      )}
      data-box-id={box.id}
    >
      {box.label && (
        <div
          aria-hidden
          className={cn('absolute inset-y-0 left-0 w-1', ringClass)}
        />
      )}
      <header className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--muted-foreground)] tabular-nums">
            {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
          {editing ? (
            <div className="flex items-center gap-1">
              <Input
                autoFocus
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    renameBox(box.id, draftName.trim() || box.name)
                    setEditing(false)
                  } else if (e.key === 'Escape') {
                    setDraftName(box.name)
                    setEditing(false)
                  }
                }}
                className="h-7 text-sm w-40"
              />
              <Button
                size="icon"
                variant="ghost"
                onClick={() => {
                  renameBox(box.id, draftName.trim() || box.name)
                  setEditing(false)
                }}
                aria-label={t('confirmRename')}
              >
                <Check className="size-3.5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => {
                  setDraftName(box.name)
                  setEditing(false)
                }}
                aria-label={t('cancelRename')}
              >
                <X className="size-3.5" />
              </Button>
            </div>
          ) : (
            <h3 className="font-display text-lg font-semibold tracking-tight truncate">
              {box.name}
            </h3>
          )}
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[11px] font-mono text-[var(--muted-foreground)] tabular-nums hidden sm:inline">
            {filled} / 30
          </span>
          {!editing && (
            <>
              <BoxColorPicker
                current={box.label}
                onChange={(c) => setBoxLabel(box.id, c)}
              />
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setEditing(true)}
                aria-label={t('rename')}
              >
                <Edit2 className="size-3.5" />
              </Button>
              <BoxActionsMenu
                boxName={box.name}
                canMoveUp={index > 0}
                canMoveDown={index < total - 1}
                onClearAll={() => {
                  box.slots.forEach((slot, i) => {
                    if (slot) clearSlot(box.id, i)
                  })
                }}
                onMarkAllRegistered={() => {
                  box.slots.forEach((slot, i) => {
                    if (!slot || slot.registered) return
                    setSlot(box.id, i, { ...slot, registered: true })
                    if (!isRegistered(slot.pokemonId, slot.formId)) {
                      toggleRegistered(slot.pokemonId, slot.formId)
                    }
                  })
                }}
                onUnmarkAllRegistered={() => {
                  box.slots.forEach((slot, i) => {
                    if (!slot || !slot.registered) return
                    setSlot(box.id, i, { ...slot, registered: false })
                  })
                }}
                onMoveUp={() => reorderBox(box.id, index - 1)}
                onMoveDown={() => reorderBox(box.id, index + 1)}
              />
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setDeleteOpen(true)}
                aria-label={t('deleteBox')}
                className="text-[var(--muted-foreground)] hover:text-[var(--destructive)]"
              >
                <Trash2 className="size-3.5" />
              </Button>
            </>
          )}
        </div>
      </header>

      <div className="grid grid-cols-6 gap-1.5 md:gap-2">
        {box.slots.map((slot, i) => (
          <BoxSlotCell
            key={`${box.id}:${i}`}
            slot={slot}
            index={i}
            boxId={box.id}
            selected={selectedSlots.has(i)}
            dimmed={dimmedSlots?.has(i) ?? false}
            onActivate={({ shift, meta }) => {
              if (shift || meta) {
                onToggleSelection(i, true)
              } else {
                handleSlotActivate(i)
              }
            }}
            onToggleRegistered={slot ? () => handleToggleRegistered(i) : undefined}
            onToggleShiny={
              slot && shinyTrackerEnabled ? () => toggleShiny(box.id, i) : undefined
            }
            onContextMenu={(e, anchor) => openContextMenu(e, anchor, i)}
          />
        ))}
      </div>

      <ContextMenu
        open={menu !== null}
        x={menu?.x ?? 0}
        y={menu?.y ?? 0}
        items={menu ? buildMenuItems(menu.slotIndex) : []}
        onClose={() => setMenu(null)}
      />

      {tagPicker && (
        <TagSlotPicker
          open
          x={tagPicker.x}
          y={tagPicker.y}
          boxId={box.id}
          slotIndex={tagPicker.slotIndex}
          onClose={() => setTagPicker(null)}
        />
      )}

      <PokemonPicker
        open={pickerOpen}
        onClose={() => {
          setPickerOpen(false)
          setActiveSlot(null)
        }}
        onPick={(pokemon) => {
          if (activeSlot === null) return
          const existing = box.slots[activeSlot]
          setSlot(box.id, activeSlot, {
            pokemonId: pokemon.id,
            registered: isRegistered(pokemon.id),
            shiny: existing?.shiny,
            note: existing?.note,
            tagIds: existing?.tagIds,
          })
        }}
      />

      <Dialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title={t('deleteBoxTitle', { name: box.name })}
        description={t('deleteBoxDescription', {
          filled: box.slots.filter(Boolean).length,
        })}
        size="sm"
        footer={
          <div className="flex justify-end gap-2 w-full">
            <Button variant="ghost" onClick={() => setDeleteOpen(false)}>
              {t('deleteBoxCancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                deleteBox(box.id)
                setDeleteOpen(false)
              }}
            >
              <Trash2 className="size-3.5" />
              {t('deleteBoxConfirm')}
            </Button>
          </div>
        }
      >
        <p className="text-sm text-[var(--muted-foreground)]">
          {t('deleteBoxWarning')}
        </p>
      </Dialog>
    </motion.section>
  )
}

