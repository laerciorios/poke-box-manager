## Context

The app has no tagging primitive today. Users manage Pokémon across boxes but cannot group them by personal intent (trading, favorite, needs evolution, etc.). Spec section 4.6 calls for a custom tag system that works across all major screens (Boxes, Missing, Pokédex).

The app is offline-first with no backend. All user state is stored in IndexedDB via Zustand stores using the `createPersistedStore` helper. Slot data lives in `useBoxStore`; tag metadata will live in a new `useTagsStore`.

## Goals / Non-Goals

**Goals:**
- Allow users to create, rename, recolor, and delete tags
- Allow assigning multiple tags to any box slot
- Render compact tag indicators on `BoxSlotCell` without disrupting existing slot states
- Enable tag-based filtering on Boxes, Missing Pokémon, and Pokédex screens
- Persist all tag data to IndexedDB; work fully offline

**Non-Goals:**
- Server-side tag sync or sharing tags with other users
- Applying tags to the Pokémon data model itself (tags are slot-level only)
- Tag-based sorting or bulk tag assignment via drag-select
- Importing/exporting tags independently of the full data export

## Decisions

### 1. Tag metadata in new store; assignments colocated with slot data

**Decision:** `useTagsStore` holds tag definitions (`id`, `name`, `color`). Tag assignments (`tagIds: string[]`) are stored directly on `BoxSlot` inside `useBoxStore`.

**Rationale:** Tag assignments are inherently slot-level state — they travel with a slot when it is moved or swapped. Keeping them in `BoxSlot` avoids a separate cross-store join for every slot render and ensures move/swap operations automatically carry tag assignments. Tag metadata (name, color) is small and rarely changes; a separate store avoids bloating `useBoxStore`.

**Alternative considered:** A map `{ [pokemonId]: tagIds[] }` in `useTagsStore`. Rejected because the same Pokémon can appear in multiple slots and users may want different tags per slot (e.g., one copy "For trade", another "Favorite").

**TypeScript types:**
```ts
// src/types/tags.ts
export interface Tag {
  id: string;        // UUID
  name: string;      // max 32 chars
  color: string;     // hex color string from predefined palette
  createdAt: number; // timestamp ms
}

// Extended BoxSlot (src/types/box.ts)
export interface BoxSlot {
  // ... existing fields ...
  tagIds?: string[];  // optional; absent === no tags
}
```

### 2. Predefined color palette (no free-form color picker)

**Decision:** Tags use a fixed palette of ~16 colors. Users pick from swatches; no free-form hex input.

**Rationale:** Avoids an external color-picker dependency, keeps the UI simple, and ensures colors look good against both dark and light themes. The palette is defined as a constant and shared across the tag manager and tag badge components.

**Alternative considered:** `react-color` or similar library. Rejected to keep the bundle lean and avoid an additional dependency.

### 3. Tag indicators as compact colored dots on slot cells

**Decision:** Tag indicators render as 1–3 small colored dots (max 3 visible, `+N` overflow indicator if more) in the bottom-left corner of the slot cell.

**Rationale:** Slots are small (6×5 grid). Full badges would obscure the sprite. Dots convey presence; the tooltip already shows full details on hover. Three dots was chosen as a reasonable visual limit without needing to redesign the cell.

**Alternative considered:** Colored border on the slot. Rejected because the accent-color border is already used for the "selected" state.

### 4. Filter is additive (OR logic between selected tags)

**Decision:** When multiple tags are selected in the filter panel, the system shows Pokémon matching ANY of the selected tags (OR logic).

**Rationale:** OR logic is more useful for exploration ("show me things I might trade OR give away"). AND logic would produce empty results for most users since few Pokémon would carry every selected tag simultaneously.

### 5. Tag deletion cleans up assignments

**Decision:** Deleting a tag removes its ID from all `BoxSlot.tagIds` arrays in `useBoxStore`.

**Rationale:** Dangling IDs would cause filter bugs and render orphan dots. Cleanup is a single pass over all slots and is cheap.

## Risks / Trade-offs

- **BoxSlot model change** → Existing IndexedDB data has no `tagIds` field. Zustand's `merge: true` default means the field will simply be absent on old slots (treated as no tags). No migration needed.
- **Slot cell visual complexity** → Adding dots to an already-dense cell. Mitigation: dots are 4px, absolutely positioned in the lower-left, and hidden behind the existing tooltip; they do not move other elements.
- **Performance on large box collections** → Tag filter on Boxes screen must re-derive filtered slots on tag selection change. Mitigation: derive inside a `useMemo` keyed on `tagIds` selection; Zustand store reads are already O(n).

## Open Questions

- Should tags be included in the future import/export feature? (Assumption: yes, as part of full state export, but not separately.)
- Maximum number of tags per user? (Assumption: no hard limit, but UX naturally limits to ~20 practical tags.)
