## ADDED Requirements

### Requirement: applyPreset pure function
The system SHALL expose a pure function `applyPreset(preset: OrganizationPreset, pokemon: PokemonEntry[], evolutionChains: Record<number, number[]>): Box[]` at `src/lib/box-engine/organizer.ts`.

#### Scenario: Returns boxes filled with pokemon
- **WHEN** `applyPreset` is called with a valid preset and a list of pokemon
- **THEN** it SHALL return a non-empty `Box[]` where the total number of filled slots equals the number of input pokemon (no pokemon are lost or duplicated)

#### Scenario: Empty pokemon list produces no boxes
- **WHEN** `applyPreset` is called with an empty pokemon array
- **THEN** it SHALL return an empty array

#### Scenario: Each box has exactly BOX_SIZE (30) slots
- **WHEN** the organizer chunks pokemon into boxes
- **THEN** each box SHALL have exactly 30 slots, with trailing slots set to `null` in the last box of each rule

### Requirement: Multi-rule sequential pipeline
The organizer SHALL apply preset rules in ascending `order` sequence, where each rule claims a subset of the remaining pool.

#### Scenario: Rules consume from a shared remaining pool
- **WHEN** rule 1 matches legendaries and rule 2 matches mythicals
- **THEN** rule 2 SHALL only process pokemon not already claimed by rule 1

#### Scenario: Unclaimed pokemon appended as remainder
- **WHEN** some pokemon are not matched by any rule
- **THEN** they SHALL be appended to the end of the box list in dex-number order

### Requirement: Filter engine
The system SHALL implement a `filterPokemon(pokemon: PokemonEntry[], filter: PokemonFilter): PokemonEntry[]` function at `src/lib/box-engine/filter.ts`.

#### Scenario: Filter by category
- **WHEN** `filter.categories` is set to `['legendary']`
- **THEN** only pokemon with `category === 'legendary'` SHALL be returned

#### Scenario: Filter by generation
- **WHEN** `filter.generations` is set to `[1, 2]`
- **THEN** only pokemon with `generation` in `[1, 2]` SHALL be returned

#### Scenario: Multiple filter criteria combine with AND logic
- **WHEN** `filter.categories` is `['normal']` and `filter.generations` is `[1]`
- **THEN** only pokemon matching BOTH criteria SHALL be returned

#### Scenario: Exclude overrides include
- **WHEN** a pokemon matches the include criteria AND `filter.exclude.categories` or `filter.exclude.pokemonIds`
- **THEN** the pokemon SHALL be excluded from the result

#### Scenario: Empty filter matches all
- **WHEN** all fields in the filter are undefined
- **THEN** all pokemon SHALL be returned

### Requirement: Sort engine
The system SHALL implement a `sortPokemon(pokemon: PokemonEntry[], criteria: SortCriteria, evolutionChains: Record<number, number[]>): PokemonEntry[]` function at `src/lib/box-engine/sort.ts`.

#### Scenario: Sort by dex-number
- **WHEN** `criteria` is `'dex-number'`
- **THEN** pokemon SHALL be returned in ascending `id` order

#### Scenario: Sort by generation
- **WHEN** `criteria` is `'generation'`
- **THEN** pokemon SHALL be returned sorted by `generation` ascending, then by `id` ascending within each generation

#### Scenario: Sort by type-primary
- **WHEN** `criteria` is `'type-primary'`
- **THEN** pokemon SHALL be sorted by primary type in the canonical type order (Normal, Fire, Water, Grass, Electric, Ice, Fighting, Poison, Ground, Flying, Psychic, Bug, Rock, Ghost, Dragon, Dark, Steel, Fairy), then by `id` ascending within each type

#### Scenario: Sort by evolution-chain
- **WHEN** `criteria` is `'evolution-chain'`
- **THEN** pokemon SHALL be grouped by chain (lowest dex ID in chain as group key), sorted by that key ascending, and within each chain sorted by their position in the chain array; pokemon with no evolutionChainId SHALL be placed at the end in dex order

#### Scenario: Sort by name
- **WHEN** `criteria` is `'name'`
- **THEN** pokemon SHALL be sorted alphabetically by `name` (English lowercase)

### Requirement: Box name template renderer
The system SHALL implement a `renderBoxName(template: string, context: BoxNameContext): string` function that substitutes template variables.

#### Scenario: Substitutes {n} with box sequence number
- **WHEN** template is `"Legendaries {n}"` and context has `n: 2`
- **THEN** the result SHALL be `"Legendaries 2"`

#### Scenario: Substitutes {start} and {end} with padded dex numbers
- **WHEN** template is `"{start}–{end}"` and context has `start: 1, end: 30`
- **THEN** the result SHALL be `"001–030"`

#### Scenario: Unknown variables left as-is
- **WHEN** template contains a variable not in the context (e.g., `{gen}` when no generation is set)
- **THEN** the literal `{gen}` SHALL remain in the output unchanged
