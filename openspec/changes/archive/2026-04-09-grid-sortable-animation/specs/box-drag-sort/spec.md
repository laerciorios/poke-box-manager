# Spec: box-drag-sort

## Capability

`box-drag-sort` — Real-time reorder animation during drag-and-drop of slots in BoxGrid.

## Requirements

### Functional

- **REQ-1**: When dragging an occupied slot, all other slots in the grid MUST shift in real time to show where the item will be inserted when released.
- **REQ-2**: Slot shifting uses a smooth CSS animation (`transition-transform`, ≤ 200ms).
- **REQ-3**: Drop semantics are **reorder** (not swap): the dragged item is inserted at the destination position, and items between origin and destination shift to fill the gap.
- **REQ-4**: Empty slots participate as drop targets — a Pokémon can be dragged to an empty position, and slots between origin and destination shift accordingly.
- **REQ-5**: The `DragOverlay` (sprite ghost following the cursor) MUST be preserved.
- **REQ-6**: During drag, the source slot MUST have reduced opacity (already implemented in the previous change).

### Cross-box (v1 simplified)

- **REQ-7**: Cross-box drag uses simple swap semantics (not reorder): the Pokémon from the source goes to the destination and vice versa. Shift animation applies intra-box only.
- **REQ-8** *(future)*: Full cross-box reorder with shift animation in both boxes MAY be implemented in a subsequent change.

### Store

- **REQ-9**: The store MUST expose `reorderSlots(boxId, fromIndex, toIndex)` using `arrayMove` to reposition slots without mutating the original array.
- **REQ-10**: The existing `moveSlot` action (swap) MUST be kept for cross-box use.

### Accessibility

- **REQ-11**: `useSortable` from dnd-kit provides ARIA attributes automatically; implementations MUST NOT override them.
