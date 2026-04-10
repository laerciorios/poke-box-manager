## Context

`gameAvailability` was intended to power the game filter UI (Switch-only vs all games toggle). The data was sourced from `game_indices` in PokéAPI's `/pokemon/{id}` endpoint, which is not maintained for Gen 8+ Pokémon. The feature has never been functional in production. The alternative (Pokédex-based sourcing) was also evaluated and rejected because Pokédex entries represent regional dex membership, not version obtainability — version exclusives would be systematically misrepresented.

The settings store (`useSettingsStore`) persists to IndexedDB under the key `"settings"` with schema version `1`. Users who have already opened the app may have `gameFilter` and `activeGames` keys in their IndexedDB. These need to be cleaned up via a store version migration.

## Goals / Non-Goals

**Goals:**
- Remove `gameAvailability` from `PokemonEntry` and `PokemonForm` types
- Remove the field from the data pipeline normalizer
- Remove `games.json` from pipeline output
- Remove `gameFilter` / `activeGames` from settings types, defaults, and store actions
- Migrate persisted IndexedDB state to drop orphaned keys

**Non-Goals:**
- Re-adding game availability via a different data source (future concern, requires a reliable data strategy first)
- Removing `GameEntry` / `GameId` types or `games.json` generation metadata from internal pipeline use
- Changing any UI that doesn't reference game availability or game filter

## Decisions

### 1. Keep version-group fetch in the pipeline

**Decision:** The Stage 3 fetch of `versionGroupsRaw` and `versionsRaw` is retained but `games.json` is no longer written to `src/data/`.

**Rationale:** `versionGroupsRaw` is used to enrich `GameEntry` with generation number via `enrichGameWithGeneration()`. This generation data flows into `GenerationEntry` normalization. Removing the fetch would require refactoring the generation enrichment path for minimal benefit.

### 2. IndexedDB migration via store version bump

**Decision:** Increment the `settings` store version from `1` to `2` in `createPersistedStore`. The migration callback for version `1→2` SHALL delete `gameFilter` and `activeGames` keys from the stored object.

**Rationale:** `createPersistedStore` wraps IndexedDB with a versioning mechanism. A version bump triggers the migration function, which runs once per user on next load. This is the correct way to clean up orphaned keys without wiping all user settings.

**Alternative considered:** Simply leaving the orphaned keys — rejected because they would cause TypeScript errors on access and could confuse future developers about the store schema.

### 3. `GameId` type stays

**Decision:** `GameId = string` type alias in `src/types/game.ts` is not removed.

**Rationale:** It provides semantic clarity in other contexts and removing it would require updating multiple files for no user-facing benefit. The `GameEntry` interface also stays for potential future use.

## Risks / Trade-offs

- **IndexedDB migration irreversible** → If the feature is re-added later, stored state won't have `gameFilter`/`activeGames` keys. Mitigation: re-adding the feature would need to re-introduce defaults via a new migration (version `3`), which is the correct pattern.
- **`games.json` consumers** → After this change, any code importing `games.json` will break. Mitigation: tasks include a grep to confirm no imports exist before deleting the write step.
