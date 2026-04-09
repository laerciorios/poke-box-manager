## Context

All three stores involved are implemented and persisting to IndexedDB:
- `useBoxStore` — holds the `Box[]` layout; each `BoxSlot` has a `registered: boolean` field
- `usePokedexStore` — holds a flat `string[]` of composite registration keys (`"25"` or `"25:pikachu-gmax"`)
- `usePresetsStore` — holds `OrganizationPreset[]` with `rules: PresetRule[]`

`BoxSlotCell` already renders registered/missing states and accepts an `onClick` prop — but nothing calls `toggleRegistered` on click yet. The box grid (`BoxGrid.tsx`, `BoxOverview.tsx`) renders slots but has no selection or mode state.

## Goals / Non-Goals

**Goals:**
- Enable click-to-register on individual slots when Registration Mode is active
- Support Shift+Click range selection and Ctrl/Cmd+Click multi-select within a box
- Floating action bar for bulk mark/unmark of selected slots
- Preset engine that converts `OrganizationPreset` rules + static data + current settings into a `Box[]` layout
- Auto-fill button with a confirmation guard when existing box data would be overwritten

**Non-Goals:**
- Drag-and-drop reordering (separate concern, `@dnd-kit` integration deferred)
- Pokémon detail view on slot click when Registration Mode is off (future change)
- Undo/redo history (spec section mentions action log, deferred)
- Keyboard navigation shortcuts (Enter to toggle, arrow keys — deferred to a dedicated keyboard-nav change)

## Decisions

### 1. Registration source of truth: `usePokedexStore` drives `BoxSlot.registered`

**Decision**: `usePokedexStore` is the single source of truth. When registering/unregistering a slot, update `usePokedexStore` via `toggleRegistered` (or `registerAll`/`unregisterAll` for bulk). `BoxSlot.registered` in `useBoxStore` is **derived**: when building the `BoxGrid`, each slot's `registered` flag is resolved by calling `isRegistered(slot.pokemonId, slot.formId)` at render time.

For `auto-fill`, generated `BoxSlot` objects always have `registered` derived from the current pokedex store state, so no separate sync is needed.

**Rationale**: Having two independent `registered` booleans (one in the box slot, one in the pokedex store) would diverge silently. Deriving from the pokedex store keeps them always in sync, regardless of how the user makes changes (via the UI, via bulk import, etc.).

**Alternative considered**: Keep `BoxSlot.registered` as the source of truth and sync to pokedex store as a side effect. Rejected — box layout can be replaced by auto-fill, which would clobber registration state.

**Implication for `BoxSlot.registered`**: The field remains in the type for serialization compatibility, but at render time `BoxGrid` will override it with `isRegistered(...)`. The stored value in `useBoxStore` can be considered a cache and may diverge from pokedex state in edge cases (acceptable, as rendering always reads the live store).

### 2. Selection state: local component state, not a store

**Decision**: The set of currently-selected slot keys is held in a `useState` inside `BoxGrid` (or a `useRegistrationMode` custom hook). It is **not** persisted to IndexedDB.

**Rationale**: Selection is ephemeral UI state — it resets naturally on navigation or refresh, which is the expected behavior. Storing it in Zustand would add accidental complexity and persistence overhead with no user benefit.

```ts
// useRegistrationMode.ts (shape)
interface RegistrationModeState {
  isActive: boolean
  selectedKeys: Set<string>          // "boxId:slotIndex"
  lastClickedKey: string | null      // for Shift+Click range anchor
  toggleMode: () => void
  handleSlotClick: (boxId: string, slotIndex: number, event: React.MouseEvent) => void
  markSelected: (registered: boolean) => void
  clearSelection: () => void
}
```

### 3. Shift+Click range selection: within a single box only

**Decision**: Range selection (Shift+Click) is scoped to slots within the **same box**. The range is computed from `lastClickedKey` (the anchor) to the newly clicked slot, filling in all slots with non-null `BoxSlot` values between them.

**Rationale**: Cross-box range selection requires a global slot index, which adds complexity for an edge case users rarely need. Pokémon Home itself does not support cross-box range selection.

**Range algorithm**:
```
slots = box.slots (array of 30)
anchorIndex = lastClickedIndex within box
targetIndex = newly clicked index
range = slots[min(anchor,target)..max(anchor,target)]
  .filter(slot => slot !== null)
  .map(slot => "boxId:slotIndex")
```

### 4. Preset engine: pure function, no store dependency

**Decision**: `src/lib/preset-engine.ts` exports a pure function:
```ts
function applyPreset(
  preset: OrganizationPreset,
  allPokemon: PokemonEntry[],
  allForms: Record<string, PokemonForm>,
  variations: VariationToggles,
  registeredKeys: Set<string>,
): Box[]
```

It takes all inputs as arguments and returns `Box[]`. It does **not** import from any Zustand store.

**Rationale**: Pure functions are trivially testable and have no side effects. The calling component (auto-fill button handler) is responsible for reading from stores and calling `useBoxStore.setBoxes()`.

**Rule evaluation order**: Rules are processed in `PresetRule.order` order. Each rule defines a filter + sort. Pokémon matching a rule are removed from the remaining pool before the next rule runs. The last rule implicitly catches "remaining" Pokémon if its filter is permissive.

**Box name templates**: Supported variables: `{n}` (1-based box number within the rule group), `{start}` (first Pokémon dex number in box), `{end}` (last Pokémon dex number in box), `{gen}` (generation number from first Pokémon).

### 5. Auto-fill confirmation: shadcn/ui AlertDialog

**Decision**: Use `AlertDialog` (already available via shadcn/ui) rather than a custom modal.

**Trigger condition**: Show the confirmation only when `useBoxStore.boxes` has at least one non-empty slot. If all boxes are empty (or no boxes exist), proceed directly.

## Risks / Trade-offs

- **`BoxSlot.registered` drift** — After auto-fill, slots reflect the pokedex state at the moment of fill. If the user then registers via the pokedex store (not the box UI), slots won't visually update until `BoxGrid` re-renders (which it will, since it reads from the live store). ✓
- **Preset engine performance on large Pokédex** — ~1,000 base Pokémon + up to ~600 forms = ~1,600 entries to filter and sort. All in-memory JS with simple comparators; no async needed. Worst-case is ~5ms. ✓
- **`other` formType slots** — 211 forms carry `formType: 'other'`. The preset engine includes them when the matching rule's `PokemonFilter` doesn't exclude them. This is intentional — these forms (like alternate formes) are part of some preset layouts.
- **No undo for auto-fill** — Replacing all boxes is destructive. The confirmation dialog is the only guard. Action history (spec section mentions undo log) is deferred.

## Migration Plan

No data migration. Both stores already exist with the correct shape. New components and utility are additive. The only behavioral change is that clicking a slot now calls `toggleRegistered` when Registration Mode is active — previously, clicks had no effect beyond the existing `onClick` prop stub.

## Open Questions

- Should `BoxGrid` re-derive `registered` on every render, or should the auto-fill handler write the correct `registered` value into `BoxSlot` at fill time and then keep both in sync? (Current decision: derive at render. Revisit if perf becomes an issue.)
- Built-in presets (National Dex, Legends First, etc.) — are they seeded into `usePresetsStore` on first load, or are they hardcoded constants that bypass the store? Lean toward hardcoded constants (no need to persist what can't be deleted) with the store holding only user-created presets.
