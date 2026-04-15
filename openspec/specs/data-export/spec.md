## ADDED Requirements

### Requirement: Full JSON export downloads all user data

The system SHALL provide a function that serialises the current state of all four stores (boxes, registrations, settings, presets) into a versioned `ExportEnvelope` JSON object and triggers a browser download via `Blob + URL.createObjectURL`.

#### Scenario: Export produces a downloadable JSON file

- **WHEN** the user clicks "Export JSON" in the Data & Backup settings section
- **THEN** a `.json` file SHALL be downloaded by the browser
- **THEN** the filename SHALL follow the pattern `poke-box-manager-YYYY-MM-DD.json`

#### Scenario: Export envelope contains all store data

- **WHEN** the exported JSON file is parsed
- **THEN** it SHALL contain a top-level `version` number, `exportedAt` ISO timestamp, `app: "poke-box-manager"` identifier, and a `data` object with `boxes`, `registered`, `settings`, and `presets` fields

#### Scenario: Export records the backup timestamp

- **WHEN** the export completes successfully
- **THEN** `useSettingsStore.recordBackup()` SHALL be called, updating `lastBackup` to the current ISO timestamp and resetting `pendingChanges` to `0`

### Requirement: Missing Pokémon text export produces a plain-text list

The system SHALL provide a function that generates a newline-separated list of unregistered Pokémon (dex number + localized name) and either downloads it as a `.txt` file or copies it to the clipboard.

#### Scenario: Text export lists all unregistered Pokémon

- **WHEN** the user clicks "Export missing list"
- **THEN** each unregistered base Pokémon SHALL appear as a line in the format `#NNNN Name` (dex number zero-padded to 4 digits, localized name)
- **THEN** the lines SHALL be sorted by national dex number ascending

#### Scenario: Text export triggers a download

- **WHEN** the user chooses "Download as .txt"
- **THEN** a `.txt` file SHALL be downloaded with MIME type `text/plain`
- **THEN** the filename SHALL follow the pattern `missing-pokemon-YYYY-MM-DD.txt`

#### Scenario: Copy to clipboard is offered as an alternative

- **WHEN** the user chooses "Copy to clipboard"
- **THEN** the full text content SHALL be written to the clipboard via `navigator.clipboard.writeText()`
- **THEN** a brief success confirmation SHALL be shown (e.g., a toast or inline text change)

### Requirement: Export UI is in the Settings page under "Data & Backup"

The Settings page SHALL contain a "Data & Backup" section with clearly labelled buttons for each export action.

#### Scenario: Export JSON button is visible in Settings

- **WHEN** the user visits the Settings page
- **THEN** a "Data & Backup" section SHALL be visible with an "Export JSON" button

#### Scenario: Export missing list button is visible in Settings

- **WHEN** the user visits the Settings page
- **THEN** a "Export missing list" button SHALL be visible in the "Data & Backup" section
