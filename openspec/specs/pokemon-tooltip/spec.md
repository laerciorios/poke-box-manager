## ADDED Requirements

### Requirement: PokemonTooltip shows a hover preview

The system SHALL render a `PokemonTooltip` wrapper that, on hover, displays a compact preview card containing the Pokemon's sprite, localized name, national Dex number, and type badge(s). On touch/coarse-pointer devices, the hover tooltip SHALL be suppressed entirely; touch input routes directly to the `PokemonCard` sheet on tap.

#### Scenario: Tooltip appears on hover (pointer: fine devices only)

- **WHEN** the primary input is `pointer: fine` (mouse) and the user hovers over a wrapped element for the hover-card delay
- **THEN** the tooltip SHALL appear showing sprite, name, number, and types

#### Scenario: Tooltip is suppressed on touch devices

- **WHEN** the primary input is `pointer: coarse` (touch/stylus)
- **THEN** no hover tooltip SHALL appear regardless of the gesture
- **THEN** hovering SHALL have no visual effect

#### Scenario: Tooltip dismisses on mouse leave (pointer: fine only)

- **WHEN** the user moves the mouse away from the wrapped element and the tooltip
- **THEN** the tooltip SHALL close

### Requirement: PokemonTooltip click opens PokemonCard

The system SHALL open the full `PokemonCard` sheet when the user clicks (or taps on touch devices) the wrapped element or the tooltip's "details" affordance. On touch devices where the hover tooltip is suppressed, a tap SHALL open the `PokemonCard` sheet directly without an intermediate tooltip step.

#### Scenario: Click on wrapped element opens card (pointer: fine)

- **WHEN** the primary input is `pointer: fine` and the user clicks the element wrapped by `PokemonTooltip`
- **THEN** `PokemonCard` SHALL open for the same `pokemonId`

#### Scenario: Tap on wrapped element opens card (pointer: coarse)

- **WHEN** the primary input is `pointer: coarse` and the user taps the element wrapped by `PokemonTooltip`
- **THEN** `PokemonCard` SHALL open for the same `pokemonId` directly (no tooltip intermediary)

#### Scenario: Tooltip does not open card on hover-only

- **WHEN** the user only hovers (no click, pointer: fine device)
- **THEN** `PokemonCard` SHALL NOT open

### Requirement: PokemonTooltip accepts pokemonId prop

The system SHALL accept `pokemonId: number` and `children: ReactNode` as its props. All Pokemon data for the preview SHALL be resolved internally from static JSON.

#### Scenario: Tooltip content matches pokemonId

- **WHEN** `pokemonId` is `25` (Pikachu)
- **THEN** the tooltip SHALL display Pikachu's sprite and name, not another Pokemon's data

### Requirement: PokemonTooltip is disabled for empty slots

The system SHALL not render any tooltip behavior when `pokemonId` is null or undefined.

#### Scenario: No tooltip for empty slot

- **WHEN** `pokemonId` is null or undefined
- **THEN** the children SHALL render without any tooltip wrapper behavior
