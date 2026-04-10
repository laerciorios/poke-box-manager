## Context

The app already has `usePokedexStore` with a `getMissingPokemon()` selector that returns `number[]` (dex IDs of unregistered Pokémon). The `useSettingsStore` holds variation toggles and active generation filters. Static Pokémon data lives in `src/data/pokemon.json` and `src/data/types.json`.

Currently there is no `/missing` route — users can only view a count on the stats page. The missing pokemon screen is spec section 3.6.

## Goals / Non-Goals

**Goals:**
- Dedicated `/missing` route showing all unregistered Pokémon as sprite cards
- Filter by generation, type, and category (Normal / Legendary / Mythical)
- Sort by dex number, name, type (first type alphabetically), or generation
- Inline Quick Add button to call `toggleRegistered()` without navigating away
- "Next up" mode: displays the first N missing Pokémon in ascending dex order
- Respects variation toggles (from `useSettingsStore`) so filtered-out forms are invisible
- Fully i18n'd (PT-BR + EN)

**Non-Goals:**
- Grouping by game (spec 3.6 mentions it, but it requires cross-referencing `games.json` availability data — deferred to a follow-up change)
- Export to image/text (spec 3.8 — separate change)
- Global search (spec 3.7 — already tracked separately)
- Editing registration in bulk (not in scope for this screen)

## Decisions

### 1. Derive missing list purely at render time — no new store state

`getMissingPokemon()` already returns `number[]`. The component will cross-reference this with static Pokémon data to build enriched `MissingEntry` objects (id, name, types, generation, category, sprite URL). Filters and sort order are applied as plain array operations — no derived Zustand slice needed.

**Why not a new store selector?** The enriched data is presentational; it combines mutable store state with immutable static JSON. Keeping enrichment in the component avoids coupling store logic to display concerns and keeps the store lean.

### 2. Filter and sort state in URL search params

Active filters and sort order live in the URL (`?gen=1&type=fire&cat=legendary&sort=name&nextup=10`) so links are shareable and the browser back button restores state. Managed via Next.js `useSearchParams` + `useRouter`.

**Alternative considered:** Local `useState`. Rejected because state is lost on navigation and can't be shared.

### 3. "Next up" mode as a URL param (`?nextup=N`)

When `nextup` is present, the list is pre-filtered to the first N entries sorted by dex number. The filter/sort controls are hidden; a banner shows "Showing next N missing in dex order". N defaults to 10, configurable via a dropdown (5 / 10 / 20 / 50).

**Why URL param?** Same sharing/bookmark rationale as filters.

### 4. Quick Add uses existing `toggleRegistered` — optimistic UI only

Clicking Quick Add calls `usePokedexStore.toggleRegistered(id)`. Because the store is IndexedDB-backed (synchronous Zustand update, async persist), the card disappears from the list immediately (optimistic). No loading state needed.

### 5. Component structure

```
app/(pages)/missing/page.tsx         — page shell, reads search params
src/components/missing/
  MissingPokemonScreen.tsx           — main container (filters + list)
  MissingFilters.tsx                 — generation / type / category selects
  MissingSortControl.tsx             — sort dropdown
  MissingPokemonCard.tsx             — sprite card with Quick Add button
  NextUpBanner.tsx                   — banner + count selector for Next Up mode
```

Static data helper: `src/lib/missing-pokemon.ts` — `buildMissingEntries(ids, pokemonData)` returns `MissingEntry[]`.

### TypeScript types

```ts
interface MissingEntry {
  id: number;
  formKey: string;           // composite key used by pokedex store
  name: string;              // locale-aware name
  types: string[];           // e.g. ["fire", "flying"]
  generation: number;        // 1–9
  category: 'normal' | 'legendary' | 'mythical' | 'ultra-beast';
  spriteUrl: string;
}

type SortKey = 'dex' | 'name' | 'type' | 'generation';
type CategoryFilter = 'all' | 'normal' | 'legendary' | 'mythical';
```

## Risks / Trade-offs

- **Large list performance** → Virtualization (e.g. `react-window`) may be needed if the unfiltered list exceeds ~500 entries. Mitigation: start without virtualization; add if profiling shows jank.
- **URL param sync complexity** → Using `useSearchParams` in a client component requires a `<Suspense>` boundary in the page. This is a Next.js App Router requirement — mitigate by wrapping the client component in Suspense at the page level.
- **Variation toggles interaction** → `getMissingPokemon()` must already filter out form keys whose variation toggle is off. If not, the helper must apply the same logic. Mitigation: verify store selector behavior and add filtering in `buildMissingEntries` if needed.
