## ADDED Requirements

### Requirement: Box store pushes history entries on slot and box mutations
After each successful mutation, `useBoxStore` SHALL call `useHistoryStore.getState().pushEntry(entry)` with an `ActivityEntry` describing the change. This applies to `moveSlot`, `reorderBox`, and `setBoxes`.

#### Scenario: moveSlot pushes a move-slot entry with pre-mutation state
- **WHEN** `moveSlot(fromBoxId, fromIndex, toBoxId, toIndex)` is called
- **THEN** the current contents of `(fromBoxId, fromIndex)` and `(toBoxId, toIndex)` SHALL be read via `get()` BEFORE the mutation
- **THEN** after the mutation, a `pushEntry` call SHALL be made with `actionType: 'move-slot'` and the pre-mutation slot contents in `undoPayload`

#### Scenario: reorderBox pushes a reorder-box entry with previous index
- **WHEN** `reorderBox(boxId, newIndex)` is called
- **THEN** the current index of the box SHALL be read via `get()` BEFORE the mutation
- **THEN** after the mutation, a `pushEntry` call SHALL be made with `actionType: 'reorder-box'` and `undoPayload.previousIndex` set to the box's pre-mutation index

#### Scenario: setBoxes pushes a preset-apply entry with full previous boxes snapshot
- **WHEN** `setBoxes(boxes)` is called (preset application)
- **THEN** a deep copy of the current `boxes` array SHALL be taken via `get()` BEFORE the mutation
- **THEN** after the mutation, a `pushEntry` call SHALL be made with `actionType: 'preset-apply'` and `undoPayload.previousBoxes` set to the snapshot

#### Scenario: setBoxes with identical boxes does not push an entry
- **WHEN** `setBoxes(boxes)` is called with a boxes array equal in structure to the current state
- **THEN** no `pushEntry` call SHALL be made (implementation MAY skip this check for simplicity; treating all setBoxes calls as pushable is also acceptable)
