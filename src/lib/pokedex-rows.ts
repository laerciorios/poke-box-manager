import type { PokemonEntry, PokemonCategory } from '@/types/pokemon'
import type { VariationToggles } from '@/types/settings'
import type { Locale } from '@/types/locale'
import { FORM_TYPE_TO_TOGGLE_KEY } from '@/lib/form-type-map'
import { getPokemonName, getFormName } from '@/lib/pokemon-names'

export type PokedexRowKind = 'base' | 'form'

export interface PokedexRow {
  key: string
  pokemonId: number
  formId?: string
  kind: PokedexRowKind
  dexNumber: number
  name: string
  types: [string, string?]
  generation: number
  category: PokemonCategory
  sprite: string
}

export function buildPokedexRows(
  pokemon: PokemonEntry[],
  variations: VariationToggles,
  activeGenerations: number[],
  locale: Locale,
): PokedexRow[] {
  const activeGenSet = new Set(activeGenerations)
  const rows: PokedexRow[] = []

  for (const entry of pokemon) {
    if (!activeGenSet.has(entry.generation)) continue

    // Base row
    rows.push({
      key: String(entry.id),
      pokemonId: entry.id,
      formId: undefined,
      kind: 'base',
      dexNumber: entry.id,
      name: getPokemonName(entry, locale),
      types: entry.types,
      generation: entry.generation,
      category: entry.category,
      sprite: entry.sprite,
    })

    // Form rows for enabled toggles
    for (const form of entry.forms) {
      const toggleKey = FORM_TYPE_TO_TOGGLE_KEY.get(form.formType)
      if (!toggleKey || !variations[toggleKey]) continue
      if (!form.sprite) continue

      rows.push({
        key: `${entry.id}:${form.id}`,
        pokemonId: entry.id,
        formId: form.id,
        kind: 'form',
        dexNumber: entry.id,
        name: getFormName(form, locale),
        types: form.types ?? entry.types,
        generation: entry.generation,
        category: entry.category,
        sprite: form.sprite,
      })
    }
  }

  return rows
}
