## 1. Search Engine — Data Layer

- [ ] 1.1 Create `src/lib/search/types.ts` with `SearchIndexEntry`, `SearchResult`, and `SearchFilters` TypeScript interfaces (as defined in design.md)
- [ ] 1.2 Create `src/lib/search/normalize.ts` with `normalizeQuery(s: string): string` — lowercases and strips diacritics via `str.normalize('NFD').replace(/\p{Diacritic}/gu, '')`
- [ ] 1.3 Create `src/lib/search/trigram.ts` with `trigramScore(a: string, b: string): number` using Sørensen–Dice coefficient on character trigrams
- [ ] 1.4 Create `src/lib/search/engine.ts` with `buildIndex(pokemon: PokemonEntry[]): SearchIndexEntry[]` — builds and caches the index at module load
- [ ] 1.5 Add `search(query: string, index: SearchIndexEntry[], filters: SearchFilters, boxes: Box[], registered: Set<string>): SearchResult[]` to `engine.ts` — handles numeric queries (exact id match) and name queries (trigram score > 0.3 + prefix boost), returns top 20 results

## 2. Global Search State — Context

- [ ] 2.1 Create `src/contexts/SearchContext.tsx` exporting `SearchProvider` and `useSearch` hook with state: `query`, `filters`, `isOpen`, `setQuery`, `setFilter`, `open`, `close`
- [ ] 2.2 Add `SearchProvider` to the root layout (`src/app/layout.tsx`) alongside existing providers
- [ ] 2.3 Read `?search=<query>` URL param on mount in `SearchProvider` and pre-fill query + set `isOpen: true` if param is present

## 3. Wire SearchBar to Context

- [ ] 3.1 Update `src/components/layout/Header.tsx` — remove local `useState('')` for search; pass `useSearch().query` and `useSearch().setQuery` as `value`/`onChange` to `SearchBar`
- [ ] 3.2 Add `onFocus` callback to `SearchBar` that calls `useSearch().open()` when the input is focused and query is non-empty

## 4. Results Panel Components

- [ ] 4.1 Create `src/components/search/SearchFilterChips.tsx` — renders chip rows for type (all types from static data), generation (1–9), category (All/Normal/Legendary/Mythical/Ultra-Beast/Paradox), and registration status (All/Registered/Missing); reads/writes `SearchContext.filters`
- [ ] 4.2 Create `src/components/search/SearchResultCard.tsx` — renders one result row: sprite (with fallback), name (locale-aware), `#NNNN` dex number, type badge(s), registration status pill, box location string
- [ ] 4.3 Create `src/components/search/SearchResults.tsx` — Radix Popover anchored to the SearchBar; renders `SearchFilterChips` + scrollable list of `SearchResultCard`; handles empty state; calls `close()` on Escape/outside click; on mobile (`< md`) renders as a shadcn/ui `Sheet` instead

## 5. Navigation on Result Click

- [ ] 5.1 In `SearchResultCard`, implement click handler: if `result.boxId` is non-null, call `router.push('/?box=<boxId>&slot=<slotIndex>')` and call `useSearch().close()`; if null, open Pokémon detail card modal and call `close()`
- [ ] 5.2 Verify the boxes page (`src/app/(pages)/page.tsx` or equivalent) reads `?box` and `?slot` URL params on mount and scrolls to + highlights the target slot (add this if not already implemented)

## 6. i18n Translation Keys

- [ ] 6.1 Add PT-BR keys for the search panel: filter section labels, type/category chip labels, registration status labels ("Registrado" / "Faltando"), "Não está em nenhuma caixa", empty state message, result count label
- [ ] 6.2 Add the same keys to the EN translation file

## 7. Polish & Edge Cases

- [ ] 7.1 Debounce `setQuery` calls in `SearchBar` to 150ms so the search engine is not called on every keystroke
- [ ] 7.2 Verify accent normalization: searching "pikachu" in PT-BR locale returns the correct result even if the stored name has accents
- [ ] 7.3 Verify numeric search: "25" returns Pikachu as the first result
- [ ] 7.4 Verify results panel closes and query clears after clicking a result
- [ ] 7.5 Verify `?search=bulba` pre-fills the input and opens the panel on page load
- [ ] 7.6 Test on mobile viewport that results render in a Sheet rather than Popover
