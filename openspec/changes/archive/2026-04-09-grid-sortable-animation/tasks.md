## 1. Install dependency

- [x] 1.1 Run `npm install @dnd-kit/sortable` and verify it appears in `package.json`

## 2. Store: reorderSlots

- [x] 2.1 Add `reorderSlots(boxId: string, fromIndex: number, toIndex: number) => void` to `useBoxStore` using `arrayMove` from `@dnd-kit/sortable`
- [x] 2.2 Add the action signature to the `BoxState` interface

## 3. BoxSlotCell: replace with useSortable

- [x] 3.1 Replace `useDraggable` and `useDroppable` with `useSortable` in `DndSlotCell`
- [x] 3.2 Apply `transform` via `CSS.Transform.toString(transform)` in the element's `style` so dnd-kit animates displacement
- [x] 3.3 Add `transition-transform duration-200` on the element when `!isDragging` (animate only the items shifting, not the item being dragged)
- [x] 3.4 Keep `disabled: !slot` on `useSortable` for empty slots (not draggable, but droppable)
- [x] 3.5 Replace `draggableId` and `droppableId` props with a single `sortableId?: string` in `BoxSlotCellProps`
- [x] 3.6 Verify `DragOverlay` still works (the ghost is unaffected by `useSortable`)

## 4. BoxGrid: SortableContext

- [x] 4.1 Wrap the inner grid with `SortableContext` from `@dnd-kit/sortable`, passing `items={slots.map((_, i) => toSlotId(box.id, i))}` and `strategy={rectSortingStrategy}`
- [x] 4.2 Remove the `activeId` prop from `BoxGrid` (no longer needed — `useSortable` exposes `isDragging` internally)
- [x] 4.3 Pass `sortableId={toSlotId(box.id, index)}` instead of `draggableId`/`droppableId` to each `BoxSlotCell`

## 5. BoxesPage: adapt onDragEnd

- [x] 5.1 In `handleDragEnd`, detect whether the drag is intra-box or cross-box by comparing the `boxId` from source and destination
- [x] 5.2 For intra-box: call `reorderSlots(boxId, fromIndex, toIndex)`
- [x] 5.3 For cross-box: call `moveSlot(fromBoxId, fromIndex, toBoxId, toIndex)` (simple swap, no reorder)
- [x] 5.4 Remove the `activeId` state from the page (no longer needed to pass down to `BoxGrid`)
