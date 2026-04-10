## Context

`@dnd-kit/core` is listed in CLAUDE.md as a project dependency but is **not yet in `package.json`** — it must be installed before any DnD code runs. The box grid (`BoxGrid`) renders 30 `BoxSlotCell` components in a 6×5 CSS grid. `BoxSlotCell` already accepts `onClick` and `selected` props but has no drag wiring. `useBoxStore.moveSlot` already implements swap semantics (if the destination is occupied, the two slots are exchanged; if empty, the source is moved). `BoxNavigation` renders the box name as a `<span>` — no editing affordance exists.

## Goals / Non-Goals

**Goals:**
- Enable drag-and-drop slot reordering within a box and across boxes
- Show a sprite ghost overlay while dragging
- Highlight drop targets (empty and occupied slots) while a drag is in flight
- Commit moves via `useBoxStore.moveSlot` on drop
- Enable inline box name editing via double-click
- Enable box label/color assignment via a color picker popover

**Non-Goals:**
- Drag-and-drop box reordering (reordering entire boxes — deferred, `reorderBox` exists in store)
- Touch/swipe drag on mobile (deferred; @dnd-kit touch sensors can be added later)
- Sortable list animations (`@dnd-kit/sortable` — not needed; slots are a fixed 6×5 grid, not a sortable list)
- Undo/redo for drag moves (deferred to action history change)
- Custom wallpaper assignment (deferred; only label/color in this change)

## Decisions

### 1. `@dnd-kit/core` only — no `@dnd-kit/sortable`

**Decision**: Install `@dnd-kit/core` and `@dnd-kit/utilities`. Do **not** install `@dnd-kit/sortable`.

**Rationale**: `@dnd-kit/sortable` is designed for reorderable lists. Box slots are a **fixed-position grid** — each slot has a fixed index (0–29). Users drag from one fixed position to another; the grid does not animate items shifting around. Using `useDraggable` + `useDroppable` from `@dnd-kit/core` directly gives full control with less magic.

**Alternative considered**: `@dnd-kit/sortable` with a custom strategy. Rejected — sortable strategies assume items shift positions during drag; that model conflicts with fixed grid slots.

### 2. Droppable/Draggable IDs: composite `"boxId:slotIndex"` strings

**Decision**: Use `"${boxId}:${slotIndex}"` as both the draggable and droppable `id` for each slot. Parse these strings in `onDragEnd` to extract `boxId` and `slotIndex`.

**Rationale**: Globally unique IDs are required when multiple boxes are mounted simultaneously (overview mode). Composite strings are trivially parsed and avoid needing a separate lookup map.

```ts
// ID utilities
const toSlotId = (boxId: string, index: number) => `${boxId}:${index}`
const fromSlotId = (id: string) => {
  const lastColon = id.lastIndexOf(':')
  return { boxId: id.slice(0, lastColon), slotIndex: Number(id.slice(lastColon + 1)) }
}
```

### 3. `DndContext` placement: wraps the entire box page, not individual grids

**Decision**: Mount a single `DndContext` at the box page level (e.g., `src/app/boxes/page.tsx` or the page's client wrapper). Individual `BoxGrid` components are children.

**Rationale**: Cross-box drag requires a shared drag context. If each `BoxGrid` had its own `DndContext`, drops onto a different box would be undetected. A single context at the page level captures all drag/drop events regardless of which box is visible.

**`onDragEnd` logic**:
```ts
function handleDragEnd({ active, over }: DragEndEvent) {
  if (!over || active.id === over.id) return
  const from = fromSlotId(String(active.id))
  const to = fromSlotId(String(over.id))
  useBoxStore.getState().moveSlot(from.boxId, from.slotIndex, to.boxId, to.slotIndex)
}
```

### 4. Ghost overlay: `DragOverlay` with a sprite image

**Decision**: Use `@dnd-kit/core`'s `DragOverlay` component inside `DndContext`. While dragging, render a `BoxDragLayer` that shows the sprite of the active slot at 1.2× scale with a subtle drop shadow.

**Rationale**: `DragOverlay` renders outside the grid DOM tree, so it isn't constrained by the grid's CSS and can freely follow the cursor. This matches the Pokémon Home ghost appearance.

**`activeSlot` state**: Store `activeSlot: { boxId: string; slotIndex: number } | null` in the page component (or a `useRef` + `useState`) set in `onDragStart`, cleared in `onDragEnd`.

### 5. Drop zone highlight: `isDraggingOver` from `useDroppable`

**Decision**: `useDroppable` returns `isOver` — pass it to `BoxSlotCell` as a new `isDragOver` prop. When `true`, render a distinct border/background (e.g., `ring-2 ring-primary`).

**Rationale**: The highlight is purely visual, derived from the droppable state. No extra state management needed.

### 6. Suppressing the drag source during drag

**Decision**: While a slot is being dragged, render it with reduced opacity (e.g., `opacity-30`) to indicate the slot is "in flight". Use `useDraggable`'s `isDragging` boolean.

**Alternative considered**: Hide the slot entirely. Rejected — keeping a ghost placeholder at the source position helps users understand the origin of the drag.

### 7. Inline box name editing: controlled input, commit on Enter/blur

**Decision**: `BoxNavigation` tracks `isEditing: boolean` and `draftName: string` in local state. Double-click on the name span enters edit mode (renders an `<input>`). Enter or blur commits via `useBoxStore.renameBox`. Escape cancels (restores original name).

**Type**: `string` — the input value is a plain string, trimmed before commit. If the trimmed value is empty, the commit is rejected and the original name is restored.

### 8. Box label/color: predefined palette, stored in `Box.label`

**Decision**: Offer a palette of 8 named colors (e.g., `"red"`, `"orange"`, `"yellow"`, `"green"`, `"blue"`, `"purple"`, `"pink"`, `"gray"`). The selected color key is stored in `Box.label`. The `BoxNavigation` header renders a colored dot/badge when `label` is set.

**Rationale**: The `Box` type already has `label?: string`. Reusing it as a color key avoids a type change. If a richer label system is needed later (text + color), `label` can be split at that point.

**Color picker UI**: A small `Popover` containing 8 colored `button` swatches + a "Clear" option. Triggered by a palette icon button in the box header.

## Risks / Trade-offs

- **`@dnd-kit/core` is a new install** — needs to be added to `package.json` before implementation. If the installed version has breaking API changes from what CLAUDE.md assumed, minor adjustments may be needed.
- **Cross-box drag in single-box view** — in the default single-box view, the destination box may not be mounted (only the current box grid is rendered). Drop targets in non-visible boxes won't be registered. Mitigation: in single-box view, cross-box drag is only valid if the overview panel is also rendered; otherwise the user must navigate to the target box first. Long-term: consider a cross-box drag modal (out of scope here).
- **`DragOverlay` z-index** — the overlay must render above the box grid, tooltip layers, and the floating action bar from the registration-mode change. Ensure `DragOverlay` is rendered at the root of the `DndContext` and that `z-index` stacking is managed via Tailwind's `z-50` / `z-[100]` utilities.

## Migration Plan

No data migration. `Box.label` is optional and its existing values (if any) are unaffected — they'll simply be ignored by the color picker if they don't match one of the 8 named palette keys. `moveSlot` and `renameBox` are already implemented. The only pre-implementation step is `npm install @dnd-kit/core @dnd-kit/utilities`.

## Open Questions

- In single-box view, should cross-box drops be blocked with a visual indicator, or should the app auto-navigate to the target box after drop? (Lean toward blocking in this change and adding a cross-box drawer in a future change.)
- Should the `@dnd-kit/accessibility` package be included for screen-reader announcements? (Lean yes — small package, meaningful accessibility improvement.)
