## ADDED Requirements

### Requirement: Pokémon names resolve to the active locale
The system SHALL display Pokémon and form names in the active locale wherever they appear in the UI (box slots, tooltips, search results, pokedex list).

#### Scenario: Pokémon name in PT-BR
- **WHEN** the active locale is `pt-BR`
- **THEN** Pokémon names SHALL render in Portuguese (e.g., "Bulbassauro" instead of "Bulbasaur")

#### Scenario: Pokémon name in EN
- **WHEN** the active locale is `en`
- **THEN** Pokémon names SHALL render in English (e.g., "Bulbasaur")

### Requirement: Pokémon name locale files exist at `i18n/pokemon-names/`
The system SHALL provide `i18n/pokemon-names/pt-BR.json` and `i18n/pokemon-names/en.json` as flat `{ "id": "name" }` maps for all Pokémon species. These files SHALL be generated from `src/data/pokemon.json` (which contains `names: Record<Locale, string>`) as part of the build-time data pipeline.

#### Scenario: File contains all species
- **WHEN** `i18n/pokemon-names/en.json` is read
- **THEN** it SHALL contain an entry for every Pokémon ID present in `src/data/pokemon.json`

### Requirement: Form names resolve to the active locale
The system SHALL display Pokémon form names (e.g., "Alolan Vulpix", "Mega Charizard X") in the active locale.

#### Scenario: Form name in PT-BR
- **WHEN** the active locale is `pt-BR`
- **AND** a slot shows an Alolan Vulpix form
- **THEN** the tooltip and any labels SHALL show the PT-BR form name

### Requirement: Locale name lookup is zero-latency
Pokémon name resolution SHALL be synchronous and use data already imported at module load time — no fetch or async lookup at render time.

#### Scenario: Name available immediately
- **WHEN** a `BoxSlotCell` with a Pokémon is rendered
- **THEN** the Pokémon name SHALL be available synchronously without any loading state
