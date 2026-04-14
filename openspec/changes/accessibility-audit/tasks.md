## 1. ARIA Landmark and Shared Infrastructure

- [ ] 1.1 Add `<main>` landmark wrapper to the root layout (`src/app/layout.tsx` or per-page)
- [ ] 1.2 Add `aria-label="Main navigation"` (i18n key) to the `<nav>` element in the Sidebar component
- [ ] 1.3 Create a shared `Announcer` component (single `aria-live="polite" aria-atomic="true"` region) and mount it in the root layout
- [ ] 1.4 Create a `useAnnounce(message: string)` hook backed by React context that writes to the `Announcer` region
- [ ] 1.5 Add `accessibility` namespace to `en` and `pt-BR` message files with all announcement and ARIA label strings

## 2. BoxSlotCell — ARIA Attributes and Keyboard Activation

- [ ] 2.1 Add `role="gridcell"` to the `BoxSlotCell` root element
- [ ] 2.2 Derive and set `aria-label` on each slot based on state: `"<Name>, registered"` / `"<Name>, not registered"` / `"Empty slot"` using i18n strings
- [ ] 2.3 Add `aria-selected` to reflect selection state (true/false) when in Registration Mode
- [ ] 2.4 Add `aria-roledescription="draggable"` (i18n) to non-empty draggable slots
- [ ] 2.5 Verify that existing Enter/Space keyboard handler on `BoxSlotCell` fires `onClick` correctly (add if missing)

## 3. BoxGrid — Roving Tabindex Navigation

- [ ] 3.1 Add `role="grid"` and `aria-label` (box name, i18n) to the `BoxGrid` container element
- [ ] 3.2 Implement roving tabindex state in `BoxGrid`: track `activeIndex`, set `tabIndex={0}` on the active slot and `tabIndex={-1}` on all others
- [ ] 3.3 Add `onKeyDown` handler on the grid container for ArrowRight, ArrowLeft, ArrowDown, ArrowUp — move `activeIndex` and programmatically focus the new slot
- [ ] 3.4 Clamp arrow navigation at grid boundaries (no wrap-around)
- [ ] 3.5 Persist the last active slot index across focus-out / focus-in cycles (via `useRef`)

## 4. Drag-and-Drop Keyboard Support and Announcements

- [ ] 4.1 Add `KeyboardSensor` from `@dnd-kit/core` to the `sensors` array in `DndContext` (alongside existing `PointerSensor`)
- [ ] 4.2 Configure `KeyboardCoordinateGetter` to map arrow keys to adjacent slot positions within the grid
- [ ] 4.3 Implement the `accessibility.announcements` object on `DndContext` with i18n strings for `onDragStart`, `onDragOver`, `onDragEnd`, and `onDragCancel`
- [ ] 4.4 Apply `motion-reduce:transition-none` (or equivalent) to the `DragOverlay` animation classes

## 5. Registration Mode — Screen Reader Announcements

- [ ] 5.1 Call `useAnnounce` after a single registration toggle (registered: `"<Name> registered"`, unregistered: `"<Name> unregistered"`)
- [ ] 5.2 Call `useAnnounce` after a bulk registration action with count string (`"N Pokémon registered/unregistered"`)
- [ ] 5.3 Add `aria-pressed` (true/false) and descriptive `aria-label` to the Registration Mode toggle button
- [ ] 5.4 Add `role="toolbar"` or appropriate role to the floating action bar (bulk actions)

## 6. Sheet/Modal Focus Management

- [ ] 6.1 Audit each Sheet/Dialog trigger site; store trigger ref and pass it to `onCloseAutoFocus` to restore focus
- [ ] 6.2 Verify `BoxMetadataEdit` Sheet: focus enters first input on open, returns to trigger on close
- [ ] 6.3 Verify `PresetEditor` Sheet: focus enters first input on open, returns to trigger on close
- [ ] 6.4 Verify `Settings` Sheet/Dialog: focus trap active, Escape closes and restores focus
- [ ] 6.5 Ensure every Sheet has `aria-labelledby` pointing to its visible heading element

## 7. WCAG AA Contrast Audit and Fixes

- [ ] 7.1 List all `--color-*` tokens from `globals.css` (or Tailwind CSS 4 theme config) for both light and dark themes
- [ ] 7.2 Calculate contrast ratios for each text token against its background counterpart (use WCAG 2 formula)
- [ ] 7.3 Fix any token pairs that fail 4.5:1 for normal text or 3:1 for large text / UI components
- [ ] 7.4 Verify `--muted-foreground` in both themes meets 4.5:1 (commonly failing token)
- [ ] 7.5 Verify the green registration indicator meets 3:1 against the slot cell background in both themes
- [ ] 7.6 Verify focus ring (`--ring`) token meets 3:1 against adjacent background in both themes

## 8. prefers-reduced-motion Integration

- [ ] 8.1 Audit all `transition-*`, `duration-*`, and `animate-*` classes in component files; add `motion-reduce:transition-none motion-reduce:duration-0` to each
- [ ] 8.2 Add `motion-reduce:animate-none` to any shimmer/pulse loading skeleton classes
- [ ] 8.3 Add `motion-reduce:transition-none` to sidebar open/close animation classes
- [ ] 8.4 Add `motion-reduce:transition-none` to Sheet open/close animation classes

## 9. Touch Target Audit

- [ ] 9.1 Identify any interactive elements with a hit area smaller than 44×44px on mobile breakpoints
- [ ] 9.2 Apply `min-h-[44px] min-w-[44px]` (or equivalent padding) to any failing elements
