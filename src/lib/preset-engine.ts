import type { OrganizationPreset, PresetRule, SortCriteria } from '@/types/preset'
import type { PokemonEntry, PokemonForm, FormType } from '@/types/pokemon'
import type { Box, BoxSlot } from '@/types/box'
import type { VariationToggles } from '@/types/settings'
import { BOX_SIZE } from '@/types/box'
import { TOGGLE_FORM_TYPES } from '@/lib/variation-counts'

// Task 5.6: reverse map — FormType → VariationToggles key
const FORM_TYPE_TO_TOGGLE_KEY = new Map<string, keyof VariationToggles>()
for (const [key, types] of Object.entries(TOGGLE_FORM_TYPES) as [
  keyof VariationToggles,
  string[],
][]) {
  for (const type of types) {
    FORM_TYPE_TO_TOGGLE_KEY.set(type, key)
  }
}

interface PoolItem {
  pokemonId: number
  formId?: string
  formType?: FormType
  generation: number
  types: [string, string?]
  category: string
  evolutionChainId?: number
  name: string
}

function makePokedexKey(item: PoolItem): string {
  return item.formId ? `${item.pokemonId}:${item.formId}` : String(item.pokemonId)
}

// Task 5.6: build pool from allPokemon + variation-enabled forms
function buildPool(
  allPokemon: PokemonEntry[],
  variations: VariationToggles,
): PoolItem[] {
  const pool: PoolItem[] = []

  for (const pokemon of allPokemon) {
    // Base pokemon entry (no formId)
    pool.push({
      pokemonId: pokemon.id,
      generation: pokemon.generation,
      types: pokemon.types,
      category: pokemon.category,
      evolutionChainId: pokemon.evolutionChainId,
      name: pokemon.name,
    })

    // Add forms for enabled variation toggles
    for (const form of pokemon.forms) {
      const toggleKey = FORM_TYPE_TO_TOGGLE_KEY.get(form.formType)
      if (toggleKey && variations[toggleKey]) {
        pool.push({
          pokemonId: pokemon.id,
          formId: form.id,
          formType: form.formType,
          generation: pokemon.generation,
          types: form.types ?? pokemon.types,
          category: pokemon.category,
          evolutionChainId: pokemon.evolutionChainId,
          name: form.name,
        })
      }
    }
  }

  return pool
}

// Task 5.2: apply PokemonFilter to a pool item
function matchesFilter(item: PoolItem, rule: PresetRule): boolean {
  const { filter } = rule

  if (filter.categories?.length && !filter.categories.includes(item.category as never)) {
    return false
  }
  if (filter.generations?.length && !filter.generations.includes(item.generation)) {
    return false
  }
  if (filter.types?.length) {
    const hasType = filter.types.some((t) => item.types.includes(t as never))
    if (!hasType) return false
  }
  if (filter.formTypes?.length) {
    if (!item.formType || !filter.formTypes.includes(item.formType)) return false
  }
  if (filter.exclude?.categories?.length) {
    if (filter.exclude.categories.includes(item.category as never)) return false
  }
  if (filter.exclude?.pokemonIds?.length) {
    if (filter.exclude.pokemonIds.includes(item.pokemonId)) return false
  }

  return true
}

// Task 5.3: sort pool items by criteria
function sortItems(items: PoolItem[], criteria: SortCriteria): PoolItem[] {
  const sorted = [...items]

  sorted.sort((a, b) => {
    switch (criteria) {
      case 'dex-number':
        return a.pokemonId - b.pokemonId
      case 'name':
        return a.name.localeCompare(b.name)
      case 'type-primary':
        return a.types[0].localeCompare(b.types[0])
      case 'generation':
        return a.generation - b.generation || a.pokemonId - b.pokemonId
      case 'evolution-chain':
        return (
          (a.evolutionChainId ?? a.pokemonId) -
            (b.evolutionChainId ?? b.pokemonId) ||
          a.pokemonId - b.pokemonId
        )
      case 'regional-dex':
        // No regional dex info in static data — fall back to dex number
        return a.pokemonId - b.pokemonId
      default:
        return 0
    }
  })

  return sorted
}

// Task 5.5: resolve box name from template
function resolveBoxName(
  template: string | undefined,
  n: number,
  items: PoolItem[],
): string {
  if (!template) return `Box ${n}`
  const start = items[0]?.pokemonId ?? n
  const end = items[items.length - 1]?.pokemonId ?? n
  const gen = items[0]?.generation ?? 0
  return template
    .replace('{n}', String(n))
    .replace('{start}', String(start))
    .replace('{end}', String(end))
    .replace('{gen}', String(gen))
}

// Task 5.4: pack sorted items into Box objects
function packIntoBoxes(
  items: PoolItem[],
  template: string | undefined,
  registeredKeys: Set<string>,
  boxIndexOffset: number,
): Box[] {
  const result: Box[] = []

  for (let i = 0; i < items.length; i += BOX_SIZE) {
    const chunk = items.slice(i, i + BOX_SIZE)
    const n = result.length + 1 + boxIndexOffset

    const slots: (BoxSlot | null)[] = Array(BOX_SIZE).fill(null)
    chunk.forEach((item, slotIdx) => {
      const pokedexKey = makePokedexKey(item)
      slots[slotIdx] = {
        pokemonId: item.pokemonId,
        formId: item.formId,
        registered: registeredKeys.has(pokedexKey),
      }
    })

    result.push({
      id: crypto.randomUUID(),
      name: resolveBoxName(template, n, chunk),
      slots,
    })
  }

  return result
}

// Task 5.1: main pure function — Tasks 5.2–5.6 implemented above
export function applyPreset(
  preset: OrganizationPreset,
  allPokemon: PokemonEntry[],
  allForms: Record<string, PokemonForm>,
  variations: VariationToggles,
  registeredKeys: Set<string>,
): Box[] {
  // Build initial pool with variation filtering applied
  let remaining = buildPool(allPokemon, variations)

  // Sort rules by order field
  const sortedRules = [...preset.rules].sort((a, b) => a.order - b.order)

  const allBoxes: Box[] = []

  for (const rule of sortedRules) {
    // Task 5.2: filter
    const matched = remaining.filter((item) => matchesFilter(item, rule))

    // Remove matched items from remaining pool
    const matchedSet = new Set(matched.map(makePokedexKey))
    remaining = remaining.filter((item) => !matchedSet.has(makePokedexKey(item)))

    // Task 5.3: sort
    const sorted = sortItems(matched, rule.sort)

    // Tasks 5.4–5.5: pack into boxes with name template
    const boxes = packIntoBoxes(sorted, rule.boxNameTemplate, registeredKeys, allBoxes.length)
    allBoxes.push(...boxes)
  }

  return allBoxes
}
