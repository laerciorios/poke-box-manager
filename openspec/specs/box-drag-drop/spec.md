## ADDED Requirements

### Requirement: DndContext includes a KeyboardSensor for accessible drag-and-drop

The `DndContext` SHALL include `@dnd-kit`'s `KeyboardSensor` in its `sensors` array alongside the existing pointer/mouse sensors. This enables keyboard users to initiate, move, and complete or cancel drag operations without a pointer device.

#### Scenario: Space initiates a drag on a focused slot

- **WHEN** a non-empty `BoxSlotCell` is focused via keyboard and the user presses Space
- **THEN** a keyboard drag SHALL begin on that slot

#### Scenario: Arrow keys move the drag target

- **WHEN** a keyboard drag is in progress
- **THEN** pressing arrow keys SHALL move the active droppable target to an adjacent slot

#### Scenario: Space drops at the current target

- **WHEN** a keyboard drag is in progress and a target slot is highlighted
- **THEN** pressing Space SHALL complete the drop (equivalent to pointer release)

#### Scenario: Escape cancels the drag

- **WHEN** a keyboard drag is in progress
- **THEN** pressing Escape SHALL cancel the drag and leave all slots unchanged

### Requirement: DndContext provides screen reader announcements for all drag lifecycle events

The `DndContext` `accessibility.announcements` prop SHALL be populated with i18n-aware strings (from `next-intl`) for each drag lifecycle event: `onDragStart`, `onDragOver`, `onDragEnd`, `onDragCancel`.

#### Scenario: Drag start is announced

- **WHEN** the user picks up a Pokémon (keyboard or pointer)
- **THEN** the screen reader SHALL announce something like "Picked up Bulbasaur. Use arrow keys to move."

#### Scenario: Drag-over a new slot is announced

- **WHEN** the drag moves over a different slot
- **THEN** the screen reader SHALL announce the target slot position (e.g., "Over slot 3 of Box 2, currently occupied by Charmander")

#### Scenario: Successful drop is announced

- **WHEN** the user drops a Pokémon onto a valid target
- **THEN** the screen reader SHALL announce the completed move (e.g., "Bulbasaur moved to slot 3 of Box 2")

#### Scenario: Drag cancel is announced

- **WHEN** the drag is cancelled (Escape or drop outside a valid target)
- **THEN** the screen reader SHALL announce "Drag cancelled. Bulbasaur returned to its original position."

### Requirement: DnD overlay animation respects prefers-reduced-motion

The `DragOverlay` ghost sprite transition (fade-in, scale) SHALL be suppressed when `prefers-reduced-motion: reduce` is active. This is a cross-cutting concern aligned with the `reduced-motion` capability.

#### Scenario: Ghost overlay appears instantly under reduced motion

- **WHEN** `prefers-reduced-motion: reduce` is active and a drag begins
- **THEN** the `DragOverlay` SHALL appear at the pointer/keyboard position immediately with no animation
