## ADDED Requirements

### Requirement: ActivityEntry and UndoPayload types
The system SHALL define `ActivityEntry`, `ActionType`, and `UndoPayload` types in `src/types/history.ts`.

`ActionType` SHALL be a union of: `'register'`, `'unregister'`, `'bulk-register'`, `'bulk-unregister'`, `'move-slot'`, `'reorder-box'`, `'preset-apply'`.

`UndoPayload` SHALL be a discriminated union keyed on `type` matching `ActionType`, each carrying sufficient data to reverse the action:
- `register` / `unregister`: `{ type, key: string }`
- `bulk-register` / `bulk-unregister`: `{ type, keys: string[] }`
- `move-slot`: `{ type, fromBoxId: string, fromIndex: number, toBoxId: string, toIndex: number, fromSlot: BoxSlot | null, toSlot: BoxSlot | null }`
- `reorder-box`: `{ type, boxId: string, previousIndex: number }`
- `preset-apply`: `{ type, previousBoxes: Box[] }`

`ActivityEntry` SHALL include: `id: string` (UUID), `timestamp: number` (ms), `actionType: ActionType`, `description: string` (pre-built human-readable summary), `undoPayload: UndoPayload`.

#### Scenario: ActivityEntry is fully serializable
- **WHEN** an `ActivityEntry` is serialized to JSON and deserialized
- **THEN** all fields SHALL round-trip without loss, including nested `undoPayload`

### Requirement: History store manages the activity log
The system SHALL provide a `useHistoryStore` Zustand store at `src/stores/useHistoryStore.ts` with:
- `entries: ActivityEntry[]` — ordered newest-first, capped at 100
- `pushEntry(entry: ActivityEntry): void`
- `undoLast(): void`
- `clearHistory(): void`

#### Scenario: pushEntry prepends new entry
- **WHEN** `pushEntry(entry)` is called
- **THEN** the new entry SHALL appear at index 0 of `entries`
- **THEN** older entries SHALL shift to higher indices

#### Scenario: Cap enforced at 100 entries
- **WHEN** `pushEntry` is called and `entries.length` is already 100
- **THEN** the oldest entry (index 99) SHALL be dropped
- **THEN** `entries.length` SHALL remain 100

#### Scenario: clearHistory empties the log
- **WHEN** `clearHistory()` is called
- **THEN** `entries` SHALL be an empty array

### Requirement: undoLast reverses the most recent action
`undoLast()` SHALL read the `undoPayload` of `entries[0]`, dispatch the corresponding inverse operation to the appropriate store via `getState()`, and remove the entry from the log.

Inverse operations:
- `register` → call `usePokedexStore.getState().toggleRegistered` to unregister the key
- `unregister` → call `usePokedexStore.getState().toggleRegistered` to re-register the key
- `bulk-register` → call `usePokedexStore.getState().unregisterAll(keys)`
- `bulk-unregister` → call `usePokedexStore.getState().registerAll(keys)`
- `move-slot` → restore `fromSlot` to `(fromBoxId, fromIndex)` and `toSlot` to `(toBoxId, toIndex)` via `useBoxStore.getState().setSlot`
- `reorder-box` → call `useBoxStore.getState().reorderBox(boxId, previousIndex)`
- `preset-apply` → call `useBoxStore.getState().setBoxes(previousBoxes)`

After dispatching, the entry SHALL be removed from `entries`.

#### Scenario: Undo of register removes registration
- **WHEN** the last entry has `actionType: 'register'` with `key: "25"`
- **WHEN** `undoLast()` is called
- **THEN** `usePokedexStore.isRegistered(25)` SHALL return `false`
- **THEN** `entries[0]` SHALL no longer be the undone entry

#### Scenario: Undo of preset-apply restores previous boxes
- **WHEN** the last entry has `actionType: 'preset-apply'` with a `previousBoxes` snapshot
- **WHEN** `undoLast()` is called
- **THEN** `useBoxStore.getState().boxes` SHALL equal the `previousBoxes` snapshot
- **THEN** the entry SHALL be removed from `entries`

#### Scenario: undoLast is a no-op when history is empty
- **WHEN** `entries` is empty and `undoLast()` is called
- **THEN** no error SHALL be thrown and store state SHALL remain unchanged

### Requirement: History store persists to IndexedDB
The `useHistoryStore` SHALL persist its state to IndexedDB using the `createPersistedStore` helper with store name `"history"` and schema version `1`.

#### Scenario: History survives page reload
- **WHEN** actions are performed and the page is reloaded
- **THEN** `entries` SHALL be restored from IndexedDB with all fields intact, including `undoPayload`

#### Scenario: Undo works after page reload
- **WHEN** the last entry is a `register` action persisted to IndexedDB, and the page is reloaded
- **WHEN** `undoLast()` is called
- **THEN** the registration SHALL be reversed correctly

### Requirement: buildDescription helper produces human-readable summaries
The system SHALL export a `buildDescription(actionType: ActionType, payload: UndoPayload, locale: 'pt-BR' | 'en'): string` helper from `src/lib/history-descriptions.ts` used by stores when constructing `ActivityEntry.description`.

#### Scenario: Register description includes Pokémon key
- **WHEN** `buildDescription('register', { type: 'register', key: '25' }, 'en')` is called
- **THEN** the result SHALL contain a reference to the Pokémon key (e.g., "#025" or the name if lookup is available)

#### Scenario: Preset-apply description is generic
- **WHEN** `buildDescription('preset-apply', ..., 'en')` is called
- **THEN** the result SHALL be a non-empty string like "Applied preset to boxes"
