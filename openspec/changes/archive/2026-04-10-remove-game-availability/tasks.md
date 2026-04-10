## 1. Types

- [x] 1.1 Remove `gameAvailability: string[]` from `PokemonEntry` interface in `src/types/pokemon.ts`
- [x] 1.2 Remove `gameAvailability?: string[]` from `PokemonForm` interface in `src/types/pokemon.ts`
- [x] 1.3 Remove `gameFilter: 'switch-only' | 'all'` and `activeGames: GameId[]` from `SettingsState` interface in `src/types/settings.ts`
- [x] 1.4 Remove `gameFilter` and `activeGames` from `DEFAULT_SETTINGS` in `src/types/settings.ts`
- [x] 1.5 Remove `import type { GameId } from './game'` from `src/types/settings.ts` if no longer used after removing those fields

## 2. Data Pipeline

- [x] 2.1 Remove `extractGameAvailability()` function from `src/scripts/normalizers/pokemon-normalizer.ts`
- [x] 2.2 Remove the `gameAvailability` assignment from `normalizePokemon()` return value
- [x] 2.3 Grep for any import of `src/data/games.json` across the codebase to confirm no consumers exist before proceeding
- [x] 2.4 Remove `writeJson('games.json', games)` from `src/scripts/fetch-pokemon-data.ts` (keep `versionGroupsRaw`/`versionsRaw` fetch and `games` variable — used for generation enrichment)
- [x] 2.5 Remove the `Games: ${games.length}` line from the pipeline summary log in `fetch-pokemon-data.ts`
- [x] 2.6 Delete `src/data/games.json` from the repository

## 3. Settings Store

- [x] 3.1 Remove `setGameFilter` and `setActiveGames` actions from `src/stores/useSettingsStore.ts`
- [x] 3.2 Remove the `setGameFilter` and `setActiveGames` entries from the `SettingsActions` interface in `useSettingsStore.ts`
- [x] 3.3 Bump the `createPersistedStore` version from `1` to `2` for the `settings` store
- [x] 3.4 Add migration callback for version `1→2` that deletes `gameFilter` and `activeGames` from the stored state object

## 4. Validation

- [x] 4.1 Run `npm run validate-data` and confirm it passes without `gameAvailability` field
- [x] 4.2 Run `npm run build` and confirm no TypeScript errors
- [x] 4.3 Run `npm run lint` and confirm no lint errors
