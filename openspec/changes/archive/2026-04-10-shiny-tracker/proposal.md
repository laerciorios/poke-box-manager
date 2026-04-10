## Why

The app currently tracks only one registration state per Pokémon — whether the user has it or not. Competitive and collection-focused players often maintain a separate shiny living dex, which requires a second registration dimension. The existing codebase already has `BoxSlot.shiny` (cosmetic flag for showing a shiny sprite in a box slot) and `PokemonCard` already has a shiny sprite toggle, but neither connects to a registration concept. Spec section 4.1 defines Shiny Tracker Mode as a toggle-gated feature that adds "Shiny registered" as a parallel state.

## What Changes

- Add `shinyTrackerEnabled: boolean` to `SettingsState` with a toggle in the Settings page
- Add shiny registration to `usePokedexStore`: `registeredShiny: string[]` list using the same composite-key format as normal registration, plus `toggleShinyRegistered()`, `isShinyRegistered()`, `registerAllShiny()`, and `unregisterAllShiny()` actions
- In box view: when Shiny Tracker is enabled, slots whose Pokémon is shiny-registered show a ✦ sparkle overlay (distinct from `slot.shiny`, which is a display-only flag for which sprite to render)
- In `PokemonCard`: when Shiny Tracker is enabled, show a "Register Shiny" toggle button alongside the existing shiny sprite toggle, calling `toggleShinyRegistered()` 
- Stats dashboard: when Shiny Tracker is enabled, add a new "Shiny Progress" section showing shiny-registered count vs total, with a generation breakdown
- Quick-toggle shiny registration from box slot cell while in Registration Mode (same UX pattern as normal registration)

## Capabilities

### New Capabilities

- `shiny-tracker`: Opt-in mode that tracks "shiny registered" state per Pokémon independently of normal registration, with sparkle indicators in the box view, a "Register Shiny" action in PokemonCard, and a shiny progress section in the stats dashboard

### Modified Capabilities

- `pokedex-store`: Adds `registeredShiny: string[]`, `toggleShinyRegistered(id, formId?)`, `isShinyRegistered(id, formId?)`, `registerAllShiny(keys)`, and `unregisterAllShiny(keys)` to support shiny registration alongside normal registration
- `settings-store`: Adds `shinyTrackerEnabled: boolean` (default `false`) to `SettingsState` and `DEFAULT_SETTINGS`; bumps schema version with migration
- `stats-dashboard`: Adds a conditional shiny progress section (overall count + generation bars) rendered only when `shinyTrackerEnabled` is true
- `pokemon-detail-card`: `PokemonCard` gains a "Register Shiny" button visible only when `shinyTrackerEnabled` is true; the existing shiny sprite toggle is unchanged
- `box-slot-cell`: `BoxSlotCell` gains a ✦ sparkle overlay visible when `shinyTrackerEnabled` is true and the slot's Pokémon is shiny-registered

## Impact

- **Modified**: `src/types/settings.ts` — add `shinyTrackerEnabled: boolean`
- **Modified**: `src/stores/useSettingsStore.ts` — add `setShinyTrackerEnabled()` action; bump version; migration
- **Modified**: `src/stores/usePokedexStore.ts` — add `registeredShiny`, shiny registration actions; bump version; migration
- **Modified**: `src/components/boxes/BoxSlotCell.tsx` — add sparkle overlay conditional on shiny tracker + `isShinyRegistered`
- **Modified**: `src/components/pokemon/PokemonCard.tsx` — add "Register Shiny" button when tracker enabled
- **Modified**: `src/hooks/useStatsData.ts` + `src/components/stats/StatsClientPage.tsx` — shiny progress section
- **New component**: `src/components/stats/ShinyProgressSection.tsx`
- **New component**: `src/components/settings/ShinyTrackerPanel.tsx`
- No new npm dependencies
- Relates to spec section **4.1 Shiny Tracker Mode**
