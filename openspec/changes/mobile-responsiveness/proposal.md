## Why

The app's core interactions — box navigation, slot registration, preset editing, and variation filtering — were designed for mouse and keyboard, leaving touch users with no swipe gestures, tap targets below the 44×44px minimum, and overlay UIs (dialogs, hover tooltips) that degrade badly on small screens. Polishing mobile UX unlocks the majority of Pokémon players who manage their boxes on phone (spec section 5.2).

## What Changes

- Add horizontal swipe gesture on the box grid area to navigate between boxes on touch devices
- Enforce minimum 44×44px tap targets on box slot cells at all mobile breakpoints
- Replace the hover-only `PokemonTooltip` with a tap-to-open-sheet pattern on touch devices (hover tooltip remains on desktop)
- Replace the `PresetEditor` Dialog with a Sheet on mobile viewports (`<768px`) for better small-screen ergonomics
- Add collapsible/accordion behavior to `VariationTogglesPanel` on mobile so the 12-toggle list doesn't dominate the screen
- Verify and document dnd-kit drag-and-drop compatibility on touch (PointerSensor already handles pointer events; confirm activation distance and visual feedback are adequate)

## Capabilities

### New Capabilities

- `box-swipe-navigation`: Touch swipe gesture (horizontal) on the box view triggers previous/next box navigation; includes swipe velocity threshold and visual swipe indicator

### Modified Capabilities

- `box-grid`: Enforce minimum 44×44px tap target on slot cells at `<768px`; current `w-[336px]` grid produces ~52px slots but this must be a guaranteed spec-level floor
- `pokemon-tooltip`: On touch devices (pointer: coarse), tooltip hover SHALL be suppressed; a tap on a slot SHALL open the `PokemonCard` sheet directly
- `preset-editor`: On `<768px` viewports, the `PresetEditor` SHALL render as a bottom Sheet instead of a centered Dialog, with full-height scrollable rule list
- `variation-toggles-panel`: On `<768px` viewports, the toggle list SHALL be rendered inside a collapsible accordion (collapsed by default); user can expand to access individual toggles

## Impact

- New component: `SwipeNavigationWrapper` (wraps box view, detects horizontal swipe via pointer events)
- Modified components: `BoxSlotCell` (tap-target sizing), `BoxGrid` (minimum slot dimension guarantee), `PokemonTooltip` (pointer-type detection), `PresetEditor` (responsive Dialog→Sheet), `VariationTogglesPanel` (collapsible on mobile)
- New hook: `useSwipeGesture` (pointer-event-based swipe detection, no new dependencies)
- No new npm dependencies — native Pointer Events API for swipe, CSS media query `(pointer: coarse)` for touch detection
- No data model or store changes
