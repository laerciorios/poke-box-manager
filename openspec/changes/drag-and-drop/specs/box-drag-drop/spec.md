## ADDED Requirements

### Requirement: Slots are draggable sources
Every non-empty `BoxSlotCell` SHALL be a draggable source using `@dnd-kit/core`'s `useDraggable` hook. Empty slots SHALL NOT be draggable.

#### Scenario: Non-empty slot can be dragged
- **WHEN** the user begins a drag gesture on a slot that contains a `BoxSlot`
- **THEN** a drag interaction SHALL start with the draggable ID `"boxId:slotIndex"`
- **THEN** the slot cell SHALL render at reduced opacity to indicate it is the drag source

#### Scenario: Empty slot cannot be dragged
- **WHEN** the user attempts to drag an empty slot (slot value is `null`)
- **THEN** no drag interaction SHALL start

### Requirement: All slots are droppable targets
Every slot (empty and occupied) in every mounted `BoxGrid` SHALL be a droppable target using `@dnd-kit/core`'s `useDroppable` hook, identified by `"boxId:slotIndex"`.

#### Scenario: Drop zone highlight appears on hover
- **WHEN** a drag is in flight and the pointer enters a slot's drop zone
- **THEN** that slot SHALL render a distinct visual highlight (e.g., ring border)

#### Scenario: Drop zone highlight clears on pointer leave
- **WHEN** the pointer leaves a slot's drop zone without dropping
- **THEN** the highlight SHALL be removed

### Requirement: Dropping onto an empty slot moves the Pokémon
When the user drops a dragged slot onto an empty target slot, `useBoxStore.moveSlot` SHALL be called, resulting in the Pokémon occupying the target slot and the source slot becoming empty.

#### Scenario: Drag from slot A (occupied) to slot B (empty)
- **WHEN** the user drops a Pokémon from slot A onto an empty slot B
- **THEN** `useBoxStore.moveSlot(fromBoxId, fromIndex, toBoxId, toIndex)` SHALL be called
- **THEN** slot B SHALL contain the Pokémon that was in slot A
- **THEN** slot A SHALL be empty (`null`)

#### Scenario: Drop on the same slot is a no-op
- **WHEN** the user drops a slot onto itself (same `boxId` and `slotIndex`)
- **THEN** no store mutation SHALL occur

### Requirement: Dropping onto an occupied slot swaps the two Pokémon
When the user drops a dragged slot onto a slot that is already occupied, `useBoxStore.moveSlot` SHALL be called, resulting in the two Pokémon exchanging positions.

#### Scenario: Drag from slot A (occupied) to slot B (occupied)
- **WHEN** the user drops a Pokémon from slot A onto an occupied slot B
- **THEN** `useBoxStore.moveSlot(fromBoxId, fromIndex, toBoxId, toIndex)` SHALL be called
- **THEN** slot B SHALL contain the Pokémon that was in slot A
- **THEN** slot A SHALL contain the Pokémon that was in slot B

### Requirement: Cross-box drag is supported when both boxes are mounted
When the destination box is currently rendered in the DOM (e.g., in overview mode), a drag from one box to another SHALL be recognized as a valid drop.

#### Scenario: Drag from box 1 slot to box 2 slot
- **WHEN** both `BoxGrid` components for box 1 and box 2 are mounted under the same `DndContext`
- **THEN** dropping a slot from box 1 onto a slot in box 2 SHALL call `useBoxStore.moveSlot` with the correct source and destination box IDs

#### Scenario: Drop outside any valid target cancels the drag
- **WHEN** the user releases the drag pointer outside any droppable target
- **THEN** no store mutation SHALL occur
- **THEN** the source slot SHALL return to its original appearance

### Requirement: DragOverlay renders a ghost sprite
A single `DragOverlay` SHALL be mounted inside `DndContext`. While a drag is active, it SHALL render the sprite of the dragged Pokémon at slightly larger scale with a drop shadow.

#### Scenario: Ghost appears on drag start
- **WHEN** a drag interaction begins on a non-empty slot
- **THEN** a ghost overlay SHALL appear at the pointer position showing the Pokémon sprite

#### Scenario: Ghost follows the pointer
- **WHEN** the user moves the pointer during a drag
- **THEN** the ghost overlay SHALL follow the pointer continuously

#### Scenario: Ghost disappears on drag end
- **WHEN** the drag ends (drop or cancel)
- **THEN** the ghost overlay SHALL be removed

### Requirement: Single DndContext wraps the box page
A single `DndContext` from `@dnd-kit/core` SHALL wrap the entire box page, encompassing all rendered `BoxGrid` components, to enable cross-box drag support.

#### Scenario: DndContext is a single ancestor
- **WHEN** the box page renders multiple `BoxGrid` components
- **THEN** all grids SHALL be descendants of the same `DndContext` instance

#### Scenario: onDragEnd triggers moveSlot
- **WHEN** a drag ends over a valid droppable target
- **THEN** the `DndContext`'s `onDragEnd` handler SHALL parse the active and over IDs and call `useBoxStore.moveSlot` with the extracted box and slot indices
