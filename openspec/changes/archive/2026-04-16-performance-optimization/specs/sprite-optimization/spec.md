## ADDED Requirements

### Requirement: Build script downloads and converts sprites to WebP
The `fetch-pokemon-data` script SHALL include a sprite download and conversion stage. For each Pokémon form with a sprite URL, it SHALL download the source PNG from PokéAPI, convert it to WebP using `sharp`, and write both files to `public/sprites/`. Existing files SHALL be skipped unless `--force` is passed.

#### Scenario: WebP file is created alongside PNG
- **WHEN** the sprite stage runs for a Pokémon that has not been processed yet
- **THEN** a `.webp` file SHALL be written to `public/sprites/<id>.webp`
- **THEN** the original `.png` SHALL also be present as a fallback at `public/sprites/<id>.png`

#### Scenario: Existing sprite is skipped
- **WHEN** both `public/sprites/<id>.webp` and `public/sprites/<id>.png` already exist
- **THEN** the script SHALL skip the download and conversion for that Pokémon

#### Scenario: Force flag re-downloads and converts all sprites
- **WHEN** the script is run with `--force`
- **THEN** all sprites SHALL be re-downloaded and re-converted regardless of existing files

### Requirement: BoxSlotCell serves WebP with PNG fallback
When rendering a Pokémon sprite, `BoxSlotCell` SHALL use a `<picture>` element with a `<source type="image/webp">` pointing to the `.webp` file and an `<img>` fallback pointing to the `.png` file.

#### Scenario: Browser supporting WebP receives .webp
- **WHEN** a browser that supports WebP renders a `BoxSlotCell` with a sprite
- **THEN** the browser SHALL load the `.webp` source

#### Scenario: Browser without WebP support falls back to PNG
- **WHEN** a browser without WebP support renders a `BoxSlotCell`
- **THEN** the browser SHALL load the `.png` fallback via the `<img>` element

### Requirement: Sprite sheet pipeline is scaffolded but deferred
The build script SHALL accept a `--sprite-sheet` flag. When passed, it SHALL log a message indicating the feature is not yet implemented and exit cleanly without error.

#### Scenario: Sprite sheet flag exits with TODO message
- **WHEN** the fetch script is run with `--sprite-sheet`
- **THEN** it SHALL print "Sprite sheet generation is not yet implemented" and exit with code 0
