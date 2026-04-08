## Why

The app has box visualization, stores, and types in place but no way to actually organize Pokémon into boxes. Without the preset engine and built-in preset definitions, the "Auto-fill" action (spec section 3.2.1) cannot work — the app is structurally complete but functionally empty for its core use case.

## What Changes

- Implement the box organizer engine (`src/lib/box-engine/organizer.ts`) that accepts a preset + Pokémon list and produces a sorted, named array of boxes
- Implement the box-name template renderer that translates `boxNameTemplate` strings like `"{start}–{end}"`, `"Gen {gen} ({n}/{total})"` into actual box names
- Define all 8 built-in presets as typed data in `src/lib/presets/builtin-presets.ts`, using the existing `OrganizationPreset` / `PresetRule` / `PokemonFilter` types
- Add a filter engine (`src/lib/box-engine/filter.ts`) that evaluates `PokemonFilter` against a `PokemonEntry`
- Add a sort engine (`src/lib/box-engine/sort.ts`) that applies `SortCriteria` to a filtered list, including `evolution-chain` ordering using the static `evolution-chains.json`
- Expose a single `applyPreset(preset, pokemon, evolutionChains)` function as the public API for the organizer
- Write unit tests for the organizer, filter, and all 8 built-in presets

## Capabilities

### New Capabilities
- `box-organizer`: Core engine that takes a preset + Pokémon list and produces Box[]  — filter → sort → chunk → name
- `builtin-presets`: The 8 built-in preset definitions (National Dex, Legends First, Gen by Gen, Type Sorted, Evolution Chain, Competitive Living Dex, Regional Dex, Regional Forms Together) as static data implementing `OrganizationPreset`

### Modified Capabilities
- `preset-types`: The `SortCriteria` type needs a `'regional-dex'` value added to support the Regional Dex preset (groups by generation, which maps 1:1 to region)

## Impact

- **New files**: `src/lib/box-engine/organizer.ts`, `src/lib/box-engine/filter.ts`, `src/lib/box-engine/sort.ts`, `src/lib/presets/builtin-presets.ts`
- **Modified files**: `src/types/preset.ts` (add `'regional-dex'` to `SortCriteria`)
- **No new npm dependencies** — uses existing static data and TypeScript
- **Static data used**: `src/data/pokemon.json`, `src/data/evolution-chains.json`
- **Relates to**: spec section 3.2.1 (built-in presets), 3.2.2 (preset configuration), box-types spec, preset-types spec
