## Context

`SearchBar` in `Header` is wired to a local `useState('')` that is never consumed. The static Pokémon corpus is ~1006 base entries (plus alternate forms) from `src/data/pokemon.json`. Each entry already carries `names: Record<Locale, string>`, `types`, `generation`, `category`, and `sprite`. Separate locale files at `src/i18n/pokemon-names/{en,pt-BR}.json` index names by dex ID. `useBoxStore` holds every box and its 30 slots, each slot optionally carrying `pokemonId` + `formId`.

## Goals / Non-Goals

**Goals:**
- Real-time search over all Pokémon by name (both locales) and dex number as the user types
- Fuzzy matching to absorb common typos (up to ~2 character edits)
- Results panel showing: sprite, name, dex number, type(s), registration status, box location (box name + slot index if placed)
- Quick filter chips inside the panel: type, generation, category, registration status
- Click-to-navigate: goes to the box if the Pokémon is placed, else opens Pokémon detail card
- `?search=<query>` URL param pre-fills the query on load
- Full i18n (PT-BR + EN) for all panel labels

**Non-Goals:**
- Server-side or API search — all search is client-side only
- Indexing user-typed box names or notes
- Pokémon form-level search (results are at species level; forms shown on detail card)
- Search history / saved searches

## Decisions

### 1. No external fuzzy-search library — implement trigram scoring

The corpus is small (~1006 entries × 2 locales). A trigram similarity score (Sørensen–Dice coefficient on character trigrams) is fast, dependency-free, and handles transpositions and insertions well.

Search pipeline per query:
1. If query is a pure number → exact match on `id`
2. Otherwise: normalize query (lowercase, strip accents) → score all entries by trigram similarity against both locale names → keep entries with score > threshold (0.3) + exact prefix matches → sort by score desc → cap at 20 results

**Why not Fuse.js or similar?** Avoids a runtime dependency for a small corpus. Trigram is straightforward to implement and test. Can swap to a library later if requirements grow.

### 2. Search index built once at module load — `src/lib/search/engine.ts`

```ts
export interface SearchIndexEntry {
  id: number
  nameEn: string
  namePtBr: string
  nameEnNorm: string    // lowercased + accent-stripped
  namePtBrNorm: string
  types: [string, string?]
  generation: number
  category: PokemonCategory
  sprite: string
}

export interface SearchResult extends SearchIndexEntry {
  score: number
  boxId: string | null      // null if not placed in any box
  boxName: string | null
  slotIndex: number | null
  registered: boolean
}

export interface SearchFilters {
  type: string | null
  generation: number | null
  category: PokemonCategory | null
  registered: boolean | null   // null = all, true = registered, false = missing
}
```

`buildIndex(pokemon: PokemonEntry[]): SearchIndexEntry[]` — called once, result cached in module scope.

`search(query: string, index: SearchIndexEntry[], filters: SearchFilters, boxes: Box[], registered: Set<string>): SearchResult[]` — pure function, called on every keystroke after 150ms debounce.

### 3. Global search state in a React context — `src/contexts/SearchContext.tsx`

Search state (query, filters, isOpen) is transient UI state — it doesn't need to outlive the session or sync to IndexedDB. A React context is sufficient and avoids polluting Zustand stores with ephemeral UI data.

```ts
interface SearchState {
  query: string
  filters: SearchFilters
  isOpen: boolean
  setQuery: (q: string) => void
  setFilter: <K extends keyof SearchFilters>(k: K, v: SearchFilters[K]) => void
  open: () => void
  close: () => void
}
```

`SearchContext` is provided in the root layout (alongside `ThemeProvider`).

**Why not Zustand?** This state has no persistence requirement and is tightly coupled to a single UI surface. Context is the right tool.

### 4. Results panel rendered as a floating overlay via Radix Popover

`SearchResults` uses `@radix-ui/react-popover` (already available via shadcn/ui) anchored to the SearchBar input. This avoids portal/z-index plumbing and gets accessibility (focus trap, `aria-expanded`, keyboard dismissal) for free.

### 5. Box location resolved at query time by scanning `useBoxStore.boxes`

`search()` accepts the current `boxes` array and resolves box location inline. Scanning 30 slots × N boxes is O(30N) — fast enough at interactive speeds. No pre-computed reverse index needed.

### 6. Navigation on result click

- **Pokémon is in a box**: navigate to `/` (boxes page) with URL param `?box=<boxId>&slot=<slotIndex>` — the box page reads this param on mount and scrolls to + highlights the slot.
- **Pokémon not in a box**: open a `PokemonDetailCard` modal (using the existing `pokemon-detail-card` component per spec) with the selected Pokémon's data.

### TypeScript types summary

All new types live in `src/lib/search/types.ts`. Reuses `PokemonCategory`, `PokemonEntry`, `Box` from existing type files.

## Risks / Trade-offs

- **Trigram threshold tuning** → A threshold of 0.3 may produce too many or too few matches in practice. Mitigation: start with 0.3 + exact-prefix boost; adjust during manual testing.
- **Radix Popover on mobile** → The Popover anchor to a small Header input may be awkward on small screens. Mitigation: on mobile (`< md`) switch to a full-screen modal sheet (shadcn/ui `Sheet`) instead of a Popover.
- **`?box=<id>&slot=<index>` scroll param** → Requires the boxes page to read and act on URL params; if that page isn't set up for this, scroll behavior needs to be added there. Flag as a dependency in tasks.
- **Accent normalization** → PT-BR names with accents (é, ã, etc.) must be normalized consistently between index build and query normalization. Mitigation: use `str.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()`.
