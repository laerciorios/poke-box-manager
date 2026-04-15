## MODIFIED Requirements

### Requirement: PokemonCard displays evolution chain
The system SHALL show the evolution chain for the Pokemon by looking up its `evolutionChainId` in `evolution-chains.json` and rendering each Pokemon in the chain with its sprite and name. Below the evolution chain display, the card SHALL render an `AcquisitionChecklist` for the currently displayed Pokémon when non-trivial acquisition steps exist.

#### Scenario: Evolution chain rendered in order
- **WHEN** the Pokemon has a non-null `evolutionChainId`
- **THEN** the card SHALL display all Pokemon in the chain in `pokemonIds` order, each with sprite and localized name

#### Scenario: No evolution section for standalone Pokemon
- **WHEN** the Pokemon has no `evolutionChainId`
- **THEN** no evolution chain section SHALL be rendered

#### Scenario: Acquisition checklist shown below evolution chain
- **WHEN** the displayed Pokémon has at least one non-trivial evolution step targeting it
- **THEN** an `AcquisitionChecklist` section SHALL be rendered below the evolution chain

#### Scenario: No acquisition checklist for trivial evolutions
- **WHEN** all steps leading to the displayed Pokémon are trivial (simple level-up)
- **THEN** no checklist section SHALL be rendered in the card
