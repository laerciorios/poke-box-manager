## ADDED Requirements

### Requirement: Arrow keys move focus between slots in the box grid
The system SHALL track a `focusedSlotIndex` (0–29) in the active box view. Pressing `ArrowUp`, `ArrowDown`, `ArrowLeft`, or `ArrowRight` when no text input is focused SHALL move the focused slot index accordingly. The focused slot SHALL receive a visible keyboard focus ring distinct from the selection/registration highlight.

#### Scenario: Right arrow moves focus one column right
- **WHEN** `focusedSlotIndex` is set to any slot that is not in the last column (indices 5, 11, 17, 23, 29)
- **THEN** pressing `ArrowRight` SHALL increment `focusedSlotIndex` by 1

#### Scenario: Left arrow moves focus one column left
- **WHEN** `focusedSlotIndex` is set to any slot that is not in the first column (indices 0, 6, 12, 18, 24)
- **THEN** pressing `ArrowLeft` SHALL decrement `focusedSlotIndex` by 1

#### Scenario: Down arrow moves focus one row down
- **WHEN** `focusedSlotIndex` is set to any slot in rows 0–3 (indices 0–23)
- **THEN** pressing `ArrowDown` SHALL increment `focusedSlotIndex` by 6

#### Scenario: Up arrow moves focus one row up
- **WHEN** `focusedSlotIndex` is set to any slot in rows 1–4 (indices 6–29)
- **THEN** pressing `ArrowUp` SHALL decrement `focusedSlotIndex` by 6

#### Scenario: Focus ring is visible on the focused slot
- **WHEN** `focusedSlotIndex` is non-null
- **THEN** the corresponding `BoxSlotCell` SHALL render a keyboard focus ring (e.g., `ring-2 ring-primary`)
- **THEN** all other slots SHALL NOT render the keyboard focus ring

#### Scenario: Arrow keys are suppressed during drag-and-drop
- **WHEN** a drag operation is active (`dndContext.active` is non-null)
- **THEN** arrow-key presses SHALL NOT change `focusedSlotIndex`

### Requirement: Arrow keys at grid boundary jump to adjacent box
When `focusedSlotIndex` is at a grid boundary and the user presses an arrow key in the direction of that boundary, the system SHALL navigate to the adjacent box and set focus to the wrap-around slot.

#### Scenario: Right arrow at last column wraps to next box
- **WHEN** `focusedSlotIndex` is in the last column (e.g., index 5, 11, … 29) and the user presses `ArrowRight`
- **THEN** the next box SHALL become active
- **THEN** `focusedSlotIndex` SHALL be set to the slot on the same row in the first column (e.g., 0, 6, … 24)

#### Scenario: Left arrow at first column wraps to previous box
- **WHEN** `focusedSlotIndex` is in the first column (e.g., index 0, 6, … 24) and the user presses `ArrowLeft`
- **THEN** the previous box SHALL become active
- **THEN** `focusedSlotIndex` SHALL be set to the slot on the same row in the last column (e.g., 5, 11, … 29)

#### Scenario: No wrap when already at first or last box boundary
- **WHEN** `focusedSlotIndex` is at the first-column boundary of the first box and the user presses `ArrowLeft`
- **THEN** `focusedSlotIndex` SHALL NOT change and no navigation SHALL occur
- **WHEN** `focusedSlotIndex` is at the last-column boundary of the last box and the user presses `ArrowRight`
- **THEN** `focusedSlotIndex` SHALL NOT change and no navigation SHALL occur

### Requirement: Slot focus is cleared when focus enters a text input
The system SHALL set `focusedSlotIndex` to `null` whenever focus moves into a text input, textarea, select, or contenteditable element, ensuring the focus ring disappears and arrow keys no longer navigate slots.

#### Scenario: Focus ring clears on input focus
- **WHEN** the user clicks or tabs into any `<input>`, `<textarea>`, `<select>`, or `[contenteditable]` element
- **THEN** `focusedSlotIndex` SHALL be set to `null`
- **THEN** no slot in the grid SHALL render a keyboard focus ring
