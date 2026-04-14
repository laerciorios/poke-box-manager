## Context

`BoxSlot` currently holds `{ pokemonId, formId?, registered, shiny? }`. There is no field for unstructured user annotations. The spec (§4.2) describes a free-text note per slot used for OT, nature, trade status, or evolution reminders. The data lives in `useBoxStore` (IndexedDB-persisted Zustand) — no backend, no separate table.

The editing surface already exists: `PokemonCard` is a side sheet that opens when the user inspects a slot. Adding a note textarea there requires minimal new UI. The only visible affordance on the grid is a small icon on slots that have a note.

`BoxSlot` is a schema-level type; adding a field to it requires bumping the IndexedDB schema version so the `createPersistedStore` migration path handles old records gracefully.

## Goals / Non-Goals

**Goals:**
- Add `note?: string` to `BoxSlot` with a max-length cap (500 chars) enforced at the store level
- `setSlotNote(boxId, slotIndex, note)` action in `useBoxStore`
- Note indicator icon on `BoxSlotCell` when note is non-empty
- Note textarea inside the existing `PokemonCard` sheet; edits saved on blur
- i18n strings for note UI in `en` and `pt-BR`

**Non-Goals:**
- Markdown rendering or rich text in notes
- Full-text search across notes
- Note export as a standalone feature (notes travel with slot data in any future export)
- A dedicated note popover independent of `PokemonCard` (the sheet is the edit surface for this increment)
- Character counter UI (validation is silent: truncate at 500)

## Decisions

### D1: `note` lives directly on `BoxSlot`, not in a parallel map

**Decision**: Add `note?: string` to the `BoxSlot` interface. Notes are stored inline with the slot they belong to.

**Alternatives considered**:
- *Separate `Map<slotKey, string>` in the store*: Requires cross-referencing two data structures on every read; risks orphan entries when slots are moved or cleared.
- *Separate Zustand store*: Overkill for a single optional string field; adds another IndexedDB object store.

**Why inline**: Notes are per-slot metadata, not per-Pokémon. When a slot is moved (`moveSlot`) or cleared (`clearSlot`), the note travels with the slot data naturally — no extra cleanup logic.

**Updated `BoxSlot` type**:
```ts
interface BoxSlot {
  pokemonId: number;
  formId?: string;
  registered: boolean;
  shiny?: boolean;
  note?: string; // max 500 chars, trimmed before storage
}
```

### D2: `setSlotNote` is a dedicated action, not overloading `setSlot`

**Decision**: Add `setSlotNote(boxId: string, slotIndex: number, note: string): void` as a dedicated store action.

**Alternatives considered**:
- *Call `setSlot` with a merged slot object*: Forces the caller to read the current slot, merge, and write — error-prone if the slot is `null`.
- *Patch function `updateSlot(boxId, slotIndex, partial: Partial<BoxSlot>)`*: More generic but introduces unconstrained partial writes; harder to reason about.

**Why dedicated action**: A named action is self-documenting, easier to test in isolation, and ensures `setSlotNote` is a no-op when `slotIndex` points to a `null` slot (empty slot — nothing to annotate).

### D3: Edit on blur in PokemonCard, no explicit save button

**Decision**: The note textarea in `PokemonCard` is a controlled component backed by local state (`useState`). On `onBlur`, if the value differs from `slot.note`, `setSlotNote` is called. No explicit Save button.

**Alternatives considered**:
- *Explicit Save button*: Extra interaction step for a simple text field; typical note UIs (Apple Notes, Notion inline) auto-save.
- *Debounced onChange*: Would write to IndexedDB on every keystroke; unnecessary churn for a local store.
- *Popover separate from PokemonCard*: Spec §4.2 doesn't require a standalone popover; placing it in PokemonCard reuses the existing inspect flow.

**Why blur-save**: Matches familiar textarea-in-form UX patterns; single write per editing session; easy to implement without debounce complexity.

### D4: IndexedDB schema version bump to 2

**Decision**: Increment the schema version in `createPersistedStore` for `"boxes"` from `1` to `2`. Migration function: for each box, for each slot that is non-null, ensure `note` is `undefined` (existing slots have no note — this is a no-op in practice but makes the migration explicit).

**Why**: Zustand's `persist` middleware with `version` + `migrate` handles this cleanly. Without a version bump, old serialized state is loaded as-is; since `note` is optional (`?`) TypeScript won't fail, but being explicit about schema changes is good practice.

## Risks / Trade-offs

- **[Risk] Note survives slot clear** → `clearSlot` sets the slot to `null`, which discards the entire `BoxSlot` object including the note. This is intentional — clearing a slot should wipe all its data. Document in the spec.
- **[Risk] Note travels on `moveSlot`** → When `moveSlot` swaps two occupied slots, both notes travel with their respective `BoxSlot`. This is the correct behavior but may surprise users who move a Pokémon expecting the note to stay at the position. The note belongs to the Pokémon, not the box position. This is a deliberate design choice.
- **[Risk] 500-char cap is silently truncated** → Server-less app; no validation feedback is shown. If a user pastes beyond the cap, excess chars are dropped on blur. Mitigation: add a visible character count near the textarea.
- **[Risk] Schema migration is a no-op but still runs** → Acceptable; the migration is cheap and runs only once per client.

## Open Questions

- Should the note also be visible in the slot tooltip (on hover), or only in the PokemonCard sheet?
- Should there be a "clear note" button in the sheet, or is selecting all + deleting sufficient?
