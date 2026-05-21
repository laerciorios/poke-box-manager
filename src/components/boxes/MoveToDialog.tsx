'use client'

import * as React from 'react'
import { useTranslations } from 'next-intl'
import { Dialog } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Sprite } from '@/components/pokemon/Sprite'
import { BOX_COLUMNS } from '@/types/box'
import type { Box, BoxSlot } from '@/types/box'
import pokemonData from '@/data/pokemon.json'
import type { PokemonEntry } from '@/types/pokemon'
import { cn } from '@/lib/utils'

const POKEMON_INDEX = new Map<number, PokemonEntry>(
  (pokemonData as PokemonEntry[]).map((p) => [p.id, p]),
)

interface Props {
  open: boolean
  onClose: () => void
  boxes: Box[]
  fromBoxId: string
  fromIndex: number
  onConfirm: (toBoxId: string, toIndex: number) => void
}

export function MoveToDialog({ open, onClose, boxes, fromBoxId, fromIndex, onConfirm }: Props) {
  const t = useTranslations('Boxes.moveDialog')
  const common = useTranslations('Common')
  const [targetBoxId, setTargetBoxId] = React.useState(fromBoxId)
  const [targetIndex, setTargetIndex] = React.useState<number>(fromIndex)

  React.useEffect(() => {
    if (open) {
      setTargetBoxId(fromBoxId)
      setTargetIndex(fromIndex)
    }
  }, [open, fromBoxId, fromIndex])

  const targetBox = boxes.find((b) => b.id === targetBoxId)

  const handleConfirm = () => {
    if (targetBoxId === fromBoxId && targetIndex === fromIndex) {
      onClose()
      return
    }
    onConfirm(targetBoxId, targetIndex)
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={t('title')}
      description={t('description')}
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            {common('cancel')}
          </Button>
          <Button variant="accent" onClick={handleConfirm}>
            {t('submit')}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
            {t('destinationBox')}
          </label>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {boxes.map((b) => (
              <Button
                key={b.id}
                size="sm"
                variant={targetBoxId === b.id ? 'accent' : 'outline'}
                onClick={() => {
                  setTargetBoxId(b.id)
                  setTargetIndex(0)
                }}
              >
                {b.name}
              </Button>
            ))}
          </div>
        </div>

        {targetBox && (
          <div>
            <div className="grid grid-cols-6 gap-1.5">
              {targetBox.slots.map((slot, i) => (
                <SlotPreview
                  key={i}
                  slot={slot}
                  index={i}
                  active={targetIndex === i}
                  onClick={() => setTargetIndex(i)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </Dialog>
  )
}

function SlotPreview({
  slot,
  index,
  active,
  onClick,
}: {
  slot: BoxSlot | null
  index: number
  active: boolean
  onClick: () => void
}) {
  const pokemon = slot ? POKEMON_INDEX.get(slot.pokemonId) : undefined
  const form = slot?.formId ? pokemon?.forms.find((f) => f.id === slot.formId) : undefined
  const src = form?.sprite ?? pokemon?.sprite
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Slot ${index + 1}`}
      aria-pressed={active}
      className={cn(
        'aspect-square rounded-md border bg-[var(--card)] grid place-items-center transition-colors',
        active
          ? 'border-[var(--accent)] ring-2 ring-[var(--accent)]'
          : 'border-[var(--border)] hover:border-[var(--border-strong)]',
        // approximate row alignment in 6 columns
        index % BOX_COLUMNS === 0 ? '' : '',
      )}
    >
      {slot ? (
        <Sprite src={src} alt={pokemon?.name ?? ''} size={32} shiny={!!slot.shiny} className="w-full h-full" />
      ) : (
        <span className="text-[10px] text-[var(--muted-foreground)] font-mono">{index + 1}</span>
      )}
    </button>
  )
}
