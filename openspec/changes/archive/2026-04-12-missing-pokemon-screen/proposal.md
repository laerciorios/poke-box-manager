## Why

The app already tracks which Pokémon are registered via `usePokedexStore`, but there is no dedicated screen for players to review and act on what's still missing. Without a focused missing list, players have no efficient way to identify gaps in their Pokédex or plan their next acquisition target.

## What Changes

- Add a new `/missing` route with a dedicated page component (`app/missing/page.tsx`)
- Build a `MissingPokemonList` view with sprite cards for every unregistered Pokémon
- Add filter controls: by generation, by type, by category (Normal / Legendary / Mythical)
- Add sort controls: by Dex number, by name, by type, by generation
- Add a **Quick Add** inline button per entry to mark a Pokémon as registered without leaving the page
- Add **"Next up" mode**: shows the next X missing Pokémon in dex order so players know their immediate target
- All data derives from `usePokedexStore.getMissingPokemon()` crossed with static Pokémon JSON; respects variation toggles and active generation filters already stored in `useSettingsStore`

## Capabilities

### New Capabilities

- `missing-pokemon-screen`: Dedicated page listing unregistered Pokémon with filters (generation, type, category), sort (dex, name, type, generation), Quick Add inline registration, and "Next up" mode for sequential dex targeting

### Modified Capabilities

<!-- No existing spec-level requirements change -->

## Impact

- **New route**: `app/(pages)/missing/page.tsx` (or equivalent App Router path)
- **New components**: `MissingPokemonScreen`, `MissingPokemonCard`, `MissingFilters`, `MissingSort`, `NextUpPanel`
- **Stores read**: `usePokedexStore` (missing list, markAsRegistered), `useSettingsStore` (variation toggles, active generations)
- **Static data**: `src/data/pokemon.json`, `src/data/types.json` — crossed at render time
- **No new dependencies**: filter/sort logic is pure TypeScript; UI uses existing shadcn/ui primitives
- Relates to spec section **3.6 Missing Pokémon**
