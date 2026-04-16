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

## ADDED Requirements

### Requirement: BoxSlotCell displays a note indicator for slots with notes

When `slot.note` is a non-empty string, `BoxSlotCell` SHALL render a small icon overlay (e.g., a pencil or note icon) in a designated corner of the cell. The indicator SHALL not be rendered when `slot.note` is absent or empty, and SHALL not be interactive on its own.

#### Scenario: Note indicator appears for slot with a note

- **WHEN** `BoxSlotCell` receives a `BoxSlot` with a non-empty `note`
- **THEN** a small note icon SHALL be visible on the cell
- **THEN** the icon SHALL be positioned so it does not obscure the Pokémon sprite

#### Scenario: No indicator for slot without a note

- **WHEN** `BoxSlotCell` receives a `BoxSlot` with `note` equal to `undefined` or `""`
- **THEN** no note indicator SHALL appear on the cell

#### Scenario: No indicator for empty slots

- **WHEN** `BoxSlotCell` receives a `null` slot
- **THEN** no note indicator SHALL appear

#### Scenario: Note indicator is decorative (aria-hidden)

- **WHEN** the note indicator icon is rendered
- **THEN** it SHALL have `aria-hidden="true"` since note content is accessible through PokemonCard

## MODIFIED Requirements

### Requirement: BoxSlotCell renders visual states

The system SHALL provide a `BoxSlotCell` component at `src/components/boxes/BoxSlotCell.tsx` that renders a single box slot with visual states using CVA variants. The component SHALL accept a `slot` prop of type `BoxSlot | null`, a `state` variant, and an optional `tags?: Tag[]` prop for rendering tag dot indicators.

#### Scenario: Registered state

- **WHEN** the slot contains a `BoxSlot` with `registered: true`
- **THEN** the Pokémon sprite SHALL be displayed at full opacity
- **THEN** a subtle green checkmark indicator SHALL appear in the corner

#### Scenario: Missing state

- **WHEN** the slot contains a `BoxSlot` with `registered: false`
- **THEN** the Pokémon sprite SHALL be displayed at 30% opacity or as a dark silhouette

#### Scenario: Empty state

- **WHEN** the slot is `null`
- **THEN** a dashed border SHALL be displayed
- **THEN** a "?" icon SHALL be shown in the center

#### Scenario: Hover state

- **WHEN** the user hovers over any non-empty slot
- **THEN** the slot SHALL show slight elevation via a shadow
- **THEN** a tooltip SHALL appear with the Pokémon's name and the names of any assigned tags

#### Scenario: Selected state

- **WHEN** the `selected` prop is `true`
- **THEN** the slot border SHALL use the accent color (`--accent`)

#### Scenario: Tag dots rendered for tagged slot

- **WHEN** the `tags` prop contains one or more `Tag` objects
- **THEN** colored dot indicators SHALL be rendered in the bottom-left corner of the slot
- **THEN** a maximum of 3 dots SHALL be shown; additional tags SHALL show a `+N` overflow label

#### Scenario: No tag dots for empty tags prop

- **WHEN** the `tags` prop is absent, `undefined`, or an empty array
- **THEN** no dot indicators SHALL be rendered
