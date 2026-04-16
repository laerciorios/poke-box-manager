## ADDED Requirements

### Requirement: BoxGrid implements roving tabindex grid navigation pattern

`BoxGrid` SHALL manage a single roving tabindex across its 30 slot cells. Only one slot SHALL have `tabIndex={0}` at a time; all others SHALL have `tabIndex={-1}`. Arrow key events on the grid container SHALL move the active (tabIndex 0) slot and programmatically focus it.

#### Scenario: Only one slot is in tab order at a time

- **WHEN** `BoxGrid` is rendered
- **THEN** exactly one `BoxSlotCell` SHALL have `tabIndex={0}`
- **THEN** all other slots SHALL have `tabIndex={-1}`

#### Scenario: Arrow keys move the active slot and shift tabIndex

- **WHEN** a slot with `tabIndex={0}` is focused and the user presses an arrow key
- **THEN** the adjacent slot in that direction SHALL receive `tabIndex={0}` and programmatic focus
- **THEN** the previously active slot SHALL revert to `tabIndex={-1}`

#### Scenario: Active slot index persists between focus-out and focus-in

- **WHEN** the user Tabs out of the grid and later Tabs back in
- **THEN** focus SHALL return to the slot that was last active (not reset to index 0)

### Requirement: BoxGrid root element carries grid ARIA role and accessible name

The `BoxGrid` container SHALL use `role="grid"` and `aria-label` so screen readers announce the grid's identity on focus.

#### Scenario: Grid role and label on container

- **WHEN** `BoxGrid` renders with a box named "Box 1"
- **THEN** the container element SHALL have `role="grid"` and `aria-label="Box 1"` (localized)
