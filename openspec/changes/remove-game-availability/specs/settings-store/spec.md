## MODIFIED Requirements

### Requirement: Settings store manages generation and game filters
The system SHALL allow updating generation filters. The `setGameFilter` and `setActiveGames` actions SHALL NOT exist in the store.

#### Scenario: Set active generations
- **WHEN** calling `setActiveGenerations(generations)` with an array of generation numbers
- **THEN** the `activeGenerations` field SHALL be replaced with the provided array

#### Scenario: Game filter actions removed
- **WHEN** inspecting the store interface
- **THEN** `setGameFilter` and `setActiveGames` SHALL NOT be present as actions

### Requirement: Settings store persists to IndexedDB
The `useSettingsStore` SHALL persist its state to IndexedDB using the `createPersistedStore` helper with store name `"settings"` and schema version `2`.

The migration from version `1` to version `2` SHALL remove the `gameFilter` and `activeGames` keys from any previously persisted state object.

#### Scenario: State survives page reload
- **WHEN** settings are modified and the page is reloaded
- **THEN** the persisted values SHALL be restored from IndexedDB

#### Scenario: Migration cleans up orphaned keys
- **WHEN** a user's IndexedDB contains a `settings` store at version `1` with `gameFilter` and `activeGames` keys
- **THEN** on next app load the migration SHALL run
- **THEN** the resulting state SHALL not contain `gameFilter` or `activeGames`
- **THEN** all other settings fields SHALL be preserved

#### Scenario: Fresh install starts at version 2
- **WHEN** a new user opens the app for the first time
- **THEN** the settings store SHALL initialize at version `2` with `DEFAULT_SETTINGS`
- **THEN** `DEFAULT_SETTINGS` SHALL NOT contain `gameFilter` or `activeGames`
