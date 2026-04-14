## ADDED Requirements

### Requirement: Fetch script includes a sprite download stage
After generating `pokemon.json` (and the per-generation shards), the fetch script SHALL include a stage that downloads the sprite PNG for each `PokemonForm` entry that has a `spriteUrl`. Downloaded files SHALL be saved to `public/sprites/<formId>.png`. Sprites already present on disk SHALL be skipped unless `--force` is passed.

#### Scenario: Sprite downloaded for each form with a URL
- **WHEN** the sprite download stage runs
- **THEN** a `.png` file SHALL be written to `public/sprites/` for every form entry that has a non-null `spriteUrl`

#### Scenario: Existing sprite skipped
- **WHEN** `public/sprites/<formId>.png` already exists
- **THEN** the download SHALL be skipped for that form

### Requirement: Fetch script includes a WebP conversion stage
After the sprite download stage, the script SHALL convert each downloaded PNG to WebP using `sharp` and write the result to `public/sprites/<formId>.webp`. Already-converted files SHALL be skipped unless `--force` is passed.

#### Scenario: WebP file produced for each PNG
- **WHEN** the WebP conversion stage runs
- **THEN** a `.webp` file SHALL exist alongside each `.png` in `public/sprites/`

#### Scenario: Conversion skipped for existing WebP
- **WHEN** `public/sprites/<formId>.webp` already exists
- **THEN** the conversion SHALL be skipped for that form

### Requirement: Fetch script produces per-generation JSON shards
After building the full `pokemon.json`, the script SHALL split entries by generation and write `src/data/pokemon-gen-{1..9}.json` files plus `src/data/pokemon-manifest.json`.

#### Scenario: Nine generation shards are produced
- **WHEN** the fetch script completes
- **THEN** `src/data/pokemon-gen-1.json` through `src/data/pokemon-gen-9.json` SHALL each exist and contain only entries for that generation

#### Scenario: Manifest file is produced
- **WHEN** the fetch script completes
- **THEN** `src/data/pokemon-manifest.json` SHALL list each generation's dex ID range and chunk key
