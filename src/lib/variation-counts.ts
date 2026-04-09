import type { VariationToggles } from '@/types/settings'
import formsData from '@/data/forms.json'
import pokemonData from '@/data/pokemon.json'

// Maps each VariationToggles key to the formType string(s) in forms.json
export const TOGGLE_FORM_TYPES: Record<keyof VariationToggles, string[]> = {
  regionalForms: ['regional-alola', 'regional-galar', 'regional-hisui', 'regional-paldea'],
  genderForms: ['gender'],
  unownLetters: ['unown'],
  vivillonPatterns: ['vivillon'],
  alcremieVariations: ['alcremie'],
  colorVariations: ['color'],
  sizeVariations: ['size'],
  megaEvolutions: ['mega'],
  gmaxForms: ['gmax'],
  battleForms: ['battle'],
  originForms: ['origin'],
  costumedPokemon: ['costume'],
}

// Compute counts from forms.json at module load — static data, computed once
const forms = Object.values(formsData as Record<string, { formType: string }>)

export const VARIATION_COUNTS: Record<keyof VariationToggles, number> = (
  Object.entries(TOGGLE_FORM_TYPES) as [keyof VariationToggles, string[]][]
).reduce(
  (acc, [key, types]) => {
    acc[key] = forms.filter((f) => types.includes(f.formType)).length
    return acc
  },
  {} as Record<keyof VariationToggles, number>,
)

// Count of base species (pokemon.json entries) — excludes all form variants
export const BASE_POKEMON_COUNT: number = (pokemonData as unknown[]).length

export function computeTotal(variations: VariationToggles): number {
  return (
    BASE_POKEMON_COUNT +
    (Object.keys(variations) as (keyof VariationToggles)[]).reduce((sum, key) => {
      return sum + (variations[key] ? VARIATION_COUNTS[key] : 0)
    }, 0)
  )
}
