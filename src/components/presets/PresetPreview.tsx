'use client'

import * as React from 'react'
import { useTranslations } from 'next-intl'
import pokemonData from '@/data/pokemon.json'
import type { PokemonEntry } from '@/types/pokemon'
import type { Box } from '@/types/box'
import { TYPE_COLORS } from '@/lib/type-colors'

const POKEMON_INDEX = new Map<number, PokemonEntry>(
  (pokemonData as PokemonEntry[]).map((p) => [p.id, p]),
)

interface Props {
  /** Boxes computed by applyPreset(). */
  boxes: Box[]
  /** How many boxes to render (default 3). */
  limit?: number
}

/**
 * Compact 6×5 mini-grid preview of the first N boxes — colored by primary type
 * of each pokemon. Used inside the preset editor so users can see what their
 * rules will produce before they apply.
 */
export function PresetPreview({ boxes, limit = 3 }: Props) {
  const t = useTranslations('Presets.preview')

  if (boxes.length === 0) {
    return (
      <div className="rounded-(--radius-md) border border-dashed border-[var(--border)] bg-[var(--surface)] p-6 text-center">
        <p className="text-sm text-[var(--muted-foreground)]">{t('empty')}</p>
      </div>
    )
  }

  const shown = boxes.slice(0, limit)

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold tracking-[0.14em] uppercase text-[var(--muted-foreground)]">
          {t('label', { shown: shown.length, total: boxes.length })}
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {shown.map((box) => (
          <MiniBox key={box.id} box={box} />
        ))}
      </div>
    </div>
  )
}

function MiniBox({ box }: { box: Box }) {
  const filled = box.slots.filter(Boolean).length
  return (
    <div className="rounded-(--radius-md) border border-[var(--border)] bg-[var(--card)] p-2.5">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[10px] font-medium truncate">{box.name}</span>
        <span className="text-[9px] font-mono tabular-nums text-[var(--muted-foreground)]">
          {filled}/30
        </span>
      </div>
      <div className="grid grid-cols-6 gap-px">
        {box.slots.map((slot, i) => {
          if (!slot) {
            return <span key={i} className="aspect-square rounded-[2px] bg-[var(--surface-2)]" />
          }
          const pokemon = POKEMON_INDEX.get(slot.pokemonId)
          const primary = pokemon?.types[0] ?? 'normal'
          const color = TYPE_COLORS[primary] ?? '#999'
          return (
            <span
              key={i}
              className="aspect-square rounded-[2px]"
              style={{ backgroundColor: color }}
              title={pokemon?.name}
            />
          )
        })}
      </div>
    </div>
  )
}
