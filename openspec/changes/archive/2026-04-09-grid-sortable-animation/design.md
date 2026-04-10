## Context

The current `BoxGrid` uses `useDraggable` + `useDroppable` from `@dnd-kit/core` with swap semantics. Each slot has a fixed id `"boxId:slotIndex"`. `onDragEnd` calls `moveSlot(fromBoxId, fromIndex, toBoxId, toIndex)`, which internally does `temp = slots[to]; slots[to] = slots[from]; slots[from] = temp`.

`@dnd-kit/sortable` was explicitly excluded in the previous drag-and-drop change because the grid used fixed positions. This change reverses that decision: the user wants real-time shift animation, which is exactly what `@dnd-kit/sortable` solves.

## Goals / Non-Goals

**Goals:**
- Slots shift during drag to reveal the destination in real time
- Smooth CSS animation on shifting (`transition-transform`)
- Cross-box drag with simple swap (no shift animation across boxes in v1)
- Preserve the `DragOverlay` sprite ghost

**Non-Goals:**
- Cross-box reorder with shift in both boxes (deferred)
- Box-level reordering (deferred — `reorderBox` exists in store)
- Touch sensors (deferred)
- Spring/physics animations (CSS transition is sufficient)

## Decisions

### 1. `@dnd-kit/sortable` with `rectSortingStrategy`

**Decision**: Install `@dnd-kit/sortable` and use `useSortable` in each slot, with `SortableContext` wrapping the grid and `rectSortingStrategy` as the layout strategy.

**Rationale**: `rectSortingStrategy` is designed for 2D fixed-size grids — exactly the 6×5 slot case. It computes each item's displacement based on rectangular position and applies a CSS `transform`, which is animated via Tailwind/CSS transitions.

**Trade-off**: Empty slots (`null`) need special handling — they participate in the sortable context as drop targets but must not be draggable.

### 2. IDs in SortableContext

**Decision**: Keep the `"boxId:slotIndex"` convention for sortable item IDs. Pass `items={slots.map((_, i) => toSlotId(box.id, i))}` to `SortableContext`.

**Rationale**: `SortableContext` needs an array of ids **in the current display order**. Since slots are a fixed-index array (position = index), the ids are always static: `[boxId:0, boxId:1, ..., boxId:29]`. `arrayMove` computes the new order after drop.

**Note**: Unlike traditional sortable lists, the ids here do not change position in the `items` array across renders — what changes is the data (`slots[i]`). `SortableContext` uses the ids to compute transition animations between renders.

### 3. Cross-box semantics

**Decision**: Cross-box drag uses simple swap (v1):
1. The Pokémon from the source goes to the destination slot
2. The Pokémon at the destination (if any) goes to the source slot
3. No shift animation in either box for cross-box moves

**Acceptable simplification**: Intra-box gets full reorder with animation; cross-box gets swap. Document as a known limitation. Full cross-box reorder can be implemented in a future change.

### 4. Empty slots in SortableContext

**Decision**: Empty slots participate in `SortableContext` as droppables (they receive items), but `useSortable` has `disabled: true` for them (not draggable).

**Rationale**: All 30 slots must be in the sortable context for shift animation to work correctly. An empty slot can receive a Pokémon (moving it from the source slot with a shift of items in between).

### 5. Store: `reorderSlots` vs adapting `moveSlot`

**Decision**: Add a new action `reorderSlots(boxId: string, fromIndex: number, toIndex: number)` that uses `arrayMove` from `@dnd-kit/sortable` to compute the new slot order.

**Rationale**: Keep `moveSlot` intact (swap) for cross-box compatibility. `reorderSlots` implements shift: `arrayMove(slots, fromIndex, toIndex)` returns the reordered array directly.

```ts
reorderSlots: (boxId, fromIndex, toIndex) => {
  set({
    boxes: get().boxes.map((b) => {
      if (b.id !== boxId) return b
      return { ...b, slots: arrayMove(b.slots, fromIndex, toIndex) }
    }),
  })
}
```

### 6. Transition animation

**Decision**: Use the `transform` value returned by `useSortable` applied as an inline `style`. Add `transition-transform duration-200` on the cell element when it is not being dragged (the dragged item itself should not transition — only the items shifting around it).

**Rationale**: dnd-kit applies `transform: translate3d(x, y, 0)` to items that are displaced. With `transition-transform`, the browser smoothly animates the displacement without any additional JS.

## Risks / Trade-offs

- **Null slots and arrayMove**: Moving a null slot is valid — `arrayMove` just repositions the `null`. The visual result (empty slots shifting) is intentional and correct.
- **Cross-box with full reorder**: Non-trivial to implement correctly. The v1 simplification (swap cross-box, reorder intra-box only) is acceptable.
- **Performance**: 30 `useSortable` hooks per grid × number of visible boxes. With one box visible at a time, no concern. Monitor if overview mode renders multiple full grids simultaneously.
