## ADDED Requirements

### Requirement: Backup reminder banner appears when changes are unexported

The system SHALL display a non-blocking dismissible banner when `useSettingsStore.pendingChanges ≥ 20` AND either `lastBackup` is undefined or more than 7 days have elapsed since `lastBackup`.

#### Scenario: Banner appears after significant unexported changes

- **WHEN** the user has made 20 or more changes since the last backup and has not exported in 7+ days
- **THEN** a reminder banner SHALL be visible in the app layout (below the header or above page content)
- **THEN** the banner SHALL include a message such as "You have unsaved changes — consider exporting a backup"
- **THEN** the banner SHALL include a direct "Export now" button

#### Scenario: Banner does not appear when changes are below threshold

- **WHEN** `pendingChanges` is less than 20
- **THEN** no backup reminder banner SHALL be visible

#### Scenario: Banner does not appear when a recent backup exists

- **WHEN** `lastBackup` is within the last 7 days
- **THEN** no backup reminder banner SHALL be visible regardless of `pendingChanges`

#### Scenario: "Export now" in banner triggers JSON export

- **WHEN** the user clicks "Export now" in the reminder banner
- **THEN** the JSON export function SHALL execute (download triggered)
- **THEN** the banner SHALL disappear because `pendingChanges` resets to 0

### Requirement: Dismissing the banner suppresses it for the session

The user SHALL be able to dismiss the banner with an × button, which hides it for the remainder of the browser session without modifying store state.

#### Scenario: Dismiss hides the banner

- **WHEN** the user clicks the dismiss button on the banner
- **THEN** the banner SHALL disappear
- **THEN** it SHALL not reappear until the next page load (even if `pendingChanges` remains ≥ 20)

#### Scenario: Dismiss does not reset pendingChanges

- **WHEN** the user dismisses the banner
- **THEN** `pendingChanges` SHALL remain unchanged in the store
