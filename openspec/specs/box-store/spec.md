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
The system SHALL allow assigning and clearing Pokémon in box slots.

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
