## MODIFIED Requirements

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

## ADDED Requirements

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
