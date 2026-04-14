## ADDED Requirements

### Requirement: BoxSlotCell has an accessible name and role
Every `BoxSlotCell` SHALL carry `role="gridcell"` and an `aria-label` that describes its content in plain language.

#### Scenario: Occupied registered slot label
- **WHEN** a slot contains a Pokémon that is registered
- **THEN** the slot SHALL have `aria-label` of the form `"<Pokémon name>, registered"` (localized)

#### Scenario: Occupied unregistered slot label
- **WHEN** a slot contains a Pokémon that is not registered
- **THEN** the slot SHALL have `aria-label` of the form `"<Pokémon name>, not registered"` (localized)

#### Scenario: Empty slot label
- **WHEN** a slot is empty (`null`)
- **THEN** the slot SHALL have `aria-label="Empty slot"` (localized)

### Requirement: BoxGrid has an accessible role and label
The `BoxGrid` container element SHALL carry `role="grid"` and `aria-label` identifying the box by name.

#### Scenario: Grid role and label present
- **WHEN** `BoxGrid` renders a box with name "Box 1"
- **THEN** the container SHALL have `role="grid"` and `aria-label="Box 1"` (localized)

### Requirement: Registration toggle button has an accessible name and state
The Registration Mode toggle button SHALL carry a descriptive `aria-label` and `aria-pressed` reflecting the current mode state.

#### Scenario: Toggle off state
- **WHEN** Registration Mode is inactive
- **THEN** the toggle SHALL have `aria-pressed="false"` and a label such as `"Enable registration mode"` (localized)

#### Scenario: Toggle on state
- **WHEN** Registration Mode is active
- **THEN** the toggle SHALL have `aria-pressed="true"` and a label such as `"Disable registration mode"` (localized)

### Requirement: Drag handles have accessible names
Any explicit drag handle element SHALL carry `aria-label` and `role="button"` to identify its purpose to screen readers.

#### Scenario: Drag handle label present
- **WHEN** a draggable slot is rendered
- **THEN** the draggable element SHALL have `aria-roledescription="draggable"` and `aria-label` of the form `"<Pokémon name>, drag to move"` (localized)

### Requirement: Sheet/modal dialogs have accessible titles and descriptions
Every `Sheet` and `Dialog` component SHALL have an accessible `aria-labelledby` pointing to its visible title element and an optional `aria-describedby`.

#### Scenario: Sheet title is announced on open
- **WHEN** a Sheet opens (e.g., BoxMetadataEdit, PresetEditor)
- **THEN** the `SheetContent` root SHALL have `aria-labelledby` pointing to the visible heading element
- **THEN** screen readers SHALL announce the dialog title when focus moves into the panel

### Requirement: Navigation landmarks are present
The page layout SHALL expose `<nav>`, `<main>`, and `<header>` landmark elements so screen reader users can jump between sections.

#### Scenario: Main landmark wraps primary content
- **WHEN** any page renders
- **THEN** the primary content area SHALL be wrapped in a `<main>` element

#### Scenario: Sidebar uses nav landmark
- **WHEN** the sidebar renders
- **THEN** it SHALL use a `<nav>` element with `aria-label="Main navigation"` (localized)
