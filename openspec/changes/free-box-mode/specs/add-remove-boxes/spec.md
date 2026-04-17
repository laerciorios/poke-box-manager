## ADDED Requirements

### Requirement: Users can add empty boxes up to the 200-box limit

The `useBoxStore` SHALL enforce a maximum of 200 boxes. When `addBox()` is called, a new `Box` SHALL be appended with a sequential default name and 30 null slots.

#### Scenario: addBox appends a new blank box

- **WHEN** `addBox()` is called and `boxes.length < 200`
- **THEN** a new `Box` SHALL be appended to the `boxes` array
- **THEN** the new box SHALL have a UUID `id`, name `"Box {boxes.length}"` (computed before append), and 30 `null` slots

#### Scenario: addBox is a no-op at the 200-box limit

- **WHEN** `addBox()` is called and `boxes.length === 200`
- **THEN** the `boxes` array SHALL remain unchanged
- **THEN** no error SHALL be thrown

#### Scenario: "+" button is disabled at the 200-box limit

- **WHEN** `boxes.length === 200`
- **THEN** the add-box button in `BoxNavigation` SHALL be disabled
- **THEN** a tooltip SHALL indicate the 200-box limit has been reached

### Requirement: "+" button in BoxNavigation adds a new empty box

`BoxNavigation` SHALL render an add-box button after the last box navigation control. Clicking it calls `useBoxStore.addBox()` and navigates to the newly created box.

#### Scenario: Clicking "+" creates a box and navigates to it

- **WHEN** the user clicks the add-box button and `boxes.length < 200`
- **THEN** `useBoxStore.addBox()` SHALL be called
- **THEN** the active box index SHALL update to the new box's index
- **THEN** `BoxGrid` SHALL render the new empty box

### Requirement: Users can delete boxes

`useBoxStore` SHALL expose a `deleteBox(boxId: string)` action (already present as `removeBox` per existing spec — this change confirms its availability in free mode with no preset constraints). Deleting a box removes it from the array regardless of its contents.

#### Scenario: Delete box removes it from the array

- **WHEN** `deleteBox(boxId)` is called with a valid box ID
- **THEN** the box SHALL be removed from `boxes`
- **THEN** all slots that were in that box SHALL be discarded

#### Scenario: Deleting the active box navigates to the previous box

- **WHEN** the currently displayed box is deleted and a previous box exists
- **THEN** the active box index SHALL decrement to the previous box
- **WHEN** the first box is deleted and other boxes remain
- **THEN** the active box index SHALL remain at 0 (now pointing to the next box)

#### Scenario: Deleting the only box leaves an empty boxes array

- **WHEN** `deleteBox` is called and only one box exists
- **THEN** `boxes` SHALL be an empty array
- **THEN** the box view SHALL display an empty-state prompt encouraging the user to add a box or apply a preset
