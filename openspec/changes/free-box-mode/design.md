## Context

`useBoxStore` currently holds boxes generated once by preset autofill (`applyPreset` → `setBoxes`). After that single write, the only user action is toggling a slot's `registered` flag. There is no way to add or remove boxes, no way to place a Pokémon that wasn't assigned by the preset, and no slot-level manipulation beyond drag-and-drop reorder.

This change decouples the box layout from the preset after initial application. Presets become one-time templates; the resulting `Box[]` is fully owned and editable by the user going forward.

## Goals / Non-Goals

**Goals:**
- Let users add empty boxes (up to 200) and delete existing boxes at any time.
- Let users place any Pokémon or form in any slot via a picker dialog.
- Provide a slot-level context menu (right-click / long-press) with Change, Clear, and Move actions.
- Provide per-box actions: Clear box and Re-apply preset (with confirmation).
- Enforce the Pokémon Home 200-box maximum in the store.

**Non-Goals:**
- Overhauling the existing @dnd-kit drag-and-drop; it continues unchanged.
- Uniqueness enforcement across slots (same species can appear in multiple slots — matching real Pokémon Home behavior).
- Undo/redo history.
- Batch multi-slot selection or bulk move.
- Any backend or sync layer; all state remains in IndexedDB.

## Decisions

### 1. `addBox()` generates sequential "Box N" names automatically

`addBox()` takes no arguments. The name defaults to `"Box {boxes.length + 1}"` at call time. This is the lowest-friction path for the most common case (add a blank box and rename it later). Alternative considered: prompt for a name on creation — rejected because it interrupts the flow for the common case.

```ts
// in useBoxStore
addBox: () => {
  if (state.boxes.length >= 200) return;
  const name = `Box ${state.boxes.length + 1}`;
  const slots: (BoxSlot | null)[] = Array(BOX_SIZE).fill(null);
  set({ boxes: [...state.boxes, { id: uuid(), name, slots }] });
}
```

### 2. Pokémon picker is a modal `Dialog`

Opening "Change Pokémon" (from context menu) or clicking an empty slot opens a `PokemonPickerDialog`. It contains a search input and a virtualized/paginated sprite grid. Selecting a Pokémon calls `setSlot` with the chosen entry. Alternative considered: inline autocomplete — rejected because sprite-based browsing is the primary use pattern and needs more visual space.

### 3. Slot context menu via shadcn/ui `ContextMenu` + long-press

On desktop: native right-click via `<ContextMenu>` wrapping each `BoxSlotCell`. On mobile: 500 ms `pointerdown` timer that cancels on `pointermove` beyond a 5px threshold to avoid conflicting with scroll. The same `SlotContextMenu` component handles both surfaces, receiving slot data and action callbacks as props.

### 4. "Re-apply preset" reuses the existing `applyPreset` / `preset-engine.ts`

No new engine logic is required. The per-box action calls the same code path as `AutoFillButton`, then commits via `setBoxes`. It is guarded by an `AlertDialog` that warns the user their manual changes will be overwritten. Alternative considered: per-box re-apply that only regenerates the current box in isolation — rejected because the engine operates on the full Pokémon pool and produces a complete `Box[]`; partial regeneration would require significant new logic for unclear benefit.

### 5. "Move to…" is a two-step picker

Step 1: select a target box from a named list. Step 2: select a target slot from a mini 6×5 grid. On confirm, calls the existing `moveSlot(fromBoxId, fromIndex, toBoxId, toIndex)` which already implements swap semantics. No new store action needed.

### 6. 200-box guard lives in the store, not the UI

`addBox()` is a no-op when `boxes.length >= 200`. The "+" button in `BoxNavigation` queries `boxes.length` and is disabled (with a tooltip) when the limit is reached. Keeping the guard in the store ensures it holds regardless of how `addBox` is triggered.

## Risks / Trade-offs

| Risk | Mitigation |
|---|---|
| Long-press on mobile conflicts with native scroll | Cancel the timer on `pointermove` > 5px; use `touch-action: none` only on the slot cell, not the grid container |
| "Re-apply preset" irreversibly overwrites manual changes | `AlertDialog` confirmation required; no undo |
| IndexedDB grows with many filled boxes | 200 boxes × 30 slots × ~80 bytes ≈ 480 KB max — acceptable for IndexedDB |
| Pokémon picker renders 1000+ entries slowly | Virtualize the sprite grid with a fixed row-height approach or paginate by 60 per page |
| `addBox` sequential naming collides after deletes | Names are cosmetic only (IDs are UUIDs); "Box 5" after deleting box 3 is acceptable and consistent with Pokémon Home behavior |

## Migration Plan

All changes are additive or guarded by confirmation dialogs. No `Box` / `BoxSlot` type changes; IndexedDB schema version does not need bumping. Existing stored data loads and renders without modification. The `addBox()` action is new alongside existing CRUD. `setSlot` already exists without uniqueness constraints.

## Open Questions

- Should clicking an **occupied** slot in the default (non-drag) interaction open the picker or the context menu? (Proposal implies context menu; clicking empty slot → picker seems natural.) To be decided during implementation.
- Should the Pokémon picker show only base species, or also forms? If forms: respect the active `VariationToggles` from `useSettingsStore`.
