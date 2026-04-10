## Why

The app currently has no way for users to visualize their Pokédex completion progress — a core motivator for managing boxes. Implementing the statistics dashboard (spec section 3.5) gives users meaningful feedback on how close they are to completing their Pokédex, broken down by generation, type, and box state.

## What Changes

- Add a `/stats` page route with a full statistics dashboard
- Implement overall completion donut/circular chart (e.g. 847/1025 — 82.6%)
- Implement progress bars per generation (Gen 1: 151/151, Gen 2: 89/100, etc.)
- Implement a type progress grid with percentage indicators per type
- Implement a box heatmap (green = complete, yellow = partial, red = empty)
- Add complete / partial / empty box counts summary
- All computations driven by `usePokedexStore`, `useBoxStore`, and `useSettingsStore` — no new data fetching
- Respect active variation toggles and generation filters from `useSettingsStore` when calculating totals

## Capabilities

### New Capabilities

- `stats-dashboard`: Statistics page with donut chart, generation progress bars, type grid, box heatmap, and box summary counts — all derived from existing stores

### Modified Capabilities

<!-- No existing capability requirements are changing -->

## Impact

- **New route**: `src/app/[locale]/stats/page.tsx`
- **New components**: `src/components/stats/` — chart components, heatmap, type grid, generation bars
- **Stores read (no writes)**: `usePokedexStore`, `useBoxStore`, `useSettingsStore`
- **New dependency**: `recharts` (or equivalent lightweight charting library) for donut chart and bar charts
- **Static data**: reads from `src/data/` (generations.json, types.json) to enumerate all possible Pokémon per gen/type
- **i18n**: new translation keys for stats labels in PT-BR and EN
- **Navigation**: add Stats entry to sidebar navigation
