## ADDED Requirements

### Requirement: EvolutionMethod and EvolutionStep types
The system SHALL define `EvolutionMethod` and `EvolutionStep` interfaces in `src/types/game.ts`.

`EvolutionMethod` SHALL include: `trigger` (union of known PokéAPI trigger names), and optional fields `minLevel`, `item`, `heldItem`, `tradeSpeciesId`, `happiness`, `timeOfDay`, `location`, `knownMove`, `knownMoveType`, `needsRain`, `turnUpsideDown`, `affection`, `beauty`.

`EvolutionStep` SHALL include: `fromId: number`, `toId: number`, `method: EvolutionMethod`.

#### Scenario: Method captures trade-with-held-item
- **WHEN** a PokéAPI evolution node has `trigger.name = "trade"` and a `held_item`
- **THEN** the normalized `EvolutionMethod` SHALL have `trigger: "trade"` and `heldItem` set to the item's name

#### Scenario: Method captures use-item trigger
- **WHEN** a PokéAPI evolution node has `trigger.name = "use-item"` and an `item`
- **THEN** the normalized `EvolutionMethod` SHALL have `trigger: "use-item"` and `item` set to the item's name

#### Scenario: Method captures level-up with location
- **WHEN** a PokéAPI evolution node has `trigger.name = "level-up"` and a `location`
- **THEN** the normalized `EvolutionMethod` SHALL have `trigger: "level-up"` and `location` set to the location's name

### Requirement: EvolutionChain type extended with steps
The `EvolutionChain` interface in `src/types/game.ts` SHALL be extended to include `steps: EvolutionStep[]` alongside the existing `pokemonIds: number[]`. The `pokemonIds` field SHALL remain unchanged.

#### Scenario: Chain with evolutions has steps
- **WHEN** an `EvolutionChain` is loaded for a Pokémon with at least one evolution (e.g., Onix → Steelix)
- **THEN** `steps` SHALL contain one `EvolutionStep` with `fromId`, `toId`, and `method`

#### Scenario: Chain with no evolutions has empty steps
- **WHEN** an `EvolutionChain` is loaded for a standalone Pokémon (no evolutions)
- **THEN** `steps` SHALL be an empty array

#### Scenario: Branched chains produce multiple steps
- **WHEN** an `EvolutionChain` covers a branching evolution (e.g., Eevee → multiple forms)
- **THEN** `steps` SHALL contain one `EvolutionStep` per branch edge, each with the correct `toId`

### Requirement: Evolution normalizer extracts method details
The `normalizeEvolutionChain` function in `src/scripts/normalizers/evolution-normalizer.ts` SHALL be extended to traverse all evolution nodes and extract `EvolutionStep` objects from each `evolution_details` entry.

#### Scenario: Normalizer reads evolution_details
- **WHEN** a chain node has a non-empty `evolution_details` array
- **THEN** the normalizer SHALL produce one `EvolutionStep` per entry, mapping PokéAPI fields to `EvolutionMethod` fields

#### Scenario: Multiple valid methods produce multiple steps for same toId
- **WHEN** a chain node has multiple `evolution_details` entries (multiple valid methods)
- **THEN** the normalizer SHALL produce one `EvolutionStep` per entry, all with the same `toId`

#### Scenario: Nodes with no evolution_details produce a step with trigger "other"
- **WHEN** a chain node has an empty `evolution_details` array but has a parent (i.e., it is an evolution target)
- **THEN** the normalizer SHALL produce a step with `method.trigger = "other"`

### Requirement: evolution-chains.json regenerated with steps
After running `npm run fetch-data`, the output `src/data/evolution-chains.json` SHALL contain `steps` data for all chains. The `validate-data` script SHALL assert that every chain entry has a `steps` array.

#### Scenario: Validate passes with steps present
- **WHEN** `npm run validate-data` is run after `npm run fetch-data`
- **THEN** validation SHALL pass with no errors related to missing `steps` fields

#### Scenario: Validate fails if steps field is missing
- **WHEN** `npm run validate-data` is run against a `evolution-chains.json` without `steps`
- **THEN** validation SHALL report an error indicating the schema mismatch
