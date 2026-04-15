## Context

The app has four Zustand stores that mutate user data: `usePokedexStore`, `useBoxStore`, `useTagsStore` (pending), and `useSettingsStore`. Of these, history tracking applies to the first two — settings changes and tag changes are not undoable actions in the spec's sense.

There is currently no cross-store coordination mechanism. Each store is independent and persists to its own IndexedDB key via `createPersistedStore`. Adding history requires each mutating action to also call into `useHistoryStore` after its own mutation — a fire-and-forget side effect, not middleware.

## Goals / Non-Goals

**Goals:**
- Log registrations, bulk marks, slot moves/swaps, box reorders, and preset applications
- Undo only the most recent action (single-level undo, not a full stack)
- Cap the log at 100 entries; trim from the oldest end when exceeded
- Persist the log to IndexedDB so history survives page reloads

**Non-Goals:**
- Multi-level undo / redo stack
- Undoing settings changes, tag mutations, or box renames
- Real-time sync or history sharing across devices
- Audit log for export (history is for UX recovery, not record-keeping)

## Decisions

### 1. `ActivityEntry` carries an inline `undoPayload` union

**Decision:** Each `ActivityEntry` stores a discriminated union `undoPayload` with enough data to reverse the action. The entry is self-contained — undo does not re-read current store state.

**Rationale:** The undo operation must be deterministic even if other state has changed since the entry was created. Storing the reverse payload inline avoids a second read of the store and makes the entry serializable for IndexedDB.

**TypeScript types:**
```ts
// src/types/history.ts

export type ActionType =
  | 'register'           // single Pokémon toggled on
  | 'unregister'         // single Pokémon toggled off
  | 'bulk-register'      // registerAll called
  | 'bulk-unregister'    // unregisterAll called
  | 'move-slot'          // moveSlot called (includes swap)
  | 'reorder-box'        // reorderBox called
  | 'preset-apply'       // setBoxes called from preset autofill

export type UndoPayload =
  | { type: 'register';        key: string }
  | { type: 'unregister';      key: string }
  | { type: 'bulk-register';   keys: string[] }
  | { type: 'bulk-unregister'; keys: string[] }
  | { type: 'move-slot';       fromBoxId: string; fromIndex: number; toBoxId: string; toIndex: number; fromSlot: BoxSlot | null; toSlot: BoxSlot | null }
  | { type: 'reorder-box';     boxId: string; previousIndex: number }
  | { type: 'preset-apply';    previousBoxes: Box[] }

export interface ActivityEntry {
  id: string           // UUID
  timestamp: number    // Date.now()
  actionType: ActionType
  description: string  // human-readable, pre-built at push time (not derived at render)
  undoPayload: UndoPayload
}
```

### 2. Preset-apply undo stores a full `Box[]` snapshot

**Decision:** The `preset-apply` undo payload stores a deep copy of the entire `boxes` array before the preset is applied.

**Rationale:** Preset application replaces all boxes atomically; the only safe undo is a full rollback. For a realistic dataset (~32 boxes × 30 slots), the snapshot is approximately 32 × 30 × ~80 bytes ≈ 77 KB — small enough for IndexedDB serialization, but large enough that only **one** preset-apply entry should be stored per user action (which is guaranteed by the 100-entry cap and the fact that preset apply is never called in rapid succession).

**Alternative considered:** Storing a diff of changed slots only. Rejected because preset application typically rewrites most/all slots, making a diff nearly as large as the full snapshot but more complex to implement and reverse.

### 3. Stores call `pushEntry` as a post-mutation side effect — no middleware

**Decision:** Each mutating action in `usePokedexStore` and `useBoxStore` calls `useHistoryStore.getState().pushEntry(entry)` at the end of its `set(...)` callback.

**Rationale:** Zustand has no built-in middleware for cross-store effects. Options were: (a) a Zustand middleware wrapping each store, (b) calling `pushEntry` in UI event handlers, or (c) calling `pushEntry` inside each mutating action. Option (c) keeps the side effect co-located with the mutation, avoids coupling UI code to history, and does not require all call sites to be updated.

**Limitation:** Actions called internally (e.g., `purgeTagId` from tags store) do not need history entries; only user-initiated actions are logged.

### 4. `undoLast()` calls the inverse store action and pops the entry

**Decision:** `undoLast()` reads the most recent entry's `undoPayload`, dispatches the inverse operation directly to the appropriate store via `getState()`, then removes the entry from the log. It does **not** push a new "undo" entry.

**Rationale:** Pushing an "undo of undo" entry would create a confusing history ("Undid registration of Pikachu") that could itself be undone in a loop. Since this is a single-level undo, the simpler approach is to just pop the entry.

### 5. Description is built at push time, stored as a plain string

**Decision:** `ActivityEntry.description` is a pre-rendered English/locale-agnostic summary like `"Registered Pikachu (#025)"` or `"Applied preset 'By Type'"`, built when `pushEntry` is called using the active locale from `useSettingsStore`.

**Rationale:** Descriptions are displayed in a list and need to be stable — they should reflect what happened, not re-derive from current state (which may have changed). Building at push time also avoids importing all Pokémon name data into the history panel component.

**i18n note:** Description strings use inline locale-selection logic in a `buildDescription(actionType, payload, locale)` helper, not `next-intl` message keys, for the same reason as evolution step labels — the strings are data-driven and not static UI copy.

### 6. Cap enforcement: trim oldest on push, not on read

**Decision:** `pushEntry` enforces the 100-entry cap by slicing the array to the last 99 entries before prepending the new one, so the array never exceeds 100.

**Rationale:** Trimming at push time keeps the stored array clean and IndexedDB storage bounded. Trimming at read time would allow unbounded growth in storage.

## Risks / Trade-offs

- **`preset-apply` snapshot size** → ~77 KB per entry in IndexedDB. With a cap of 100, at most one preset-apply entry will typically exist (users don't apply presets 100 times in a session). → Acceptable; IndexedDB limit is typically 50–500 MB.
- **`moveSlot` before/after state requires pre-mutation snapshot** → The undo payload needs the slot contents *before* the move. The box store must read current slot state and pass it to `pushEntry` before calling `set(...)`. → Handled by reading `get()` before the mutation inside `moveSlot`.
- **Cross-store dependency** → Pokedex and box stores now depend on `useHistoryStore`. Circular dependency risk is low since history store has no knowledge of other stores; the dependency is one-directional.

## Open Questions

- Where exactly is `ActivityHistoryPanel` surfaced? Assumption: as a collapsible section on the Home dashboard, and optionally accessible via a clock icon in the header.
- Should undo be available even after a page reload (i.e., undo from persisted history)? Assumption: yes — the `undoPayload` is persisted, so undo works across reloads.
