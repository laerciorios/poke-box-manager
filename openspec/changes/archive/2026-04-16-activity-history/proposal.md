## Why

Users performing bulk operations (preset application, bulk registration, box reorganization) have no way to recover from accidental changes — there is no history and no undo. Spec section 4.8 defines an activity history log capped at 100 entries with timestamps and a single-level undo for the last action, giving users visibility into what changed and a safety net for mistakes.

## What Changes

- New `useHistoryStore` Zustand store persisting an array of `ActivityEntry` records (capped at 100) to IndexedDB, each containing the action type, a human-readable description, a timestamp, and a reversible snapshot sufficient to undo it
- Undo action: `undoLast()` replays the inverse of the most recent entry by calling the appropriate store action and removes the entry from the log
- `ActivityHistoryPanel` component: collapsible panel listing entries with relative timestamps and an "Undo" button on the topmost entry
- Integration points: `usePokedexStore` (registration toggles, bulk mark), `useBoxStore` (move/swap, reorder, preset application)
- No new external dependencies

## Capabilities

### New Capabilities

- `activity-history-store`: `useHistoryStore` with `ActivityEntry` type, `pushEntry`, `undoLast`, cap enforcement, and IndexedDB persistence
- `activity-history-ui`: `ActivityHistoryPanel` collapsible component with entry list and undo affordance

### Modified Capabilities

- `pokedex-store`: `toggleRegistered`, `registerAll`, `unregisterAll` call `useHistoryStore.pushEntry` after each mutation
- `box-store`: `moveSlot`, `reorderBox`, and preset `setBoxes` call `useHistoryStore.pushEntry` after each mutation

## Impact

- New: `src/types/history.ts` — `ActivityEntry` and `ActionType` types
- New: `src/stores/useHistoryStore.ts`
- New: `src/components/history/ActivityHistoryPanel.tsx`
- Modified: `src/stores/usePokedexStore.ts` — push entries on registration mutations
- Modified: `src/stores/useBoxStore.ts` — push entries on box mutations; `setBoxes` must snapshot previous boxes for undo
- Panel surfaced on the Home dashboard and/or as a drawer accessible from the header
- Relates to spec section **4.8 Activity History**
