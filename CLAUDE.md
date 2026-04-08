# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev              # Start Next.js dev server
npm run build            # Production build
npm run lint             # ESLint
npm run format           # Prettier (src/**/*.{ts,tsx,css,json})
npm run fetch-data       # Fetch Pokémon data from PokéAPI → src/data/*.json
npm run validate-data    # Validate generated data files
```

No test framework is used in this project.

## Architecture

**Offline-first Pokémon Home box manager** — a client-side Next.js 16 app with no backend. All user data persists in IndexedDB via Zustand stores. Pokémon data is fetched from PokéAPI at build time and stored as static JSON.

### Data Flow

1. **Build-time data pipeline**: `src/scripts/fetch-pokemon-data.ts` fetches PokéAPI in 7 stages, normalizes via `src/scripts/normalizers/`, outputs static JSON to `src/data/` (pokemon.json, forms.json, games.json, generations.json, evolution-chains.json, types.json). PokéAPI responses are cached in `.cache/`.
2. **Static imports**: App imports `src/data/*.json` directly — zero runtime API calls.
3. **User state**: Zustand stores (`src/stores/`) persist to IndexedDB via `src/lib/indexeddb-storage.ts` using the `createPersistedStore` helper in `src/lib/store.ts`.

### State Management

Four Zustand stores, all using `createPersistedStore` for IndexedDB persistence:

- **useBoxStore** — Box CRUD, slot management, move/reorder Pokémon (boxes are 6×5 grids = 30 slots, matching Pokémon Home)
- **usePokedexStore** — Track which Pokémon/forms are registered
- **useSettingsStore** — User preferences: variation toggles, active generations, theme, locale (pt-BR/en), sprite style
- **usePresetsStore** — Organization preset management

### Key Types

- `PokemonEntry` / `PokemonForm` — Core Pokémon data model with 17 form types and 6 categories
- `Box` / `BoxSlot` — Box grid model (`BOX_SIZE = 30`)
- `SettingsState` / `VariationToggles` — User preferences with defaults in `DEFAULT_SETTINGS`
- `OrganizationPreset` / `PresetRule` — Box organization rules

### UI Stack

- **Next.js 16** App Router with static generation
- **shadcn/ui** (base-nova style) + Tailwind CSS 4 — components in `src/components/ui/`, configured via `components.json`
- **Layout**: Sidebar navigation + Header, wrapped in `Providers` (ThemeProvider via next-themes)
- **Path alias**: `@/*` maps to `./src/*`
- Default locale is `pt-BR`, also supports `en`

### OpenSpec

The project uses OpenSpec for structured planning. Specs and archived changes live in `/openspec/`. The main specification document is at `openspec/specs/spec.md`.
