## MODIFIED Requirements

### Requirement: SortCriteria type
The system SHALL define a `SortCriteria` union type with values: `'dex-number'`, `'name'`, `'type-primary'`, `'generation'`, `'evolution-chain'`, `'regional-dex'`.

#### Scenario: All sort options available
- **WHEN** selecting a sort criteria
- **THEN** all six options SHALL be valid values of the SortCriteria type

#### Scenario: regional-dex sort groups by generation
- **WHEN** `SortCriteria` is `'regional-dex'`
- **THEN** the sort engine SHALL group pokemon by their `generation` field (mapping generation to region name) and sort within each group by `id` ascending
