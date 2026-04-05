## 1. Box Types

- [x] 1.1 Create `src/types/box.ts` with `Box` interface (id, name, label, slots, wallpaper)
- [x] 1.2 Add `BoxSlot` interface (pokemonId, formId, registered)
- [x] 1.3 Export constants `BOX_COLUMNS = 6`, `BOX_ROWS = 5`, `BOX_SIZE = 30`

## 2. Preset Types

- [x] 2.1 Create `src/types/preset.ts` with `OrganizationPreset` interface (id, name, names, description, descriptions, isBuiltIn, rules, boxNames)
- [x] 2.2 Add `PresetRule` interface (order, filter, sort, boxNameTemplate)
- [x] 2.3 Add `PokemonFilter` interface (categories, generations, types, formTypes, exclude)
- [x] 2.4 Add `SortCriteria` union type ('dex-number' | 'name' | 'type-primary' | 'generation' | 'evolution-chain')

## 3. Settings Types

- [x] 3.1 Create `src/types/settings.ts` with `VariationToggles` interface (12 boolean toggles matching spec 2.4)
- [x] 3.2 Add `SpriteStyle` union type ('home-3d' | 'pixel-gen5' | 'pixel-gen8' | 'official-art')
- [x] 3.3 Add `SettingsState` interface with all fields from spec 2.4 (variations, activeGenerations, gameFilter, activeGames, theme, locale, spriteStyle, autoSave, lastBackup)
- [x] 3.4 Export `DEFAULT_SETTINGS` constant with sensible defaults (all variations on, all generations active, dark theme, pt-BR locale)

## 4. Game Type Update

- [x] 4.1 Add `GameId` type alias (`type GameId = string`) to `src/types/game.ts`

## 5. Barrel Export

- [x] 5.1 Create `src/types/index.ts` with re-exports from all type files (pokemon, game, locale, box, preset, settings)

## 6. Verification

- [x] 6.1 Run `npm run build` and verify no type errors
- [x] 6.2 Verify all types are importable from `@/types`
