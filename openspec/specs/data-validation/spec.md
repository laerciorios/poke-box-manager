## ADDED Requirements

### Requirement: Data validation script
The system SHALL provide a validation script at `src/scripts/validate-data.ts` executable via `npm run validate-data`. The script SHALL verify the integrity and completeness of generated JSON files in `src/data/`.

#### Scenario: Validation passes on valid data
- **WHEN** running `npm run validate-data` after a successful fetch
- **THEN** the script SHALL report success with a summary of validated data

#### Scenario: Validation fails on missing files
- **WHEN** running `npm run validate-data` and one or more expected JSON files are missing
- **THEN** the script SHALL report an error listing the missing files

### Requirement: Schema validation
The validation script SHALL verify that each JSON file conforms to its expected TypeScript interface. It SHALL check that required fields are present and have the correct types.

#### Scenario: Invalid PokemonEntry detected
- **WHEN** a `pokemon.json` entry is missing the `id` or `name` field
- **THEN** the validation script SHALL report the invalid entry with its index and missing fields

#### Scenario: Invalid FormType detected
- **WHEN** a form has a `formType` value not in the FormType enum
- **THEN** the validation script SHALL report the invalid form with its id and the invalid formType value

### Requirement: Completeness checks
The validation script SHALL verify:
- `pokemon.json` contains entries for all National Dex numbers (no gaps)
- Every Pokemon references valid type IDs that exist in `types.json`
- Every `evolutionChainId` references a valid chain in `evolution-chains.json`
- Every `gameAvailability` entry references a valid game in `games.json`

#### Scenario: Missing National Dex entry
- **WHEN** `pokemon.json` is missing an entry for a National Dex number (e.g., #150)
- **THEN** the validation script SHALL report the gap with the missing dex number(s)

#### Scenario: Dangling reference detected
- **WHEN** a PokemonEntry references a gameId that does not exist in `games.json`
- **THEN** the validation script SHALL report the dangling reference with the Pokemon ID and invalid gameId

### Requirement: Validation summary
The validation script SHALL output a summary including: total Pokemon count, total forms count, total types, total games, total generations, total evolution chains, and any warnings or errors found.

#### Scenario: Summary output
- **WHEN** validation completes
- **THEN** the script SHALL print a summary table with counts for each data category and pass/fail status
