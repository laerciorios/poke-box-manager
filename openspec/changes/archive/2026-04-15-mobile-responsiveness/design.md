## Context

The app has partial mobile support today:
- `AppShell` already renders a bottom nav bar on `<md` and a hamburger Sheet on `md`–`lg`
- `BoxGrid` already applies `overflow-x-auto` and `max-md:-mx-4 max-md:px-4` on mobile
- `PokemonCard` detail already opens as a right-side Sheet on click
- `@dnd-kit/core` uses `PointerSensor` which handles touch pointer events natively

Key gaps being closed:
1. No swipe gesture for box-to-box navigation — users must tap arrow buttons
2. No guaranteed minimum tap-target size for slot cells
3. Hover tooltip pattern is invisible on touch (no `hover` events)
4. `PresetEditor` is a wide Dialog — unusable without horizontal scroll on narrow phones
5. `VariationTogglesPanel` renders 12 full-height toggle rows unconditionally, dominating mobile viewports

## Goals / Non-Goals

**Goals:**
- Swipe left/right on the box area to navigate between boxes on touch devices
- Guarantee minimum 44×44px tap target on every slot cell at `<768px`
- Detect touch/coarse-pointer devices and suppress hover tooltips; route taps directly to the detail sheet
- Render `PresetEditor` as a bottom Sheet (full-height, scrollable) on `<768px`
- Collapse `VariationTogglesPanel` into an accordion on `<768px`, expanded on demand
- No new npm dependencies

**Non-Goals:**
- Multi-finger gestures (pinch-zoom, two-finger scroll)
- Native mobile app (React Native / Capacitor)
- Custom swipe animations beyond a simple transition
- Replacing dnd-kit with a touch-only drag library

## Decisions

### 1. Swipe detection via Pointer Events, not a library

**Decision:** A `useSwipeGesture(ref, { onSwipeLeft, onSwipeRight, threshold })` hook tracks `pointerdown`, `pointermove`, and `pointerup` on the box container ref. A swipe is recognized when the horizontal delta exceeds a `threshold` (default 60px) and the gesture is more horizontal than vertical (aspect ratio guard).

**Rationale:** No new dependency. `PointerEvent` is supported in all modern mobile browsers. The hook is straightforward and can be unit-tested. The same `PointerSensor` approach is used by dnd-kit internally.

**Alternative considered:** `touchstart`/`touchend` events. Rejected — Pointer Events API supersedes Touch Events and is already the model used by dnd-kit.

**Alternative considered:** `@use-gesture/react` (React Spring ecosystem). Rejected — heavyweight, adds ~12KB, and the use-case here is simple directional swipe.

**Conflict with dnd-kit:** dnd-kit's `PointerSensor` also listens to pointer events. To avoid conflict, `useSwipeGesture` must check `dndContext.active` before recognizing a swipe (same guard used for keyboard shortcuts). If a drag is in progress, swipe recognition is suspended.

**Types:**
```typescript
interface SwipeGestureOptions {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  threshold?: number       // px, default 60
  velocityThreshold?: number  // px/ms, default 0.3
}
```

### 2. Touch device detection via CSS media query, not JS user-agent

**Decision:** Use the CSS media query `(pointer: coarse)` to detect touch/stylus primary input. In React, this is evaluated once at mount via `window.matchMedia('(pointer: coarse)').matches` inside `PokemonTooltip` and any other components that need to branch behavior.

**Rationale:** `pointer: coarse` correctly identifies touch screens and stylus-primary devices regardless of OS/browser. User-agent sniffing is fragile. `navigator.maxTouchPoints` is an alternative but less semantic.

**Alternative considered:** Zustand settings store flag `isTouchDevice`. Rejected — this is a capability detection, not a user preference. It doesn't need to survive sessions and shouldn't pollute the settings schema.

### 3. PresetEditor responsive rendering: same component, conditional `asChild` trigger

**Decision:** `PresetEditor` stays a single component but switches its container between `<Dialog>` (desktop) and `<Sheet side="bottom">` (mobile) based on a `useMediaQuery('(max-width: 767px)')` hook. Both `@base-ui/react/dialog` and the Sheet share the same trigger/close API, so the inner form content is extracted into `PresetEditorContent` and reused in both containers.

**Rationale:** Avoids duplicating the form logic. The `@base-ui/react` Dialog and Sheet components have the same `open`/`onOpenChange` API. The only thing that changes is the outer wrapper and some sizing classes.

**Alternative considered:** CSS-only approach using `max-h` and `overflow-y-auto` to make the Dialog scroll. Rejected — a Dialog on mobile still centers as a floating box, which doesn't fill the screen naturally and requires awkward scrolling. A bottom Sheet is the correct mobile affordance.

**Alternative considered:** Always use Sheet (even on desktop). Rejected — a wide Dialog at `max-w-2xl` is superior UX on desktop.

**Types:**
```typescript
// New hook
function useMediaQuery(query: string): boolean
```

### 4. VariationTogglesPanel collapsible: shadcn Collapsible, not Accordion

**Decision:** Wrap the panel's toggle list in a shadcn/ui `Collapsible` component (not `Accordion`) on mobile. Collapsed by default; a header row shows "Variation Filters (N active)" as the trigger. The collapsible is only active on `<768px`; on wider screens the full list is always visible.

**Rationale:** `Collapsible` is simpler than `Accordion` (no multi-panel state) and is already in the shadcn/ui component set. The "N active" summary in the trigger means users can see their filter state even when collapsed.

**Alternative considered:** Move variations to a Sheet triggered by a button. Rejected — adds a navigation layer; the collapsible keeps the toggles in-page and accessible.

### 5. Slot tap-target enforcement: CSS `min-w` / `min-h` + `touch-action`

**Decision:** Add `min-w-[44px] min-h-[44px]` to `BoxSlotCell`'s root element only at `<md` breakpoint (via `max-md:min-w-[44px] max-md:min-h-[44px]`). Also add `touch-action: manipulation` to suppress double-tap zoom and the 300ms tap delay.

**Rationale:** The current minimum slot at `w-[336px]` / 6 columns is ~52px — above 44px — but a CSS guarantee is more robust than a width calculation. `touch-action: manipulation` is the correct CSS property for interactive elements that need immediate tap response.

## Risks / Trade-offs

- **Swipe vs. dnd conflict** → Mitigated by `dndContext.active` guard. If a user starts a drag on mobile, swipe recognition pauses for the gesture lifetime.
- **Pointer Events on older Android WebView** → `PointerEvent` is supported since Chrome 55 (Android 6+). Not a concern for the target audience.
- **`useMediaQuery` SSR flash** → On server render, the hook can't know screen size; it defaults to `false` (desktop behavior). On mobile, there will be a one-frame flash where the Dialog renders before hydration switches to Sheet. Mitigation: default to `false` is acceptable; alternatively detect via CSS class with `suppressHydrationWarning` if flash is noticeable in testing.
- **PresetEditor Sheet height** → A bottom Sheet with many rules may need careful `max-h-[90dvh] overflow-y-auto` to avoid overflow on short-screen phones. Use `dvh` units (dynamic viewport height) to account for browser chrome.
- **dnd-kit drag on touch** → `PointerSensor` with `activationConstraint: { distance: 5 }` is the existing config. On touch, 5px is too sensitive (accidental drags on scroll). Consider raising to `distance: 8` or adding a `delay: 200` constraint for touch pointer type specifically — this is a non-spec discovery to document as an open question.

## Migration Plan

Ship as a single PR. All changes are additive (new classes, new wrappers, conditional rendering). No data migrations, no breaking changes. Feature can be verified on Chrome DevTools device emulation before testing on real hardware.

## Open Questions

- Should the swipe threshold be user-configurable in settings, or is 60px fixed? — *Proposed: fixed at 60px for now; revisit if user feedback indicates it's too sensitive.*
- Should dnd-kit's `PointerSensor` activation distance be tuned for touch? `distance: 5` may cause accidental drags during scroll on mobile. — *Proposed: increase to `distance: 8` and add `delay: 150` for touch input; verify empirically.*
- Should the collapsed `VariationTogglesPanel` state persist across sessions (via `useSettingsStore`) or reset to collapsed on every page load? — *Proposed: reset to collapsed on load; variations are not a frequent workflow on mobile.*
