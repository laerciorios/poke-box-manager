## Why

Pokémon with complex acquisition methods (trade evolutions, item evolutions, location-based evolutions) are easy to forget mid-progress — users land on a missing entry with no in-app guidance on what steps to take. Spec section 4.3 defines an acquisition checklist as a first-class feature for surfacing these requirements inside `PokemonCard`, with checkable steps to track multi-step progress.

## What Changes

- **Data pipeline extended**: `evolution-normalizer.ts` rewritten to capture full evolution method details (trigger, held item, trade item, min level, location, time of day, happiness, known move, etc.) alongside the existing `pokemonIds`; `evolution-chains.json` schema is extended accordingly
- **New acquisition steps store**: `useAcquisitionStore` persists per-Pokémon checklist progress to IndexedDB
- **New UI inside `PokemonCard`**: Acquisition checklist section showing steps derived from evolution data, with checkboxes the user can tick off
- **Derived step labels**: Human-readable step descriptions ("Trade holding Metal Coat", "Level 25 near Magnetic Field") generated from raw evolution detail objects
- No new external dependencies required

## Capabilities

### New Capabilities

- `evolution-method-data`: Extended data pipeline capturing evolution method details from PokéAPI; new `EvolutionStep` type and updated `evolution-chains.json` schema
- `acquisition-checklist-store`: `useAcquisitionStore` for persisting per-Pokémon checklist progress (which steps are checked)
- `acquisition-checklist-ui`: Checklist section inside `PokemonCard` rendering labeled steps with checkboxes; only shown for Pokémon with non-trivial acquisition methods

### Modified Capabilities

- `pokemon-detail-card`: `PokemonCard` gains a new collapsible "Acquisition" section rendering the checklist when evolution method data exists for the displayed Pokémon

## Impact

- Modified: `src/scripts/normalizers/evolution-normalizer.ts` (extend to capture method details)
- Modified: `src/data/evolution-chains.json` (schema change — existing consumers read only `pokemonIds`, which is preserved)
- Modified: `src/types/game.ts` (extend `EvolutionChain` type with per-step method data)
- New: `src/types/acquisition.ts` (step and checklist progress types)
- New: `src/stores/useAcquisitionStore.ts`
- New: `src/lib/evolution-step-labels.ts` (step label derivation logic)
- New: `src/components/pokemon/AcquisitionChecklist.tsx`
- Modified: `src/components/pokemon/PokemonCard.tsx` (add checklist section)
- Re-run `npm run fetch-data` required after normalizer change to regenerate `evolution-chains.json`
- Relates to spec section **4.3 Acquisition Checklist**
