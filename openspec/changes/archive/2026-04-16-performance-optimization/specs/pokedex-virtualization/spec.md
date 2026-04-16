## ADDED Requirements

### Requirement: Pokédex table is virtualized for 1,000+ rows
The Pokédex screen's Pokémon list SHALL use `react-window`'s `FixedSizeList` (or equivalent) so that only visible rows are rendered in the DOM. The full list of 1,025–1,149 entries SHALL NOT be mounted simultaneously.

#### Scenario: DOM contains only visible rows
- **WHEN** the Pokédex list renders 1,100 entries with a viewport showing 20 rows
- **THEN** the DOM SHALL contain at most `visibleCount + (2 × overscanCount)` row elements
- **THEN** scrolling SHALL mount/unmount rows dynamically

#### Scenario: Filter reduces virtual list to matching rows only
- **WHEN** the user applies a filter that matches 50 Pokémon
- **THEN** the virtual list SHALL resize to 50 items
- **THEN** only the visible subset of those 50 SHALL be mounted in the DOM

#### Scenario: Scroll position resets when filter changes
- **WHEN** the user changes a filter or search query
- **THEN** the virtual list SHALL scroll back to the top (item index 0)

### Requirement: Virtualized rows maintain fixed height
Each row in the Pokédex virtual list SHALL have a consistent fixed height to enable `FixedSizeList`. Row content (sprite thumbnail, name, type badges, registration indicator) SHALL fit within this height.

#### Scenario: Row height is uniform across all entries
- **WHEN** the virtual list renders any subset of rows
- **THEN** each row SHALL have the same height in pixels
- **THEN** no row SHALL overflow its allocated height and cause layout issues
