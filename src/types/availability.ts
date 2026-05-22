export type GameKind = 'main' | 'remake' | 'spinoff' | 'dlc'

export interface GameEntry {
  id: string
  name: string
  shortName: string
  generation: number
  color: string
  kind: GameKind
  /** When kind === 'remake', the original generation being remade. */
  remakeOf?: number
  /** When kind === 'dlc', the base game ids it attaches to. */
  parentOf?: string[]
  /**
   * Informational only. Lists the Pokémon generations whose species can
   * theoretically appear in this game (via main gameplay, transfer, or
   * breeding). The resolver does NOT use this as a default — verified data
   * in `availability-overrides.json` is the single source of truth.
   */
  acceptsFromGens: number[]
  /**
   * True for games with a regional dex that doesn't cover the full set of
   * acceptsFromGens (e.g. Sword/Shield's Galar dex, Legends Arceus's Hisui
   * dex, Scarlet/Violet's Paldea dex). UI shows a small "limited dex" hint.
   */
  restrictedDex?: boolean
}

/**
 * Optional per-form availability. Used when a form is exclusive to a subset
 * of the species' games (e.g. Tauros Paldea Blaze Breed is Scarlet-only,
 * Aqua Breed is Violet-only).
 */
export interface FormAvailability {
  /** Absolute list of game ids where this specific form can be obtained. */
  games: string[]
  /** True if the form is event-distributed. */
  event?: boolean
}

/**
 * One species' entry in `availability-overrides.json`. Schema v3.
 *
 * The `games` array is the **complete, absolute** list of games where the
 * species can be obtained — no defaults applied, no deltas. If a species is
 * missing from this file, the UI treats it as "not yet curated".
 *
 * Per-form availability lives in `forms`, keyed by form id (matching the
 * `id` field in `forms.json`). Forms inherit the species' `games` unless
 * overridden here.
 */
export interface AvailabilityEntry {
  games: string[]
  event?: boolean
  notes?: string
  forms?: Record<string, FormAvailability>
}

export interface ResolvedAvailability {
  /** Absolute list of game ids where the species (or form) can be obtained. */
  games: string[]
  /** True if the canonical acquisition is via event distribution. */
  isEvent: boolean
  /** True if no curated data exists yet for this species. */
  isUncurated: boolean
}
