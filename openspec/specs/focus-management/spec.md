## ADDED Requirements

### Requirement: Sheet/modal components trap focus while open

While a Sheet or Dialog is open, focus SHALL be contained within its content region. Tabbing past the last focusable element inside SHALL wrap to the first, and Shift-Tab past the first SHALL wrap to the last.

#### Scenario: Tab wraps at last focusable element

- **WHEN** a Sheet is open and the last focusable element inside it is focused
- **THEN** pressing Tab SHALL move focus to the first focusable element inside the Sheet (not outside)

#### Scenario: Shift-Tab wraps at first focusable element

- **WHEN** a Sheet is open and the first focusable element inside it is focused
- **THEN** pressing Shift-Tab SHALL move focus to the last focusable element inside the Sheet (not outside)

#### Scenario: Escape closes the Sheet and restores focus

- **WHEN** a Sheet is open and the user presses Escape
- **THEN** the Sheet SHALL close
- **THEN** focus SHALL return to the element that triggered the Sheet to open

### Requirement: Focus restores to trigger element on Sheet close

When a Sheet is closed (via Escape, close button, or backdrop click), focus SHALL return to the element that originally triggered the Sheet.

#### Scenario: Close button restores focus

- **WHEN** the user activates the Sheet's close button
- **THEN** the Sheet SHALL close
- **THEN** focus SHALL move to the trigger element (e.g., the "Edit box" button)

#### Scenario: Outside click restores focus

- **WHEN** the user clicks outside the Sheet to dismiss it
- **THEN** focus SHALL return to the trigger element

### Requirement: Focus moves into Sheet content on open

When a Sheet opens, focus SHALL move to the first focusable element inside the panel (or to the panel's heading if no focusable element precedes it).

#### Scenario: Focus enters Sheet on open

- **WHEN** a Sheet is opened by activating a trigger element
- **THEN** focus SHALL move to the first focusable element inside the Sheet content
- **THEN** focus SHALL NOT remain on the trigger or background content

### Requirement: A visible focus indicator is present on all focusable elements

Every interactive element that can receive keyboard focus SHALL display a clearly visible focus ring that meets the WCAG 2.2 Focus Visible minimum (area ≥ perimeter × 2px at 3:1 contrast with adjacent colors).

#### Scenario: Slot focus ring visible

- **WHEN** a `BoxSlotCell` receives keyboard focus
- **THEN** a visible focus ring SHALL appear around the cell using the `--ring` token

#### Scenario: Button focus ring visible

- **WHEN** any button receives keyboard focus
- **THEN** a visible focus ring SHALL appear
