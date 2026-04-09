## Why

The state management infrastructure (Zustand + persist helper) was set up in the previous change, but no domain stores exist yet. Without stores, the UI cannot track which Pokémon are registered, manage box layouts, apply user preferences, or handle organization presets. This change implements all four domain stores with IndexedDB persistence and schema versioning, enabling the core interactive features described in spec sections 2.3–2.5.

## What Changes

- Create `usePokedexStore` to track registered Pokémon with per-form granularity and bulk operations
- Create `useBoxStore` to manage box state (CRUD, slot assignment, reordering, preset application)
- Create `useSettingsStore` to manage user preferences (variation toggles, game filters, theme, locale, sprite style)
- Create `usePresetsStore` to manage organization presets (built-in + custom CRUD)
- Upgrade the persist helper in `src/lib/store.ts` to use IndexedDB storage adapter (via `idb-keyval`) instead of localStorage, supporting larger datasets
- Add schema versioning with a `version` field and `migrate` function per store for future-proof data migrations (spec section 2.4)

## Capabilities

### New Capabilities
- `pokedex-store`: Zustand store for tracking registered Pokémon, bulk toggle, and per-form registration state
- `box-store`: Zustand store for box CRUD, slot management, reordering, and preset-driven organization
- `settings-store`: Zustand store for user preferences with defaults from `DEFAULT_SETTINGS`
- `presets-store`: Zustand store for built-in and custom organization presets
- `indexeddb-persistence`: IndexedDB storage adapter and schema versioning infrastructure for all stores

### Modified Capabilities
- `state-management-setup`: The persist helper gains IndexedDB storage support and a versioned migration pattern

## Impact

- **New files**: `src/stores/usePokedexStore.ts`, `src/stores/useBoxStore.ts`, `src/stores/useSettingsStore.ts`, `src/stores/usePresetsStore.ts`, `src/lib/indexeddb-storage.ts`
- **Modified files**: `src/lib/store.ts` (add IndexedDB adapter + version/migrate options)
- **New dependency**: `idb-keyval` for lightweight IndexedDB access
- **Types consumed**: `PokemonEntry`, `PokemonForm`, `Box`, `BoxSlot`, `SettingsState`, `VariationToggles`, `OrganizationPreset`, `PresetRule` from `src/types/`
- **No breaking changes** — this is a net-new addition building on existing infrastructure
