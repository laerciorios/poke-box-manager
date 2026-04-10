## Context

The `/pokedex` stub page lives at `src/app/[locale]/pokedex/page.tsx` (Next.js App Router, locale-prefixed routing). The existing codebase already provides:

- `PokemonCard` — a Sheet side panel at `src/components/pokemon/PokemonCard.tsx` accepting `pokemonId`, `isOpen`, `onClose`
- `usePokedexStore` — `registered: string[]`, `isRegistered(id, formId?)`, `toggleRegistered(id, formId?)`
- `useSettingsStore` — `variations: VariationToggles`, `activeGenerations: number[]`, `locale`
- `FORM_TYPE_TO_TOGGLE_KEY` map in `src/lib/preset-engine.ts` — maps `FormType → keyof VariationToggles`
- Static data: `src/data/pokemon.json` (~1006 base entries, each with `forms[]`)

## Goals / Non-Goals

**Goals:**
- Virtualized list of all visible Pokémon rows (base + active form rows) — performant up to ~2 000+ rows
- Columns: sprite, dex #, name, types, generation, category, registration status
- Column sort: dex (default), name, primary type, generation
- Filter chips: generation, type, category
- Local search input (name or dex number substring match)
- Inline registration toggle per row
- Row click → open `PokemonCard` Sheet for that Pokémon
- Variation toggles from settings determine which form rows are visible
- Filter/sort state in URL search params

**Non-Goals:**
- Editing box placement from this page (box assignment is done in the main boxes view)
- Showing which box a Pokémon is in (that's the global search result card's job)
- Grouping/collapsing rows by evolution family or type (can be added later)
- Pagination (virtualization makes it unnecessary)

## Decisions

### 1. Row model — flat list of `PokedexRow` computed from static data + settings

```ts
type PokedexRowKind = 'base' | 'form'

interface PokedexRow {
  key: string          // unique stable key: pokemonId or "pokemonId:formId"
  pokemonId: number
  formId?: string
  kind: PokedexRowKind
  dexNumber: number    // always the base pokémon's id for sorting
  name: string         // locale-resolved display name
  types: [string, string?]
  generation: number
  category: PokemonCategory
  sprite: string
}
```

`buildPokedexRows(pokemon, variations, activeGenerations, locale): PokedexRow[]` in `src/lib/pokedex-rows.ts`:
1. Filter base entries by `activeGenerations`
2. For each base entry, emit a `'base'` row
3. For each form in `entry.forms`: look up toggle key via `FORM_TYPE_TO_TOGGLE_KEY`; emit a `'form'` row only if that toggle is enabled

The result is a stable flat array rebuilt only when settings change (memoized via `useMemo`).

### 2. Virtualization via `@tanstack/react-virtual`

Rows can reach ~1 800 when all toggles are on. `useVirtualizer` from `@tanstack/react-virtual` virtualizes the tbody — only DOM nodes for visible rows are rendered. Row height is fixed at 52px for predictable layout. No scroll restoration needed (table resets on filter change).

**Why not CSS `content-visibility`?** Less control over scroll performance on large lists; `react-virtual` is the de-facto standard and is lightweight (~5 kB).

### 3. Filter and sort state via URL search params

`?gen=1,3&type=fire&cat=legendary&sort=name&q=char` — readable, shareable, back-button-friendly. Managed via `useSearchParams` + `router.replace` (not `push` to avoid polluting history on each keystroke). The page wraps the client component in `<Suspense>` as required by App Router.

### 4. Inline registration toggle — optimistic, no confirmation

Clicking the registration status pill calls `toggleRegistered(pokemonId, formId?)` immediately. The store update is synchronous (Zustand); IndexedDB persist is async in the background. No loading state needed.

### 5. Registered-set derived at render time for O(1) lookups

`usePokedexStore` stores `registered` as a `string[]`. For a table scanning 1 800 rows, calling `includes()` per row is O(n²). Derive a `Set<string>` once per render: `const registeredSet = useMemo(() => new Set(registered), [registered])`. Then each row checks `registeredSet.has(row.key)` in O(1).

### 6. Component structure

```
src/app/[locale]/pokedex/page.tsx          — server component shell + Suspense boundary
src/components/pokedex/
  PokedexPage.tsx                          — client root: computes rows, reads URL params
  PokedexSearch.tsx                        — local search input
  PokedexFilters.tsx                       — generation / type / category filter chips
  PokedexSortHeader.tsx                    — sortable column headers
  PokedexRow.tsx                           — single virtualized row
src/lib/pokedex-rows.ts                    — buildPokedexRows() pure function
```

## Risks / Trade-offs

- **`@tanstack/react-virtual` new dependency** → Adds ~5 kB gzipped. Mitigation: justified by the row count; document in package.json with a comment.
- **`useSearchParams` Suspense requirement** → Client components using `useSearchParams` must be wrapped in `<Suspense>` at the page level or Next.js will throw at build time. Mitigation: page.tsx remains a server component and imports `PokedexPage` (client) inside `<Suspense>`.
- **Row height fixed at 52px** → If name or type badge wraps (rare at default font size), the row will overflow. Mitigation: clamp text to one line with `truncate`; use `title` attribute for full name on hover.
- **`FORM_TYPE_TO_TOGGLE_KEY` coupling** → The row builder depends on an internal map in `preset-engine.ts`. Mitigation: extract the map to a shared `src/lib/form-type-map.ts` so both the preset engine and the Pokédex row builder import from one source.
