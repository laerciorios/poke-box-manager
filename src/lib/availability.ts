import gamesData from '@/data/games-list.json'
import overridesData from '@/data/availability-overrides.json'
import type {
  GameEntry,
  AvailabilityEntry,
  ResolvedAvailability,
} from '@/types/availability'

const GAMES: GameEntry[] = gamesData as GameEntry[]
const GAMES_BY_ID = new Map(GAMES.map((g) => [g.id, g]))
const OVERRIDES = overridesData as unknown as Record<string, AvailabilityEntry>

/**
 * Returns the curated availability for a species.
 *
 * The new schema (v3) has no defaults: each species' `games` array is the
 * absolute, verified list of games where it can be obtained. If the species
 * has no entry in `availability-overrides.json`, the resolver returns
 * `isUncurated: true` so the UI can show a "not yet curated" hint.
 */
export function getAvailability(pokemonId: number): ResolvedAvailability {
  const entry = OVERRIDES[String(pokemonId)]
  if (!entry) {
    return { games: [], isEvent: false, isUncurated: true }
  }
  const games = (entry.games ?? []).filter(isKnownGameId)
  return {
    games,
    isEvent: !!entry.event,
    isUncurated: false,
  }
}

/**
 * Returns the availability for a specific form. If the species has a
 * form-level override for `formId`, it replaces the species `games`.
 * Otherwise the form inherits species availability.
 */
export function getFormAvailability(
  pokemonId: number,
  formId: string,
): ResolvedAvailability {
  const entry = OVERRIDES[String(pokemonId)]
  if (!entry) {
    return { games: [], isEvent: false, isUncurated: true }
  }
  const formEntry = entry.forms?.[formId]
  if (formEntry) {
    return {
      games: (formEntry.games ?? []).filter(isKnownGameId),
      isEvent: !!formEntry.event,
      isUncurated: false,
    }
  }
  // No form-specific entry: inherit species-level availability.
  return getAvailability(pokemonId)
}

export function hasFormOverride(pokemonId: number, formId: string): boolean {
  return !!OVERRIDES[String(pokemonId)]?.forms?.[formId]
}

export function getGame(id: string): GameEntry | undefined {
  return GAMES_BY_ID.get(id)
}

export function listAllGames(): GameEntry[] {
  return GAMES
}

/**
 * Groups game ids by generation, separating DLCs out so the UI can render
 * them as their own row under the parent generation block.
 */
export function groupGamesByGeneration(
  gameIds: string[],
): Array<{ generation: number; main: GameEntry[]; dlc: GameEntry[] }> {
  const buckets = new Map<number, { main: GameEntry[]; dlc: GameEntry[] }>()
  for (const id of gameIds) {
    const game = GAMES_BY_ID.get(id)
    if (!game) continue
    const bucket = buckets.get(game.generation) ?? { main: [], dlc: [] }
    if (game.kind === 'dlc') bucket.dlc.push(game)
    else bucket.main.push(game)
    buckets.set(game.generation, bucket)
  }
  return Array.from(buckets.entries())
    .sort(([a], [b]) => a - b)
    .map(([generation, b]) => ({ generation, main: b.main, dlc: b.dlc }))
}

/** Any game in `gameIds` flagged as restrictedDex (Galar / Hisui / Paldea). */
export function hasRestrictedDexGames(gameIds: string[]): boolean {
  return gameIds.some((id) => GAMES_BY_ID.get(id)?.restrictedDex)
}

/**
 * Set of games considered relevant when the "Switch-only" availability
 * filter is on. Includes Switch console titles (Let's Go, Sw/Sh + DLCs,
 * BDSP, Legends Arceus, Scarlet/Violet + DLCs, Legends Z-A + DLC) plus
 * FireRed/LeafGreen — the latter included by user request because of the
 * Pokémon Home transfer chain reaching back into Gen 3.
 */
const SWITCH_ERA_GAMES: ReadonlySet<string> = new Set([
  'lets-go-pikachu',
  'lets-go-eevee',
  'sword',
  'shield',
  'the-isle-of-armor',
  'the-crown-tundra',
  'brilliant-diamond',
  'shining-pearl',
  'legends-arceus',
  'scarlet',
  'violet',
  'the-teal-mask',
  'the-indigo-disk',
  'legends-za',
  'mega-dimension',
  'firered',
  'leafgreen',
  'pokemon-go',
])

export function isSwitchEraGame(gameId: string): boolean {
  return SWITCH_ERA_GAMES.has(gameId)
}

/** Drop everything from `gameIds` that isn't in the Switch-era set. */
export function filterToSwitchEra(gameIds: string[]): string[] {
  return gameIds.filter((id) => SWITCH_ERA_GAMES.has(id))
}

function isKnownGameId(id: string): boolean {
  return GAMES_BY_ID.has(id)
}
