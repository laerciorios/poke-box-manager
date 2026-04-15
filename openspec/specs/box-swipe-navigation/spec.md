## ADDED Requirements

### Requirement: Horizontal swipe on box view navigates to adjacent box

The system SHALL provide a `useSwipeGesture` hook that detects horizontal pointer swipe gestures on a given container ref. When a swipe is recognized on the box view container, the system SHALL navigate to the next or previous box.

#### Scenario: Swipe left navigates to next box

- **WHEN** the user performs a leftward swipe (horizontal delta ≥ 60px, more horizontal than vertical) on the box view area on a touch device
- **THEN** the next box SHALL become active (equivalent to pressing the "next" arrow)
- **THEN** if the current box is the last box, no navigation SHALL occur

#### Scenario: Swipe right navigates to previous box

- **WHEN** the user performs a rightward swipe (horizontal delta ≥ 60px, more horizontal than vertical) on the box view area on a touch device
- **THEN** the previous box SHALL become active (equivalent to pressing the "previous" arrow)
- **THEN** if the current box is the first box, no navigation SHALL occur

#### Scenario: Swipe is suppressed during active drag-and-drop

- **WHEN** a dnd-kit drag operation is in progress (`dndContext.active` is non-null) and the user performs a horizontal swipe
- **THEN** no box navigation SHALL occur

#### Scenario: Vertical scroll is not misidentified as a swipe

- **WHEN** the user performs a predominantly vertical gesture (vertical delta > horizontal delta)
- **THEN** no swipe navigation SHALL be triggered
- **THEN** normal page scroll SHALL proceed uninterrupted

#### Scenario: Swipe is only active on touch/coarse-pointer devices

- **WHEN** the primary input device reports `pointer: fine` (mouse/trackpad)
- **THEN** swipe gesture recognition SHALL be disabled and pointer events SHALL pass through normally

### Requirement: Swipe gesture uses Pointer Events API

The `useSwipeGesture` hook SHALL use `pointerdown`, `pointermove`, and `pointerup` events (not Touch Events) attached to the container element. The hook SHALL call `setPointerCapture` on `pointerdown` to ensure the gesture is tracked even if the pointer leaves the element boundary.

#### Scenario: Gesture tracked across element boundary

- **WHEN** the user begins a swipe inside the container and moves the pointer outside the element boundary before releasing
- **THEN** the full gesture displacement SHALL still be measured correctly
- **THEN** the swipe SHALL be recognized if thresholds are met

#### Scenario: Hook cleanup removes listeners

- **WHEN** the component using `useSwipeGesture` unmounts
- **THEN** all pointer event listeners SHALL be removed from the container element
