## ADDED Requirements

### Requirement: BoxGrid wraps each slot cell in SlotContextMenu

`BoxGrid` SHALL wrap each `BoxSlotCell` with a `SlotContextMenu` component so that right-click and long-press interactions are available on every slot.

#### Scenario: Every slot cell has a context menu trigger

- **WHEN** `BoxGrid` renders a box
- **THEN** every `BoxSlotCell` (whether occupied or empty) SHALL be wrapped in `SlotContextMenu`
- **THEN** right-clicking any slot SHALL open the appropriate context menu for that slot's state

### Requirement: Clicking an empty BoxSlotCell opens PokemonPickerDialog

`BoxGrid` SHALL handle click events on empty (null) slots by opening `PokemonPickerDialog` for that slot position.

#### Scenario: Click on an empty slot opens the Pokémon picker

- **WHEN** the user left-clicks a `BoxSlotCell` whose slot value is `null`
- **THEN** `PokemonPickerDialog` SHALL open with the correct `boxId` and `slotIndex` in scope
- **THEN** selecting a Pokémon from the picker SHALL call `useBoxStore.setSlot(boxId, slotIndex, slot)`
