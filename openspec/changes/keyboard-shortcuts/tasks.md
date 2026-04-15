## 1. Foundation — Shortcut Provider & Input Guard

- [x] 1.1 Create `src/contexts/KeyboardShortcutContext.tsx` exporting `KeyboardShortcutProvider` and `useKeyboardShortcut` hook; attach a single `window keydown` listener with input guard (blocks when `<input>`, `<textarea>`, `<select>`, `[contenteditable]`, or `[data-no-shortcuts]` is focused)
- [x] 1.2 Create `src/contexts/ModalStackContext.tsx` exporting `ModalStackProvider` and `useModalStack` hook; implement LIFO push/pop API for close callbacks
- [x] 1.3 Add both providers to `src/components/layout/Providers.tsx` (wrap inside existing ThemeProvider + TooltipProvider)

## 2. Search Bar Refactor

- [x] 2.1 Create `src/contexts/SearchBarContext.tsx` exposing `inputRef` (a `RefObject<HTMLInputElement>`) so the shortcut provider can focus it programmatically
- [x] 2.2 Update `src/components/layout/SearchBar.tsx`: remove the local `window keydown` handler for `Cmd/Ctrl+K` and `Escape`; populate `SearchBarContext.inputRef` with the input's ref
- [x] 2.3 Register `Cmd/Ctrl+K` and `/` in `KeyboardShortcutProvider` to call `SearchBarContext.inputRef.current?.focus()` (with `e.preventDefault()`)
- [x] 2.4 Register `Escape` in `KeyboardShortcutProvider` to call `SearchBarContext.inputRef.current?.blur()` when the search bar is focused and has a value (matches existing Escape-clears-and-blurs behavior)

## 3. Box Navigation Refactor

- [x] 3.1 Remove the local `document.addEventListener('keydown', ...)` from `src/components/boxes/BoxNavigation.tsx`
- [x] 3.2 Accept an `onKeyboardPrev` / `onKeyboardNext` prop (or delegate via context) so the parent page can wire keyboard-triggered navigation; the visual component itself should be stateless re: keyboard

## 4. Slot Focus State & Arrow Navigation

- [x] 4.1 Create `src/hooks/useSlotFocus.ts` managing `focusedSlotIndex: number | null` and exposing `moveFocus(direction: 'up'|'down'|'left'|'right', totalBoxes, currentBoxIndex, onBoxChange)` — handles intra-grid movement and boundary box-wrap logic
- [x] 4.2 Add a `focusin` listener on `window` inside `useSlotFocus` that resets `focusedSlotIndex` to `null` when focus enters any text input
- [x] 4.3 Register arrow-key handlers in `KeyboardShortcutProvider` that call `moveFocus`; suppress when `dndContext.active` is non-null
- [x] 4.4 Update `BoxGrid` props interface: add `keyboardFocusIndex?: number | null`
- [x] 4.5 Update `BoxSlotCell`: apply keyboard focus ring styles (`ring-2 ring-primary outline-none`) when its index matches `keyboardFocusIndex`
- [x] 4.6 Wire `useSlotFocus` in the boxes page (`src/app/[locale]/boxes/page.tsx` or equivalent); pass `focusedSlotIndex` down to `BoxGrid`

## 5. Enter — Registration Toggle on Focused Slot

- [x] 5.1 Register `Enter` in `KeyboardShortcutProvider`; when Registration Mode is active and `focusedSlotIndex` is non-null and the slot is non-empty, call `usePokedexStore.toggleRegistered(pokemonId, formId)` for the focused slot

## 6. Escape — Modal Stack Integration

- [x] 6.1 Register `Escape` in `KeyboardShortcutProvider` (lower-priority than search-bar Escape): when `modalStack.length > 0`, call the top entry's `close()` callback
- [x] 6.2 Update the AutoFill confirmation dialog in `src/components/boxes/AutoFillButton.tsx` to push/pop its close callback to `ModalStackContext`
- [x] 6.3 Update the delete-box confirmation dialog in `src/components/boxes/BoxOverview.tsx` to push/pop its close callback
- [x] 6.4 Update the preset editor dialog in `src/components/presets/PresetEditor.tsx` to push/pop its close callback

## 7. "?" Help Overlay

- [x] 7.1 Create `src/components/layout/ShortcutHelpOverlay.tsx`: a shadcn `Dialog` listing all shortcuts in a two-column layout (key — description); `open` prop controlled externally
- [x] 7.2 Define the static shortcut registry array (key label + i18n message key) co-located in `KeyboardShortcutProvider` or a `src/lib/shortcuts.ts` file; use it as the source for both dispatch and the help overlay
- [x] 7.3 Add i18n translation keys under `ui` namespace in `src/messages/pt-BR.json` and `src/messages/en.json` for all shortcut descriptions (e.g., `shortcuts.navigateSlots`, `shortcuts.toggleRegistration`, `shortcuts.focusSearch`, `shortcuts.closePanel`, `shortcuts.showHelp`)
- [x] 7.4 Register `?` (Shift+/) in `KeyboardShortcutProvider` to toggle the help overlay open state

## 8. Validation & Cleanup

- [x] 8.1 Verify no duplicate `keydown` listeners exist (check that old handlers in `BoxNavigation` and `SearchBar` are fully removed)
- [x] 8.2 Manually verify all shortcuts work end-to-end: arrows, Enter, `/`, Escape, `?`
- [x] 8.3 Verify shortcuts are suppressed when typing in the box rename input, preset editor form, and search bar
- [x] 8.4 Verify the `?` overlay labels render correctly in both PT-BR and EN (switch language in settings and re-open overlay)
