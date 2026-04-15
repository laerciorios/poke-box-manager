import type { Locale } from './locale'

export type GameId = string

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

// ─── Evolution Chain Types ─────────────────────────────────────────────────

export interface EvolutionMethod {
  trigger: 'level-up' | 'trade' | 'use-item' | 'shed' | 'spin'
    | 'tower-of-darkness' | 'tower-of-waters' | 'three-critical-hits'
    | 'take-damage' | 'other'
  minLevel?: number
  /** Item used to trigger evolution (use-item trigger) */
  item?: string
  /** Item held during trade */
  heldItem?: string
  /** Species traded with */
  tradeSpeciesId?: number
  /** Minimum happiness required */
  happiness?: number
  timeOfDay?: 'day' | 'night' | 'dusk'
  /** Location name (kebab-case) */
  location?: string
  /** Move name required to be known */
  knownMove?: string
  /** Move type required to be known */
  knownMoveType?: string
  needsRain?: boolean
  turnUpsideDown?: boolean
  /** Minimum affection (Pokémon-Amie / Camp) */
  affection?: number
  /** Minimum beauty (Contest stat) */
  beauty?: number
  /** Tyrogue: 1 = Atk > Def, -1 = Def > Atk, 0 = equal */
  relativePhysicalStats?: 1 | -1 | 0
}

/** One evolution edge in the chain tree. */
export interface EvolutionStep {
  fromId: number
  toId: number
  method: EvolutionMethod
}

export interface EvolutionChain {
  id: number
  /** All Pokémon IDs in the chain (depth-first order). Preserved for backwards compat. */
  pokemonIds: number[]
  /** Every evolution edge in the chain (one per from→to pair). */
  steps: EvolutionStep[]
}
