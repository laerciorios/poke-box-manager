## MODIFIED Requirements

### Requirement: PokemonEntry normalization
The pipeline SHALL transform raw PokeAPI species and Pokemon data into the `PokemonEntry` interface as defined in spec section 2.3. Each entry SHALL include: `id`, `name`, `names` (PT-BR + EN), `generation`, `types`, `category`, `sprite`, `spriteShiny`, `forms`, `evolutionChainId`, and `homeAvailable`. The `gameAvailability` field SHALL NOT be present on `PokemonEntry`.

#### Scenario: Complete PokemonEntry for standard Pokemon
- **WHEN** normalizing data for Pikachu (id: 25)
- **THEN** the output SHALL include: id=25, name="pikachu", names with PT-BR and EN translations, generation=1, types=["electric"], category="normal", and valid sprite URLs
- **THEN** the output SHALL NOT include a `gameAvailability` field

#### Scenario: Complete PokemonEntry for Gen 8+ Pokemon
- **WHEN** normalizing data for Eternatus (id: 890)
- **THEN** the output SHALL include all required fields without errors
- **THEN** the output SHALL NOT include a `gameAvailability` field

#### Scenario: Name fallback when PT-BR missing
- **WHEN** a Pokemon species has no PT-BR name in PokeAPI
- **THEN** the pipeline SHALL use the English name as fallback for the PT-BR entry
- **THEN** the pipeline SHALL log a warning identifying the missing translation

### Requirement: PokemonForm normalization
The pipeline SHALL transform raw PokeAPI form data into the `PokemonForm` interface. Each form SHALL include: `id`, `name`, `names` (PT-BR + EN), `formType`, and `sprite`. The optional `types` field is retained. The `gameAvailability` field SHALL NOT be present on `PokemonForm`.

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

### Requirement: Output JSON files
The pipeline SHALL generate the following files in `src/data/`:
- `pokemon.json` — Array of all PokemonEntry objects
- `forms.json` — Map of formId to PokemonForm details
- `types.json` — Array of type objects with translated names
- `generations.json` — Array of generation metadata
- `evolution-chains.json` — Map of chainId to array of Pokemon IDs in the chain

`games.json` SHALL NOT be written to `src/data/`. Version-group data MAY be fetched internally during the pipeline for generation enrichment purposes but SHALL NOT be persisted as a separate output file.

#### Scenario: All output files generated
- **WHEN** the pipeline completes successfully
- **THEN** exactly 5 JSON files SHALL exist in `src/data/`: `pokemon.json`, `forms.json`, `types.json`, `generations.json`, `evolution-chains.json`
- **THEN** `games.json` SHALL NOT exist in `src/data/`

#### Scenario: Pokemon.json completeness
- **WHEN** inspecting `pokemon.json`
- **THEN** it SHALL contain entries for all Pokemon in the National Dex (1025+ entries)
- **THEN** each entry SHALL conform to the updated PokemonEntry interface (no `gameAvailability`)
