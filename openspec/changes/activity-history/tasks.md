## 1. Types

- [ ] 1.1 Create `src/types/history.ts` with `ActionType` union, `UndoPayload` discriminated union, and `ActivityEntry` interface

## 2. Description Helper

- [ ] 2.1 Create `src/lib/history-descriptions.ts` with `buildDescription(actionType, payload, locale)` — covers all 7 action types; for `register`/`unregister` include the Pokémon key; for bulk actions include the count; for `preset-apply` use a generic label

## 3. History Store

- [ ] 3.1 Create `src/stores/useHistoryStore.ts` with `entries: ActivityEntry[]`, `pushEntry`, `undoLast`, `clearHistory` actions
- [ ] 3.2 Implement cap enforcement in `pushEntry`: slice to last 99 entries before prepending (ensuring array never exceeds 100)
- [ ] 3.3 Implement `undoLast`: switch on `undoPayload.type`, dispatch inverse to the target store via `getState()`, then remove `entries[0]`
- [ ] 3.4 Ensure `undoLast` is a no-op (no throw) when `entries` is empty
- [ ] 3.5 Persist store to IndexedDB via `createPersistedStore` with store name `"history"` and schema version `1`

## 4. Pokedex Store Integration

- [ ] 4.1 In `toggleRegistered`: read current registration state before mutation, push `'register'` or `'unregister'` entry after mutation with the affected key
- [ ] 4.2 In `registerAll`: compute net-new keys (keys not already registered), push `'bulk-register'` entry only if net-new keys is non-empty
- [ ] 4.3 In `unregisterAll`: compute actually-registered keys (keys present before removal), push `'bulk-unregister'` entry only if any were present

## 5. Box Store Integration

- [ ] 5.1 In `moveSlot`: read `(fromBoxId, fromIndex)` and `(toBoxId, toIndex)` slot contents via `get()` before mutation; push `'move-slot'` entry with the pre-mutation slots after mutation
- [ ] 5.2 In `reorderBox`: read current box index via `get()` before mutation; push `'reorder-box'` entry with `previousIndex` after mutation
- [ ] 5.3 In `setBoxes`: deep-clone current `boxes` via `get()` before mutation using `structuredClone`; push `'preset-apply'` entry with the snapshot after mutation

## 6. ActivityHistoryPanel Component

- [ ] 6.1 Create `src/components/history/ActivityHistoryPanel.tsx` with collapsible wrapper (local `isOpen` state, collapsed by default)
- [ ] 6.2 Render panel header with title, entry count badge, and toggle chevron
- [ ] 6.3 Render entry list when expanded: each row shows `description` and a relative timestamp (using `Intl.RelativeTimeFormat` or a small helper)
- [ ] 6.4 Render "Undo" button on the first entry only; wire to `useHistoryStore.undoLast()`
- [ ] 6.5 Render empty-state message when `entries` is empty
- [ ] 6.6 Make entry list vertically scrollable with a max-height (e.g., `max-h-64 overflow-y-auto`)
- [ ] 6.7 Add i18n keys for: panel title ("Activity History" / "Histórico de Atividades"), empty state, "Undo" button, and relative time labels in PT-BR and EN locale files

## 7. Home Dashboard Integration

- [ ] 7.1 Import and render `ActivityHistoryPanel` on the Home page below the quick stats / BoxCalculatorCard area
- [ ] 7.2 Verify the panel is collapsed on initial render and expands on click

## 8. QA and Verification

- [ ] 8.1 Manually register a Pokémon, open the history panel, verify the entry appears and "Undo" unregisters it
- [ ] 8.2 Manually apply a preset, verify the `'preset-apply'` entry appears and "Undo" restores the previous box layout
- [ ] 8.3 Manually move a slot, verify the `'move-slot'` entry appears and "Undo" restores both slot positions
- [ ] 8.4 Push 101 entries programmatically (or by performing 101 actions) and verify `entries.length` stays at 100
- [ ] 8.5 Reload the page after performing actions, verify history persists and undo still works
- [ ] 8.6 Run `npm run build` and confirm no TypeScript errors
