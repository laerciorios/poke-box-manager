import type { PokemonEntry } from '@/types/pokemon'
import type { OrganizationPreset } from '@/types/preset'
import type { Box } from '@/types/box'
import { BOX_SIZE } from '@/types/box'
import { filterPokemon } from './filter'
import { sortPokemon, GENERATION_REGION, TYPE_ORDER } from './sort'
import { renderBoxName } from './name-template'

function chunkIntoBoxes(
  pokemon: PokemonEntry[],
  template: string | undefined,
  contextExtras: { gen?: number; type?: string; region?: string },
): Box[] {
  if (pokemon.length === 0) return []

  const chunks: PokemonEntry[][] = []
  for (let i = 0; i < pokemon.length; i += BOX_SIZE) {
    chunks.push(pokemon.slice(i, i + BOX_SIZE))
  }

  return chunks.map((chunk, idx) => {
    const first = chunk[0]
    const last = chunk[chunk.length - 1]
    const n = idx + 1
    const total = chunks.length
    const name = template
      ? renderBoxName(template, {
          n,
          total,
          start: first.id,
          end: last.id,
          ...contextExtras,
        })
      : `Box ${n}`

    const slots = Array.from({ length: BOX_SIZE }, (_, i): Box['slots'][number] => {
      const p = chunk[i]
      if (!p) return null
      return { pokemonId: p.id, registered: false }
    })

    return {
      id: crypto.randomUUID(),
      name,
      slots,
    }
  })
}

function getContextExtras(
  pokemon: PokemonEntry[],
  sort: string,
): { gen?: number; type?: string; region?: string } {
  if (pokemon.length === 0) return {}

  switch (sort) {
    case 'generation':
    case 'regional-dex': {
      const gen = pokemon[0].generation
      return { gen, region: GENERATION_REGION[gen] }
    }
    case 'type-primary': {
      return { type: capitalizeType(pokemon[0].types[0]) }
    }
    default:
      return {}
  }
}

function capitalizeType(type: string): string {
  return type.charAt(0).toUpperCase() + type.slice(1)
}

// For gen-by-gen and regional-dex, each generation gets its own set of boxes
// so the type/gen context must be resolved per-rule, not per-chunk.
// The rule-level context is provided by the preset rules themselves.
// We only need per-chunk context for type-sorted (type changes per box).

function buildBoxesForRule(
  matched: PokemonEntry[],
  template: string | undefined,
  sort: string,
  ruleContext: { gen?: number; type?: string; region?: string },
): Box[] {
  if (sort === 'type-primary') {
    // Group by primary type so each type gets named correctly
    const groups = new Map<string, PokemonEntry[]>()
    for (const p of matched) {
      const t = p.types[0]
      if (!groups.has(t)) groups.set(t, [])
      groups.get(t)!.push(p)
    }
    // Iterate in canonical type order
    const boxes: Box[] = []
    for (const type of TYPE_ORDER) {
      const group = groups.get(type)
      if (!group || group.length === 0) continue
      boxes.push(
        ...chunkIntoBoxes(group, template, { type: capitalizeType(type) }),
      )
    }
    // Any types not in canonical order appended last
    for (const [type, group] of groups) {
      if (!TYPE_ORDER.includes(type)) {
        boxes.push(...chunkIntoBoxes(group, template, { type: capitalizeType(type) }))
      }
    }
    return boxes
  }

  if (sort === 'generation' || sort === 'regional-dex') {
    // Group by generation so box names reflect the correct gen/region
    const groups = new Map<number, PokemonEntry[]>()
    for (const p of matched) {
      if (!groups.has(p.generation)) groups.set(p.generation, [])
      groups.get(p.generation)!.push(p)
    }
    const boxes: Box[] = []
    const sortedGens = [...groups.keys()].sort((a, b) => a - b)
    for (const gen of sortedGens) {
      const group = groups.get(gen)!
      boxes.push(
        ...chunkIntoBoxes(group, template, {
          gen,
          region: GENERATION_REGION[gen],
        }),
      )
    }
    return boxes
  }

  return chunkIntoBoxes(matched, template, ruleContext)
}

export function applyPreset(
  preset: OrganizationPreset,
  pokemon: PokemonEntry[],
  evolutionChains: Record<number, number[]> = {},
): Box[] {
  if (pokemon.length === 0) return []

  const remaining = new Set(pokemon.map((p) => p.id))
  const allBoxes: Box[] = []

  const sortedRules = [...preset.rules].sort((a, b) => a.order - b.order)

  for (const rule of sortedRules) {
    const pool = pokemon.filter((p) => remaining.has(p.id))
    const matched = filterPokemon(pool, rule.filter)
    const sorted = sortPokemon(matched, rule.sort, evolutionChains)

    const ruleContext = getContextExtras(sorted, rule.sort)
    const boxes = buildBoxesForRule(sorted, rule.boxNameTemplate, rule.sort, ruleContext)
    allBoxes.push(...boxes)

    for (const p of matched) remaining.delete(p.id)
  }

  // Remainder: unclaimed pokemon in dex order
  if (remaining.size > 0) {
    const leftover = pokemon
      .filter((p) => remaining.has(p.id))
      .sort((a, b) => a.id - b.id)
    allBoxes.push(...chunkIntoBoxes(leftover, 'Box {n}', {}))
  }

  return allBoxes
}
