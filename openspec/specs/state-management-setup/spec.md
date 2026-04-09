## ADDED Requirements

### Requirement: Zustand installation with persist middleware
The system SHALL install Zustand as the state management library. The persist middleware SHALL be configured and ready for use by future stores. A helper utility SHALL be available at `src/lib/store.ts` to create persisted stores with consistent configuration. The `createPersistedStore` helper SHALL default to using the IndexedDB storage adapter from `src/lib/indexeddb-storage.ts`. The helper SHALL accept optional `version` and `migrate` parameters to support schema versioning.

#### Scenario: Zustand available as dependency
- **WHEN** inspecting `package.json`
- **THEN** `zustand` SHALL be listed as a dependency

#### Scenario: Persist helper creates working store with IndexedDB
- **WHEN** a developer creates a new store using the persist helper from `src/lib/store.ts`
- **THEN** the store SHALL automatically persist its state to IndexedDB
- **THEN** the store SHALL rehydrate state on page reload

#### Scenario: Persist helper accepts version and migrate options
- **WHEN** a developer creates a store with `version` and `migrate` options
- **THEN** the store SHALL use the provided version for persistence
- **THEN** the store SHALL call the migrate function when version mismatches are detected

### Requirement: No business stores in this change
This change SHALL NOT create domain-specific stores (boxStore, pokedexStore, settingsStore, presetsStore). Only the infrastructure (Zustand + persist helper) SHALL be set up.

#### Scenario: No domain stores exist
- **WHEN** inspecting `src/stores/`
- **THEN** no domain-specific store files (useBoxStore, usePokedexStore, useSettingsStore, usePresetsStore) SHALL exist
