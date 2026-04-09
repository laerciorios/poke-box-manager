## Why

The box grid (`BoxSlotCell`) already renders a registered/missing visual state, and the stores (`usePokedexStore`, `useBoxStore`) already support single and bulk registration operations — but nothing connects them to user input. Without this layer, users cannot actually mark Pokémon as registered, which makes the entire app non-functional for its core use case: tracking a living dex. This change wires up the full registration UX (spec section 3.1) in one cohesive step, including the auto-fill mechanism that makes initial setup fast.

## What Changes

- **New**: Single-click toggle on any box slot when Registration Mode is active marks/unmarks that slot as registered and syncs with `usePokedexStore`.
- **New**: "Registration Mode" toggle button in the box view header; when off, clicks on slots do nothing (or open a detail view in a future change).
- **New**: Multi-select interactions — Shift+Click for contiguous range selection within a box, Ctrl+Click (Cmd+Click on macOS) for individual multi-select.
- **New**: Floating action bar that appears when one or more slots are selected, with "Mark X as registered" and "Unmark X" bulk actions.
- **New**: Preset engine utility (`src/lib/preset-engine.ts`) that evaluates an `OrganizationPreset`'s rules against static Pokémon data and active `VariationToggles` to produce a full `Box[]` layout.
- **New**: "Auto-fill" button in the box view that applies the currently selected preset via the engine and commits the result to `useBoxStore`, with each slot's `registered` flag derived from the current `usePokedexStore` state.
- **New**: Confirmation dialog before auto-fill when boxes already contain data, warning that the current layout will be replaced.

## Capabilities

### New Capabilities

- `registration-mode`: UI layer for the box view — Registration Mode toggle, per-slot click-to-register, Shift+Click range selection, Ctrl+Click multi-select, and the floating action bar for bulk mark/unmark operations.
- `preset-autofill`: Preset engine utility + Auto-fill button UI that generates a `Box[]` layout from an `OrganizationPreset`, populates `useBoxStore`, and derives each slot's `registered` state from `usePokedexStore`. Includes the confirmation dialog.

### Modified Capabilities

<!-- No existing spec-level requirements change. The stores (usePokedexStore, useBoxStore, usePresetsStore) already expose all needed actions. This change adds the missing UI and computation layers. -->

## Impact

- `src/components/boxes/` — new `RegistrationModeToggle.tsx`, `FloatingActionBar.tsx`, updated `BoxGrid.tsx` and `BoxSlotCell.tsx` to handle selection state and registration callbacks
- `src/lib/preset-engine.ts` — new utility; imports `src/data/pokemon.json`, `src/data/forms.json`; depends on `VariationToggles` from settings store
- `src/stores/usePokedexStore.ts` — consumed (read + write); no store API changes required
- `src/stores/useBoxStore.ts` — `setBoxes` consumed for auto-fill; no store API changes required
- `src/stores/usePresetsStore.ts` — `presets` list read to populate the preset selector; no store API changes required
- No new npm dependencies needed (`@dnd-kit` already present, shadcn/ui `Dialog` and `Button` already available)
