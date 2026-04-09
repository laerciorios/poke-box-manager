## Why

Users need a rich detail view to inspect any Pokémon's full profile — types, forms, and evolution chain — without leaving the box or Pokédex context. Currently there is no expanded detail card or tooltip preview, leaving a core UX gap described in the `pokemon/` component directory.

## What Changes

- Add `PokemonCard` component — full-detail modal/panel with: name, national dex number, types, generation, category, all forms/variations, evolution chain, and shiny sprite toggle
- Add `PokemonTooltip` component — lightweight hover preview showing sprite, name, number, and types (triggers PokemonCard on click)
- Wire components so any slot in the box grid and any Pokédex row can trigger the tooltip/card

## Capabilities

### New Capabilities

- `pokemon-detail-card`: Expanded Pokémon detail card/modal with full profile info, form switcher, evolution chain display, and shiny toggle
- `pokemon-tooltip`: Hover preview tooltip for quick Pokémon summary, used across box slots and Pokédex rows

### Modified Capabilities

<!-- No existing spec-level requirements are changing -->

## Impact

- New components: `src/components/pokemon/PokemonCard.tsx`, `PokemonTooltip.tsx`
- Reads from static `src/data/pokemon.json`, `forms.json`, `evolution-chains.json`
- Consumes `useSettingsStore` for locale only
- Consumed by `BoxSlot.tsx` (tooltip on hover) and future Pokédex row
- No store schema changes required
