## Why

Users need a flexible way to group and track Pokémon across boxes by personal intent — for trade, favorites, needs evolution, special events — a concept not covered by any existing organizational primitive. Section 4.6 of the spec defines this feature as a planned capability, and implementing it now rounds out the core box management workflow.

## What Changes

- New `useTagsStore` Zustand store with IndexedDB persistence for managing user-created tags
- Tag management UI: create, edit (name + color), and delete tags
- Ability to assign one or more tags to any Pokémon slot in a box
- Visual tag indicators on box slot cells
- Tag-based filtering panel available on Boxes, Missing Pokémon, and Pokédex screens

## Capabilities

### New Capabilities

- `custom-tags`: Tag data model, store (CRUD), and IndexedDB persistence
- `tag-assignment`: Assign/remove tags on box slots; tag state colocated with slot data
- `tag-indicators`: Visual rendering of tag badges/dots on slot cells
- `tag-filter`: Tag-based filtering across Boxes, Missing, and Pokédex screens

### Modified Capabilities

- `box-slot-cell`: Slot cell must render tag indicators alongside existing slot states
- `box-store`: Slot model gains an optional `tagIds` field for persisted tag assignments

## Impact

- New store file: `src/stores/tags-store.ts`
- Modified store: `src/stores/box-store.ts` (slot model extended with `tagIds`)
- New components: tag manager modal, tag badge, tag filter panel
- Modified components: `BoxSlotCell` (add tag indicator layer), filter panels on Boxes / Missing / Pokédex pages
- No new dependencies required; color picker can use a predefined palette (no external library)
- Relates to spec section **4.6 Custom Tags**
