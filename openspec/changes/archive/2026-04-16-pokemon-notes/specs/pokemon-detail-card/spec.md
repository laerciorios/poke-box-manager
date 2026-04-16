## ADDED Requirements

### Requirement: PokemonCard displays and edits the slot note when opened from a box slot
When `PokemonCard` is opened with a `boxId` and `slotIndex` context, it SHALL render a note section containing a textarea pre-filled with `slot.note`. Changes are saved to `useBoxStore` via `setSlotNote` on textarea blur. When opened without slot context (e.g., from the Pokédex page), no note section is rendered.

#### Scenario: Note section visible when opened from a box slot
- **WHEN** `PokemonCard` is opened with valid `boxId` and `slotIndex` props
- **THEN** a note textarea SHALL be rendered in the card content

#### Scenario: Textarea pre-filled with existing note
- **WHEN** `PokemonCard` opens for a slot whose `note` is `"Pending trade with @friend"`
- **THEN** the textarea SHALL display `"Pending trade with @friend"`

#### Scenario: Textarea shows placeholder when no note exists
- **WHEN** `PokemonCard` opens for a slot with no note
- **THEN** the textarea SHALL be empty with a localized placeholder text (e.g., "Add a note…" / "Adicionar uma nota…")

#### Scenario: Blur saves changed note
- **WHEN** the user edits the textarea and moves focus away from it
- **THEN** `setSlotNote(boxId, slotIndex, newValue)` SHALL be called with the current textarea value
- **THEN** the slot's note in the store SHALL reflect the new value

#### Scenario: Blur with empty textarea clears the note
- **WHEN** the user clears the textarea and moves focus away
- **THEN** `setSlotNote(boxId, slotIndex, "")` SHALL be called
- **THEN** `BoxSlot.note` SHALL become `undefined`

#### Scenario: Textarea enforces 500-character limit
- **WHEN** the note textarea is rendered
- **THEN** it SHALL have `maxLength={500}` to prevent input beyond the cap

#### Scenario: Note section absent when no slot context
- **WHEN** `PokemonCard` is opened without `boxId` or `slotIndex` props
- **THEN** no note textarea or note section SHALL be rendered
