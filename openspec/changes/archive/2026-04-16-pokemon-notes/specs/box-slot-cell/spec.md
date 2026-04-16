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
