## ADDED Requirements

### Requirement: BoxSlotCell exposes ARIA role, label, and live-state attributes
In addition to the existing visual states, every `BoxSlotCell` SHALL carry semantic ARIA attributes so assistive technologies can identify each slot and its current state.

#### Scenario: Occupied registered slot has role and label
- **WHEN** a slot contains a registered Pokémon
- **THEN** the element SHALL have `role="gridcell"`, `aria-label="<Name>, registered"` (localized), and `aria-selected="true"` when selected

#### Scenario: Occupied unregistered slot has role and label
- **WHEN** a slot contains an unregistered Pokémon
- **THEN** the element SHALL have `role="gridcell"` and `aria-label="<Name>, not registered"` (localized)

#### Scenario: Empty slot has role and label
- **WHEN** a slot is `null`
- **THEN** the element SHALL have `role="gridcell"` and `aria-label="Empty slot"` (localized)

### Requirement: BoxSlotCell drag handle carries draggable semantics
When the slot is a draggable source (non-empty), it SHALL expose drag-related ARIA attributes to signal its interactive nature to screen readers.

#### Scenario: Draggable slot has roledescription and label
- **WHEN** a non-empty slot is rendered as a draggable source
- **THEN** it SHALL have `aria-roledescription="draggable"` (localized) and the accessible name SHALL include the Pokémon's name
