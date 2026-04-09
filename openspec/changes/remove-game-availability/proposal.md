## Why

Game availability data (`gameAvailability` field on `PokemonEntry`) is populated via `game_indices` from PokéAPI's `/pokemon/{id}` endpoint. This field is not maintained for Gen 8+ Pokémon — Eternatus, Sprigatito, and all modern Pokémon return an empty array. Alternative sourcing via Pokédex entries (pokedex endpoint) was evaluated but also proved unreliable: it maps Pokémon to regional dexes, not to individual game versions, making it impossible to correctly represent version exclusives (e.g., Growlithe in Red but not Blue). Since no reliable data source exists, the feature should be removed rather than ship incorrect data.

## What Changes

- Remove `gameAvailability` field from `PokemonEntry` and `PokemonForm` types
- Remove `extractGameAvailability()` from the data pipeline normalizer
- Remove `games.json` from pipeline output (version-group→game mapping logic is retained internally for generation enrichment)
- Remove `gameFilter` and `activeGames` from `SettingsState` and `DEFAULT_SETTINGS`
- Remove `setGameFilter` and `setActiveGames` actions from `useSettingsStore`
- Increment IndexedDB store version for `settings` store to trigger migration that drops orphaned `gameFilter`/`activeGames` keys from persisted state

## Capabilities

### New Capabilities

<!-- None -->

### Modified Capabilities

- `data-normalization`: Remove `gameAvailability` from `PokemonEntry` normalization requirement and output spec
- `settings-types`: Remove `gameFilter` and `activeGames` from `SettingsState` interface
- `settings-store`: Remove game filter actions and migrate persisted state

## Impact

- `src/types/pokemon.ts` — remove `gameAvailability` from `PokemonEntry` and `PokemonForm`
- `src/types/game.ts` — `GameId` type and `GameEntry` interface remain (used for generation metadata)
- `src/types/settings.ts` — remove `gameFilter`, `activeGames` from `SettingsState` and `DEFAULT_SETTINGS`
- `src/stores/useSettingsStore.ts` — remove `setGameFilter`, `setActiveGames`; increment store version
- `src/scripts/normalizers/pokemon-normalizer.ts` — remove `extractGameAvailability` call
- `src/scripts/fetch-pokemon-data.ts` — remove `games.json` write; keep version-group fetch for generation enrichment
- `src/data/games.json` — deleted from output (not imported by any component after this change)
- `openspec/specs/data-normalization/spec.md` — updated
- `openspec/specs/settings-types/spec.md` — updated
- `openspec/specs/settings-store/spec.md` — updated
