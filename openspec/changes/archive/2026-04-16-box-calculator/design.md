## Context

The app already has `computeTotal(variations: VariationToggles): number` in `src/lib/variation-counts.ts` which sums `BASE_POKEMON_COUNT` plus enabled variation counts. However, this function ignores generation filters — it always counts across all generations. `useSettingsStore` also exposes `activeGenerations: number[]` (defaults to `[1..9]`), and `PokemonEntry` / `PokemonForm` both carry a `generation` field.

`BOX_SIZE = 30` is already defined in `src/types/box.ts`.

The box calculator is a pure derived-value widget: given settings state, output a number. No user input required, no store writes.

## Goals / Non-Goals

**Goals:**
- Extend `variation-counts.ts` with a generation-aware total function
- Render a reactive card that updates immediately as the user changes toggles or generation filters
- Place the card in both the settings page and the home dashboard

**Non-Goals:**
- Counting only occupied slots (this is about capacity planning, not current usage)
- Per-type or per-generation breakdown of boxes (single total only)
- Suggesting how to arrange Pokémon across boxes
- Fractional box display (always round up: `Math.ceil`)

## Decisions

### 1. `computeFilteredTotal` filters base Pokémon and forms independently

**Decision:** `computeFilteredTotal(variations: VariationToggles, activeGenerations: number[]): number` iterates `pokemon.json` to count base entries within active generations, then iterates `forms.json` to count enabled variation forms within active generations.

**Rationale:** The existing `computeTotal` uses pre-aggregated `VARIATION_COUNTS` constants (computed once at module load from `forms.json`). Those constants are not broken down by generation, so a new function must do its own filtering pass over the raw JSON arrays. This is a one-time computation per settings change — not hot-path render work — so iterating the static arrays on each call is acceptable (both files load synchronously as static imports).

**Alternative considered:** Pre-computing per-generation counts into a `VARIATION_COUNTS_BY_GENERATION` constant at module load. Rejected because it adds significant build-time complexity and 9 × 12 entries of data that are only used here; the direct filter approach is simpler and fast enough (~1ms for ~1100 entries).

**TypeScript signature:**
```ts
// src/lib/variation-counts.ts

export function computeFilteredTotal(
  variations: VariationToggles,
  activeGenerations: number[]
): number

export function computeBoxCount(pokemonCount: number): {
  boxes: number       // Math.ceil(pokemonCount / BOX_SIZE)
  lastBoxSlots: number // pokemonCount % BOX_SIZE (slots used in the last box)
  emptySlots: number  // BOX_SIZE - lastBoxSlots (0 if perfectly full)
}
```

### 2. Empty `activeGenerations` means "all generations"

**Decision:** When `activeGenerations` is an empty array, `computeFilteredTotal` treats it as "all generations selected" (same as passing `[1..9]`).

**Rationale:** `DEFAULT_SETTINGS` initialises `activeGenerations` to `[1..9]`, but defensive handling of the empty case prevents a result of 0 if the store ever reaches that state. This matches the pattern used in `missing-pokemon.ts` where an empty generations filter is treated as no filter.

### 3. `BoxCalculatorCard` reads directly from `useSettingsStore`

**Decision:** `BoxCalculatorCard` calls `useSettingsStore` internally to read `variations` and `activeGenerations`, then calls `computeFilteredTotal` and `computeBoxCount` inline (no memoisation hook needed).

**Rationale:** Zustand store reads already memoize by reference equality; Zustand's `useShallow` can be used to select both fields together. The computation is cheap enough (~1ms) that a `useMemo` would add more indirection than value.

### 4. Card placement: settings page (primary) + home dashboard (secondary widget)

**Decision:** The card is rendered in the settings page directly below (or adjacent to) `VariationTogglesPanel` where settings changes are made, and as a compact summary tile on the Home dashboard.

**Rationale:** Settings page is where users will naturally look while adjusting toggles — immediate feedback there is most useful. The dashboard gives at-a-glance visibility without requiring a navigation step.

## Risks / Trade-offs

- **Two JSON iteration passes per render of `BoxCalculatorCard`** → Negligible: static arrays, ~1100 entries combined, synchronous. Runs only when settings change (Zustand subscription). → No mitigation needed.
- **Generation filter UX mismatch** → If the user hasn't set an explicit generation filter, `activeGenerations = [1..9]` makes the calculator show the full-variation total, which may confuse users who never touched generation settings. → Mitigation: card label clarifies "based on your current settings".

## Open Questions

- Should the home dashboard widget be collapsible/removable by the user? Assumption: no, it's always visible if space allows — it's a low-noise info tile.
