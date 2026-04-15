## MODIFIED Requirements

### Requirement: BoxGrid is responsive across breakpoints
The `BoxGrid` SHALL adapt its layout to the viewport width as defined in spec section 5.2. On mobile viewports (`<768px`), every slot cell SHALL meet a minimum tap-target size of 44×44px. Additionally, the `BoxGrid` container SHALL apply `touch-action: manipulation` on mobile to suppress double-tap zoom and the 300ms tap delay.

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
- **THEN** each slot cell SHALL have a minimum width and height of 44px
- **THEN** the grid container SHALL apply `touch-action: manipulation` to prevent double-tap zoom
