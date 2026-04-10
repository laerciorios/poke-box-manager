## ADDED Requirements

### Requirement: Import reads a JSON file via file picker
The system SHALL provide a file input (`.json` only) that reads the selected file via `FileReader` and parses its contents as JSON.

#### Scenario: User selects a valid JSON file
- **WHEN** the user clicks "Import" and selects a `.json` file
- **THEN** the file SHALL be read via `FileReader.readAsText`
- **THEN** the parsed content SHALL be passed to schema validation before any store is modified

#### Scenario: User selects a non-JSON file
- **WHEN** the user selects a file that cannot be parsed as JSON
- **THEN** an error message SHALL be displayed: "File is not valid JSON"
- **THEN** no store data SHALL be modified

### Requirement: Import validates the file schema before applying
The system SHALL validate the parsed JSON against the `ExportEnvelope` schema and reject files that fail validation with a descriptive error message.

#### Scenario: Valid export file passes validation
- **WHEN** a file produced by the app's own export function is selected
- **THEN** schema validation SHALL succeed and the confirmation dialog SHALL open

#### Scenario: File missing required top-level fields fails validation
- **WHEN** the parsed JSON is missing `version`, `app`, or `data`
- **THEN** an error SHALL be displayed: "File does not appear to be a Pokémon Box Manager backup"
- **THEN** no store data SHALL be modified

#### Scenario: File from a different app fails the guard check
- **WHEN** the parsed JSON has `app` set to a value other than `"poke-box-manager"`
- **THEN** an error SHALL be displayed indicating the file is not from this application
- **THEN** no store data SHALL be modified

#### Scenario: File with invalid data arrays fails validation
- **WHEN** `data.boxes` or `data.registered` is not an array
- **THEN** an error SHALL be displayed describing the invalid field
- **THEN** no store data SHALL be modified

### Requirement: Confirmation dialog presents merge and replace options
After a file passes validation, the system SHALL display a confirmation dialog showing file metadata and two import mode options before modifying any data.

#### Scenario: Dialog shows file metadata
- **WHEN** the confirmation dialog opens after successful validation
- **THEN** the dialog SHALL display: the `exportedAt` date formatted in the active locale, the count of boxes, registrations, and presets in the file

#### Scenario: User chooses Replace mode
- **WHEN** the user clicks "Replace all data" in the confirmation dialog
- **THEN** all existing boxes, registrations, and presets SHALL be cleared
- **THEN** the imported `boxes`, `registered`, and `presets` SHALL be loaded into their respective stores
- **THEN** the imported `settings` SHALL overwrite `useSettingsStore` (excluding `pendingChanges`)
- **THEN** `recordBackup()` SHALL be called after a successful replace import

#### Scenario: User chooses Merge mode
- **WHEN** the user clicks "Merge" in the confirmation dialog
- **THEN** `registered` entries SHALL be unioned with existing registrations (no duplicates)
- **THEN** imported `boxes` whose `id` does not exist in the store SHALL be appended
- **THEN** imported `presets` whose `id` does not exist in the store SHALL be appended
- **THEN** current `settings` SHALL remain unchanged
- **THEN** `recordBackup()` SHALL be called after a successful merge

#### Scenario: User cancels the confirmation dialog
- **WHEN** the user closes or cancels the confirmation dialog
- **THEN** no store data SHALL be modified

### Requirement: Import errors are shown inline without losing the user's current data
If any step of the import process fails (file read, parse, validate, apply), the system SHALL display an error message in the UI and leave all store data untouched.

#### Scenario: Error is shown without data loss
- **WHEN** import fails at any stage
- **THEN** an error message SHALL be visible in the Data & Backup section
- **THEN** all store data SHALL remain in its pre-import state
