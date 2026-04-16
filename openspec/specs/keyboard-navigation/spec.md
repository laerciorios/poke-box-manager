## ADDED Requirements

### Requirement: Box grid uses roving tabindex for arrow-key navigation

The `BoxGrid` component SHALL implement the roving tabindex pattern so that only one slot at a time is included in the page tab order. Arrow keys (Up/Down/Left/Right) SHALL move focus to the adjacent slot within the 6×5 grid. Tab and Shift-Tab SHALL move focus out of the grid entirely.

#### Scenario: Initial focus enters the grid at the first slot

- **WHEN** the user Tabs into a `BoxGrid`
- **THEN** focus SHALL land on the first slot (index 0)
- **THEN** only that slot SHALL have `tabIndex={0}`; all other slots SHALL have `tabIndex={-1}`

#### Scenario: Arrow-right moves focus one column right

- **WHEN** a slot is focused and the user presses ArrowRight
- **THEN** focus SHALL move to the slot at index + 1 (same row, next column)
- **THEN** if the slot is in the last column (index % 6 === 5), focus SHALL not wrap

#### Scenario: Arrow-left moves focus one column left

- **WHEN** a slot is focused and the user presses ArrowLeft
- **THEN** focus SHALL move to the slot at index − 1 (same row, previous column)
- **THEN** if the slot is in the first column (index % 6 === 0), focus SHALL not wrap

#### Scenario: Arrow-down moves focus one row down

- **WHEN** a slot is focused and the user presses ArrowDown
- **THEN** focus SHALL move to the slot at index + 6 (next row, same column)
- **THEN** if the slot is in the last row, focus SHALL not wrap

#### Scenario: Arrow-up moves focus one row up

- **WHEN** a slot is focused and the user presses ArrowUp
- **THEN** focus SHALL move to the slot at index − 6 (previous row, same column)
- **THEN** if the slot is in the first row, focus SHALL not wrap

#### Scenario: Tab exits the grid forward

- **WHEN** a slot within the grid is focused and the user presses Tab
- **THEN** focus SHALL move to the next focusable element outside the grid

#### Scenario: Shift-Tab exits the grid backward

- **WHEN** a slot within the grid is focused and the user presses Shift-Tab
- **THEN** focus SHALL move to the previous focusable element outside the grid

### Requirement: Box navigation (switcher) is keyboard accessible

The box list / switcher UI SHALL be fully navigable by keyboard. Each box item SHALL be reachable via Tab and activatable via Enter or Space.

#### Scenario: Tab reaches each box item

- **WHEN** the user Tabs through the sidebar or box navigation panel
- **THEN** each box item SHALL receive focus in DOM order

#### Scenario: Enter activates a box item

- **WHEN** a box item is focused and the user presses Enter
- **THEN** that box SHALL become the active box (equivalent to a click)

#### Scenario: Space activates a box item

- **WHEN** a box item is focused and the user presses Space
- **THEN** that box SHALL become the active box

### Requirement: Sidebar navigation is fully keyboard accessible

All sidebar navigation links SHALL be reachable via Tab and activatable via Enter.

#### Scenario: Tab reaches each navigation link

- **WHEN** the user Tabs through the sidebar
- **THEN** each navigation link SHALL receive visible focus in order

#### Scenario: Enter navigates to the linked route

- **WHEN** a navigation link is focused and the user presses Enter
- **THEN** the app SHALL navigate to the corresponding route
