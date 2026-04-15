## 1. Foundation — Utilities & Hooks

- [x] 1.1 Create `src/hooks/useMediaQuery.ts` — returns `boolean` for a given CSS media query string, evaluated at mount; defaults to `false` during SSR
- [x] 1.2 Create `src/hooks/useSwipeGesture.ts` — accepts a `ref` and `SwipeGestureOptions`; attaches `pointerdown`/`pointermove`/`pointerup` listeners, calls `setPointerCapture`, computes horizontal delta and aspect-ratio guard, fires `onSwipeLeft`/`onSwipeRight` when threshold is met; suppresses when `pointer: fine`

## 2. Box Swipe Navigation

- [x] 2.1 Add `useSwipeGesture` to the boxes page (`src/app/[locale]/boxes/page.tsx`) on the box view container ref, wiring `onSwipeLeft` → next box, `onSwipeRight` → previous box
- [x] 2.2 Guard swipe callbacks with `dndContext.active` check so active drag-and-drop suppresses swipe recognition
- [x] 2.3 Verify swipe does not interfere with horizontal grid overflow-scroll on very small viewports (swipe target should be the navigation area, not inside the scrollable grid)

## 3. Touch-Optimized Slot Tap Targets

- [x] 3.1 Add `max-md:min-w-[44px] max-md:min-h-[44px]` to the root element of `src/components/boxes/BoxSlotCell.tsx`
- [x] 3.2 Add `max-md:[touch-action:manipulation]` (or a Tailwind arbitrary class) to the `BoxGrid` container div in `src/components/boxes/BoxGrid.tsx` to suppress double-tap zoom and the 300ms tap delay

## 4. PokemonTooltip — Touch Device Behavior

- [x] 4.1 In `src/components/pokemon/PokemonTooltip.tsx`, detect coarse pointer at mount: `const isTouch = window.matchMedia('(pointer: coarse)').matches`
- [x] 4.2 Conditionally disable the hover tooltip wrapper when `isTouch` is true — render children directly without `HoverCard` / tooltip wrapper
- [x] 4.3 Ensure the `onClick` → `PokemonCard` sheet path works for tap events when the tooltip is disabled (the tap handler must still be present on the children wrapper)
- [x] 4.4 Verify that on desktop (pointer: fine), existing hover tooltip and click-to-sheet behavior is unchanged

## 5. PresetEditor — Responsive Dialog → Sheet

- [x] 5.1 Extract the inner form content of `src/components/presets/PresetEditor.tsx` into a `PresetEditorContent` sub-component (name input, "Start from" select, rule list, action buttons)
- [x] 5.2 Use `useMediaQuery('(max-width: 767px)')` to select the container: render `<Dialog>` on desktop, `<Sheet side="bottom">` on mobile
- [x] 5.3 Apply `max-h-[90dvh] overflow-y-auto` to the Sheet content wrapper so the rule list scrolls within the sheet
- [x] 5.4 Verify the "Save", "Cancel", and validation-hint behavior is identical in both containers

## 6. VariationTogglesPanel — Collapsible on Mobile

- [x] 6.1 Add the shadcn/ui `Collapsible` component if not already present (`npx shadcn@latest add collapsible`)
- [x] 6.2 In `src/components/settings/VariationTogglesPanel.tsx`, wrap the 12-toggle list in `<Collapsible>` when `useMediaQuery('(max-width: 767px)')` is true
- [x] 6.3 Set the collapsible trigger label to "Variation Filters (N active)" where N is derived from the current `useSettingsStore` variation state
- [x] 6.4 Default collapsible `open` to `false` on mobile (collapsed on mount)
- [x] 6.5 Ensure the live total summary section renders outside the collapsible so it remains visible when the list is collapsed

## 7. dnd-kit Touch Validation

- [x] 7.1 In `src/app/[locale]/boxes/page.tsx`, review the `PointerSensor` activation constraint; increase `distance` from 5 to 8 and add `delay: 150` for touch pointer type to reduce accidental drag triggers during scroll
- [x] 7.2 Manually test drag-and-drop on Chrome DevTools touch emulation: verify a slot can be picked up and dropped in a new position without triggering swipe navigation

## 8. Validation & QA Checklist

- [x] 8.1 Test all flows on Chrome DevTools device emulation (375px — iPhone SE, 390px — iPhone 14, 768px — iPad Mini) — registration, box navigation via swipe, preset editor sheet, variation toggles accordion
- [x] 8.2 Verify no horizontal overflow on 375px viewport (grid scrolls within its container, page does not overflow)
- [x] 8.3 Confirm PokemonCard detail sheet opens on slot tap on touch emulation and hover tooltip is suppressed
- [x] 8.4 Confirm bottom navigation bar shows correct active state for all 4 main routes on mobile
- [x] 8.5 Verify `ShortcutHelpOverlay` (from keyboard-shortcuts change) is not triggered accidentally on touch (the `?` shortcut should be guarded by input context)
