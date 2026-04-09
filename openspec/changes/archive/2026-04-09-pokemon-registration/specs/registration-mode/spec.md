## ADDED Requirements

### Requirement: Registration Mode toggle controls click behavior
The system SHALL provide a "Registration Mode" toggle button in the box view. When Registration Mode is active, clicking a slot toggles its registered status. When inactive, clicks on slots have no registration effect.

#### Scenario: Enable Registration Mode
- **WHEN** the user clicks the Registration Mode toggle button while it is off
- **THEN** Registration Mode SHALL become active
- **THEN** the toggle button SHALL render in an active/highlighted state

#### Scenario: Disable Registration Mode
- **WHEN** the user clicks the Registration Mode toggle button while it is on
- **THEN** Registration Mode SHALL become inactive
- **THEN** any current slot selection SHALL be cleared
- **THEN** the floating action bar SHALL be hidden

#### Scenario: Registration Mode defaults to inactive
- **WHEN** the box view is first mounted
- **THEN** Registration Mode SHALL be inactive

### Requirement: Single-click toggles registration in Registration Mode
When Registration Mode is active, clicking a non-empty slot with no modifier keys SHALL toggle that slot's registration status in `usePokedexStore`.

#### Scenario: Click unregistered slot registers it
- **WHEN** Registration Mode is active and the user clicks a slot whose Pokémon is not registered in `usePokedexStore`
- **THEN** `usePokedexStore.toggleRegistered(pokemonId, formId)` SHALL be called
- **THEN** the slot SHALL render in the registered (green checkmark) state

#### Scenario: Click registered slot unregisters it
- **WHEN** Registration Mode is active and the user clicks a slot whose Pokémon is registered in `usePokedexStore`
- **THEN** `usePokedexStore.toggleRegistered(pokemonId, formId)` SHALL be called
- **THEN** the slot SHALL render in the missing (desaturated) state

#### Scenario: Click on empty slot has no effect
- **WHEN** Registration Mode is active and the user clicks a slot that is `null`
- **THEN** no registration action SHALL occur

### Requirement: Ctrl+Click (Cmd+Click on macOS) adds/removes slot from selection
When Registration Mode is active, holding Ctrl (or Cmd on macOS) while clicking a slot SHALL add it to the current selection without clearing other selected slots.

#### Scenario: Ctrl+Click selects an unselected slot
- **WHEN** Registration Mode is active and the user Ctrl+Clicks a slot that is not currently selected
- **THEN** that slot SHALL be added to the selection set
- **THEN** previously selected slots SHALL remain selected

#### Scenario: Ctrl+Click deselects a selected slot
- **WHEN** Registration Mode is active and the user Ctrl+Clicks a slot that is already selected
- **THEN** that slot SHALL be removed from the selection set

#### Scenario: Ctrl+Click does not toggle registration immediately
- **WHEN** the user Ctrl+Clicks a slot
- **THEN** `usePokedexStore.toggleRegistered` SHALL NOT be called immediately
- **THEN** registration changes SHALL only occur via the floating action bar

### Requirement: Shift+Click selects a contiguous range within the same box
When Registration Mode is active, holding Shift while clicking a slot SHALL select all non-empty slots between the last-clicked slot and the newly clicked slot, within the same box.

#### Scenario: Shift+Click from anchor creates range
- **WHEN** Registration Mode is active, the user has previously clicked a slot (establishing an anchor), and the user Shift+Clicks another slot in the same box
- **THEN** all non-empty slots from the anchor index to the target index (inclusive) SHALL be added to the selection set

#### Scenario: Shift+Click with no anchor selects only the clicked slot
- **WHEN** Registration Mode is active, no prior click anchor exists, and the user Shift+Clicks a slot
- **THEN** only that slot SHALL be selected

#### Scenario: Shift+Click does not cross box boundaries
- **WHEN** the user Shift+Clicks a slot in a different box than the anchor
- **THEN** only the clicked slot SHALL be selected (anchor resets to the new slot)

### Requirement: Selected slots render a visual selection indicator
Each slot that is part of the current selection SHALL render a visual highlight (border + ring) to indicate it is selected, distinct from its registered/missing state.

#### Scenario: Selected slot shows selection styling
- **WHEN** a slot is in the current selection set
- **THEN** it SHALL render with the `selected` variant of `BoxSlotCell` (border-accent + ring-accent)

#### Scenario: Deselected slot shows no selection styling
- **WHEN** a slot is not in the current selection set
- **THEN** it SHALL render without selection styling regardless of its registered state

### Requirement: Floating action bar appears when slots are selected
The system SHALL render a floating action bar at the bottom of the screen when at least one slot is selected in Registration Mode. The bar SHALL display the count of selected slots and two action buttons: "Mark as registered" and "Unmark".

#### Scenario: Bar appears on first selection
- **WHEN** Registration Mode is active and the user selects at least one slot
- **THEN** the floating action bar SHALL become visible

#### Scenario: Bar disappears when selection is cleared
- **WHEN** all slots are deselected or Registration Mode is turned off
- **THEN** the floating action bar SHALL be hidden

#### Scenario: Bar shows correct selected count
- **WHEN** N slots are selected
- **THEN** the floating action bar SHALL display a label indicating N slots are selected

### Requirement: Floating action bar bulk-registers selected slots
Clicking "Mark as registered" in the floating action bar SHALL call `usePokedexStore.registerAll` with the keys of all selected non-empty slots, then clear the selection.

#### Scenario: Mark as registered updates pokedex store
- **WHEN** the user clicks "Mark as registered" with N slots selected
- **THEN** `usePokedexStore.registerAll(keys)` SHALL be called with the N composite keys
- **THEN** all previously-selected slots SHALL render in the registered state
- **THEN** the selection SHALL be cleared and the floating action bar SHALL be hidden

#### Scenario: Unmark updates pokedex store
- **WHEN** the user clicks "Unmark" with N slots selected
- **THEN** `usePokedexStore.unregisterAll(keys)` SHALL be called with the N composite keys
- **THEN** all previously-selected slots SHALL render in the missing state
- **THEN** the selection SHALL be cleared and the floating action bar SHALL be hidden
