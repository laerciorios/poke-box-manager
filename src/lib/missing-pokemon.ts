import pokemonData from '@/data/pokemon.json'
import { TOGGLE_FORM_TYPES } from '@/lib/variation-counts'
import type { VariationToggles } from '@/types/settings'
import type { Locale } from '@/types/locale'

export interface MissingEntry {
  id: number
  formKey: string
  name: string
  types: string[]
  generation: number
  category: 'normal' | 'legendary' | 'mythical' | 'baby' | 'ultra-beast' | 'paradox'
  spriteUrl: string
}

export type SortKey = 'dex' | 'name' | 'type' | 'generation'
export type CategoryFilter = 'all' | 'normal' | 'legendary' | 'mythical'

interface RawPokemon {
  id: number
  names: Record<string, string>
  generation: number
  types: string[]
  category: string
  sprite: string
  forms: Array<{
    id: string
    names: Record<string, string>
    formType: string
    sprite: string
    types?: string[]
  }>
}

function buildEnabledFormTypes(variations: VariationToggles): Set<string> {
  const enabled = new Set<string>()
  for (const [key, formTypes] of Object.entries(TOGGLE_FORM_TYPES) as [
    keyof VariationToggles,
    string[],
  ][]) {
    if (variations[key]) {
      for (const ft of formTypes) enabled.add(ft)
    }
  }
  return enabled
}

export function buildMissingEntries(
  registeredSet: Set<string>,
  variations: VariationToggles,
  activeGenerations: number[],
  locale: Locale,
): MissingEntry[] {
  const enabledFormTypes = buildEnabledFormTypes(variations)
  const activeGenSet = new Set(activeGenerations)
  const results: MissingEntry[] = []

  for (const mon of pokemonData as unknown as RawPokemon[]) {
    if (!activeGenSet.has(mon.generation)) continue

    const baseKey = String(mon.id)
    if (!registeredSet.has(baseKey)) {
      results.push({
        id: mon.id,
        formKey: baseKey,
        name: mon.names[locale] ?? mon.names['en'] ?? String(mon.id),
        types: mon.types,
        generation: mon.generation,
        category: mon.category as MissingEntry['category'],
        spriteUrl: mon.sprite,
      })
    }

    for (const form of mon.forms) {
      if (!enabledFormTypes.has(form.formType)) continue
      const formKey = `${mon.id}:${form.id}`
      if (!registeredSet.has(formKey)) {
        results.push({
          id: mon.id,
          formKey,
          name: form.names[locale] ?? form.names['en'] ?? form.id,
          types: form.types ?? mon.types,
          generation: mon.generation,
          category: mon.category as MissingEntry['category'],
          spriteUrl: form.sprite,
        })
      }
    }
  }

  return results
}

export function applyFiltersAndSort(
  entries: MissingEntry[],
  opts: {
    generations: number[]
    type: string
    category: CategoryFilter
    sort: SortKey
  },
): MissingEntry[] {
  let filtered = entries

  if (opts.generations.length > 0) {
    const genSet = new Set(opts.generations)
    filtered = filtered.filter((e) => genSet.has(e.generation))
  }

  if (opts.type) {
    filtered = filtered.filter((e) => e.types.includes(opts.type))
  }

  if (opts.category !== 'all') {
    filtered = filtered.filter((e) => e.category === opts.category)
  }

  return [...filtered].sort((a, b) => {
    switch (opts.sort) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'type':
        return (a.types[0] ?? '').localeCompare(b.types[0] ?? '') || a.id - b.id
      case 'generation':
        return a.generation - b.generation || a.id - b.id
      case 'dex':
      default:
        return a.id - b.id
    }
  })
}
