## ADDED Requirements

### Requirement: addBox creates a new empty box with a sequential default name

The `useBoxStore` SHALL expose an `addBox(): void` action that appends a new blank box.

#### Scenario: addBox appends a box with sequential name and 30 null slots

- **WHEN** `addBox()` is called and `boxes.length < 200`
- **THEN** a new `Box` SHALL be appended with `id` = UUID, `name` = `"Box {boxes.length + 1}"` (evaluated before append), and `slots` = array of 30 `null` values

#### Scenario: addBox is a no-op when 200 boxes exist

- **WHEN** `addBox()` is called and `boxes.length === 200`
- **THEN** the `boxes` array SHALL remain unchanged

### Requirement: Box store enforces a maximum of 200 boxes

No store action SHALL allow `boxes.length` to exceed 200.

#### Scenario: Box count cannot exceed 200

- **WHEN** any action that creates boxes (e.g., `addBox`, `setBoxes`) would cause `boxes.length > 200`
- **THEN** only the first 200 boxes SHALL be retained or the action SHALL be a no-op
