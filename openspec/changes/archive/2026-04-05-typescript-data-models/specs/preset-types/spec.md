## ADDED Requirements

### Requirement: OrganizationPreset interface
The system SHALL define an `OrganizationPreset` interface at `src/types/preset.ts` with the following fields:
- `id: string` — unique identifier
- `name: string` — default name
- `names: Record<Locale, string>` — translated names
- `description: string` — default description
- `descriptions: Record<Locale, string>` — translated descriptions
- `isBuiltIn: boolean` — whether this is a built-in or custom preset
- `rules: PresetRule[]` — organization rules
- `boxNames?: Record<number, string>` — optional custom names per box index

#### Scenario: Preset defines organization rules
- **WHEN** inspecting an OrganizationPreset
- **THEN** it SHALL contain an array of PresetRule objects defining how Pokemon are distributed

#### Scenario: Built-in vs custom distinction
- **WHEN** inspecting the `isBuiltIn` field
- **THEN** it SHALL be `true` for system presets and `false` for user-created presets

### Requirement: PresetRule interface
The system SHALL define a `PresetRule` interface with:
- `order: number` — priority order for rule application
- `filter: PokemonFilter` — which Pokemon this rule includes
- `sort: SortCriteria` — how to sort the filtered Pokemon
- `boxNameTemplate?: string` — optional template for box names

#### Scenario: Rules applied in order
- **WHEN** multiple PresetRules exist
- **THEN** they SHALL be applied in ascending `order` value

### Requirement: PokemonFilter interface
The system SHALL define a `PokemonFilter` interface with optional filter criteria:
- `categories?: PokemonCategory[]` — filter by category
- `generations?: number[]` — filter by generation
- `types?: string[]` — filter by type
- `formTypes?: FormType[]` — filter by form type
- `exclude?: { categories?: PokemonCategory[]; pokemonIds?: number[] }` — exclusion criteria

#### Scenario: Filter combines criteria with AND logic
- **WHEN** multiple filter fields are set
- **THEN** they SHALL be combined with AND logic (all criteria must match)

#### Scenario: Exclude overrides include
- **WHEN** both include criteria and exclude criteria match a Pokemon
- **THEN** the Pokemon SHALL be excluded

### Requirement: SortCriteria type
The system SHALL define a `SortCriteria` union type with values: `'dex-number'`, `'name'`, `'type-primary'`, `'generation'`, `'evolution-chain'`.

#### Scenario: All sort options available
- **WHEN** selecting a sort criteria
- **THEN** all five options SHALL be valid values of the SortCriteria type
