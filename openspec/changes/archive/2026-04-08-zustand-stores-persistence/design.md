## Context

The Zustand + persist middleware infrastructure exists (`src/lib/store.ts`), but `src/stores/` is empty. The app needs four domain stores to power interactive features: Pokédex registration tracking, box management, user settings, and organization presets. All user data is offline-first with no backend — persistence uses the browser's IndexedDB via Zustand's persist middleware.

Existing types (`src/types/`) already define the data shapes: `PokemonEntry`, `Box`, `BoxSlot`, `SettingsState`, `OrganizationPreset`, etc. Stores will consume these types directly.

## Goals / Non-Goals

**Goals:**
- Implement all four domain stores with full CRUD actions
- Persist all store data to IndexedDB (handles larger datasets than localStorage)
- Add schema versioning per store so future data migrations are non-breaking
- Expose clean, typed APIs that components can consume via hooks

**Non-Goals:**
- UI components or pages (separate change)
- Export/import functionality (later change)
- Undo/redo support (future enhancement)
- Server-side state or API calls (offline-first architecture)
- Built-in preset content (data concern, not store concern)

## Decisions

### 1. IndexedDB via `idb-keyval` over localStorage

**Choice**: Use `idb-keyval` as the Zustand persist storage adapter.

**Why**: localStorage has a ~5MB limit. A full Pokédex with 1000+ entries and multiple boxes can exceed this. IndexedDB has no practical limit. `idb-keyval` is a 600-byte wrapper that provides a simple get/set API compatible with Zustand's `StateStorage` interface.

**Alternative considered**: Raw IndexedDB API — rejected because the boilerplate is significant and `idb-keyval` already provides the exact interface Zustand needs.

### 2. Schema versioning with Zustand's built-in `version` + `migrate`

**Choice**: Use Zustand persist's native `version` and `migrate` options rather than a custom versioning layer.

**Why**: Zustand persist already supports `version: number` and `migrate: (persisted, version) => newState`. This is battle-tested and avoids reinventing the wheel. Each store starts at version 1.

**Alternative considered**: Custom migration framework with named migrations — rejected as over-engineered for the current scope. Zustand's built-in approach handles sequential version bumps cleanly.

### 3. One store per domain concern (4 stores, not 1 monolith)

**Choice**: Separate stores for pokedex, boxes, settings, and presets.

**Why**: Each domain has independent persistence needs, different update frequencies, and different migration paths. Separate stores mean a schema change in settings doesn't require migrating box data. Components subscribe only to the slice they need, minimizing re-renders.

**Alternative considered**: Single unified store with slices — rejected because IndexedDB persistence granularity is per-store, and independent versioning is cleaner.

### 4. Upgrade `createPersistedStore` helper

**Choice**: Modify `src/lib/store.ts` to accept `version` and `migrate` options, and default to the IndexedDB storage adapter.

**Why**: Centralizes persistence configuration so all stores automatically get IndexedDB + versioning without repetition. The existing helper signature remains compatible — only the defaults and available options change.

### 5. Store state shape: flat actions alongside state

**Choice**: Each store's type is a single interface containing both state fields and action methods (Zustand convention).

**Why**: This is idiomatic Zustand — no need for separate action creators or dispatch. Components destructure what they need: `const { registered, toggleRegistered } = usePokedexStore()`.

## Risks / Trade-offs

**[Risk] IndexedDB unavailable in some contexts (SSR, incognito)** → Mitigation: Zustand persist gracefully falls back — the store works in-memory if storage is unavailable. No crash, just no persistence. The `idb-keyval` adapter will be wrapped with error handling.

**[Risk] Large pokedex state could slow hydration** → Mitigation: Pokedex registration is stored as a `Set<string>` (serialized as array) of registered IDs, not full Pokémon objects. Static Pokémon data comes from build-time JSON, not the store.

**[Risk] Schema migration bugs corrupt user data** → Mitigation: Start all stores at version 1 with simple state shapes. Migrations only run when version mismatches. Future migrations can be tested in isolation with mock persisted state.

**[Trade-off] `idb-keyval` is a new dependency** → Acceptable: it's 600 bytes gzipped, zero dependencies, widely used. The alternative (raw IndexedDB) adds far more code.
