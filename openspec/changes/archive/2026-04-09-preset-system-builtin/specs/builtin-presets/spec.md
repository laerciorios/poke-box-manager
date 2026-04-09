## ADDED Requirements

### Requirement: Built-in presets static data
The system SHALL define all 8 built-in presets as an exported constant `BUILTIN_PRESETS: OrganizationPreset[]` at `src/lib/presets/builtin-presets.ts`. Each preset SHALL have `isBuiltIn: true`, translated `names` and `descriptions` in both `pt-BR` and `en`, and `rules` using the `PokemonFilter` / `SortCriteria` types.

#### Scenario: All 8 built-in presets are present
- **WHEN** importing `BUILTIN_PRESETS`
- **THEN** it SHALL contain exactly 8 items with IDs: `national-dex-order`, `legends-first`, `gen-by-gen`, `type-sorted`, `evolution-chain`, `competitive-living-dex`, `regional-dex`, `regional-forms-together`

#### Scenario: Each preset has required translated names
- **WHEN** inspecting any built-in preset
- **THEN** it SHALL have non-empty strings for `names['en']` and `names['pt-BR']`

### Requirement: National Dex Order preset
The `national-dex-order` preset SHALL define one rule: empty filter (all pokemon), sort by `dex-number`, with box name template `"{start}–{end}"`.

#### Scenario: National Dex boxes are named by dex range
- **WHEN** applying the National Dex Order preset to all 1025 base pokemon
- **THEN** the first box SHALL be named `"001–030"` and the second `"031–060"`

#### Scenario: National Dex Order includes all pokemon
- **WHEN** applying the National Dex Order preset to all pokemon
- **THEN** all pokemon SHALL appear in exactly one box slot

### Requirement: Legends First preset
The `legends-first` preset SHALL define three rules: (1) filter `categories: ['legendary']`, sort `dex-number`, template `"Legendaries {n}"`; (2) filter `categories: ['mythical']`, sort `dex-number`, template `"Mythicals {n}"`; (3) empty filter (remainder), sort `dex-number`, template `"{start}–{end} (no legends)"`.

#### Scenario: Legendaries appear before mythicals
- **WHEN** applying the Legends First preset
- **THEN** all legendary boxes SHALL precede all mythical boxes which SHALL precede all remaining boxes

#### Scenario: Remaining pokemon exclude legendaries and mythicals
- **WHEN** inspecting boxes produced by the remainder rule
- **THEN** no legendary or mythical pokemon SHALL appear in them

### Requirement: Gen by Gen preset
The `gen-by-gen` preset SHALL define one rule per generation (1–9), each filtering by `generations: [n]`, sorting by `dex-number`, with template `"Gen {gen} ({n}/{total})"`.

#### Scenario: Each generation starts in a new box
- **WHEN** applying the Gen by Gen preset
- **THEN** the last box of generation N and the first box of generation N+1 SHALL be distinct boxes (never share a box)

#### Scenario: Gen by Gen box names show progress
- **WHEN** a generation spans multiple boxes
- **THEN** box names SHALL follow the pattern `"Gen 1 (1/6)"`, `"Gen 1 (2/6)"`, etc.

### Requirement: Type Sorted preset
The `type-sorted` preset SHALL define one rule with empty filter, sort `type-primary`, and template `"{type} {n}"`.

#### Scenario: Pokemon grouped by primary type in canonical order
- **WHEN** applying the Type Sorted preset
- **THEN** all Normal-type pokemon SHALL appear before Fire-type, Fire before Water, and so on in the canonical 18-type order

#### Scenario: Type Sorted box names include type name
- **WHEN** inspecting boxes produced by the Type Sorted preset
- **THEN** box names SHALL include the primary type name (e.g., `"Normal 1"`, `"Fire 1"`)

### Requirement: Evolution Chain preset
The `evolution-chain` preset SHALL define one rule with empty filter, sort `evolution-chain`, and template `"Families {n}"`.

#### Scenario: Evolution chain members appear together
- **WHEN** applying the Evolution Chain preset
- **THEN** Bulbasaur (id: 1), Ivysaur (id: 2), and Venusaur (id: 3) SHALL appear in the same box or adjacent boxes with no other chain interspersed between them

#### Scenario: Pokemon without evolutions placed at end
- **WHEN** applying the Evolution Chain preset
- **THEN** pokemon with no `evolutionChainId` SHALL appear in the final boxes after all chain-grouped pokemon

### Requirement: Competitive Living Dex preset
The `competitive-living-dex` preset SHALL define three rules: (1) filter `categories: ['normal']`, sort `dex-number`, template `"Comp. {n}"`; (2) filter `categories: ['legendary', 'mythical']`, sort `dex-number`, template `"Restricted {n}"`; (3) remainder (ultra-beasts, paradox, baby, etc.), sort `dex-number`, template `"Others {n}"`.

#### Scenario: Normal-category pokemon appear first
- **WHEN** applying the Competitive Living Dex preset
- **THEN** boxes named `"Comp. N"` SHALL contain only pokemon with `category === 'normal'`

#### Scenario: Restricted boxes contain legendaries and mythicals
- **WHEN** applying the Competitive Living Dex preset
- **THEN** boxes named `"Restricted N"` SHALL contain only pokemon with `category === 'legendary'` or `'mythical'`

### Requirement: Regional Dex preset
The `regional-dex` preset SHALL define one rule per region, filtering by the corresponding generation(s), sorting by `dex-number`, with template `"{region} {n}"`. Gen 1 = Kanto, Gen 2 = Johto, Gen 3 = Hoenn, Gen 4 = Sinnoh, Gen 5 = Unova, Gen 6 = Kalos, Gen 7 = Alola, Gen 8 = Galar, Gen 9 = Paldea. Hisui forms (form type `regional-hisui`) SHALL be grouped with Gen 8 (Galar) boxes.

#### Scenario: Kanto pokemon appear in Kanto boxes
- **WHEN** applying the Regional Dex preset
- **THEN** all generation-1 pokemon SHALL appear in boxes named `"Kanto N"`

#### Scenario: Regions appear in chronological order
- **WHEN** applying the Regional Dex preset
- **THEN** Kanto boxes SHALL precede Johto, which SHALL precede Hoenn, and so on

### Requirement: Regional Forms Together preset
The `regional-forms-together` preset SHALL define one rule with empty filter, sort by `dex-number`, where pokemon with regional form types (`regional-alola`, `regional-galar`, `regional-hisui`, `regional-paldea`) are sorted adjacent to their base form (same dex ID group), and template `"Forms {n}"`.

#### Scenario: Regional forms adjacent to base form
- **WHEN** applying the Regional Forms Together preset
- **THEN** Vulpix (id: 37) and Alolan Vulpix SHALL appear in the same box or in adjacent boxes with no other species between them

#### Scenario: All pokemon covered
- **WHEN** applying the Regional Forms Together preset to all pokemon including regional forms
- **THEN** no pokemon SHALL be omitted
