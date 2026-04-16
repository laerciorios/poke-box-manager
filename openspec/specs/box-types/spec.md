## ADDED Requirements

### Requirement: Box interface

The system SHALL define a `Box` interface at `src/types/box.ts` with the following fields:

- `id: string` — unique identifier
- `name: string` — editable box name
- `label?: string` — optional visual label/color
- `slots: (BoxSlot | null)[]` — array of exactly 30 slots (6x5 grid)
- `wallpaper?: string` — optional box background

#### Scenario: Box has 30 slots

- **WHEN** a new Box is created
- **THEN** its `slots` array SHALL have exactly 30 elements (6 columns x 5 rows)

#### Scenario: Box fields match spec 2.3

- **WHEN** inspecting the Box interface
- **THEN** all fields SHALL match the types defined in spec section 2.3

### Requirement: BoxSlot interface

The system SHALL define a `BoxSlot` interface at `src/types/box.ts` with the following fields:

- `pokemonId: number` — National Dex ID
- `formId?: string` — optional specific form ID
- `registered: boolean` — whether the player has registered this Pokemon
- `note?: string` — optional free-text annotation (max 500 characters)

#### Scenario: BoxSlot references valid Pokemon

- **WHEN** a BoxSlot has a `pokemonId`
- **THEN** it SHALL be a valid National Dex number (positive integer)

#### Scenario: BoxSlot tracks registration

- **WHEN** inspecting a BoxSlot
- **THEN** the `registered` field SHALL indicate whether the player has marked this Pokemon as owned

#### Scenario: BoxSlot may carry an optional note

- **WHEN** a BoxSlot has a `note` field
- **THEN** it SHALL be a string of at most 500 characters
- **WHEN** no note has been set
- **THEN** the `note` field SHALL be `undefined`

### Requirement: Box constants

The system SHALL export constants `BOX_COLUMNS = 6`, `BOX_ROWS = 5`, and `BOX_SIZE = 30` from `src/types/box.ts`.

#### Scenario: Constants available for grid calculations

- **WHEN** a component imports box constants
- **THEN** `BOX_COLUMNS`, `BOX_ROWS`, and `BOX_SIZE` SHALL be available as numeric constants
