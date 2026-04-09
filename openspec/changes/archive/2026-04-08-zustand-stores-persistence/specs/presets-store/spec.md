## ADDED Requirements

### Requirement: Presets store manages organization presets
The system SHALL provide a `usePresetsStore` Zustand store at `src/stores/usePresetsStore.ts` that manages an array of `OrganizationPreset` objects. The store SHALL use types from `src/types/preset.ts`.

#### Scenario: List all presets
- **WHEN** accessing `presets` from the store
- **THEN** an array of all `OrganizationPreset` objects SHALL be returned (built-in and custom)

#### Scenario: Get a preset by ID
- **WHEN** calling `getPreset(presetId)` with a valid preset ID
- **THEN** the matching `OrganizationPreset` SHALL be returned

### Requirement: Presets store supports custom preset CRUD
The system SHALL allow creating, updating, and deleting custom (non-built-in) presets.

#### Scenario: Create a custom preset
- **WHEN** calling `createPreset(preset)` with an `OrganizationPreset` where `isBuiltIn` is `false`
- **THEN** the preset SHALL be appended to the presets array with a generated UUID `id`

#### Scenario: Update a custom preset
- **WHEN** calling `updatePreset(presetId, changes)` with a valid custom preset ID and partial preset data
- **THEN** the preset SHALL be updated with the provided changes
- **THEN** built-in presets SHALL NOT be modifiable via this action

#### Scenario: Delete a custom preset
- **WHEN** calling `deletePreset(presetId)` with a valid custom preset ID
- **THEN** the preset SHALL be removed from the array
- **THEN** built-in presets SHALL NOT be deletable via this action

### Requirement: Presets store supports duplicate
The system SHALL allow duplicating a preset (built-in or custom) as a new custom preset.

#### Scenario: Duplicate a preset
- **WHEN** calling `duplicatePreset(presetId)` with any valid preset ID
- **THEN** a new preset SHALL be created with the same rules and a generated UUID
- **THEN** the new preset SHALL have `isBuiltIn: false`
- **THEN** the new preset name SHALL indicate it is a copy

### Requirement: Presets store persists to IndexedDB
The `usePresetsStore` SHALL persist its state to IndexedDB using the `createPersistedStore` helper with store name `"presets"` and schema version `1`.

#### Scenario: State survives page reload
- **WHEN** custom presets are created and the page is reloaded
- **THEN** all presets (built-in and custom) SHALL be restored from IndexedDB
