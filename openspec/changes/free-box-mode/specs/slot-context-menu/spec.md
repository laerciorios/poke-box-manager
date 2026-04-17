## ADDED Requirements

### Requirement: SlotContextMenu appears on right-click and long-press

The system SHALL provide a `SlotContextMenu` component at `src/components/boxes/SlotContextMenu.tsx` that wraps a `BoxSlotCell`. It SHALL use shadcn/ui `ContextMenu` for desktop right-click and a 500 ms `pointerdown` timer for mobile long-press.

#### Scenario: Right-click on a slot opens the context menu

- **WHEN** the user right-clicks a `BoxSlotCell`
- **THEN** the `SlotContextMenu` SHALL open at the pointer position
- **THEN** it SHALL display the applicable actions for that slot

#### Scenario: Long-press on a slot opens the context menu

- **WHEN** the user holds a pointer down on a `BoxSlotCell` for 500 ms without moving more than 5 px
- **THEN** the `SlotContextMenu` SHALL open
- **THEN** the native browser context menu SHALL be suppressed via `preventDefault`

#### Scenario: Pointer movement beyond 5 px cancels long-press

- **WHEN** the user starts a press on a slot and moves the pointer more than 5 px before 500 ms
- **THEN** the long-press timer SHALL be cancelled
- **THEN** no context menu SHALL open (allowing normal scroll/drag)

### Requirement: Context menu for occupied slots offers Change, Clear, and Move actions

When the target slot contains a `BoxSlot` (non-null), the context menu SHALL display three items: "Change Pokémon", "Clear slot", and "Move to…".

#### Scenario: "Change Pokémon" opens PokemonPickerDialog

- **WHEN** the user selects "Change Pokémon" from the context menu on an occupied slot
- **THEN** `PokemonPickerDialog` SHALL open pre-loaded for that slot position
- **THEN** selecting a new Pokémon SHALL call `setSlot` and replace the existing entry

#### Scenario: "Clear slot" removes the Pokémon from the slot

- **WHEN** the user selects "Clear slot" from the context menu
- **THEN** `useBoxStore.clearSlot(boxId, slotIndex)` SHALL be called immediately (no confirmation)
- **THEN** the slot SHALL render as empty

#### Scenario: "Move to…" opens a two-step box-and-slot picker

- **WHEN** the user selects "Move to…" from the context menu
- **THEN** a dialog SHALL appear listing all boxes by name
- **WHEN** the user selects a target box
- **THEN** a mini 6×5 slot grid for that box SHALL be displayed
- **WHEN** the user selects a target slot
- **THEN** `useBoxStore.moveSlot(fromBoxId, fromIndex, toBoxId, toIndex)` SHALL be called
- **THEN** if the target slot was occupied, its contents SHALL swap to the source slot

### Requirement: Context menu for empty slots offers only "Place Pokémon"

When the target slot is null, the context menu SHALL display a single item: "Place Pokémon", which opens `PokemonPickerDialog`.

#### Scenario: "Place Pokémon" on an empty slot opens picker

- **WHEN** the user right-clicks an empty slot and selects "Place Pokémon"
- **THEN** `PokemonPickerDialog` SHALL open for that slot position
