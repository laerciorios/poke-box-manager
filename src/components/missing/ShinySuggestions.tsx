'use client'

import * as React from 'react'
import { Sparkles } from 'lucide-react'
import { useTranslations } from 'next-intl'
import pokemonData from '@/data/pokemon.json'
import type { PokemonEntry } from '@/types/pokemon'
import { useBoxStore } from '@/stores/useBoxStore'
import { usePokedexStore } from '@/stores/usePokedexStore'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { Sprite } from '@/components/pokemon/Sprite'
import { TypeChip } from '@/components/pokemon/TypeChip'
import { getPokemonName } from '@/lib/pokemon-names'
import { FadeIn } from '@/components/motion'

const POKEMON_INDEX = new Map<number, PokemonEntry>(
  (pokemonData as PokemonEntry[]).map((p) => [p.id, p]),
)

interface Suggestion {
  pokemon: PokemonEntry
  formKey: string
}

export function ShinySuggestions({ onSelect }: { onSelect: (pokemon: PokemonEntry) => void }) {
  const t = useTranslations('Missing.shinies')
  const registered = usePokedexStore((s) => s.registered)
  const boxes = useBoxStore((s) => s.boxes)
  const locale = useSettingsStore((s) => s.locale)
  const activeGenerations = useSettingsStore((s) => s.activeGenerations)

  const shinyKeys = React.useMemo(() => {
    const keys = new Set<string>()
    for (const box of boxes) {
      for (const slot of box.slots) {
        if (!slot?.shiny) continue
        keys.add(slot.formId ? `${slot.pokemonId}:${slot.formId}` : `${slot.pokemonId}`)
      }
    }
    return keys
  }, [boxes])

  const activeGenSet = React.useMemo(() => new Set(activeGenerations), [activeGenerations])

  const suggestions: Suggestion[] = React.useMemo(() => {
    const out: Suggestion[] = []
    // Suggest Pokémon the user already has registered but doesn't have a shiny for.
    for (const key of registered) {
      if (key.includes(':')) continue // base-form suggestions only for now
      if (shinyKeys.has(key)) continue
      const id = Number(key)
      const pokemon = POKEMON_INDEX.get(id)
      if (!pokemon) continue
      if (!activeGenSet.has(pokemon.generation)) continue
      out.push({ pokemon, formKey: key })
    }
    out.sort((a, b) => a.pokemon.generation - b.pokemon.generation || a.pokemon.id - b.pokemon.id)
    return out
  }, [registered, shinyKeys, activeGenSet])

  if (suggestions.length === 0) return null

  return (
    <FadeIn delay={0.1}>
      <div className="rounded-(--radius-xl) border border-[var(--shiny)]/30 bg-[var(--shiny-soft)] p-5">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="size-4 text-[var(--shiny)]" />
          <h3 className="font-display text-base font-semibold tracking-tight">
            {t('title')}
          </h3>
        </div>
        <p className="text-xs text-[var(--muted-foreground)] mb-4">
          {t('description', { count: suggestions.length })}
        </p>

        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 max-h-80 overflow-y-auto">
          {suggestions.slice(0, 60).map((s) => (
            <li key={s.formKey}>
              <button
                type="button"
                onClick={() => onSelect(s.pokemon)}
                className="w-full flex items-center gap-2 rounded-(--radius-md) border border-[var(--border)] bg-[var(--card)] p-2 text-left hover:border-[var(--shiny)] transition-colors"
              >
                <Sprite src={s.pokemon.sprite} alt={s.pokemon.name} size={40} shiny />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-mono tabular-nums text-[var(--muted-foreground)]">
                    #{String(s.pokemon.id).padStart(4, '0')}
                  </p>
                  <p className="text-xs font-medium truncate">
                    {getPokemonName(s.pokemon, locale)}
                  </p>
                  <div className="flex gap-1 mt-0.5">
                    {s.pokemon.types.filter(Boolean).map((tt) => (
                      <TypeChip key={tt as string} type={tt as string} />
                    ))}
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
        {suggestions.length > 60 && (
          <p className="text-[11px] text-[var(--muted-foreground)] text-center mt-3 font-mono tabular-nums">
            {t('more', { count: suggestions.length - 60 })}
          </p>
        )}
      </div>
    </FadeIn>
  )
}
