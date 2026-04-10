## Why

The current drag-and-drop implementation uses **swap semantics**: dropping a Pokémon onto another slot immediately swaps the two, with no intermediate animation. The problem is that this UX gives no visual feedback of "where the item will land" during the drag — the user has to guess the outcome before releasing.

Pokémon Home and similar collection-management apps use a different approach: surrounding items **shift in real time** to make room, so the destination is visually obvious before the user lets go. This change delivers that experience.

## What Changes

- **Semantic change**: from swap to **reorder** — dragging from position A to B shifts items between A and B to fill the gap, like a reorderable list
- **New**: Install `@dnd-kit/sortable` to manage grid reordering logic
- **New**: Replace `useDraggable` + `useDroppable` with `useSortable` in `BoxSlotCell`
- **New**: Wrap each `BoxGrid` with `SortableContext` using the grid strategy (`rectSortingStrategy`)
- **New**: CSS transition on shifting slots (`transition-transform`)
- **Modified**: `useBoxStore` — add `reorderSlots` action using `arrayMove`; keep existing `moveSlot` (swap) for cross-box drops
- **Modified**: `BoxGrid` — remove `activeId` prop passed from parent; replace with `SortableContext`-internal state
- **Modified**: `DndContext` in `BoxesPage` — use `arrayMove` in `onDragEnd` for intra-box reordering

## Capabilities

### Modified Capabilities

- `box-drag-drop`: Semantics change from swap to reorder with real-time shift animation. Cross-box drag (v1): uses simple swap — reorder animation applies intra-box only. Full cross-box reorder deferred to a future change.

## Impact

- **New dependency**: `@dnd-kit/sortable`
- `src/stores/useBoxStore.ts` — add `reorderSlots(boxId, fromIndex, toIndex)` using `arrayMove`
- `src/components/boxes/BoxSlotCell.tsx` — replace `useDraggable`/`useDroppable` with `useSortable`
- `src/components/boxes/BoxGrid.tsx` — wrap grid with `SortableContext`; pass sorted `items` array of ids
- `src/app/[locale]/boxes/page.tsx` — adapt `onDragEnd` to call `reorderSlots` for intra-box and `moveSlot` for cross-box
- `src/lib/dnd-utils.ts` — `toSlotId`/`fromSlotId` helpers reused as-is
