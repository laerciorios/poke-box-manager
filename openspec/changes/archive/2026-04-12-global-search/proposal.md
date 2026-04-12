## Why

The `SearchBar` component already exists in the Header and accepts keyboard input (Cmd+K shortcut, Escape to clear), but the `search` state is local to `Header` and never actually queries anything — it is completely inert. Players have no way to find a specific Pokémon by name or number without manually scanning boxes. Spec section 3.7 defines this as a core feature of the app.

## What Changes

- Lift search state out of `Header` into a global search context (or a lightweight Zustand slice) so results are accessible across the layout
- Build `src/lib/search/` engine: index built from static Pokémon JSON + both locale name files (`i18n/pokemon-names/en.json`, `i18n/pokemon-names/pt-BR.json`); fuzzy matching for typo tolerance (e.g. "charzard" → "Charizard"); search by name or dex number
- Add a `SearchResults` dropdown/panel below the SearchBar that shows matched Pokémon with: sprite, name, dex number, type(s), registration status, and which box they appear in (if placed)
- Add quick-filter chips inside the panel: type, generation, category, registration status
- Clicking a result navigates to the box containing that Pokémon (if placed) or opens the Pokémon detail card
- Support `?search=<query>` URL param as a shareable entry point
- Fully i18n'd (PT-BR + EN) for all UI labels

## Capabilities

### New Capabilities

- `global-search`: Full-text fuzzy search engine over Pokémon names (both locales) and dex numbers, with a results panel showing registration status and box location, and quick filter chips

### Modified Capabilities

- `global-search-bar`: The existing SearchBar spec only covers the input component itself. The requirement changes: SearchBar is now wired to a live search engine; the `value` prop drives the engine and its `onChange` must integrate with the global search state rather than local `Header` state.

## Impact

- **Modified**: `src/components/layout/Header.tsx` — search state moves out of `useState` into shared context/store
- **Modified**: `src/components/layout/SearchBar.tsx` — may need `onFocus`/`onBlur` callbacks to show/hide results panel
- **New**: `src/lib/search/engine.ts` — index builder + fuzzy search function
- **New**: `src/lib/search/types.ts` — `SearchResult`, `SearchIndex`, `SearchFilters` types
- **New**: `src/components/search/SearchResults.tsx` — result dropdown panel with filter chips
- **New**: `src/components/search/SearchResultCard.tsx` — individual result row
- **New**: `src/components/search/SearchFilterChips.tsx` — type/gen/category/status chip filters
- **New context or store**: lightweight global search state (query + filters + open/closed)
- **Locale files**: add new UI translation keys for the search panel labels
- No new npm dependencies required (fuzzy matching is simple enough to implement without a library given the small corpus — ~1000 Pokémon)
- Relates to spec section **3.7 Search and Navigation**
