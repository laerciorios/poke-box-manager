## MODIFIED Requirements

### Requirement: BoxNavigation supports keyboard shortcuts
The `BoxNavigation` SHALL support keyboard arrow keys for navigation. Arrow-key handling SHALL be delegated to the central `KeyboardShortcutProvider` rather than a local `document.addEventListener`. The component SHALL NOT attach its own keydown listener.

#### Scenario: Left arrow navigates to previous box
- **WHEN** no input is focused, no slot focus is active at a non-boundary position, and the user presses `ArrowLeft`
- **THEN** the `onPrevious` callback SHALL be called (if not at first box)

#### Scenario: Right arrow navigates to next box
- **WHEN** no input is focused, no slot focus is active at a non-boundary position, and the user presses `ArrowRight`
- **THEN** the `onNext` callback SHALL be called (if not at last box)
