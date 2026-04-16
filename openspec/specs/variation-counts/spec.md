## ADDED Requirements

### Requirement: computeFilteredTotal respects both variations and active generations

The system SHALL export a `computeFilteredTotal(variations: VariationToggles, activeGenerations: number[]): number` function from `src/lib/variation-counts.ts` that counts base Pokémon entries and enabled variation forms filtered to the given active generations.

The function SHALL:

1. Iterate `pokemon.json` and count entries whose `generation` is in `activeGenerations`
2. For each enabled variation toggle, iterate `forms.json` and count form entries whose `formType` maps to that toggle (via `TOGGLE_FORM_TYPES`) AND whose `generation` is in `activeGenerations`
3. Return the sum of step 1 and step 2

When `activeGenerations` is empty, the function SHALL treat it as all generations (no generation filter applied).

#### Scenario: All generations, no variations

- **WHEN** `computeFilteredTotal` is called with all toggles `false` and `activeGenerations = [1..9]`
- **THEN** the return value SHALL equal `BASE_POKEMON_COUNT`

#### Scenario: Single generation, no variations

- **WHEN** `computeFilteredTotal` is called with all toggles `false` and `activeGenerations = [1]`
- **THEN** the return value SHALL equal the count of base Pokémon in generation 1 (151)

#### Scenario: All generations, one variation enabled

- **WHEN** `computeFilteredTotal` is called with only `regionalForms: true` and `activeGenerations = [1..9]`
- **THEN** the return value SHALL equal `BASE_POKEMON_COUNT + VARIATION_COUNTS.regionalForms`

#### Scenario: Filtered generation with enabled variation

- **WHEN** `computeFilteredTotal` is called with `regionalForms: true` and `activeGenerations = [7]`
- **THEN** the return value SHALL equal (gen-7 base count) + (count of regional forms in gen 7)

#### Scenario: Empty activeGenerations treated as all generations

- **WHEN** `computeFilteredTotal` is called with `activeGenerations = []`
- **THEN** the return value SHALL equal `computeFilteredTotal(variations, [1,2,3,4,5,6,7,8,9])`

### Requirement: VARIATION_COUNTS constant maps each toggle key to additional form count

The system SHALL provide a `VARIATION_COUNTS` constant at `src/lib/variation-counts.ts` of type `Record<keyof VariationToggles, number>`, computed from the static `src/data/forms.json` at module load time.

#### Scenario: Each key has a non-negative integer count

- **WHEN** `VARIATION_COUNTS` is imported
- **THEN** each of the 12 `VariationToggles` keys SHALL map to a non-negative integer representing the number of form entries in `forms.json` whose `formType` matches that toggle's mapped type(s)

#### Scenario: regionalForms aggregates all regional formTypes

- **WHEN** inspecting `VARIATION_COUNTS.regionalForms`
- **THEN** its value SHALL equal the sum of forms with `formType` in `['regional-alola', 'regional-galar', 'regional-hisui', 'regional-paldea']`

#### Scenario: Counts match actual forms.json data

- **WHEN** `forms.json` is updated (e.g. new region added)
- **THEN** the corresponding `VARIATION_COUNTS` entry SHALL reflect the updated count automatically on next build without code changes

### Requirement: BASE_POKEMON_COUNT constant reflects non-variation Pokémon

The system SHALL export a `BASE_POKEMON_COUNT: number` constant from `src/lib/variation-counts.ts` equal to the count of entries in `src/data/pokemon.json` (the base species list, excluding all forms).

#### Scenario: Base count is a positive integer

- **WHEN** `BASE_POKEMON_COUNT` is imported
- **THEN** it SHALL be a positive integer greater than 0

#### Scenario: Base count does not include form entries

- **WHEN** `BASE_POKEMON_COUNT` is compared to the total of all `VARIATION_COUNTS` values
- **THEN** the two values SHALL be independent and not overlap

### Requirement: computeTotal derives Pokédex total for a given toggle configuration

The system SHALL export a `computeTotal(variations: VariationToggles): number` function from `src/lib/variation-counts.ts` that returns `BASE_POKEMON_COUNT` plus the sum of `VARIATION_COUNTS[key]` for every key where `variations[key]` is `true`.

#### Scenario: All toggles disabled returns base count

- **WHEN** `computeTotal` is called with all toggles set to `false`
- **THEN** the return value SHALL equal `BASE_POKEMON_COUNT`

#### Scenario: All toggles enabled returns maximum count

- **WHEN** `computeTotal` is called with all toggles set to `true`
- **THEN** the return value SHALL equal `BASE_POKEMON_COUNT` plus the sum of all values in `VARIATION_COUNTS`

#### Scenario: Partial selection returns accurate total

- **WHEN** `computeTotal` is called with only `regionalForms: true` and all others `false`
- **THEN** the return value SHALL equal `BASE_POKEMON_COUNT + VARIATION_COUNTS.regionalForms`

### Requirement: TOGGLE_FORM_TYPES maps each toggle key to its formType strings

The system SHALL export a `TOGGLE_FORM_TYPES: Record<keyof VariationToggles, string[]>` constant that exposes the `formType` values that contribute to each toggle key, enabling other utilities to perform form-level filtering.

#### Scenario: regionalForms maps to all regional formTypes

- **WHEN** reading `TOGGLE_FORM_TYPES.regionalForms`
- **THEN** it SHALL contain `['regional-alola', 'regional-galar', 'regional-hisui', 'regional-paldea']`

#### Scenario: Single-type toggles map to a one-element array

- **WHEN** reading `TOGGLE_FORM_TYPES.megaEvolutions`
- **THEN** it SHALL contain exactly `['mega']`
