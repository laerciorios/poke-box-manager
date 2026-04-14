## 1. Prerequisites & Shared Utilities

- [x] 1.1 Extract `FORM_TYPE_TO_TOGGLE_KEY` map from `src/lib/preset-engine.ts` into a new `src/lib/form-type-map.ts` and update `preset-engine.ts` to import from there (both the pokedex row builder and the preset engine need it)
- [x] 1.2 Install `@tanstack/react-virtual` and add it to `package.json` dependencies
- [x] 1.3 Create `src/lib/pokedex-rows.ts` with `buildPokedexRows(pokemon: PokemonEntry[], variations: VariationToggles, activeGenerations: number[], locale: Locale): PokedexRow[]` — emits base rows + form rows for enabled toggles, filtered by active generations
- [x] 1.4 Add `PokedexRow` TypeScript interface to `src/lib/pokedex-rows.ts` (key, pokemonId, formId?, kind, dexNumber, name, types, generation, category, sprite)

## 2. i18n Translation Keys

- [x] 2.1 Add PT-BR translation keys: column headers (Nº, Nome, Tipos, Geração, Categoria, Status), filter section labels, category names, status pill labels ("Registrado" / "Faltando"), search placeholder, empty-state message, sort direction labels
- [x] 2.2 Add the same keys to the EN translation file

## 3. Core Components

- [x] 3.1 Create `src/components/pokedex/PokedexSearch.tsx` — controlled text input with a clear (×) button; calls `onChange` on input change; debounces to 100ms
- [x] 3.2 Create `src/components/pokedex/PokedexFilters.tsx` — filter chips/selects for generation (multi), type (single), and category (single); reads and writes URL search params via `useSearchParams` + `router.replace`
- [x] 3.3 Create `src/components/pokedex/PokedexSortHeader.tsx` — renders a table `<th>` that shows an up/down arrow indicator for the active sort column; clicking toggles asc/desc or changes column; updates URL sort params
- [x] 3.4 Create `src/components/pokedex/PokedexRow.tsx` — renders one `<tr>` with: 40×40 sprite (Next/Image with SpritePlaceholder fallback), `#NNNN`, name (truncated), type badge(s), generation, category, registration status pill; registration pill click calls `toggleRegistered` and stops event propagation; row click (excluding pill) calls `onRowClick(pokemonId)`
- [x] 3.5 Create `src/components/pokedex/PokedexPage.tsx` — client component; reads URL params for filters/sort/query; derives `registeredSet` as `useMemo(() => new Set(registered), [registered])`; builds rows via `useMemo(() => buildPokedexRows(...), [pokemon, variations, activeGenerations, locale])`; applies search + filter + sort pipeline; uses `useVirtualizer` from `@tanstack/react-virtual`; renders table with sticky `<thead>`, virtualized `<tbody>`, and `PokemonCard` Sheet state

## 4. Page Route

- [x] 4.1 Replace `src/app/[locale]/pokedex/page.tsx` stub with a server component that sets page metadata (title, description) and renders `<Suspense><PokedexPage /></Suspense>` — Suspense boundary is required for `useSearchParams` in App Router

## 5. Filter & Sort Pipeline (inside PokedexPage)

- [x] 5.1 Implement search filter: substring match on `row.name` (case-insensitive) and on `String(row.dexNumber).padStart(4, '0')`
- [x] 5.2 Implement generation filter: keep rows where `row.generation` is in the selected generation set
- [x] 5.3 Implement type filter: keep rows where `row.types` includes the selected type
- [x] 5.4 Implement category filter: keep rows where `row.category === selectedCategory`
- [x] 5.5 Implement sort: map sort key (dex / name / type / generation) to a comparator; apply `dir` (asc/desc); dex is the stable secondary sort for all other sort keys

## 6. Polish & Edge Cases

- [x] 6.1 Verify form rows display the base Pokémon's dex number (not a form-internal id)
- [x] 6.2 Verify inline registration toggle correctly passes `formId` for form rows and `undefined` for base rows
- [x] 6.3 Verify `buildPokedexRows` respects `activeGenerations` from settings — Pokémon from inactive generations must not appear regardless of page-level generation filter
- [x] 6.4 Test that navigating to `/pokedex?gen=1&cat=legendary&sort=name` pre-applies all three params on load
- [x] 6.5 Test virtualization: confirm only ~30 DOM row nodes exist when the full list contains 1 000+ rows (check with browser DevTools)
- [x] 6.6 Verify the page is accessible: table has correct `role`, `aria-sort` on sorted column header, registration pill has `aria-label` describing the action ("Mark as registered" / "Mark as missing")
