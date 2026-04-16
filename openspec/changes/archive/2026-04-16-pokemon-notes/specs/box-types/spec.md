## MODIFIED Requirements

### Requirement: BoxSlot interface
The system SHALL define a `BoxSlot` interface at `src/types/box.ts` with the following fields:
- `pokemonId: number` — National Dex ID
- `formId?: string` — optional specific form ID
- `registered: boolean` — whether the player has registered this Pokémon
- `note?: string` — optional free-text annotation (max 500 characters)

#### Scenario: BoxSlot references valid Pokemon
- **WHEN** a BoxSlot has a `pokemonId`
- **THEN** it SHALL be a valid National Dex number (positive integer)

#### Scenario: BoxSlot tracks registration
- **WHEN** inspecting a BoxSlot
- **THEN** the `registered` field SHALL indicate whether the player has marked this Pokémon as owned

#### Scenario: BoxSlot may carry an optional note
- **WHEN** a BoxSlot has a `note` field
- **THEN** it SHALL be a string of at most 500 characters
- **WHEN** no note has been set
- **THEN** the `note` field SHALL be `undefined`
