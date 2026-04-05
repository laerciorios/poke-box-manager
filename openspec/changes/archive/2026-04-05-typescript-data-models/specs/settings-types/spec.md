## ADDED Requirements

### Requirement: SettingsState interface
The system SHALL define a `SettingsState` interface at `src/types/settings.ts` containing all user-configurable settings as defined in spec section 2.4:
- `variations: VariationToggles` — which form variations to track
- `activeGenerations: number[]` — active generation filters (1-9)
- `gameFilter: 'switch-only' | 'all'` — game filter mode
- `activeGames: GameId[]` — list of active game IDs
- `theme: 'light' | 'dark' | 'system'` — appearance theme
- `locale: Locale` — UI language
- `spriteStyle: SpriteStyle` — sprite display preference
- `autoSave: boolean` — whether to auto-save changes
- `lastBackup?: string` — ISO date of last backup

#### Scenario: Settings cover all spec 2.4 fields
- **WHEN** inspecting the SettingsState interface
- **THEN** all fields from spec section 2.4 SHALL be present

#### Scenario: Default generations include all
- **WHEN** creating default settings
- **THEN** `activeGenerations` SHALL default to `[1, 2, 3, 4, 5, 6, 7, 8, 9]`

### Requirement: VariationToggles interface
The system SHALL define a `VariationToggles` interface as a separate exportable type with boolean toggles for each variation category:
- `regionalForms`, `genderForms`, `unownLetters`, `vivillonPatterns`, `alcremieVariations`, `colorVariations`, `sizeVariations`, `megaEvolutions`, `gmaxForms`, `battleForms`, `originForms`, `costumedPokemon`

#### Scenario: Each FormType has a corresponding toggle
- **WHEN** inspecting VariationToggles
- **THEN** there SHALL be a boolean toggle for each major FormType category

### Requirement: SpriteStyle type
The system SHALL define a `SpriteStyle` union type with values: `'home-3d'`, `'pixel-gen5'`, `'pixel-gen8'`, `'official-art'`.

#### Scenario: Sprite style options match spec
- **WHEN** selecting a sprite style
- **THEN** all four options from spec section 2.4 SHALL be valid values

### Requirement: GameId type alias
The system SHALL export a `GameId` type alias (`type GameId = string`) from `src/types/game.ts` for semantic clarity in game-related fields.

#### Scenario: GameId used in settings and pokemon types
- **WHEN** referencing game identifiers in SettingsState or PokemonEntry
- **THEN** the `GameId` type SHALL be used instead of raw `string`

### Requirement: Barrel export
The system SHALL provide a barrel export file at `src/types/index.ts` that re-exports all types from all type files (`pokemon.ts`, `game.ts`, `locale.ts`, `box.ts`, `preset.ts`, `settings.ts`).

#### Scenario: Single import point
- **WHEN** a component needs types from multiple type files
- **THEN** it SHALL be able to import all types from `@/types`
