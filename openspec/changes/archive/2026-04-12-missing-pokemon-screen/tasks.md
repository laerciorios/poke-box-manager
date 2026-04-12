## 1. Data Layer

- [x] 1.1 Audit `usePokedexStore.getMissingPokemon()` to confirm it applies variation toggle filtering; add filtering in the selector if not already present
- [x] 1.2 Create `src/lib/missing-pokemon.ts` with `buildMissingEntries(ids: number[], locale: string): MissingEntry[]` that cross-references static Pokémon JSON and returns enriched entries (id, formKey, name, types, generation, category, spriteUrl)
- [x] 1.3 Add `MissingEntry`, `SortKey`, and `CategoryFilter` TypeScript types (can live in `src/types/missing.ts` or inline in the lib file)

## 2. i18n Translation Keys

- [x] 2.1 Add PT-BR translation keys for the missing screen: page title, filter labels (Generation, Type, Category), sort labels (Dex, Name, Type, Generation), Quick Add button, empty-state message, Next up banner text, and count selector label
- [x] 2.2 Add the same keys to the EN translation file

## 3. Core Components

- [x] 3.1 Create `src/components/missing/MissingPokemonCard.tsx` — renders sprite, dex number, name, type badge(s), and Quick Add button; calls `toggleRegistered` on click
- [x] 3.2 Create `src/components/missing/MissingFilters.tsx` — generation multi-select, type select, and category select (All / Normal / Legendary / Mythical); reads/writes URL search params
- [x] 3.3 Create `src/components/missing/MissingSortControl.tsx` — dropdown for sort key (Dex / Name / Type / Generation); reads/writes URL search params
- [x] 3.4 Create `src/components/missing/NextUpBanner.tsx` — banner shown when `?nextup=N` is active; displays count, count selector (5/10/20/50), and updates URL on change
- [x] 3.5 Create `src/components/missing/MissingPokemonScreen.tsx` — main container: reads URL params, derives filtered+sorted `MissingEntry[]`, conditionally renders `NextUpBanner` or `MissingFilters`+`MissingSortControl`, renders card grid, renders empty state

## 4. Page Route

- [x] 4.1 Create `src/app/(pages)/missing/page.tsx` (or correct App Router path matching existing structure) — wraps `MissingPokemonScreen` in a `<Suspense>` boundary (required for `useSearchParams` in client components), sets page title/metadata

## 5. Navigation

- [x] 5.1 Add a "Missing" link to the sidebar navigation pointing to `/missing`
- [x] 5.2 Verify the missing count badge/link on the stats page (if present) also routes to `/missing`

## 6. Polish & Edge Cases

- [x] 6.1 Add sprite fallback placeholder (silhouette or grey box) when image fails to load in `MissingPokemonCard`
- [x] 6.2 Verify Quick Add for alternate forms passes the correct composite `formKey` to `toggleRegistered(pokemonId, formId)`
- [x] 6.3 Test that navigating to `/missing?gen=2&cat=legendary` pre-applies both filters on load
- [x] 6.4 Test that Next up mode (`?nextup=10`) hides filter controls and shows the banner
- [x] 6.5 Verify the list re-renders correctly after Quick Add removes a card (no layout shift or stale data)
