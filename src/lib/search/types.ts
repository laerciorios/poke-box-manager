import type { PokemonCategory } from '@/types/pokemon'

export interface SearchIndexEntry {
  id: number
  nameEn: string
  namePtBr: string
  nameEnNorm: string    // lowercased + accent-stripped
  namePtBrNorm: string
  types: [string, string?]
  generation: number
  category: PokemonCategory
  sprite: string
}

export interface SearchResult extends SearchIndexEntry {
  score: number
  boxId: string | null
  boxName: string | null
  slotIndex: number | null
  registered: boolean
}

export interface SearchFilters {
  type: string | null
  generation: number | null
  category: PokemonCategory | null
  registered: boolean | null   // null = all, true = registered, false = missing
}

export const DEFAULT_FILTERS: SearchFilters = {
  type: null,
  generation: null,
  category: null,
  registered: null,
}
