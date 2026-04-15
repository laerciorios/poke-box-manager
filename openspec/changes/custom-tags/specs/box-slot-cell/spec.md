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
