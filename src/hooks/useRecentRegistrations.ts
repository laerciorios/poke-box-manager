'use client'

import { useMemo } from 'react'
import { usePokedexStore } from '@/stores/usePokedexStore'
import { getPokemonById } from '@/lib/pokemon-lookup'
import type { PokemonEntry, PokemonForm } from '@/types/pokemon'

export interface RecentEntry {
  key: string
  pokemonId: number
  formId: string | undefined
  name: string
  sprite: string
  types: string[]
}

function resolveEntry(key: string): RecentEntry | null {
  // Key format: "pokemonId" or "pokemonId:formId"
  const colonIdx = key.indexOf(':')
  const pokemonId = colonIdx === -1 ? parseInt(key, 10) : parseInt(key.slice(0, colonIdx), 10)
  const formId = colonIdx === -1 ? undefined : key.slice(colonIdx + 1)

  const pokemon = getPokemonById(pokemonId)
  if (!pokemon) return null

  if (formId) {
    const form: PokemonForm | undefined = pokemon.forms.find((f) => f.id === formId)
    if (form) {
      return {
        key,
        pokemonId,
        formId,
        name: form.name,
        sprite: form.sprite,
        types: form.types?.filter(Boolean) as string[] ?? pokemon.types.filter(Boolean) as string[],
      }
    }
  }

  return {
    key,
    pokemonId,
    formId: undefined,
    name: pokemon.name,
    sprite: pokemon.sprite,
    types: (pokemon.types as string[]).filter(Boolean),
  }
}

/**
 * Returns the last `count` registered Pokémon in insertion order (most recent first).
 * Derived from the ordered `registered[]` array — no timestamps needed.
 */
export function useRecentRegistrations(count: number): RecentEntry[] {
  const registered = usePokedexStore((s) => s.registered)

  return useMemo(() => {
    const lastN = registered.slice(-count).reverse()
    return lastN.map(resolveEntry).filter((e): e is RecentEntry => e !== null)
  }, [registered, count])
}
