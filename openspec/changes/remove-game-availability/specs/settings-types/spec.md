## MODIFIED Requirements

### Requirement: SettingsState interface
The system SHALL define a `SettingsState` interface at `src/types/settings.ts` containing all user-configurable settings. The `gameFilter` and `activeGames` fields SHALL NOT be present in `SettingsState`. All other fields from the previous definition are retained:
- `variations: VariationToggles` — which form variations to track
- `activeGenerations: number[]` — active generation filters (1-9)
- `theme: 'light' | 'dark' | 'system'` — appearance theme
- `locale: Locale` — UI language
- `spriteStyle: SpriteStyle` — sprite display preference
- `autoSave: boolean` — whether to auto-save changes
- `lastBackup?: string` — ISO date of last backup

#### Scenario: Settings cover all required fields
- **WHEN** inspecting the SettingsState interface
- **THEN** `variations`, `activeGenerations`, `theme`, `locale`, `spriteStyle`, `autoSave`, and `lastBackup` SHALL be present
- **THEN** `gameFilter` and `activeGames` SHALL NOT be present

#### Scenario: Default generations include all
- **WHEN** creating default settings
- **THEN** `activeGenerations` SHALL default to `[1, 2, 3, 4, 5, 6, 7, 8, 9]`

### Requirement: GameId type alias
The system SHALL continue to export a `GameId` type alias (`type GameId = string`) from `src/types/game.ts` for semantic clarity.

#### Scenario: GameId remains importable
- **WHEN** a source file imports `GameId` from `@/types/game`
- **THEN** the type SHALL resolve to `string`
