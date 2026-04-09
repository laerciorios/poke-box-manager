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

### Requirement: Settings store manages generation and game filters
The system SHALL allow updating generation filters and game availability settings.

#### Scenario: Set active generations
- **WHEN** calling `setActiveGenerations(generations)` with an array of generation numbers
- **THEN** the `activeGenerations` field SHALL be replaced with the provided array

#### Scenario: Set game filter mode
- **WHEN** calling `setGameFilter(mode)` with `'switch-only'` or `'all'`
- **THEN** the `gameFilter` field SHALL be updated

#### Scenario: Set active games
- **WHEN** calling `setActiveGames(games)` with an array of `GameId` values
- **THEN** the `activeGames` field SHALL be replaced with the provided array

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
The `useSettingsStore` SHALL persist its state to IndexedDB using the `createPersistedStore` helper with store name `"settings"` and schema version `1`.

#### Scenario: State survives page reload
- **WHEN** settings are modified and the page is reloaded
- **THEN** all settings SHALL be restored from IndexedDB
