## Context

The app currently has scattered, independent keyboard handlers:
- `SearchBar.tsx` — `Cmd/Ctrl+K` focuses the search input, `Escape` blurs it
- `BoxNavigation.tsx` — `ArrowLeft`/`ArrowRight` navigates between boxes

These are registered directly on `window`/`document` inside individual components. There is no central shortcut registry, no input-guard, and no user-discoverable help. Adding more shortcuts naively risks duplicate listeners, conflicting keys, and handlers firing while the user types in a form.

New shortcuts to introduce (per spec §4.7):
- `ArrowUp/Down/Left/Right` — move focus between slots in the box grid
- `Enter` — toggle registration on focused slot
- `/` — focus global search bar
- `Escape` — close topmost modal/sheet/panel
- `?` — open shortcut help overlay
- Box-level left/right navigation already exists; it must be coordinated with grid slot focus (slot boundary behavior)

## Goals / Non-Goals

**Goals:**
- Central `KeyboardShortcutProvider` that owns all global shortcut logic in one place
- Input guard: shortcuts are suppressed when focus is inside `<input>`, `<textarea>`, `<select>`, `<[contenteditable]>`, or any element with `data-no-shortcuts`
- Visible slot focus indicator (keyboard focus ring) distinct from the existing selected/registration-mode highlight
- `?` help overlay listing all shortcuts, i18n-aware labels (PT-BR + EN)
- Migrate existing `SearchBar` `Cmd+K` and `BoxNavigation` arrow-key handlers into the central registry (or at least guard them with the same input-guard logic)
- No new npm dependencies — native `KeyboardEvent` API only

**Non-Goals:**
- Custom key rebinding / user-configurable shortcuts
- Mobile / touch device shortcuts
- Vim-style modal editing
- Shortcut support inside the preset editor or settings panels (those are forms — guard fires)

## Decisions

### 1. Central provider + context, not a global singleton

**Decision:** A `KeyboardShortcutProvider` React context component wraps the app (inside `Providers`). It owns the single `window keydown` listener and dispatches to registered handlers. Components opt in by calling `useRegisterShortcut(key, handler, deps)` or the provider reads a static shortcut map.

**Rationale:** Avoids multiple competing `window` listeners (current pattern). Makes it trivial to enable/disable the whole system (e.g., during drag-and-drop) and to enumerate all shortcuts for the help overlay. A singleton module would work too but is harder to test and doesn't follow React's data-flow.

**Alternative considered:** Keep per-component listeners but add a shared `isInputFocused()` guard utility. Rejected — doesn't solve the enumeration problem for the help overlay and makes ordering/priority hard.

### 2. Slot focus is React state, not DOM focus

**Decision:** Track `focusedSlotIndex: number | null` in a `useSlotFocus` hook that lives inside the box page. Arrow-key events update this index; `BoxGrid` receives it as a prop and renders the focus ring via a CSS class. The actual DOM `:focus` is not moved to the slot `<button>`.

**Rationale:** Moving real DOM focus to a grid cell conflicts with `@dnd-kit` (which manages tabIndex internally for sortable items) and triggers unwanted scroll behavior. A separate React-state focus model is simpler and lets us style it precisely.

**Alternative considered:** Make each slot a real focusable element and use `roving tabIndex`. Rejected because of the dnd-kit conflict and the performance cost of 30 focus-managed elements per box.

**Types:**
```typescript
interface SlotFocusState {
  focusedIndex: number | null  // 0–29, null = no slot focused
  setFocusedIndex: (i: number | null) => void
}
```

### 3. Escape uses a priority stack, not a global flag

**Decision:** A lightweight `useModalStack` context maintains a LIFO stack of `() => void` close callbacks. Dialogs and sheets push their close handler on mount and pop on unmount. The `Escape` shortcut calls `stack[top]()`.

**Rationale:** The app uses `@base-ui/react/dialog` which already handles `Escape` internally — but only for the element that has focus. When a shortcut key is pressed (not from inside the dialog), the base-ui handler doesn't fire. The explicit stack ensures the correct panel closes.

**Alternative considered:** Let `@base-ui/react/dialog` handle Escape natively and skip the stack. Works fine for mouse/keyboard-focused dialogs but breaks when the user presses Escape while focus is on the box grid. Rejected.

**Types:**
```typescript
interface ModalStackEntry {
  id: string
  close: () => void
}
```

### 4. `/` shortcut — intercept before browser find

**Decision:** In the `window keydown` listener, call `e.preventDefault()` on `/` when the input guard passes, then call `searchInputRef.current?.focus()`. The `SearchBar` exposes its `inputRef` via a context value (or forwarded ref on its wrapping component).

**Rationale:** Browsers open find-in-page on `/` in some configurations. `preventDefault` must happen inside the central listener before the event reaches the browser default. `Cmd+K` can remain as an alias since `SearchBar` already handles it.

### 5. Help overlay is a standard Dialog, not a portal

**Decision:** `ShortcutHelpOverlay` is a shadcn `Dialog` with `open` controlled by the `?` shortcut handler in the provider. The shortcut list is a static TypeScript array (key → i18n message key) co-located with the provider.

**Rationale:** Keeps the overlay in the React tree for theming/i18n. Static array is the single source of truth for both the dispatcher and the help UI — no drift.

## Risks / Trade-offs

- **dnd-kit conflict** → Arrow keys must be suppressed when a drag is in progress. `@dnd-kit` provides a `useDndContext().active` value — check it in the shortcut provider before processing arrow keys.
- **`@base-ui/react` Escape handling** → `@base-ui/react/dialog` already calls `e.stopPropagation()` on Escape for open dialogs. The central listener should check `modalStack.length > 0` only as a fallback; if base-ui closes the dialog first, the stack will already be empty. Test ordering carefully.
- **BoxNavigation migration** → `BoxNavigation.tsx` currently attaches its own `document.addEventListener` for ArrowLeft/ArrowRight. After this change, those keys are handled by the central provider and delegated to the box-navigation handler. The existing listener in `BoxNavigation` must be removed to avoid double-firing.
- **SearchBar Cmd+K migration** → Same: remove the `window` listener in `SearchBar.tsx` and register it in the central provider instead.
- **i18n of shortcut labels** — Key names themselves are not translated (they're always physical key symbols), but action descriptions are. Add shortcut label keys under the existing `ui` namespace in translation files.

## Migration Plan

1. Add `KeyboardShortcutProvider` and `ModalStackProvider` to `Providers.tsx` (no visible change yet)
2. Remove the `window keydown` listener from `SearchBar.tsx`; expose the input ref via context
3. Remove the `document keydown` listener from `BoxNavigation.tsx`; register its handler in the provider
4. Add slot focus state and arrow-key navigation to the boxes page
5. Add `Enter` registration toggle wired to `useRegistrationMode`
6. Add `/` search focus shortcut
7. Add `Escape` modal stack integration to Dialog/Sheet usages
8. Add `ShortcutHelpOverlay` and `?` shortcut
9. Add i18n keys and translations (PT-BR + EN)

No data migrations. No feature flags needed — ship as a single PR.

## Open Questions

- Should `ArrowLeft`/`ArrowRight` at the grid boundary automatically jump to the previous/next box, or only move within the current box? (Current BoxNavigation only navigates boxes with dedicated prev/next controls.) — *Proposed default: boundary wrap jumps to next/prev box, landing on slot 0 or slot 29.*
- Should `Enter` on an empty slot be a no-op, or should it open a Pokémon picker? — *Proposed default: no-op (no picker exists yet).*
