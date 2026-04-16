## ADDED Requirements

### Requirement: Tag dot indicators on box slot cells

The `BoxSlotCell` component SHALL render compact colored dot indicators representing assigned tags when a slot has one or more tags. Dots SHALL be absolutely positioned in the bottom-left corner of the cell and SHALL not displace other slot content.

#### Scenario: One tag renders one dot

- **WHEN** a slot has exactly one tag assigned
- **THEN** one colored dot SHALL be visible in the bottom-left corner of the cell

#### Scenario: Multiple tags render up to three dots

- **WHEN** a slot has two or three tags assigned
- **THEN** two or three colored dots SHALL be rendered side by side

#### Scenario: More than three tags shows overflow indicator

- **WHEN** a slot has more than three tags assigned
- **THEN** three dots SHALL be shown followed by a `+N` label where N is the number of additional tags

#### Scenario: No tags renders no dots

- **WHEN** a slot has no tags assigned or `tagIds` is absent
- **THEN** no dot indicators SHALL be rendered

#### Scenario: Dots are hidden for empty slots

- **WHEN** a slot is `null` (empty)
- **THEN** no tag dots SHALL be rendered

### Requirement: Tag dot tooltip on hover

When the user hovers over a slot cell that has tag indicators, the existing slot tooltip SHALL include the names of assigned tags.

#### Scenario: Tooltip lists tag names

- **WHEN** the user hovers over a slot with one or more tags
- **THEN** the tooltip SHALL display the Pokémon name AND the names of all assigned tags

### Requirement: Tag badge component

The system SHALL provide a reusable `TagDot` component in `src/components/tags/TagDot.tsx` that renders a single colored dot given a `Tag` object. The dot size SHALL be approximately 8px diameter with a circular shape.

#### Scenario: TagDot renders with tag color

- **WHEN** `TagDot` is rendered with a `Tag` that has a hex color
- **THEN** the dot's background SHALL match the tag's color

#### Scenario: TagDot is accessible

- **WHEN** `TagDot` is rendered
- **THEN** it SHALL have an `aria-label` containing the tag name
