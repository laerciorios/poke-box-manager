## 1. Types and Data Model

- [x] 1.1 Add `EvolutionMethod` interface to `src/types/game.ts` with all PokéAPI method fields
- [x] 1.2 Add `EvolutionStep` interface to `src/types/game.ts` (`fromId`, `toId`, `method`)
- [x] 1.3 Extend `EvolutionChain` interface in `src/types/game.ts` with `steps: EvolutionStep[]`
- [x] 1.4 Create `src/types/acquisition.ts` with `AcquisitionProgress` type (`Record<number, number[]>`)

## 2. Data Pipeline — Evolution Normalizer

- [x] 2.1 Rewrite `normalizeEvolutionChain` in `src/scripts/normalizers/evolution-normalizer.ts` to recursively extract `EvolutionStep` objects from each `evolution_details` entry
- [x] 2.2 Map all PokéAPI `evolution_details` fields to `EvolutionMethod` fields (trigger, held_item, item, min_level, min_happiness, location, time_of_day, known_move, known_move_type, needs_overworld_rain, turn_upside_down, min_affection, min_beauty, trade_species)
- [x] 2.3 Handle nodes with empty `evolution_details` by producing a step with `trigger: "other"`
- [x] 2.4 Handle branching chains: produce one `EvolutionStep` per edge across all `evolves_to` branches

## 3. Data Regeneration and Validation

- [x] 3.1 Run `npm run fetch-data` to regenerate `src/data/evolution-chains.json` with `steps`
- [x] 3.2 Update `src/scripts/validate-data.ts` to assert every chain entry has a `steps` array field
- [x] 3.3 Run `npm run validate-data` and confirm it passes

## 4. Step Label Utilities

- [x] 4.1 Create `src/lib/evolution-step-labels.ts` with `getStepLabel(method, locale)` covering all known trigger/condition combinations (trade, trade+heldItem, trade+tradeSpeciesId, use-item, level-up+minLevel, level-up+happiness, level-up+location, level-up+timeOfDay, level-up+knownMove, level-up+needsRain, level-up+turnUpsideDown, other)
- [x] 4.2 Implement `isTrivialStep(method)` — returns `true` only for plain level-up (trigger=level-up, only minLevel set, no other conditions)
- [x] 4.3 Add item/location name humanization (replace hyphens with spaces, title-case) for label display

## 5. Acquisition Checklist Store

- [x] 5.1 Create `src/stores/useAcquisitionStore.ts` with `checkedSteps: Record<number, number[]>`, `toggleStep`, `clearChecklist`, `isStepChecked` actions
- [x] 5.2 Persist store to IndexedDB via `createPersistedStore` with name `"acquisition"` and version `1`

## 6. AcquisitionChecklist Component

- [x] 6.1 Create `src/components/pokemon/AcquisitionChecklist.tsx` accepting `pokemonId: number`
- [x] 6.2 Resolve evolution chain steps from `evolution-chains.json` filtered to `toId === pokemonId`
- [x] 6.3 Filter out trivial steps using `isTrivialStep`; return `null` if no steps remain
- [x] 6.4 Render each non-trivial step as a labeled checkbox with `getStepLabel` output and target Pokémon name
- [x] 6.5 Wire checkbox `onChange` to `useAcquisitionStore.toggleStep`
- [x] 6.6 Pre-populate checked state from `useAcquisitionStore.isStepChecked`
- [x] 6.7 Render a "Clear" button (visible only when ≥1 step is checked) that calls `clearChecklist`
- [x] 6.8 Add i18n keys for "Acquisition", "How to obtain", "Clear", "Steps completed" in PT-BR and EN locale files

## 7. PokemonCard Integration

- [x] 7.1 Import and render `AcquisitionChecklist` below the evolution chain section in `PokemonCard`
- [x] 7.2 Pass the currently displayed `pokemonId` (or active form's base Pokémon ID) to `AcquisitionChecklist`
- [x] 7.3 Verify the checklist section is hidden when `AcquisitionChecklist` returns null (no non-trivial steps)

## 8. QA and Verification

- [x] 8.1 Manually verify Scizor (ID 212) shows "Trade holding Metal Coat" checklist in `PokemonCard`
- [x] 8.2 Manually verify Magnezone (ID 462) shows location-based step
- [x] 8.3 Manually verify Charmeleon (ID 5) shows no acquisition checklist
- [x] 8.4 Manually verify Espeon and Umbreon (Eevee branches) each show their own distinct steps
- [x] 8.5 Run `npm run build` and confirm no TypeScript errors
