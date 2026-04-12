import pokemonData from '@/data/pokemon.json'
import { normalizeQuery } from './normalize'
import { trigramScore } from './trigram'
import type { SearchIndexEntry, SearchResult, SearchFilters } from './types'
import type { PokemonEntry, PokemonCategory } from '@/types/pokemon'
import type { Box } from '@/types/box'

// Build index once at module load
function buildIndex(pokemon: PokemonEntry[]): SearchIndexEntry[] {
  return pokemon.map((p) => {
    const nameEn = p.names['en'] ?? p.name
    const namePtBr = p.names['pt-BR'] ?? nameEn
    return {
      id: p.id,
      nameEn,
      namePtBr,
      nameEnNorm: normalizeQuery(nameEn),
      namePtBrNorm: normalizeQuery(namePtBr),
      types: p.types as [string, string?],
      generation: p.generation,
      category: p.category as PokemonCategory,
      sprite: p.sprite,
    }
  })
}

export const SEARCH_INDEX: SearchIndexEntry[] = buildIndex(
  pokemonData as unknown as PokemonEntry[],
)

const SCORE_THRESHOLD = 0.3
const MAX_RESULTS = 20

export function search(
  query: string,
  index: SearchIndexEntry[],
  filters: SearchFilters,
  boxes: Box[],
  registered: Set<string>,
): SearchResult[] {
  const trimmed = query.trim()
  if (!trimmed) return []

  // Build reverse map: pokemonId → { boxId, boxName, slotIndex }
  const placement = new Map<number, { boxId: string; boxName: string; slotIndex: number }>()
  for (const box of boxes) {
    for (let i = 0; i < box.slots.length; i++) {
      const slot = box.slots[i]
      if (slot && !placement.has(slot.pokemonId)) {
        placement.set(slot.pokemonId, { boxId: box.id, boxName: box.name, slotIndex: i })
      }
    }
  }

  let candidates: Array<SearchIndexEntry & { score: number }>

  // Numeric query → exact id match
  if (/^\d+$/.test(trimmed)) {
    const targetId = parseInt(trimmed, 10)
    candidates = index
      .filter((e) => e.id === targetId)
      .map((e) => ({ ...e, score: 1 }))
  } else {
    const norm = normalizeQuery(trimmed)
    candidates = []

    for (const entry of index) {
      const scoreEn = trigramScore(norm, entry.nameEnNorm)
      const scorePt = trigramScore(norm, entry.namePtBrNorm)
      let score = Math.max(scoreEn, scorePt)

      // Prefix boost
      if (entry.nameEnNorm.startsWith(norm) || entry.namePtBrNorm.startsWith(norm)) {
        score = Math.max(score, 0.7)
      }

      if (score >= SCORE_THRESHOLD) {
        candidates.push({ ...entry, score })
      }
    }

    candidates.sort((a, b) => b.score - a.score)
  }

  // Apply filters
  let filtered = candidates as Array<SearchIndexEntry & { score: number }>
  if (filters.type) {
    filtered = filtered.filter((e) => e.types.includes(filters.type!))
  }
  if (filters.generation !== null) {
    filtered = filtered.filter((e) => e.generation === filters.generation)
  }
  if (filters.category !== null) {
    filtered = filtered.filter((e) => e.category === filters.category)
  }
  if (filters.registered !== null) {
    filtered = filtered.filter((e) => {
      const isReg = registered.has(String(e.id))
      return filters.registered ? isReg : !isReg
    })
  }

  return filtered.slice(0, MAX_RESULTS).map((e) => {
    const loc = placement.get(e.id) ?? null
    return {
      ...e,
      boxId: loc?.boxId ?? null,
      boxName: loc?.boxName ?? null,
      slotIndex: loc?.slotIndex ?? null,
      registered: registered.has(String(e.id)),
    }
  })
}
