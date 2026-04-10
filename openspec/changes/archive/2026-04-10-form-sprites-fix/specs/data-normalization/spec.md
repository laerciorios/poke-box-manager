## MODIFIED Requirements

### Requirement: PokemonForm normalization
The pipeline SHALL transform raw PokeAPI form data into the `PokemonForm` interface. Each form SHALL include: `id`, `name`, `names` (PT-BR + EN), `formType`, `sprite`, and optionally `spriteShiny` and `types`. The `gameAvailability` field SHALL NOT be present on `PokemonForm`.

For the `sprite` field, the pipeline SHALL prioritize the Home 3D sprite from the corresponding `/pokemon/<id>` variety endpoint (`sprites.other.home.front_default`), falling back to the pixel sprite from the `/pokemon-form/<id>` endpoint (`sprites.front_default`) when the Home 3D sprite is not available.

For the `spriteShiny` field, the pipeline SHALL use the Home 3D shiny sprite from the variety endpoint (`sprites.other.home.front_shiny`), falling back to the pixel shiny sprite from the form endpoint (`sprites.front_shiny`) when the Home 3D sprite is not available. The field SHALL be omitted entirely when neither source provides a shiny sprite.

#### Scenario: Regional form mapping
- **WHEN** normalizing a form with name containing "-alola"
- **THEN** the `formType` SHALL be `regional-alola`

#### Scenario: Mega evolution mapping
- **WHEN** normalizing a form with name containing "-mega"
- **THEN** the `formType` SHALL be `mega`

#### Scenario: Gigantamax form mapping
- **WHEN** normalizing a form with name containing "-gmax"
- **THEN** the `formType` SHALL be `gmax`

#### Scenario: Species-specific form types
- **WHEN** normalizing forms for Unown
- **THEN** the `formType` SHALL be `unown`
- **WHEN** normalizing forms for Vivillon
- **THEN** the `formType` SHALL be `vivillon`
- **WHEN** normalizing forms for Alcremie
- **THEN** the `formType` SHALL be `alcremie`

#### Scenario: Unknown form type fallback
- **WHEN** a form cannot be mapped to a known FormType
- **THEN** the `formType` SHALL be `other`

#### Scenario: Form sprite uses Home 3D when available
- **WHEN** normalizing a Mega form that has a variety entry at its `/pokemon/<id>` endpoint with `sprites.other.home.front_default` present
- **THEN** the `sprite` field SHALL be the Home 3D URL from that endpoint
- **THEN** the `spriteShiny` field SHALL be the Home 3D shiny URL from that endpoint

#### Scenario: Form sprite falls back to pixel when Home not available
- **WHEN** normalizing a form whose variety entry has no `sprites.other.home.front_default`
- **THEN** the `sprite` field SHALL fall back to `sprites.front_default` from the form endpoint
- **THEN** the `spriteShiny` field SHALL fall back to `sprites.front_shiny` from the form endpoint when available

#### Scenario: Form with no shiny sprite omits the field
- **WHEN** normalizing a form with no shiny sprite in either endpoint
- **THEN** the resulting `PokemonForm` SHALL NOT include a `spriteShiny` field
