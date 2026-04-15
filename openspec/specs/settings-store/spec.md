## ADDED Requirements

### Requirement: Settings store manages user preferences

The system SHALL provide a `useSettingsStore` Zustand store at `src/stores/useSettingsStore.ts` that manages a `SettingsState` object. The store SHALL initialize with `DEFAULT_SETTINGS` from `src/types/settings.ts`.

#### Scenario: Read default settings on first load

- **WHEN** the store is accessed for the first time (no persisted data)
- **THEN** the state SHALL match `DEFAULT_SETTINGS`

#### Scenario: Update variation toggles

- **WHEN** calling `setVariation(key, value)` with a `VariationToggles` key and boolean value
- **THEN** the corresponding variation toggle SHALL be updated
- **THEN** other toggles SHALL remain unchanged

#### Scenario: Update all variations at once

- **WHEN** calling `setVariations(toggles)` with a partial `VariationToggles` object
- **THEN** all provided toggles SHALL be merged into the current variations

### Requirement: Settings store manages generation filters

The system SHALL allow updating generation filters. The `setGameFilter` and `setActiveGames` actions SHALL NOT exist in the store.

#### Scenario: Set active generations

- **WHEN** calling `setActiveGenerations(generations)` with an array of generation numbers
- **THEN** the `activeGenerations` field SHALL be replaced with the provided array

#### Scenario: Game filter actions removed

- **WHEN** inspecting the store interface
- **THEN** `setGameFilter` and `setActiveGames` SHALL NOT be present as actions

### Requirement: Settings store manages theme and locale

The system SHALL allow updating display preferences.

#### Scenario: Set theme

- **WHEN** calling `setTheme(theme)` with `'light'`, `'dark'`, or `'system'`
- **THEN** the `theme` field SHALL be updated

#### Scenario: Set locale

- **WHEN** calling `setLocale(locale)` with a valid `Locale` value
- **THEN** the `locale` field SHALL be updated

#### Scenario: Set sprite style

- **WHEN** calling `setSpriteStyle(style)` with a valid `SpriteStyle` value
- **THEN** the `spriteStyle` field SHALL be updated

### Requirement: Settings store supports reset to defaults

The system SHALL allow resetting all settings to their default values.

#### Scenario: Reset settings

- **WHEN** calling `resetSettings()`
- **THEN** the entire state SHALL be replaced with `DEFAULT_SETTINGS`

### Requirement: Settings store persists to IndexedDB

The `useSettingsStore` SHALL persist its state to IndexedDB using the `createPersistedStore` helper with store name `"settings"` and schema version `3`.

The migration from version `1` to version `2` SHALL remove the `gameFilter` and `activeGames` keys from any previously persisted state object.

The migration from version `2` to version `3` SHALL add `pendingChanges: 0` and `lastBackup: undefined` to any previously persisted state object that is missing those fields.

#### Scenario: State survives page reload

- **WHEN** settings are modified and the page is reloaded
- **THEN** the persisted values SHALL be restored from IndexedDB

#### Scenario: Migration cleans up orphaned keys

- **WHEN** a user's IndexedDB contains a `settings` store at version `1` with `gameFilter` and `activeGames` keys
- **THEN** on next app load the migration SHALL run
- **THEN** the resulting state SHALL not contain `gameFilter` or `activeGames`
- **THEN** all other settings fields SHALL be preserved

#### Scenario: Migration from v2 adds pendingChanges

- **WHEN** a user's IndexedDB contains a `settings` store at version `2` (without `pendingChanges`)
- **THEN** the v2→v3 migration SHALL add `pendingChanges: 0` to the persisted state
- **THEN** all other settings fields SHALL be preserved

#### Scenario: Fresh install starts at version 3

- **WHEN** a new user opens the app for the first time
- **THEN** the settings store SHALL initialize at version `3` with `DEFAULT_SETTINGS`
- **THEN** `DEFAULT_SETTINGS` SHALL include `pendingChanges: 0`

## ADDED Requirements

### Requirement: Settings store tracks pending changes for backup reminder

`SettingsState` SHALL include a `pendingChanges: number` field (default `0`) that counts meaningful data mutations (box edits, registration toggles, preset changes) since the last export. `useSettingsStore` SHALL expose two new actions: `recordChange()` and `recordBackup()`.

#### Scenario: recordChange increments the counter

- **WHEN** `recordChange()` is called
- **THEN** `pendingChanges` SHALL increase by `1`

#### Scenario: recordBackup resets the counter and records the timestamp

- **WHEN** `recordBackup()` is called
- **THEN** `pendingChanges` SHALL be set to `0`
- **THEN** `lastBackup` SHALL be set to the current ISO 8601 timestamp

#### Scenario: pendingChanges is excluded from export payload

- **WHEN** the export function builds the `ExportEnvelope`
- **THEN** `pendingChanges` SHALL NOT appear in the exported `settings` object

### Requirement: Settings store exposes shinyTrackerEnabled toggle action

The `useSettingsStore` SHALL expose a `setShinyTrackerEnabled(value: boolean)` action that updates the `shinyTrackerEnabled` field.

#### Scenario: Enable shiny tracker

- **WHEN** calling `setShinyTrackerEnabled(true)`
- **THEN** `shinyTrackerEnabled` SHALL be `true`

#### Scenario: Disable shiny tracker

- **WHEN** calling `setShinyTrackerEnabled(false)`
- **THEN** `shinyTrackerEnabled` SHALL be `false`
- **THEN** `registeredShiny` data in `usePokedexStore` SHALL remain unchanged
