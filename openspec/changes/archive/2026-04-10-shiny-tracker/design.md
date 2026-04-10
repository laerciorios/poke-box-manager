## Context

The codebase already has two shiny-adjacent features that must be kept clearly distinct from the new shiny registration concept:

1. **`BoxSlot.shiny?: boolean`** — a display flag on a placed slot indicating the user has a shiny variant physically stored in that box slot. It controls which sprite renders in `BoxSlotCell` and is toggled via `useBoxStore.toggleShiny()`. This is about *what is displayed*, not *what is tracked*.
2. **`PokemonCard` shiny sprite toggle** — a local `isShiny` state that switches the card's sprite between normal and shiny. Cosmetic only; writes nothing to any store.

The new "shiny registered" concept is a **third, orthogonal axis** in `usePokedexStore`: has the user obtained a shiny of this Pokémon? It is stored entirely in the pokedex store, independent of whether any shiny variant is placed in a box.

Settings schema is currently at version 3 (after the export-import-system change bumped it). Pokedex store is at version 1.

## Goals / Non-Goals

**Goals:**
- A settings toggle (`shinyTrackerEnabled`) that gates all shiny-tracking UI
- `registeredShiny: string[]` in `usePokedexStore` with the same composite-key format as `registered`
- Sparkle overlay on `BoxSlotCell` when the slot's Pokémon is shiny-registered (regardless of `slot.shiny`)
- "Register Shiny" button in `PokemonCard` when tracker is enabled — calls `toggleShinyRegistered()`
- Shiny progress section in stats: overall donut/count + generation breakdown, visible only when tracker is enabled
- Quick-toggle shiny registration from box slot when in Registration Mode (same interaction model as normal registration toggle, but for shiny)

**Non-Goals:**
- Separate shiny box layout (shiny tracking is pokedex-level, not box-layout-level)
- Shiny form tracking with separate form-level shiny sprites (shiny is tracked at the species/form key level but not every form has a distinct shiny sprite in the data)
- Shiny stats by type (adds complexity without proportionate value)
- Bulk shiny registration (select-all-as-shiny)

## Decisions

### 1. Shiny registration keys use the identical format as normal registration

`usePokedexStore.registeredShiny` is a `string[]` of keys following the same `"pokemonId"` / `"pokemonId:formId"` format as `registered`. This means:

- `toggleShinyRegistered(25)` → key `"25"`
- `toggleShinyRegistered(25, "pikachu-gmax")` → key `"25:pikachu-gmax"`
- `isShinyRegistered(25)` → `registeredShiny.includes("25")`

Same helpers, same composite-key builder. The only new risk is that `registeredShiny` is a separate array — it never merges with `registered`.

**Why not a single `Record<string, {normal: bool, shiny: bool}>`?** That would require migrating the existing `registered: string[]` to a new shape, breaking all current serialisation. Two parallel arrays are additive and backward-compatible.

### 2. Pokedex store version bump: 1 → 2, migration adds empty `registeredShiny`

```ts
migrate: (persisted, fromVersion) => {
  if (fromVersion < 2) {
    (persisted as any).registeredShiny ??= []
  }
  return persisted
}
```

### 3. Settings store version bump: 3 → 4, migration adds `shinyTrackerEnabled: false`

Follows the same pattern as prior migrations.

### 4. Sparkle overlay in BoxSlotCell — prop-driven, no store access in cell

`BoxSlotCell` is presentational. The parent (box grid/page) is responsible for:
- Reading `shinyTrackerEnabled` from `useSettingsStore`
- Reading `usePokedexStore.registeredShiny` as a `Set<string>`
- Deriving `isShinyRegistered` per slot: `shinySet.has(makeKey(slot.pokemonId, slot.formId))`
- Passing `isShinyRegistered: boolean` as a prop to `BoxSlotCell`

`BoxSlotCell` renders a small ✦ (`Sparkles` icon from lucide-react — already imported) overlay in the top-right corner when `isShinyRegistered` is true. The sparkle is visually distinct from the `slot.shiny` shiny-sprite indicator (which is a bottom-right button/badge).

**Why a prop instead of store access in the cell?** `BoxSlotCell` is rendered 30 times per box. Deriving a `Set` once in the parent and doing O(1) prop lookups per cell is efficient. Accessing the store 30 times per render would trigger 30 separate subscriptions.

### 5. "Register Shiny" button in PokemonCard

When `shinyTrackerEnabled` is true, `PokemonCard` shows a second button below the existing shiny sprite toggle:

```
[ ✦ Shiny ]  ← existing sprite toggle (cosmetic, local state)
[ ✓ Register Shiny ] / [ + Register Shiny ]  ← new pokedex action
```

The button label changes based on `isShinyRegistered(pokemonId)`. Clicking it calls `toggleShinyRegistered(pokemonId, activeFormId)`.

`PokemonCard` already reads `useSettingsStore` (for locale). It will add reads of `shinyTrackerEnabled` and `usePokedexStore.isShinyRegistered`.

### 6. Shiny stats — extend `useStatsData`, add `ShinyProgressSection`

`useStatsData` gains a new return field:

```ts
shiny?: {
  overall: { registered: number; total: number; percentage: number }
  byGeneration: GenerationStat[]
}
```

`shiny` is `undefined` when `shinyTrackerEnabled` is false, so downstream components can gate on its presence.

The `total` for shiny stats is the same filtered total as normal stats — the denominator is how many Pokémon the user is tracking, not a separate "shinifiable" subset. Every tracked Pokémon theoretically has a shiny form.

`ShinyProgressSection` is a new component rendered in `StatsClientPage` below the existing sections, only when `shiny` is defined.

### 7. Quick-toggle from box slot in Registration Mode

When Registration Mode is active AND `shinyTrackerEnabled` is true, `BoxSlotCell` shows a second mini-button (✦ icon) for shiny registration next to the existing registration check. Tapping it calls `onShinyRegistrationToggle` — a new optional callback prop following the same pattern as the existing `onClick` for normal registration.

The parent box page wires this callback to `usePokedexStore.toggleShinyRegistered(slot.pokemonId, slot.formId)`.

### TypeScript additions

```ts
// usePokedexStore additions
interface PokedexState {
  // existing...
  registeredShiny: string[]
  toggleShinyRegistered: (pokemonId: number, formId?: string) => void
  isShinyRegistered: (pokemonId: number, formId?: string) => boolean
  registerAllShiny: (keys: string[]) => void
  unregisterAllShiny: (keys: string[]) => void
}

// useSettingsStore / SettingsState addition
shinyTrackerEnabled: boolean

// BoxSlotCellProps additions
isShinyRegistered?: boolean
onShinyRegistrationToggle?: (e: React.MouseEvent) => void
```

## Risks / Trade-offs

- **`BoxSlot.shiny` vs `isShinyRegistered` confusion** → Two different things named "shiny" on the same cell. Mitigation: clear visual differentiation (slot.shiny controls sprite; `isShinyRegistered` shows a static overlay badge, not a button unless in registration mode). Code-level naming must be explicit.
- **Stats denominator choice** → Using the same total as normal stats (all tracked Pokémon) means shiny % will always be low for most users. Alternative: only count Pokémon with a `spriteShiny` available. Chosen approach is simpler and consistent — document in the shiny section header that the denominator is the full tracked set.
- **Settings version bump dependency** → If `export-import-system` change is applied first (bumping settings to v3) before this change is applied, the migration here must start from v3, not v2. Mitigation: tasks document this dependency; migration checks `fromVersion < 4` regardless of intermediate states.
