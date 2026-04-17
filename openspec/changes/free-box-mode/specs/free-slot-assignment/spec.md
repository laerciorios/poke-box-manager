## ADDED Requirements

### Requirement: PokemonPickerDialog allows placing any Pokémon in a slot

The system SHALL provide a `PokemonPickerDialog` component at `src/components/boxes/PokemonPickerDialog.tsx` that opens as a modal dialog. It SHALL accept `onSelect(entry: PokemonEntry | PokemonForm): void` and `onClose(): void` callbacks plus an optional `initialQuery` string.

#### Scenario: Dialog opens with search focused

- **WHEN** `PokemonPickerDialog` is rendered with `open={true}`
- **THEN** a search input SHALL be auto-focused
- **THEN** all available Pokémon SHALL be displayed in a sprite grid below the input

#### Scenario: Search filters by name and dex number

- **WHEN** the user types "bulb" into the search input
- **THEN** only Pokémon whose name contains "bulb" (case-insensitive) SHALL be shown
- **WHEN** the user types "001"
- **THEN** only Pokémon with dex number 1 SHALL be shown

#### Scenario: Selecting a Pokémon calls onSelect and closes dialog

- **WHEN** the user clicks a Pokémon sprite in the picker
- **THEN** `onSelect` SHALL be called with that `PokemonEntry` or `PokemonForm`
- **THEN** the dialog SHALL close

#### Scenario: Forms are included when their variation toggle is enabled

- **WHEN** `useSettingsStore` has `variations.megaEvolutions: true`
- **THEN** Mega Evolution forms SHALL appear in the picker
- **WHEN** `useSettingsStore` has `variations.megaEvolutions: false`
- **THEN** Mega Evolution forms SHALL NOT appear in the picker

#### Scenario: Pressing Escape closes the dialog without selecting

- **WHEN** the dialog is open and the user presses Escape
- **THEN** `onClose` SHALL be called
- **THEN** no slot SHALL be modified

### Requirement: Empty slot click opens PokemonPickerDialog

The system SHALL open `PokemonPickerDialog` when the user clicks an empty (null) slot in `BoxGrid`.

#### Scenario: Click on empty slot opens picker

- **WHEN** the user clicks a `BoxSlotCell` whose slot value is `null`
- **THEN** `PokemonPickerDialog` SHALL open for that slot position

#### Scenario: Confirming a selection fills the slot

- **WHEN** the user selects a Pokémon from the picker opened via empty-slot click
- **THEN** `useBoxStore.setSlot(boxId, slotIndex, { pokemonId, formId?, registered: false })` SHALL be called
- **THEN** the slot SHALL render the chosen Pokémon sprite

### Requirement: No uniqueness enforcement on slot assignment

The system SHALL allow the same Pokémon or form to occupy multiple slots across one or more boxes without restriction.

#### Scenario: Duplicate species in the same box is accepted

- **WHEN** `setSlot` is called with a `pokemonId` that already exists in another slot of the same box
- **THEN** the call SHALL succeed and both slots SHALL contain that Pokémon
- **THEN** no warning or error SHALL be shown to the user
