## MODIFIED Requirements

### Requirement: Settings store persists to IndexedDB
The `useSettingsStore` SHALL persist its state to IndexedDB using the `createPersistedStore` helper with store name `"settings"` and schema version `3`.

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
