## ADDED Requirements

### Requirement: BoxOverview renders miniature grids for all boxes

The system SHALL provide a `BoxOverview` component at `src/components/boxes/BoxOverview.tsx` that renders a compact visual summary of all boxes. Each box SHALL be represented as a miniature 6×5 grid of small colored dots indicating slot occupancy.

#### Scenario: Render all boxes as mini-grids

- **WHEN** `BoxOverview` receives an array of `Box` objects
- **THEN** each box SHALL be rendered as a miniature grid
- **THEN** each box's name SHALL be displayed below or above its mini-grid

#### Scenario: Dot colors indicate slot state

- **WHEN** a slot contains a `BoxSlot` with `registered: true`
- **THEN** the dot SHALL use a green color (success/registered indicator)
- **WHEN** a slot contains a `BoxSlot` with `registered: false`
- **THEN** the dot SHALL use an orange color (missing indicator)
- **WHEN** a slot is `null`
- **THEN** the dot SHALL be transparent or use a very subtle background

### Requirement: BoxOverview supports box selection

The `BoxOverview` SHALL allow clicking a mini-grid to navigate to that box.

#### Scenario: Click a mini-grid to navigate

- **WHEN** the user clicks on a mini-grid representation
- **THEN** the `onSelectBox` callback SHALL be called with the box's index

#### Scenario: Highlight the current box

- **WHEN** the `activeBoxIndex` prop matches a box's index
- **THEN** that mini-grid SHALL have a highlighted border (accent color)

### Requirement: BoxOverview provides inline add-box action

The `BoxOverview` SHALL render an add-box control as the last item in the same visual list of box cards.

#### Scenario: Add action appears at list end

- **WHEN** the `BoxOverview` is rendered
- **THEN** a dedicated add-box card SHALL be displayed after all existing boxes
- **THEN** the add-box card SHALL follow the same overall footprint as box mini-grid items while remaining visually distinguishable as an add action

#### Scenario: Add action triggers callback

- **WHEN** the user clicks the add-box card
- **THEN** the `onAddBox` callback SHALL be called

### Requirement: BoxOverview supports inline box deletion

The `BoxOverview` SHALL provide a delete action on each box item and use platform dialog confirmation only when the target box contains Pokemon.

#### Scenario: Show delete affordance on box hover/focus

- **WHEN** the user hovers or focuses a box item
- **THEN** a delete affordance SHALL be visible in an overlaid position on that box card

#### Scenario: Delete empty box without confirmation

- **WHEN** the user triggers delete for a box with no non-null slots
- **THEN** the `onDeleteBox` callback SHALL be called immediately

#### Scenario: Confirm deletion for non-empty box

- **WHEN** the user triggers delete for a box containing at least one non-null slot
- **THEN** the UI SHALL open a platform dialog with translated title/description/actions
- **THEN** the box SHALL be deleted only after explicit confirmation in that dialog
