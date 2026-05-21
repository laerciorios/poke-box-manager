'use client'

import { TYPE_COLORS, TYPE_FOREGROUNDS } from '@/lib/type-colors'
import { cn } from '@/lib/utils'

const TYPE_GLYPH: Record<string, string> = {
  normal: 'NOR',
  fire: 'FIR',
  water: 'WAT',
  grass: 'GRA',
  electric: 'ELE',
  ice: 'ICE',
  fighting: 'FGT',
  poison: 'POI',
  ground: 'GRD',
  flying: 'FLY',
  psychic: 'PSY',
  bug: 'BUG',
  rock: 'ROC',
  ghost: 'GHO',
  dragon: 'DRA',
  dark: 'DRK',
  steel: 'STL',
  fairy: 'FAI',
}

export function TypeChip({ type, className }: { type: string; className?: string }) {
  const bg = TYPE_COLORS[type] ?? '#999'
  const fg = TYPE_FOREGROUNDS[type] ?? '#111'
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md px-2 h-5 text-[10px] font-semibold tracking-wider uppercase',
        className,
      )}
      style={{ backgroundColor: bg, color: fg }}
    >
      <span aria-hidden>{TYPE_GLYPH[type] ?? '???'}</span>
      <span className="sr-only">{type}</span>
    </span>
  )
}
