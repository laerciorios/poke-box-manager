## ADDED Requirements

### Requirement: Zustand installation with persist middleware
The system SHALL install Zustand as the state management library. The persist middleware SHALL be configured and ready for use by future stores. A helper utility SHALL be available at `src/lib/store.ts` to create persisted stores with consistent configuration.

#### Scenario: Zustand available as dependency
- **WHEN** inspecting `package.json`
- **THEN** `zustand` SHALL be listed as a dependency

#### Scenario: Persist helper creates working store
- **WHEN** a developer creates a new store using the persist helper from `src/lib/store.ts`
- **THEN** the store SHALL automatically persist its state to storage
- **THEN** the store SHALL rehydrate state on page reload

### Requirement: No business stores in this change
This change SHALL NOT create domain-specific stores (boxStore, pokedexStore, settingsStore, presetsStore). Only the infrastructure (Zustand + persist helper) SHALL be set up.

#### Scenario: No domain stores exist
- **WHEN** inspecting `src/stores/`
- **THEN** no domain-specific store files (useBoxStore, usePokedexStore, useSettingsStore, usePresetsStore) SHALL exist
