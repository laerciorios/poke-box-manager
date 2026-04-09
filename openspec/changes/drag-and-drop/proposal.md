## Why

The box grid is a static display with no way to rearrange Pokémon. The spec describes drag & drop as a core interaction for managing a living dex layout (spec section 3.1), and the `useBoxStore.moveSlot` action already supports the move/swap operation — but nothing triggers it from the UI. Similarly, box names are rendered as static text in `BoxNavigation` with no editing affordance. This change delivers the full interactive box management experience expected by users familiar with Pokémon Home.

## What Changes

- **New**: Install `@dnd-kit/core` and `@dnd-kit/utilities` — not currently in `package.json`
- **New**: `DndContext` provider wrapping the box view, wired to `useBoxStore.moveSlot` on drag end
- **New**: Each `BoxSlotCell` becomes a draggable source via `useDraggable`
- **New**: Each slot drop zone becomes a droppable target via `useDroppable`, with visual highlight when a draggable is over it
- **New**: `BoxDragLayer` (`src/components/boxes/BoxDragLayer.tsx`) — custom drag overlay rendering the dragged Pokémon's sprite as a ghost following the cursor
- **New**: Slot swap — dropping onto an occupied slot exchanges the two Pokémon (existing `moveSlot` already implements swap semantics)
- **New**: Cross-box drag — dragging from one box and dropping into a different box works via globally unique droppable IDs (`"boxId:slotIndex"`)
- **New**: Editable box name — double-clicking the box name in `BoxNavigation` enters an inline edit mode; pressing Enter or blurring commits via `useBoxStore.renameBox`
- **New**: Box label/color picker — a small popover on the box header lets the user assign one of a predefined set of named colors stored in `Box.label`
- **Modified**: `BoxGrid` accepts a `draggingKey` prop to suppress the selected/hover visual on the currently dragged slot

## Capabilities

### New Capabilities

- `box-drag-drop`: DnD infrastructure using `@dnd-kit/core` — `DndContext`, draggable slots, droppable targets, drop zone highlights, ghost overlay (`BoxDragLayer`), and the `onDragEnd` handler that calls `useBoxStore.moveSlot`.
- `box-metadata-edit`: Editable box name (double-click inline edit + commit) and box label/color assignment via a color picker popover, stored in `Box.label`.

### Modified Capabilities

<!-- No existing spec-level requirements change. useBoxStore.moveSlot, renameBox, and setSlot already cover all needed store operations. This change adds the UI layer only. -->

## Impact

- **New dependency**: `@dnd-kit/core`, `@dnd-kit/utilities` (to be installed)
- `src/components/boxes/BoxGrid.tsx` — wrapped with `DndContext`, slots become draggable/droppable
- `src/components/boxes/BoxSlotCell.tsx` — gains `useDraggable` + `useDroppable` hooks, `isDragOver` prop for highlight
- `src/components/boxes/BoxDragLayer.tsx` — new custom drag overlay component
- `src/components/boxes/BoxNavigation.tsx` — editable name (inline input on double-click) + color picker trigger
- `src/components/boxes/BoxColorPicker.tsx` — new small popover component for label/color selection
- `src/stores/useBoxStore.ts` — consumed (`moveSlot`, `renameBox`); no store changes needed
- `src/types/box.ts` — `Box.label` repurposed as the color key storage (no type shape change needed)
