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
