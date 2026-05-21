'use client'

import { motion, useReducedMotion } from 'motion/react'
import { Check, Sparkles, Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import pokemonData from '@/data/pokemon.json'
import type { PokemonEntry } from '@/types/pokemon'
import type { BoxSlot as BoxSlotType } from '@/types/box'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { getPokemonName } from '@/lib/pokemon-names'
import { Sprite } from '@/components/pokemon/Sprite'
import { cn } from '@/lib/utils'

const POKEMON_INDEX = new Map<number, PokemonEntry>(
  (pokemonData as PokemonEntry[]).map((p) => [p.id, p]),
)

interface Props {
  slot: BoxSlotType | null
  index: number
  onClick: () => void
  onToggleRegistered?: () => void
}

export function BoxSlotCell({ slot, index, onClick, onToggleRegistered }: Props) {
  const t = useTranslations('Boxes')
  const locale = useSettingsStore((s) => s.locale)
  const reduce = useReducedMotion()

  if (!slot) {
    return (
      <motion.button
        type="button"
        onClick={onClick}
        className={cn(
          'group relative aspect-square rounded-md border border-dashed border-[var(--border)]',
          'bg-[var(--surface-2)]/30 hover:bg-[var(--surface-2)] hover:border-[var(--border-strong)]',
          'flex items-center justify-center transition-colors',
        )}
        aria-label={t('emptySlot', { index: index + 1 })}
        whileTap={reduce ? undefined : { scale: 0.96 }}
      >
        <Plus className="size-4 text-[var(--muted-foreground)] opacity-0 group-hover:opacity-100 transition-opacity" />
      </motion.button>
    )
  }

  const pokemon = POKEMON_INDEX.get(slot.pokemonId)
  const name = pokemon ? getPokemonName(pokemon, locale) : String(slot.pokemonId)
  const spriteSrc = slot.shiny ? pokemon?.spriteShiny : pokemon?.sprite

  return (
    <motion.div
      layout={!reduce}
      initial={reduce ? { opacity: 1 } : { opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={reduce ? { duration: 0 } : { duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'group relative aspect-square rounded-md border bg-[var(--card)]',
        slot.registered ? 'border-[var(--border)]' : 'border-[var(--border-strong)]',
      )}
    >
      <button
        type="button"
        onClick={onClick}
        className="absolute inset-0 grid place-items-center rounded-md focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
        aria-label={name}
      >
        <Sprite src={spriteSrc ?? pokemon?.sprite} alt={name} size={56} className="w-full h-full" />
      </button>

      {slot.shiny && (
        <span className="absolute top-1 left-1 size-3.5 rounded-full bg-[var(--shiny)] grid place-items-center pointer-events-none">
          <Sparkles className="size-2 text-[var(--shiny-foreground)]" />
        </span>
      )}

      {onToggleRegistered && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onToggleRegistered()
          }}
          className={cn(
            'absolute top-1 right-1 size-4 rounded-full grid place-items-center transition-colors',
            slot.registered
              ? 'bg-[var(--registered)] text-[var(--registered-foreground)]'
              : 'bg-[var(--surface-2)] border border-[var(--border-strong)] text-[var(--muted-foreground)] hover:bg-[var(--surface-3)]',
          )}
          aria-label={slot.registered ? t('unmarkRegistered') : t('markRegistered')}
          aria-pressed={slot.registered}
        >
          {slot.registered && <Check className="size-2.5" strokeWidth={3} />}
        </button>
      )}
    </motion.div>
  )
}
