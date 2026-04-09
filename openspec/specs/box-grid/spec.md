## ADDED Requirements

### Requirement: BoxGrid renders a 6×5 CSS grid of slots
The system SHALL provide a `BoxGrid` component at `src/components/boxes/BoxGrid.tsx` that renders a `Box` object as a 6-column, 5-row CSS Grid. Each of the 30 slots SHALL be rendered as a `BoxSlotCell`. The component SHALL accept a `Box` prop and render its `slots` array in grid order (left-to-right, top-to-bottom).

#### Scenario: Render a full box
- **WHEN** `BoxGrid` receives a `Box` with 30 slots
- **THEN** a CSS Grid with 6 columns and 5 rows SHALL be rendered
- **THEN** each slot SHALL be rendered as a `BoxSlotCell` component

#### Scenario: Render a box with empty slots
- **WHEN** `BoxGrid` receives a `Box` where some slots are `null`
- **THEN** `null` slots SHALL be rendered as `BoxSlotCell` in the `empty` state
- **THEN** the grid layout SHALL remain 6×5 regardless of empty slots

### Requirement: BoxGrid is responsive across breakpoints
The `BoxGrid` SHALL adapt its layout to the viewport width as defined in spec section 5.2.

#### Scenario: Desktop layout (≥1024px)
- **WHEN** the viewport width is 1024px or greater
- **THEN** the grid SHALL display as a full 6×5 grid with comfortable cell sizing

#### Scenario: Tablet layout (768–1023px)
- **WHEN** the viewport width is between 768px and 1023px
- **THEN** the grid SHALL display as a 6×5 grid with reduced cell sizing

#### Scenario: Mobile layout (<768px)
- **WHEN** the viewport width is less than 768px
- **THEN** the grid SHALL be horizontally scrollable
- **THEN** the grid SHALL maintain 6 columns at a fixed cell size

### Requirement: BoxGrid supports slot selection callback
The `BoxGrid` SHALL accept an optional `onSlotClick` callback and an optional `selectedSlotIndex` prop.

#### Scenario: Slot click triggers callback
- **WHEN** a user clicks on a `BoxSlotCell` within the grid
- **THEN** the `onSlotClick` callback SHALL be called with the slot index (0–29)

#### Scenario: Selected slot is visually highlighted
- **WHEN** `selectedSlotIndex` matches a slot's index
- **THEN** that slot SHALL be rendered in the `selected` visual state
