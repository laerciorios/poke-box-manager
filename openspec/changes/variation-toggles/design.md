## Context

The `VariationToggles` interface and `useSettingsStore` (with `setVariation` / `setVariations`) are fully implemented. Static form data lives in `src/data/forms.json` as a record keyed by form ID, each entry carrying a `formType` field. The settings component directory (`src/components/settings/`) exists but is empty. No UI currently exposes toggle controls to the user.

## Goals / Non-Goals

**Goals:**
- Render all 12 variation toggles with name, subtitle examples, per-toggle additional count, and a Switch control
- Show a live Pokédex total (base + active variations) that updates as the user flips switches
- Warn non-destructively when the user turns off a toggle that has already-registered forms in the Pokédex
- Keep the computation fully client-side and offline — no fetches, no backend

**Non-Goals:**
- Deleting or migrating registered Pokémon when a toggle is disabled (explicitly out of scope per spec 3.3)
- Filtering the box grid or Pokédex list (that is driven separately by the stores)
- Adding or changing the `VariationToggles` type or `useSettingsStore` API
- i18n for toggle labels in this iteration (PT-BR strings can be added once the structure is stable)

## Decisions

### 1. Count computation: build-time constant vs. runtime derived

**Decision**: Pre-compute counts from `forms.json` at module load time in `src/lib/variation-counts.ts` and export them as a plain object constant.

**Rationale**: `forms.json` is static — it never changes at runtime. Computing once at module load keeps component render paths synchronous and avoids re-scanning ~560 form entries on every toggle flip. The counts fit in ~200 bytes.

**Alternative considered**: Compute inside the component with `useMemo`. Rejected because the data never changes; memoising a static computation adds ceremony with no benefit.

**Mapping** — `VariationToggles` key → `formType` values in `forms.json`:

| Toggle key | formType(s) | Extra forms (from data) |
|---|---|---|
| `regionalForms` | `regional-alola`, `regional-galar`, `regional-hisui`, `regional-paldea` | 59 |
| `genderForms` | `gender` | 4 |
| `unownLetters` | `unown` | 28 |
| `vivillonPatterns` | `vivillon` | 20 |
| `alcremieVariations` | `alcremie` | 63 |
| `colorVariations` | `color` | 32 |
| `sizeVariations` | `size` | 6 |
| `megaEvolutions` | `mega` | 96 |
| `gmaxForms` | `gmax` | 34 |
| `battleForms` | `battle` | 6 |
| `originForms` | `origin` | 4 |
| `costumedPokemon` | `costume` | 15 |

```ts
// src/lib/variation-counts.ts (shape)
export interface VariationCount {
  key: keyof VariationToggles
  additionalCount: number
  formTypes: string[]  // formType values that contribute to this toggle
}

export const VARIATION_COUNTS: Record<keyof VariationToggles, number>
export const BASE_POKEMON_COUNT: number  // forms.json entries with no toggle = base
export function computeTotal(variations: VariationToggles): number
```

### 2. Warning detection: store scan vs. derived selector

**Decision**: Derive "has registered forms for toggle X" from `usePokedexStore` via a selector that maps toggle key → set of form IDs expected under that toggle, then intersects with registered form IDs.

**Rationale**: Keeps warning logic in the component layer without adding new store actions. The intersection is O(n) over registered forms, which is at most a few hundred entries in practice.

**Alternative considered**: Add a computed field to `usePokedexStore`. Rejected — the pokedex store should not know about settings; that is a cross-cutting concern better handled at the UI layer.

### 3. Component decomposition

```
VariationTogglesPanel          — outer shell: total display, reads store, renders list
  └─ VariationToggleItem       — single row: Switch + label + count badge + optional warning icon
```

`VariationTogglesPanel` holds the single `useSettingsStore` and `usePokedexStore` subscriptions. `VariationToggleItem` is a pure presentational component (props-only) to keep it easily testable.

### 4. Placement in the app

The panel lives in `src/components/settings/` and is surfaced in the Settings page (route `/settings`). It can also be embedded as a Sheet/Dialog trigger from the Pokédex page header (future, not in this change).

## Risks / Trade-offs

- **Form count drift** — If `forms.json` is regenerated (e.g. new regional forms added), `VARIATION_COUNTS` updates automatically on next build because it scans the file at module load. No manual constant to update. ✓
- **`other` formType is untracked** — 211 forms carry `formType: 'other'` (alternate battle forms, cosmetic variants, etc.) and are not represented by any toggle. These are always excluded from the total. This matches the spec's design — only explicitly named variation categories are tracked.
- **Warning UX is advisory only** — The user can dismiss or ignore the warning. No guard prevents the toggle from being turned off. This is intentional: preserving registered data is the highest priority.

## Migration Plan

No data migration needed. The stores already persist `variations` in IndexedDB with the correct shape. New UI reads existing store fields — no schema change, no version bump.

## Open Questions

- Should the total shown be "Pokémon to track" or "box slots needed"? (Currently the spec shows both base total and selected-variation total — we'll show both lines matching the spec mockup.)
- i18n: toggle names/subtitles — use hardcoded strings for now or wire `next-intl` messages from the start? Lean toward wiring i18n from the start since the project already uses `next-intl`.
