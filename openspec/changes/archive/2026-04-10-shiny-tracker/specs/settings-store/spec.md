## MODIFIED Requirements

### Requirement: Settings store persists to IndexedDB
The `useSettingsStore` SHALL persist its state to IndexedDB using the `createPersistedStore` helper with store name `"settings"` and schema version `4`.

The migration from version `3` to version `4` SHALL add `shinyTrackerEnabled: false` to any previously persisted state object that is missing the field.

#### Scenario: State survives page reload
- **WHEN** settings are modified and the page is reloaded
- **THEN** the persisted values SHALL be restored from IndexedDB

#### Scenario: Migration from v3 adds shinyTrackerEnabled
- **WHEN** a user's IndexedDB contains a `settings` store at version `3` (without `shinyTrackerEnabled`)
- **THEN** the v3→v4 migration SHALL add `shinyTrackerEnabled: false` to the persisted state
- **THEN** all other settings fields SHALL be preserved

#### Scenario: Fresh install starts at version 4
- **WHEN** a new user opens the app for the first time
- **THEN** the settings store SHALL initialize at version `4` with `DEFAULT_SETTINGS`
- **THEN** `DEFAULT_SETTINGS` SHALL include `shinyTrackerEnabled: false`

## ADDED Requirements

### Requirement: Settings store exposes shinyTrackerEnabled toggle action
The `useSettingsStore` SHALL expose a `setShinyTrackerEnabled(value: boolean)` action that updates the `shinyTrackerEnabled` field.

#### Scenario: Enable shiny tracker
- **WHEN** calling `setShinyTrackerEnabled(true)`
- **THEN** `shinyTrackerEnabled` SHALL be `true`

#### Scenario: Disable shiny tracker
- **WHEN** calling `setShinyTrackerEnabled(false)`
- **THEN** `shinyTrackerEnabled` SHALL be `false`
- **THEN** `registeredShiny` data in `usePokedexStore` SHALL remain unchanged
