## Why

The `/pokedex` route already exists but is a stub — it renders only a title and subtitle. Players have no way to browse the full National Dex in a structured list view, see which Pokémon they have or haven't registered at a glance, or drill into details without first finding the Pokémon in a box. A full Pokédex list page is a core navigation surface that complements the box-centric main view, referenced as a planned feature in the spec's file-tree (PokedexTable, PokedexFilters, PokedexSearch) and flagged in the roadmap as "full Pokédex view".

## What Changes

- Replace the pokedex stub page with a fully functional Pokédex list view
- Build a virtualized table of all Pokémon (base entries + visible forms) showing: sprite, dex number, name, types, generation, category, and registration status
- Add column sorting: by dex number, name, type, generation
- Add filter controls: by generation, type, category (Normal / Legendary / Mythical / etc.)
- Add a local search input for quick name/number filtering within the page
- Inline registration toggle per row (click status pill to toggle registered/missing)
- Row click opens the existing `PokemonCard` Sheet side panel
- Variation toggles from `useSettingsStore` control which alternate forms appear as additional rows
- Filter and sort state reflected in URL search params

## Capabilities

### New Capabilities

- `pokedex-page`: Full Pokédex list page with virtualized table, column sort, generation/type/category filters, inline search, inline registration toggle, and PokemonCard side panel on row click

### Modified Capabilities

<!-- No existing spec-level requirements change -->

## Impact

- **Modified**: `src/app/[locale]/pokedex/page.tsx` — replace stub with full page component
- **New components**: `PokedexTable`, `PokedexFilters`, `PokedexSearch`, `PokedexRow`, `PokedexSortHeader`
- **New lib**: `src/lib/pokedex-rows.ts` — builds the flat row list (base + form rows) respecting variation toggles
- **New dependency**: `@tanstack/react-virtual` for row virtualization (list can exceed 1 000 rows when all forms enabled)
- **Stores read**: `usePokedexStore` (registered list), `useSettingsStore` (variations, activeGenerations, locale)
- **Store write**: `usePokedexStore.toggleRegistered()` from inline row action
- **Existing component reused**: `PokemonCard` (Sheet side panel) — no changes needed
- Relates to spec section **3.1** (box visualization context), file-tree entries `PokedexTable.tsx`, `PokedexFilters.tsx`, `PokedexSearch.tsx`, and roadmap item "full Pokédex view"
