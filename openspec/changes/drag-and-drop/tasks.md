## 1. Install Dependencies

- [ ] 1.1 Run `npm install @dnd-kit/core @dnd-kit/utilities` and verify the packages appear in `package.json`
- [ ] 1.2 (Optional) Run `npm install @dnd-kit/accessibility` for screen-reader drag announcements

## 2. Store: setBoxLabel Action

- [ ] 2.1 Add `setBoxLabel(boxId: string, label: string | undefined) => void` action to `useBoxStore` in `src/stores/useBoxStore.ts`
- [ ] 2.2 Verify the action updates only the target box's `label` field without mutating other boxes

## 3. Slot ID Utilities

- [ ] 3.1 Create `src/lib/dnd-utils.ts` exporting `toSlotId(boxId, slotIndex)` and `fromSlotId(id)` helpers for composing and parsing `"boxId:slotIndex"` drag IDs

## 4. DraggableSlot and DroppableSlot Wiring

- [ ] 4.1 Update `BoxSlotCell` to accept `draggableId?: string`, `droppableId?: string`, `isDragOver?: boolean`, and `isDragging?: boolean` props
- [ ] 4.2 In `BoxSlotCell`, apply `useDraggable({ id: draggableId })` when `draggableId` is provided and the slot is non-null — disable drag for null slots
- [ ] 4.3 In `BoxSlotCell`, apply `useDroppable({ id: droppableId })` when `droppableId` is provided
- [ ] 4.4 Apply `opacity-30` styling when `isDragging` is true (drag source visual)
- [ ] 4.5 Apply `ring-2 ring-primary` (or equivalent) highlight when `isDragOver` is true

## 5. BoxDragLayer (Ghost Overlay)

- [ ] 5.1 Create `src/components/boxes/BoxDragLayer.tsx` that accepts a `slot: BoxSlot`, `pokemonName?: string`, and `spriteUrl?: string` prop and renders the sprite at 1.2× scale with a drop shadow
- [ ] 5.2 Wrap the drag layer output in `@dnd-kit/core`'s `DragOverlay` component

## 6. BoxGrid DnD Integration

- [ ] 6.1 Update `BoxGrid` to pass `draggableId`, `droppableId`, `isDragging`, and `isDragOver` props to each `BoxSlotCell`, derived from `toSlotId(box.id, index)` and an `activeId` prop passed in from the parent
- [ ] 6.2 Add an `activeId?: string | null` prop to `BoxGrid` (set while drag is in flight from the parent context)

## 7. DndContext and Page Wiring

- [ ] 7.1 Wrap the box page (or its client layout component) with `DndContext` from `@dnd-kit/core`
- [ ] 7.2 Implement `handleDragStart` — set `activeId` state to `event.active.id`; also track `activeSlot` (parsed box/slot coords + slot data for the ghost overlay)
- [ ] 7.3 Implement `handleDragEnd` — parse `active.id` and `over?.id` via `fromSlotId`; call `useBoxStore.moveSlot` if source ≠ destination and `over` is non-null; clear `activeId` and `activeSlot`
- [ ] 7.4 Render `BoxDragLayer` inside `DndContext`, visible only when `activeSlot` is non-null, passing the active slot's data, name, and sprite URL
- [ ] 7.5 Verify single-box drag within one grid works end-to-end in the dev server
- [ ] 7.6 Verify cross-box drag in overview mode (both grids mounted) works end-to-end

## 8. Editable Box Name

- [ ] 8.1 Update `BoxNavigation` to track `isEditing: boolean` and `draftName: string` in local state
- [ ] 8.2 Add `onDoubleClick` to the box name `<span>` to enter edit mode and focus the input
- [ ] 8.3 Render a controlled `<input>` with `aria-label="Edit box name"` when `isEditing` is true
- [ ] 8.4 On Enter / blur: trim the draft; if non-empty call `useBoxStore.renameBox(boxId, trimmedName)`, then exit edit mode; if empty, restore original name
- [ ] 8.5 On Escape: exit edit mode and restore the original name without calling `renameBox`
- [ ] 8.6 Add i18n strings for the `aria-label` in `pt-BR` and `en` locale files

## 9. Box Color Picker

- [ ] 9.1 Create `src/components/boxes/BoxColorPicker.tsx` — a `Popover` trigger button (palette icon) containing 8 colored `<button>` swatches (`"red"`, `"orange"`, `"yellow"`, `"green"`, `"blue"`, `"purple"`, `"pink"`, `"gray"`) and a "Clear" option
- [ ] 9.2 On swatch click: call `useBoxStore.setBoxLabel(boxId, colorKey)` and close the popover
- [ ] 9.3 On "Clear" click: call `useBoxStore.setBoxLabel(boxId, undefined)` and close the popover
- [ ] 9.4 Define a `BOX_LABEL_COLORS` constant mapping color keys to Tailwind background classes (e.g., `{ red: 'bg-red-500', blue: 'bg-blue-500', ... }`)
- [ ] 9.5 Integrate `BoxColorPicker` into `BoxNavigation` alongside the box name, passing the current `box.label` and `boxId`
- [ ] 9.6 Render a small colored dot in `BoxNavigation` when `box.label` is set, using the `BOX_LABEL_COLORS` map
- [ ] 9.7 Add i18n strings for the color picker tooltip/aria labels in `pt-BR` and `en`
