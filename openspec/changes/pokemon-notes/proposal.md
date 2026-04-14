## Why

Players often need to track per-Pokémon metadata that has no structured field — OT name, nature, held item, trade status, evolution reminders — and today there is nowhere to put it. Spec §4.2 explicitly calls for a free-text notes field per slot; this change delivers it as the smallest useful increment: a note stored in `BoxSlot`, a note indicator on the slot cell, and an edit UI accessible from the existing PokemonCard sheet.

## What Changes

- **`BoxSlot` gains a `note?: string` field** — optional, stored in IndexedDB alongside existing slot data (**BREAKING**: schema version bump required)
- **Note indicator on `BoxSlotCell`** — a small icon appears on any slot whose note is non-empty; no indicator when the note is absent
- **Note editor in `PokemonCard` sheet** — a textarea (or inline editable field) lets the user read and edit the note for the slot currently open; changes are committed on blur or an explicit save action
- **`useBoxStore` gains `setSlotNote` action** — updates `note` for a given `(boxId, slotIndex)` without touching other slot fields

## Capabilities

### New Capabilities

- `slot-notes`: Free-text note stored in `BoxSlot.note`, indicator on the cell, editor in PokemonCard — covers storage, display, and editing (spec §4.2)

### Modified Capabilities

- `box-types`: `BoxSlot` interface gains the optional `note?: string` field
- `box-store`: New `setSlotNote(boxId, slotIndex, note)` action; schema version bump for IndexedDB persistence
- `box-slot-cell`: Note indicator icon rendered when `slot.note` is non-empty
- `pokemon-detail-card`: Note textarea added to the PokemonCard sheet; reads from and writes to `useBoxStore` via `setSlotNote`

## Impact

- **Types**: `src/types/box.ts` — `BoxSlot` interface
- **Store**: `src/stores/useBoxStore.ts` — new action, IndexedDB schema version bump
- **Components**: `BoxSlotCell.tsx` (indicator), `PokemonCard.tsx` (editor textarea)
- **i18n**: New strings for note placeholder, save/clear labels in `en` and `pt-BR` message files
- **No new dependencies**
