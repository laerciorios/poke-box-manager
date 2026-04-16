## ADDED Requirements

### Requirement: Box store manages box CRUD

The system SHALL provide a `useBoxStore` Zustand store at `src/stores/useBoxStore.ts` that manages an array of `Box` objects. The store SHALL use the `Box` and `BoxSlot` types from `src/types/box.ts`.

#### Scenario: Create a new box

- **WHEN** calling `createBox(name)` with a box name
- **THEN** a new `Box` SHALL be appended to the boxes array with a generated UUID `id`, the given `name`, and 30 `null` slots

#### Scenario: Delete a box

- **WHEN** calling `deleteBox(boxId)` with a valid box ID
- **THEN** the box with that ID SHALL be removed from the boxes array

#### Scenario: Rename a box

- **WHEN** calling `renameBox(boxId, newName)` with a valid box ID and new name
- **THEN** the box's `name` field SHALL be updated to the new name

### Requirement: Box store manages slot assignment

The system SHALL allow assigning and clearing Pokémon in box slots. The `BoxSlot` model SHALL include an optional `tagIds?: string[]` field.

#### Scenario: Assign a Pokémon to a slot

- **WHEN** calling `setSlot(boxId, slotIndex, pokemonSlot)` with a valid box ID, slot index (0–29), and a `BoxSlot` object
- **THEN** the slot at the given index SHALL contain the provided `BoxSlot`

#### Scenario: Clear a slot

- **WHEN** calling `clearSlot(boxId, slotIndex)` with a valid box ID and slot index
- **THEN** the slot at the given index SHALL be set to `null`

#### Scenario: Move a Pokémon between slots

- **WHEN** calling `moveSlot(fromBoxId, fromIndex, toBoxId, toIndex)`
- **THEN** the Pokémon in the source slot SHALL be placed in the destination slot
- **THEN** the source slot SHALL be set to `null`
- **THEN** if the destination slot was occupied, its content SHALL be placed in the source slot (swap)
- **THEN** `tagIds` on the moved slot SHALL be preserved in the destination

### Requirement: Box store supports per-slot tag assignment

The `useBoxStore` SHALL expose `addTagToSlot(boxId, slotIndex, tagId)` and `removeTagFromSlot(boxId, slotIndex, tagId)` actions for managing tag assignments on individual slots.

#### Scenario: Add a tag to an occupied slot

- **WHEN** calling `addTagToSlot(boxId, slotIndex, tagId)` on a slot that contains a `BoxSlot`
- **THEN** the tag ID SHALL be appended to the slot's `tagIds` array if not already present

#### Scenario: Adding a duplicate tag ID is a no-op

- **WHEN** calling `addTagToSlot` with a tag ID already in the slot's `tagIds`
- **THEN** the slot's `tagIds` array SHALL remain unchanged (no duplicate)

#### Scenario: Add tag to empty slot is a no-op

- **WHEN** calling `addTagToSlot` on a `null` slot
- **THEN** the store SHALL not throw and state SHALL remain unchanged

#### Scenario: Remove a tag from a slot

- **WHEN** calling `removeTagFromSlot(boxId, slotIndex, tagId)`
- **THEN** the tag ID SHALL be removed from the slot's `tagIds` array

### Requirement: Box store supports tag ID purge

The `useBoxStore` SHALL expose a `purgeTagId(tagId: string)` action that removes the given `tagId` from the `tagIds` array of every slot in every box.

#### Scenario: Purge removes tag from all slots

- **WHEN** calling `purgeTagId(tagId)`
- **THEN** every slot whose `tagIds` contained that ID SHALL have it removed

#### Scenario: Purge on non-existent tag ID is safe

- **WHEN** calling `purgeTagId` with an ID that does not exist in any slot
- **THEN** the store SHALL not throw and state SHALL remain unchanged

### Requirement: Box store supports reordering

The system SHALL allow reordering boxes within the array.

#### Scenario: Reorder a box

- **WHEN** calling `reorderBox(boxId, newIndex)` with a valid box ID and target index
- **THEN** the box SHALL be moved to the target index in the boxes array
- **THEN** other boxes SHALL shift to accommodate the move

### Requirement: Box store supports bulk operations from presets

The system SHALL allow replacing all boxes at once to support preset application.

#### Scenario: Apply preset results

- **WHEN** calling `setBoxes(boxes)` with an array of `Box` objects
- **THEN** the entire boxes array SHALL be replaced with the provided array

### Requirement: Box store persists to IndexedDB

The `useBoxStore` SHALL persist its state to IndexedDB using the `createPersistedStore` helper with store name `"boxes"` and schema version `1`.

#### Scenario: State survives page reload

- **WHEN** boxes are created and modified, then the page is reloaded
- **THEN** all box state SHALL be restored from IndexedDB

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
