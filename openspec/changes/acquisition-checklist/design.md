## Context

`evolution-chains.json` today stores only `{ [chainId]: number[] }` — a flat list of Pokémon IDs per chain. The `evolution-normalizer.ts` traverses PokéAPI's nested chain nodes but discards the `evolution_details` array at each node, which contains the trigger, held item, trade condition, level, location, happiness threshold, and other method data.

`PokemonCard` already renders the evolution chain as a sprite row. It has no awareness of how each evolution is triggered.

The PokéAPI raw `.cache/` data is already present locally, so no additional network calls are needed to re-derive the method details — they just need to be extracted during the next `fetch-data` run.

## Goals / Non-Goals

**Goals:**
- Capture per-evolution method details in the data pipeline (normalizer + output JSON)
- Derive human-readable step labels from raw method objects (both PT-BR and EN)
- Render a checkable acquisition checklist inside `PokemonCard` for Pokémon with non-trivial evolution methods
- Persist per-Pokémon checklist progress to IndexedDB
- Preserve backwards compatibility for existing consumers of `pokemonIds`

**Non-Goals:**
- Checklist for acquisition methods not related to evolution (event-only Pokémon, in-game items, wild encounters)
- Branching visual evolution trees — the checklist shows steps toward a specific final form only
- Real-time sync of checklist state across devices

## Decisions

### 1. Extend `EvolutionChain` type: add `steps` array alongside `pokemonIds`

**Decision:** `EvolutionChain` gains a `steps: EvolutionStep[]` array where each step describes a single evolution edge (from → to Pokémon, plus method details). `pokemonIds` is preserved unchanged.

**Rationale:** Existing code that only reads `pokemonIds` (evolution chain rendering in `PokemonCard`, preset organizer) is unaffected. New code reads `steps` explicitly. Colocating steps with the chain avoids a separate data file.

**TypeScript types:**
```ts
// src/types/game.ts

export interface EvolutionMethod {
  trigger: 'level-up' | 'trade' | 'use-item' | 'shed' | 'spin' | 'tower-of-darkness'
          | 'tower-of-waters' | 'three-critical-hits' | 'take-damage' | 'other'
  minLevel?: number
  item?: string           // item name (for use-item trigger)
  heldItem?: string       // item name (for trade-with-held-item)
  tradeSpeciesId?: number // trade with specific Pokémon
  happiness?: number      // min happiness
  timeOfDay?: 'day' | 'night' | 'dusk'
  location?: string       // location name
  knownMove?: string      // move name
  knownMoveType?: string  // type name
  needsRain?: boolean
  turnUpsideDown?: boolean
  affection?: number      // min affection (amie/camp)
  beauty?: number         // min beauty (contest)
}

export interface EvolutionStep {
  fromId: number          // pre-evolution Pokémon ID
  toId: number            // result Pokémon ID
  method: EvolutionMethod
}

export interface EvolutionChain {
  id: number
  pokemonIds: number[]    // preserved; order matches chain traversal
  steps: EvolutionStep[]  // one per evolution edge
}
```

### 2. Step labels derived at render time, not stored in JSON

**Decision:** `src/lib/evolution-step-labels.ts` exports a `getStepLabel(method: EvolutionMethod, locale: string): string` function that maps method fields to human-readable text. Labels are derived on demand during render.

**Rationale:** Baking translated strings into `evolution-chains.json` would bloat the static file and require re-running `fetch-data` whenever translations change. A pure function is easier to test, modify, and localise. The function covers the ~15 known PokéAPI trigger/condition combinations with a fallback label.

**i18n approach:** The label function receives `locale` and uses a simple lookup map (no `next-intl` message files needed — these are data-driven labels, not UI strings). Example PT-BR: "Troca segurando Metal Casaco"; EN: "Trade holding Metal Coat".

### 3. Checklist progress stored in `useAcquisitionStore` keyed by `pokemonId`

**Decision:** Progress map: `{ [pokemonId: number]: Set<number> }` where the set contains 0-based step indices that are checked. Steps are indexed by position in the `EvolutionStep[]` array for the relevant chain (filtered to steps where `toId === pokemonId`).

**Rationale:** Progress is per-target Pokémon (the one being acquired), not per chain. A Pokémon that is the destination of multiple branched evolutions (e.g., Espeon vs. Umbreon both from Eevee) each get their own independent checklist filtered to their specific `toId`. Storing as a Set of indices is compact and O(1) for toggle and check.

**Alternative considered:** Storing `{ chainId → stepIndex → boolean }`. Rejected because UI always queries by `pokemonId`, not `chainId`, requiring an extra join.

### 4. Checklist only shown for non-trivial methods

**Decision:** Steps with `trigger: 'level-up'` and no other conditions (only `minLevel` set, or no conditions at all) are considered "trivial" and excluded from the checklist. The acquisition section is hidden entirely when all steps to a Pokémon are trivial.

**Rationale:** "Level up to 16" is not actionable guidance that warrants a checklist — it's already obvious from the evolution chain display. The checklist is meaningful only for trade evolutions, item evolutions, location/time/happiness gating, etc.

## Risks / Trade-offs

- **`evolution-chains.json` size increase** → Each step adds ~4–8 fields. Estimate: ~3 KB added to the file (total ~600 chains × avg 1.5 steps × ~4 fields). Acceptable for a static JSON import. → Mitigation: none needed; file stays well under any practical bundle size concern.
- **`fetch-data` must be re-run** → Existing `evolution-chains.json` won't have `steps` until regenerated. → Mitigation: document in task list; add validation in `validate-data.ts` to assert `steps` field presence.
- **PokéAPI evolution_details can have multiple entries per edge** → Some Pokémon have multiple valid methods (e.g., Rockruff day/dusk). → Mitigation: normalizer takes the first non-empty `evolution_details` entry; `EvolutionStep` stores one method. Multiple valid paths are represented as separate steps with the same `toId`.
- **Cached PokéAPI data may be stale** → The `.cache/` directory may not have all chains if cache was partial. → Mitigation: `fetch-data` script already handles re-fetching missing entries.

## Migration Plan

1. Update `EvolutionChain` type and `EvolutionMethod`/`EvolutionStep` types
2. Rewrite `evolution-normalizer.ts` to extract steps
3. Run `npm run fetch-data` to regenerate `evolution-chains.json`
4. Run `npm run validate-data` to confirm schema
5. Implement store, label function, and UI components
6. Existing `pokemonIds` consumers require no changes

## Open Questions

- Should trivial level-up steps be optionally shown (collapsed by default)? Assumption: no, keep checklist clean.
- Should checked steps persist across browser sessions even after the Pokémon is registered? Assumption: yes — users may want to keep notes.
