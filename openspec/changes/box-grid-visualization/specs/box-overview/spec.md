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
