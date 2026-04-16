## ADDED Requirements

### Requirement: BoxSlot carries tag assignments

The `BoxSlot` type in `src/types/box.ts` SHALL be extended with an optional `tagIds?: string[]` field representing the IDs of tags assigned to that slot. Absence of the field SHALL be treated as an empty assignment (no tags).

#### Scenario: New slot has no tags by default

- **WHEN** a new `BoxSlot` is created via `setSlot`
- **THEN** `tagIds` SHALL be absent or an empty array

#### Scenario: Existing slots without tagIds are valid

- **WHEN** a slot loaded from IndexedDB has no `tagIds` field
- **THEN** the system SHALL treat it as having zero tags (no error, no migration needed)

### Requirement: Box store supports tag assignment on slots

The `useBoxStore` SHALL expose `addTagToSlot(boxId, slotIndex, tagId)` and `removeTagFromSlot(boxId, slotIndex, tagId)` actions.

#### Scenario: Add a tag to a slot

- **WHEN** calling `addTagToSlot(boxId, slotIndex, tagId)` on an occupied slot
- **THEN** the tag ID SHALL be appended to the slot's `tagIds` array (no duplicate)

#### Scenario: Add tag to empty slot is a no-op

- **WHEN** calling `addTagToSlot` on a `null` slot
- **THEN** the store SHALL not throw and the state SHALL remain unchanged

#### Scenario: Remove a tag from a slot

- **WHEN** calling `removeTagFromSlot(boxId, slotIndex, tagId)`
- **THEN** the tag ID SHALL be removed from the slot's `tagIds` array

#### Scenario: Tags travel with slot on move

- **WHEN** calling `moveSlot(fromBoxId, fromIndex, toBoxId, toIndex)`
- **THEN** the moved slot's `tagIds` SHALL be preserved in the destination slot

### Requirement: Box store purges deleted tag IDs

The `useBoxStore` SHALL expose a `purgeTagId(tagId)` action that removes the given `tagId` from the `tagIds` array of every slot in every box.

#### Scenario: Purge removes tag from all slots

- **WHEN** calling `purgeTagId(tagId)` after a tag is deleted
- **THEN** every slot whose `tagIds` contained that ID SHALL have it removed
- **THEN** slots with no remaining tags SHALL have an empty `tagIds` array

### Requirement: Tag assignment UI on slot context menu

The system SHALL allow users to assign or remove tags from a slot via a context menu or slot action panel that lists all existing tags with checkboxes.

#### Scenario: Open tag assignment panel

- **WHEN** the user right-clicks or long-presses a slot, or uses a "Tags" action button
- **THEN** a panel SHALL appear listing all user-created tags with their color and name

#### Scenario: Toggle tag on slot

- **WHEN** the user checks a tag in the panel
- **THEN** the tag SHALL be assigned to the slot
- **WHEN** the user unchecks an already-assigned tag
- **THEN** the tag SHALL be removed from the slot

#### Scenario: No tags created yet

- **WHEN** the user opens the tag assignment panel and no tags exist
- **THEN** the panel SHALL show a prompt to create tags first (with a link to the tag manager)
