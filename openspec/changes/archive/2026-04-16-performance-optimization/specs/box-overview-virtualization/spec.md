## ADDED Requirements

### Requirement: Box overview list is virtualized with react-window
The box overview screen SHALL render the box list using `react-window`'s `FixedSizeList`. Only boxes that are within or near the visible scroll area SHALL be mounted in the DOM. Off-screen boxes SHALL be unmounted.

#### Scenario: Only visible boxes are rendered in DOM
- **WHEN** the box overview renders 50 boxes and only 5 fit in the viewport
- **THEN** the DOM SHALL contain at most `visibleCount + (2 × overscanCount)` box rows
- **THEN** scrolling SHALL progressively mount and unmount box rows

#### Scenario: Overscan keeps nearby boxes mounted
- **WHEN** the user is scrolling through the box list
- **THEN** boxes within `overscanCount` (minimum 2) rows above and below the viewport SHALL remain mounted
- **THEN** this prevents unmounting boxes that are likely drag-and-drop targets

#### Scenario: Box item height is fixed
- **WHEN** the `FixedSizeList` is configured
- **THEN** each item height SHALL be a fixed pixel value matching the rendered `BoxGrid` height at the current breakpoint

### Requirement: Total scroll height reflects all boxes even when off-screen
The virtualized list SHALL maintain the correct total scroll height so the scrollbar accurately represents the full list length.

#### Scenario: Scrollbar proportional to total box count
- **WHEN** 50 boxes exist and the list is scrolled to the top
- **THEN** the scrollbar thumb SHALL be proportionally sized as if all 50 boxes were in the DOM
