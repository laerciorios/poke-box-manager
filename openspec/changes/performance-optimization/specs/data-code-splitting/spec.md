## ADDED Requirements

### Requirement: Pokémon data is split into per-generation JSON chunks
The build pipeline SHALL produce one JSON file per generation (`pokemon-gen-1.json` through `pokemon-gen-9.json`) containing only the `PokemonEntry` records for that generation, plus a lightweight manifest file (`pokemon-manifest.json`) listing national dex ID ranges and chunk keys per generation.

#### Scenario: Per-generation chunk file is produced
- **WHEN** the fetch script runs
- **THEN** `src/data/pokemon-gen-{1..9}.json` SHALL each contain only the entries belonging to that generation
- **THEN** `src/data/pokemon-manifest.json` SHALL list each generation's ID range and chunk identifier

#### Scenario: Chunk files are smaller than the monolithic file
- **WHEN** the per-generation chunks are gzipped
- **THEN** each individual chunk SHALL be smaller than the full `pokemon.json` was
- **THEN** the total data budget across all chunks SHALL remain ≤ 300KB gzip

### Requirement: Generation data is dynamically imported on demand
The app SHALL import each generation's data chunk via dynamic `import()` only when that generation is first needed (e.g., when it becomes active in settings or when the Pokédex page loads entries for that generation). Chunks SHALL be cached in a module-level map after first load.

#### Scenario: Inactive generation data is not in the initial bundle
- **WHEN** the app loads with only Generation I active
- **THEN** the JS bundle SHALL NOT include data for Generations II–IX in the initial payload

#### Scenario: Activating a generation triggers its chunk import
- **WHEN** the user activates Generation II in settings for the first time
- **THEN** `pokemon-gen-2.json` SHALL be dynamically imported
- **THEN** subsequent accesses to Generation II data SHALL use the cached module

#### Scenario: All active generations are loaded in parallel on startup
- **WHEN** the app starts with multiple generations active
- **THEN** all active generation chunks SHALL be imported concurrently via `Promise.all`
- **THEN** the app SHALL not render dependent UI until all active chunks are resolved

### Requirement: A static manifest drives chunk loading without full data
`pokemon-manifest.json` SHALL be imported statically (not dynamically) and used to determine which chunk to load for a given national dex ID, without loading the full Pokémon data first.

#### Scenario: Manifest used to resolve chunk key for a dex ID
- **WHEN** code needs to look up data for dex ID #152 (Chikorita, Gen II)
- **THEN** the manifest SHALL resolve to chunk key `"pokemon-gen-2"`
- **THEN** the system SHALL dynamically import that chunk if not already cached
