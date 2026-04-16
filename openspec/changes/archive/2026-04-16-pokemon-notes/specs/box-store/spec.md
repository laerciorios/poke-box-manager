## ADDED Requirements

### Requirement: Box store exposes setSlotNote action
`useBoxStore` SHALL provide a `setSlotNote(boxId: string, slotIndex: number, note: string): void` action. When called on an occupied slot, it SHALL update `BoxSlot.note` to the trimmed, 500-char-capped value (or `undefined` if the trimmed string is empty). When called on a `null` slot, it SHALL be a no-op.

#### Scenario: setSlotNote updates note on occupied slot
- **WHEN** `setSlotNote("box-1", 5, "OT: John")` is called and slot 5 of box-1 is occupied
- **THEN** `boxes[box-1].slots[5].note` SHALL equal `"OT: John"`

#### Scenario: setSlotNote is a no-op on empty slot
- **WHEN** `setSlotNote("box-1", 5, "note")` is called and slot 5 is `null`
- **THEN** no state change SHALL occur

#### Scenario: setSlotNote with empty string sets note to undefined
- **WHEN** `setSlotNote("box-1", 5, "")` is called
- **THEN** `boxes[box-1].slots[5].note` SHALL be `undefined`

#### Scenario: setSlotNote truncates input exceeding 500 characters
- **WHEN** `setSlotNote` is called with a string of 600 characters
- **THEN** the stored note SHALL contain exactly the first 500 characters

### Requirement: Box store persists to IndexedDB at schema version 2
The `useBoxStore` SHALL increment its persisted schema version to `2`. The migration from version `1` to version `2` SHALL be a no-op (existing `BoxSlot` records have no `note` field; `undefined` is the correct default for the optional field).

#### Scenario: Migration from v1 to v2 preserves all existing slots
- **WHEN** a user upgrades from a version of the app that used schema version 1
- **THEN** all existing boxes and slots SHALL be preserved with their original `pokemonId`, `formId`, `registered`, and `shiny` values
- **THEN** each slot's `note` SHALL be `undefined`
