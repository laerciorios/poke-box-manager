'use client'

import * as React from 'react'
import { motion } from 'motion/react'
import { Trash2, Edit2, Check, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useBoxStore } from '@/stores/useBoxStore'
import { usePokedexStore } from '@/stores/usePokedexStore'
import type { Box } from '@/types/box'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { BoxSlotCell } from './BoxSlot'
import { PokemonPicker } from '@/components/pokemon/PokemonPicker'

interface Props {
  box: Box
  index: number
  total: number
}

export function BoxView({ box, index, total }: Props) {
  const t = useTranslations('Boxes')
  const renameBox = useBoxStore((s) => s.renameBox)
  const deleteBox = useBoxStore((s) => s.deleteBox)
  const setSlot = useBoxStore((s) => s.setSlot)
  const clearSlot = useBoxStore((s) => s.clearSlot)
  const toggleRegistered = usePokedexStore((s) => s.toggleRegistered)
  const isRegistered = usePokedexStore((s) => s.isRegistered)

  const [editing, setEditing] = React.useState(false)
  const [draftName, setDraftName] = React.useState(box.name)
  const [pickerOpen, setPickerOpen] = React.useState(false)
  const [activeSlot, setActiveSlot] = React.useState<number | null>(null)

  const filled = box.slots.filter(Boolean).length

  function handleSlotClick(slotIndex: number) {
    const slot = box.slots[slotIndex]
    if (!slot) {
      setActiveSlot(slotIndex)
      setPickerOpen(true)
    } else {
      // Toggle clear for now (Phase 2 will add context menu)
      clearSlot(box.id, slotIndex)
    }
  }

  function handleToggleRegistered(slotIndex: number) {
    const slot = box.slots[slotIndex]
    if (!slot) return
    const next = !slot.registered
    setSlot(box.id, slotIndex, { ...slot, registered: next })
    // mirror into Pokédex store
    if (next !== isRegistered(slot.pokemonId, slot.formId)) {
      toggleRegistered(slot.pokemonId, slot.formId)
    }
  }

  return (
    <motion.section
      layout
      className="rounded-(--radius-xl) border border-[var(--border)] bg-[var(--card)] p-5 md:p-6"
    >
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
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setEditing(true)}
                aria-label={t('rename')}
              >
                <Edit2 className="size-3.5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => {
                  if (window.confirm(t('deleteConfirm', { name: box.name }))) {
                    deleteBox(box.id)
                  }
                }}
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
            key={i}
            slot={slot}
            index={i}
            onClick={() => handleSlotClick(i)}
            onToggleRegistered={slot ? () => handleToggleRegistered(i) : undefined}
          />
        ))}
      </div>

      <PokemonPicker
        open={pickerOpen}
        onClose={() => {
          setPickerOpen(false)
          setActiveSlot(null)
        }}
        onPick={(pokemon) => {
          if (activeSlot === null) return
          setSlot(box.id, activeSlot, {
            pokemonId: pokemon.id,
            registered: isRegistered(pokemon.id),
          })
        }}
      />
    </motion.section>
  )
}
