## Why

Boxes are currently locked to whatever layout a preset generates — users can register Pokémon but cannot freely rearrange, add, or remove boxes after the fact. This makes the tool feel rigid compared to real Pokémon Home, where players own their box layout completely and can have multiples of the same species.

## What Changes

- Presets become one-time templates: applying a preset populates boxes as before, but the result is fully editable going forward.
- Users can place **any** Pokémon (or form) in any slot via a picker — no uniqueness enforcement per slot.
- Users can **add** new empty boxes (up to the Pokémon Home limit of 200) and **delete** existing boxes.
- A "+" button after the last box lets users create a new blank "Box N" (sequential default name, renameable).
- Per-box actions: **Clear box** (empties all slots) and **Re-apply preset** (regenerates layout from the active preset, with a confirmation warning).
- Slot-level context menu (right-click / long-press): **Change Pokémon** (opens picker), **Clear slot**, **Move to…** (pick target box/slot). These complement existing drag-and-drop.

## Capabilities

### New Capabilities

- `free-slot-assignment`: Pokémon picker for placing any Pokémon (or form) in any slot; no uniqueness enforcement; supports search and browse.
- `add-remove-boxes`: Add/delete boxes independently of presets; enforce 200-box maximum; sequential default naming ("Box N").
- `slot-context-menu`: Right-click / long-press context menu on box slots with "Change Pokémon", "Clear slot", and "Move to…" actions.
- `per-box-actions`: "Clear box" and "Re-apply preset" actions on individual boxes, with confirmation dialog for destructive operations.

### Modified Capabilities

- `box-store`: Add `addBox()` action (no-arg, generates sequential name), enforce max 200 boxes, and ensure `setSlot` accepts any Pokémon without uniqueness checks.
- `preset-autofill`: `applyPreset` result is no longer the authoritative box state — it generates an initial layout that the user then owns. The re-apply action reuses this logic on demand.
- `box-navigation`: Add "+" button after the last box to trigger `addBox`. Show box count / limit indicator.
- `box-grid`: Expose slot context menu trigger on each `BoxSlotCell`.

## Impact

- **`src/stores/useBoxStore.ts`** — add `addBox()` (sequential naming, 200-box guard), verify `setSlot` is unconstrained.
- **`src/lib/box-engine/organizer.ts`** — no logic change; used by both preset autofill and the new re-apply action.
- **`src/components/boxes/BoxNavigation.tsx`** — add "+" button and box count display.
- **`src/components/boxes/BoxGrid.tsx`** — wire context menu into `BoxSlotCell`.
- **`src/components/boxes/BoxSlotCell.tsx`** — add right-click / long-press handler, render context menu.
- **New components**: `PokemonPickerDialog`, `SlotContextMenu`, `ClearBoxDialog`, `ReapplyPresetDialog`.
- **i18n**: New translation keys in `pt-BR` and `en` for all new UI strings.
- No changes to data pipeline, static JSON, or PokéAPI fetcher.
