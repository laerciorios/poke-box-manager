## ADDED Requirements

### Requirement: PokemonTooltip shows a hover preview
The system SHALL render a `PokemonTooltip` wrapper that, on hover, displays a compact preview card containing the Pokémon's sprite, localized name, national Dex number, and type badge(s).

#### Scenario: Tooltip appears on hover
- **WHEN** the user hovers over a wrapped element for the hover-card delay
- **THEN** the tooltip SHALL appear showing sprite, name, number, and types

#### Scenario: Tooltip dismisses on mouse leave
- **WHEN** the user moves the mouse away from the wrapped element and the tooltip
- **THEN** the tooltip SHALL close

### Requirement: PokemonTooltip click opens PokemonCard
The system SHALL open the full `PokemonCard` sheet when the user clicks the wrapped element or the tooltip's "details" affordance.

#### Scenario: Click on wrapped element opens card
- **WHEN** the user clicks the element wrapped by `PokemonTooltip`
- **THEN** `PokemonCard` SHALL open for the same `pokemonId`

#### Scenario: Tooltip does not open card on hover-only
- **WHEN** the user only hovers (no click)
- **THEN** `PokemonCard` SHALL NOT open

### Requirement: PokemonTooltip accepts pokemonId prop
The system SHALL accept `pokemonId: number` and `children: ReactNode` as its props. All Pokémon data for the preview SHALL be resolved internally from static JSON.

#### Scenario: Tooltip content matches pokemonId
- **WHEN** `pokemonId` is `25` (Pikachu)
- **THEN** the tooltip SHALL display Pikachu's sprite and name, not another Pokémon's data

### Requirement: PokemonTooltip is disabled for empty slots
The system SHALL not render any tooltip behavior when `pokemonId` is null or undefined.

#### Scenario: No tooltip for empty slot
- **WHEN** `pokemonId` is null or undefined
- **THEN** the children SHALL render without any tooltip wrapper behavior
