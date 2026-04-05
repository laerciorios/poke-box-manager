import type { Locale } from './locale'

export interface GameEntry {
  id: string
  name: string
  names: Record<Locale, string>
  generation: number
  versionGroupId: number
}

export interface GenerationEntry {
  id: number
  name: string
  names: Record<Locale, string>
  mainRegion: string
  pokemonCount: number
}

export interface TypeEntry {
  id: number
  name: string
  names: Record<Locale, string>
}

export interface EvolutionChain {
  id: number
  pokemonIds: number[]
}
