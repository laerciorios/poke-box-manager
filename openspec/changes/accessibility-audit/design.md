## Context

The app's interactive surfaces — box grid slots, drag-and-drop, sheets/modals, and sidebar navigation — were built without systematic accessibility support. Spec §5.4 requires full keyboard navigation, ARIA annotations, WCAG AA contrast, and `prefers-reduced-motion`. This design pass retrofits those requirements across the existing component tree without introducing new dependencies.

Current state:
- `BoxSlotCell` has a partial keyboard spec (Tab focus + Enter/Space) but no roving tabindex pattern for grid navigation
- `@dnd-kit` ships a `KeyboardSensor` and an `Announcements` API that are not yet wired up
- shadcn/ui `Sheet` components handle focus trapping natively via Radix UI primitives — but focus restore on close is not always exercised
- Theme color tokens use CSS custom properties in Tailwind CSS 4 — contrast has not been formally audited
- No `prefers-reduced-motion` integration exists

## Goals / Non-Goals

**Goals:**
- Arrow-key grid navigation (roving tabindex) within the 6×5 box grid
- `@dnd-kit` `KeyboardSensor` wired to `DndContext` with full `Announcements` callbacks
- Screen reader live region for registration toggle events
- ARIA role/label audit across `BoxSlotCell`, `BoxGrid`, `BoxNavigation`, sidebar, and Sheet modals
- WCAG AA contrast audit of all CSS custom property tokens in light and dark themes
- `prefers-reduced-motion` suppression for CSS transitions and DnD overlay animations
- Focus restore on Sheet/modal close

**Non-Goals:**
- WCAG AAA compliance (4.5:1 text is sufficient; AAA 7:1 is not targeted)
- Full E2E accessibility automation suite (manual audit + targeted unit tests only)
- Custom drag-and-drop via pointer events (keyboard DnD uses `@dnd-kit`'s built-in sensor)
- Touch target audit beyond flagging violations found in the contrast pass

## Decisions

### D1: Roving tabindex for box grid navigation

**Decision**: Implement roving tabindex on `BoxGrid` so only one slot at a time is in the tab order. Arrow keys move focus within the grid; Tab/Shift-Tab exits the grid.

**Alternatives considered**:
- *Tab through all 30 slots*: Unacceptable — adds 30 tab stops per box and is unusable in practice.
- *Grid role with `aria-activedescendant`*: More complex to implement; roving tabindex is simpler and equally correct for a bounded grid.

**Why roving tabindex**: Industry-standard pattern for composite widgets (APG Grid pattern). `@dnd-kit`'s `KeyboardSensor` also expects a focused element to initiate drag, so roving tabindex aligns naturally.

### D2: Use @dnd-kit's built-in KeyboardSensor and Announcements API

**Decision**: Wire `KeyboardSensor` (with default key mappings) to the existing `DndContext`. Provide an `Announcements` object with i18n-aware strings via `next-intl`'s `useTranslations`.

**Alternatives considered**:
- *Custom keyboard handler*: Duplicates logic already solved by `@dnd-kit`; maintenance burden.
- *Disable keyboard DnD*: Not compliant with WCAG 2.1 SC 2.1.1.

### D3: aria-live region for registration events via a shared context

**Decision**: Mount a single `<div aria-live="polite" aria-atomic="true">` in the root layout. Expose a `useAnnounce(message)` hook backed by a Zustand atom (or simple React context) to push messages to it from anywhere in the tree.

**Alternatives considered**:
- *Inline aria-live on each slot*: Creates many competing live regions; screen readers may suppress some.
- *Toast notifications*: Visual-only; does not guarantee SR announcement timing.

### D4: Theme contrast via CSS custom property audit + Tailwind `motion-safe`/`motion-reduce`

**Decision**: Audit all `--color-*` tokens in `src/app/globals.css` (or equivalent Tailwind CSS 4 config) for light and dark themes using the APCA / WCAG 2 formula. Fix failing tokens in-place. For motion, use Tailwind's `motion-reduce:` variant on transition classes rather than a global override.

**Alternatives considered**:
- *Runtime contrast check*: Adds JS overhead for a purely design-time concern.
- *Global `@media (prefers-reduced-motion)` override*: A single `* { transition: none }` override can break functional animations (e.g., accordion height). Per-class `motion-reduce:` is surgical.

### D5: Rely on Radix UI for Sheet/modal focus trap; add explicit focus restore

**Decision**: shadcn/ui `Sheet` and `Dialog` are built on Radix primitives that already implement focus trapping per WAI-ARIA. The gap is focus restore: ensure the element that triggered the open receives focus on close. Implement via a `ref` passed to the trigger element and a Radix `onCloseAutoFocus` callback.

**Alternatives considered**:
- *Custom focus trap library*: Radix already provides this; duplication.

## Risks / Trade-offs

- **[Risk] Roving tabindex conflicts with existing onClick handlers** → `onKeyDown` handler on the grid container intercepts arrow keys before they bubble; slot `onClick` is left unchanged.
- **[Risk] KeyboardSensor changes drag UX for mouse users** → `KeyboardSensor` is additive; pointer/mouse sensors remain unchanged.
- **[Risk] Contrast fixes change visual design** → Changes are constrained to tokens that fall below 4.5:1 for text (3:1 for UI). Present before/after values in the implementation PR for design review.
- **[Risk] i18n announcement strings add translation burden** → Strings are added to the existing `en` and `pt-BR` message files under a new `accessibility` namespace.

## Open Questions

- Are there any intentional low-contrast decorative elements that should be exempt from the contrast audit?
- Should keyboard-initiated drag-and-drop support cross-box moves (requires both boxes to be mounted in DOM simultaneously)?
