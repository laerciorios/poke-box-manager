## Why

Power users navigating large Pokémon box collections rely heavily on mouse interaction, making high-frequency actions like slot traversal, box switching, and registration toggling slow and repetitive. Keyboard shortcuts (spec section 4.7) would dramatically improve throughput for users organizing hundreds of Pokémon across many boxes.

## What Changes

- Add global keyboard shortcut manager that is aware of focus context (input fields, modals, sheets)
- Arrow keys (`↑ ↓ ← →`) navigate between slots within the focused box grid
- `Left` / `Right` (outside slot grid) navigate between boxes in the box list
- `Enter` toggles registration status on the currently focused slot
- `/` focuses the global search bar without triggering browser find-in-page
- `Escape` closes the topmost open modal, sheet, or side panel
- `?` opens a help overlay listing all available shortcuts
- Shortcuts are suppressed when focus is inside any text input, textarea, or contenteditable element

## Capabilities

### New Capabilities

- `keyboard-navigation`: Arrow-key slot navigation within a box grid and left/right box switching; includes focus indicator styling for the active slot
- `keyboard-shortcuts`: Global shortcut dispatcher, input-guard logic, `?` help overlay, and `/` search focus; registration toggle via `Enter` on focused slot

### Modified Capabilities

- `box-grid`: Add focusable slot cells and keyboard-driven focus state (visual focus ring, aria attributes)
- `box-navigation`: Extend with keyboard-triggered box switching (left/right arrow at box boundary or dedicated keys)
- `global-search-bar`: Accept programmatic focus triggered by `/` shortcut
- `registration-mode`: Support keyboard `Enter` to toggle registration on the focused slot

## Impact

- New components: `KeyboardShortcutProvider`, `ShortcutHelpOverlay`
- Modified components: `BoxGrid`, `BoxSlotCell`, `BoxNavigation`, `GlobalSearchBar`
- New hook: `useKeyboardShortcuts`, `useSlotFocus`
- No new dependencies required (native browser KeyboardEvent API)
- No backend or data model changes
