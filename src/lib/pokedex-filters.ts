import type { PokemonEntry, PokemonForm, PokemonCategory, FormType } from '@/types/pokemon'
import type { VariationToggles } from '@/types/settings'
import type { Locale } from '@/types/locale'
import { TOGGLE_FORM_TYPES } from '@/lib/variation-counts'
import { getPokemonName, getFormName } from '@/lib/pokemon-names'

export type RegistrationStatus = 'all' | 'registered' | 'missing'

export interface PokedexRow {
  /** key in the registered set (`id` or `id:formId`) */
  key: string
  pokemon: PokemonEntry
  form?: PokemonForm
  /** Display name in the active locale (form-aware). */
  name: string
  /** Type chips to display (form-aware). */
  types: string[]
  /** Sprite URLs (canonical home-3d). */
  sprite?: string
  spriteShiny?: string
  /** Category from the parent species. */
  category: PokemonCategory
  generation: number
  /** Indent flag — true for non-base form rows. */
  isFormRow: boolean
}

export interface FilterState {
  query: string
  activeGenerations: number[]
  generationFilter: number | 'all'
  types: Set<string>
  categories: Set<PokemonCategory>
  status: RegistrationStatus
  variations: VariationToggles
}

const TYPE_ABBR: Record<string, string> = {
  nor: 'normal',
  fir: 'fire',
  wat: 'water',
  gra: 'grass',
  ele: 'electric',
  ice: 'ice',
  fgt: 'fighting',
  poi: 'poison',
  grd: 'ground',
  fly: 'flying',
  psy: 'psychic',
  bug: 'bug',
  roc: 'rock',
  gho: 'ghost',
  dra: 'dragon',
  drk: 'dark',
  stl: 'steel',
  fai: 'fairy',
}

function matchesQuery(row: PokedexRow, raw: string, locale: Locale): boolean {
  if (!raw) return true
  const q = raw.trim().toLowerCase()
  if (!q) return true
  // numeric: match by id (with or without #, leading zeros)
  if (/^#?\d+$/.test(q)) {
    return row.pokemon.id === Number(q.replace('#', ''))
  }
  // type abbreviation search (e.g. "fir" → fire)
  if (TYPE_ABBR[q]) {
    return row.types.includes(TYPE_ABBR[q])
  }
  const name = row.name.toLowerCase()
  const slug = row.pokemon.name.toLowerCase()
  const localized = getPokemonName(row.pokemon, locale).toLowerCase()
  return name.includes(q) || slug.includes(q) || localized.includes(q)
}

/**
 * Build the full flat list of rows for the Pokédex (base + extra form rows
 * when enabled). The output ordering is dex order, with form rows directly
 * below their species.
 */
export function buildPokedexRows(
  pokemon: PokemonEntry[],
  variations: VariationToggles,
  locale: Locale,
): PokedexRow[] {
  const enabledFormTypes = new Set<string>(
    (Object.entries(TOGGLE_FORM_TYPES) as [keyof VariationToggles, string[]][])
      .filter(([key]) => variations[key])
      .flatMap(([, types]) => types),
  )

  const rows: PokedexRow[] = []
  for (const p of pokemon) {
    rows.push({
      key: String(p.id),
      pokemon: p,
      name: getPokemonName(p, locale),
      types: p.types.filter(Boolean) as string[],
      sprite: p.sprite,
      spriteShiny: p.spriteShiny,
      category: p.category,
      generation: p.generation,
      isFormRow: false,
    })
    for (const form of p.forms) {
      if (!enabledFormTypes.has(form.formType)) continue
      rows.push({
        key: `${p.id}:${form.id}`,
        pokemon: p,
        form,
        name: getFormName(form, locale),
        types: (form.types?.filter(Boolean) as string[]) ?? (p.types.filter(Boolean) as string[]),
        sprite: form.sprite,
        spriteShiny: form.spriteShiny,
        category: p.category,
        generation: p.generation,
        isFormRow: true,
      })
    }
  }
  return rows
}

export function applyFilters(
  rows: PokedexRow[],
  filters: FilterState,
  isRegistered: (key: string) => boolean,
  locale: Locale,
): PokedexRow[] {
  const genSet = filters.activeGenerations.length > 0 ? new Set(filters.activeGenerations) : null

  return rows.filter((row) => {
    if (genSet && !genSet.has(row.generation)) return false
    if (filters.generationFilter !== 'all' && row.generation !== filters.generationFilter) return false
    if (filters.types.size > 0 && !row.types.some((t) => filters.types.has(t))) return false
    if (filters.categories.size > 0 && !filters.categories.has(row.category)) return false
    if (filters.status !== 'all') {
      const reg = isRegistered(row.key)
      if (filters.status === 'registered' && !reg) return false
      if (filters.status === 'missing' && reg) return false
    }
    if (!matchesQuery(row, filters.query, locale)) return false
    return true
  })
}

export const ALL_TYPES = [
  'normal', 'fire', 'water', 'grass', 'electric', 'ice', 'fighting', 'poison', 'ground',
  'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy',
] as const

export const ALL_CATEGORIES: PokemonCategory[] = [
  'normal', 'legendary', 'mythical', 'baby', 'ultra-beast', 'paradox',
]

export type { FormType, PokemonCategory }
