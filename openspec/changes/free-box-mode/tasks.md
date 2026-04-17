## 1. Store — addBox and 200-box limit

- [x] 1.1 Add `addBox(): void` action to `useBoxStore` that appends a blank box with sequential name `"Box {length + 1}"` and 30 null slots
- [x] 1.2 Add 200-box guard to `addBox` (no-op when `boxes.length >= 200`)
- [x] 1.3 Add 200-box guard to `setBoxes` (clamp to first 200 if result exceeds limit)
- [x] 1.4 Add i18n translation keys for default box name pattern (`"Box {n}"`) in `pt-BR` and `en`

## 2. BoxNavigation — add-box button

- [x] 2.1 Add "+" add-box button to `BoxNavigation` after the "next" arrow
- [x] 2.2 Wire "+" button to call `useBoxStore.addBox()` and navigate to the newly appended box index
- [x] 2.3 Disable "+" button when `boxes.length >= 200` and show a tooltip with the limit message
- [x] 2.4 Add translation keys for add-box button label and limit tooltip

## 3. PokemonPickerDialog

- [x] 3.1 Create `src/components/boxes/PokemonPickerDialog.tsx` as a shadcn/ui `Dialog` with a search input and sprite grid
- [x] 3.2 Load all `PokemonEntry` items from static JSON; filter by active `VariationToggles` from `useSettingsStore` to include/exclude forms
- [x] 3.3 Implement search filtering by name (case-insensitive) and dex number
- [x] 3.4 Call `onSelect(entry)` on sprite click and close the dialog; call `onClose` on Escape / backdrop click
- [x] 3.5 Auto-focus the search input when the dialog opens
- [x] 3.6 Add translation keys for picker placeholder, empty-state text, and close button

## 4. Empty-slot click to open picker

- [x] 4.1 In `BoxGrid`, add an `onClick` handler on `BoxSlotCell` that opens `PokemonPickerDialog` when `slot === null`
- [x] 4.2 On picker `onSelect`, call `useBoxStore.setSlot(boxId, slotIndex, { pokemonId, formId, registered: false })`

## 5. SlotContextMenu

- [x] 5.1 Create `src/components/boxes/SlotContextMenu.tsx` wrapping shadcn/ui `ContextMenu`
- [x] 5.2 Implement long-press (500 ms timer, cancel on pointer move > 5 px) that opens the same context menu on mobile
- [x] 5.3 For occupied slots: render "Change Pokémon", "Clear slot", and "Move to…" menu items
- [x] 5.4 For empty slots: render "Place Pokémon" menu item only
- [x] 5.5 "Change Pokémon" / "Place Pokémon" → open `PokemonPickerDialog` for that slot
- [x] 5.6 "Clear slot" → call `useBoxStore.clearSlot(boxId, slotIndex)` immediately
- [x] 5.7 Add translation keys for all context menu item labels

## 6. "Move to…" picker

- [x] 6.1 Create a `MoveToDialog` component: step 1 lists all boxes by name, step 2 shows a mini 6×5 slot grid for the chosen target box
- [x] 6.2 On target slot confirm, call `useBoxStore.moveSlot(fromBoxId, fromIndex, toBoxId, toIndex)` and close dialog
- [x] 6.3 Add translation keys for dialog title, step labels, and confirm/cancel buttons

## 7. BoxGrid — wrap slots in SlotContextMenu

- [x] 7.1 Wrap each `BoxSlotCell` in `SlotContextMenu` inside `BoxGrid`, passing `boxId`, `slotIndex`, and current slot data

## 8. Per-box action menu

- [x] 8.1 Add an overflow "⋯" menu button in the box view header (near `BoxNavigation` or box title)
- [x] 8.2 Add "Clear box" menu item that opens a confirmation `AlertDialog`; on confirm, call `clearSlot` for all 30 slots in the current box
- [x] 8.3 Add "Re-apply preset" menu item that opens a confirmation `AlertDialog`; on confirm, call `applyPreset` with the active preset and commit via `setBoxes`
- [x] 8.4 Disable "Re-apply preset" and show tooltip when no preset exists in `usePresetsStore`
- [x] 8.5 Add translation keys for menu labels, dialog titles, warning messages, and confirm/cancel buttons

## 9. Empty-state when no boxes exist

- [x] 9.1 In the box view, render an empty-state UI when `boxes.length === 0` prompting the user to add a box or apply a preset

## 10. Delete box

- [x] 10.1 Add "Delete box" item to the per-box overflow menu, guarded by a confirmation `AlertDialog`
- [x] 10.2 On confirm, call `useBoxStore.removeBox(boxId)` and update active box index (decrement if needed, clamp to 0)
- [x] 10.3 Add translation keys for delete confirmation dialog
