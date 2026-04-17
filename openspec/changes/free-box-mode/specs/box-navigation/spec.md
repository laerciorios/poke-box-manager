## ADDED Requirements

### Requirement: BoxNavigation displays an add-box button

`BoxNavigation` SHALL render an add-box ("+" ) button after the navigation controls. Clicking it calls `useBoxStore.addBox()` and sets the active box index to the newly added box.

#### Scenario: Clicking the add-box button creates a box and navigates to it

- **WHEN** the user clicks the add-box button and `boxes.length < 200`
- **THEN** `useBoxStore.addBox()` SHALL be called
- **THEN** the active box index SHALL be updated to `boxes.length - 1` (the new last index)
- **THEN** `BoxGrid` SHALL render the newly created empty box

#### Scenario: Add-box button is disabled at the 200-box limit

- **WHEN** `boxes.length === 200`
- **THEN** the add-box button SHALL be rendered in a disabled state
- **THEN** a tooltip SHALL inform the user that the 200-box limit has been reached

### Requirement: BoxNavigation displays the box count

`BoxNavigation` SHALL display the current box count alongside the position indicator so users can track proximity to the 200-box limit.

#### Scenario: Position indicator shows current index and total

- **WHEN** `BoxNavigation` renders with 15 boxes and the user is on box 7
- **THEN** the position indicator SHALL show `"7 / 15"` (or equivalent localized format)
