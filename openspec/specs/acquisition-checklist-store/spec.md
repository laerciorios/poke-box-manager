## ADDED Requirements

### Requirement: Acquisition checklist progress store

The system SHALL provide a `useAcquisitionStore` Zustand store at `src/stores/useAcquisitionStore.ts` that persists per-Pokémon checklist progress to IndexedDB. Progress is keyed by `pokemonId` (number) and stores a set of checked step indices (0-based positions in the `EvolutionStep[]` array filtered to that Pokémon's `toId`).

The store SHALL expose:

- `checkedSteps: Record<number, number[]>` — map of pokemonId → array of checked step indices
- `toggleStep(pokemonId: number, stepIndex: number): void`
- `clearChecklist(pokemonId: number): void`
- `isStepChecked(pokemonId: number, stepIndex: number): boolean`

#### Scenario: Toggle step on checks it

- **WHEN** calling `toggleStep(pokemonId, stepIndex)` for a step that is not yet checked
- **THEN** `stepIndex` SHALL be added to the checked set for that `pokemonId`

#### Scenario: Toggle step off unchecks it

- **WHEN** calling `toggleStep(pokemonId, stepIndex)` for a step that is already checked
- **THEN** `stepIndex` SHALL be removed from the checked set for that `pokemonId`

#### Scenario: isStepChecked returns correct state

- **WHEN** calling `isStepChecked(pokemonId, stepIndex)` after toggling a step on
- **THEN** it SHALL return `true`
- **WHEN** calling `isStepChecked` for a step that was never checked
- **THEN** it SHALL return `false`

#### Scenario: clearChecklist resets all steps for a Pokémon

- **WHEN** calling `clearChecklist(pokemonId)` for a Pokémon with checked steps
- **THEN** all checked step indices for that `pokemonId` SHALL be removed

### Requirement: Acquisition store persists to IndexedDB

The `useAcquisitionStore` SHALL persist its state to IndexedDB using the `createPersistedStore` helper with store name `"acquisition"` and schema version `1`.

#### Scenario: Checklist progress survives page reload

- **WHEN** the user checks steps and the page is reloaded
- **THEN** all checked step states SHALL be restored from IndexedDB

#### Scenario: Pokémon with no checked steps has no entry in storage

- **WHEN** no steps have been checked for a Pokémon
- **THEN** `checkedSteps[pokemonId]` SHALL be `undefined` or an empty array (no unnecessary keys)
