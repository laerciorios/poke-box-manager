## ADDED Requirements

### Requirement: BoxNavigation displays current box info

The system SHALL provide a `BoxNavigation` component at `src/components/boxes/BoxNavigation.tsx` that displays the current box's name and position indicator (e.g., "3 / 12").

#### Scenario: Display box name and position

- **WHEN** `BoxNavigation` receives `boxName`, `currentIndex`, and `totalBoxes` props
- **THEN** the box name SHALL be displayed prominently
- **THEN** the position indicator SHALL show `{currentIndex + 1} / {totalBoxes}`

### Requirement: BoxNavigation provides previous/next controls

The `BoxNavigation` SHALL render arrow buttons to navigate between boxes.

#### Scenario: Navigate to next box

- **WHEN** the user clicks the "next" arrow button
- **THEN** the `onNext` callback SHALL be called

#### Scenario: Navigate to previous box

- **WHEN** the user clicks the "previous" arrow button
- **THEN** the `onPrevious` callback SHALL be called

#### Scenario: Disable navigation at boundaries

- **WHEN** the current box is the first box
- **THEN** the "previous" arrow button SHALL be disabled
- **WHEN** the current box is the last box
- **THEN** the "next" arrow button SHALL be disabled

### Requirement: BoxNavigation supports keyboard shortcuts

The `BoxNavigation` SHALL support keyboard arrow keys for navigation. Arrow-key handling SHALL be delegated to the central `KeyboardShortcutProvider` rather than a local `document.addEventListener`. The component SHALL NOT attach its own keydown listener.

#### Scenario: Left arrow navigates to previous box

- **WHEN** no input is focused, no slot focus is active at a non-boundary position, and the user presses `ArrowLeft`
- **THEN** the `onPrevious` callback SHALL be called (if not at first box)

#### Scenario: Right arrow navigates to next box

- **WHEN** no input is focused, no slot focus is active at a non-boundary position, and the user presses `ArrowRight`
- **THEN** the `onNext` callback SHALL be called (if not at last box)
