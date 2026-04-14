## ADDED Requirements

### Requirement: Each box slot stores an optional free-text note
`BoxSlot` SHALL support an optional `note?: string` field of up to 500 characters. The note is associated with the Pokémon occupying the slot, travels with it on `moveSlot`, and is discarded when the slot is cleared.

#### Scenario: Note is stored with the slot
- **WHEN** `setSlotNote(boxId, slotIndex, "OT: John, Nature: Adamant")` is called on an occupied slot
- **THEN** `useBoxStore` SHALL store the note string on the corresponding `BoxSlot.note`
- **THEN** the note SHALL persist across page reloads via IndexedDB

#### Scenario: Note travels with Pokémon on moveSlot
- **WHEN** `moveSlot` moves a Pokémon from slot A (which has a note) to slot B
- **THEN** the Pokémon in slot B SHALL carry the same note that was on slot A
- **THEN** slot A SHALL be empty (note discarded with the slot)

#### Scenario: Note is discarded when slot is cleared
- **WHEN** `clearSlot` is called on a slot that has a note
- **THEN** the slot SHALL become `null`
- **THEN** the note SHALL no longer exist

#### Scenario: setSlotNote is a no-op on an empty slot
- **WHEN** `setSlotNote` is called on a slot index that is `null`
- **THEN** no state change SHALL occur

#### Scenario: Note is trimmed and capped at 500 characters
- **WHEN** `setSlotNote` is called with a string longer than 500 characters
- **THEN** the stored note SHALL be trimmed to exactly 500 characters

#### Scenario: Setting an empty string clears the note
- **WHEN** `setSlotNote` is called with an empty string `""`
- **THEN** `BoxSlot.note` SHALL be `undefined` (not stored as empty string)

### Requirement: Note indicator is visible on slots with a non-empty note
`BoxSlotCell` SHALL render a small icon indicator when `slot.note` is a non-empty string. The indicator SHALL be absent when `slot.note` is absent or empty.

#### Scenario: Indicator appears when note is non-empty
- **WHEN** a `BoxSlotCell` renders with a `BoxSlot` whose `note` is a non-empty string
- **THEN** a small note icon SHALL be visible on the cell (e.g., a pencil or document icon, positioned in a corner)

#### Scenario: No indicator when note is absent
- **WHEN** a `BoxSlotCell` renders with a `BoxSlot` whose `note` is `undefined` or `""`
- **THEN** no note indicator SHALL be rendered on the cell

#### Scenario: Indicator is not interactive
- **WHEN** the user clicks or hovers the note indicator
- **THEN** the indicator SHALL NOT independently open any UI; interaction is handled by the slot's existing click/keyboard handler

### Requirement: Note is readable and editable in the PokemonCard sheet
When a `PokemonCard` sheet is opened for a slot that belongs to a box, it SHALL display the current note in a textarea. Editing the textarea and blurring SHALL persist the new note via `setSlotNote`. The textarea SHALL enforce the 500-character cap.

#### Scenario: Note textarea shows current note on open
- **WHEN** `PokemonCard` opens for a slot with `note = "Needs stone evolution"`
- **THEN** the textarea SHALL be pre-filled with `"Needs stone evolution"`

#### Scenario: Note textarea is empty when no note exists
- **WHEN** `PokemonCard` opens for a slot with no note
- **THEN** the textarea SHALL be empty with a localized placeholder (e.g., "Add a note…")

#### Scenario: Editing and blurring saves the note
- **WHEN** the user types a new note in the textarea and the textarea loses focus
- **THEN** `setSlotNote(boxId, slotIndex, newNote)` SHALL be called
- **THEN** the stored note SHALL reflect the new value

#### Scenario: Deleting all text and blurring clears the note
- **WHEN** the user clears the textarea and the field loses focus
- **THEN** `setSlotNote(boxId, slotIndex, "")` SHALL be called
- **THEN** `BoxSlot.note` SHALL become `undefined`

#### Scenario: Textarea rejects input beyond 500 characters
- **WHEN** the textarea already contains 500 characters
- **THEN** further keyboard input SHALL be ignored (via `maxLength` attribute)

#### Scenario: Note editor is not shown when PokemonCard lacks slot context
- **WHEN** `PokemonCard` is opened in a context that has no associated `boxId`/`slotIndex` (e.g., from the Pokédex page)
- **THEN** no note textarea SHALL be rendered
