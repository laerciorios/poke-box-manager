## Requirements

### Requirement: Overall progress donut chart
The stats page SHALL display a circular/donut chart showing the total number of registered Pokémon against the filtered total (e.g. 847/1025 — 82.6%). The total SHALL respect active generation filters and variation toggles from `useSettingsStore`.

#### Scenario: Donut reflects registered count
- **WHEN** the user opens the stats page
- **THEN** the donut chart SHALL show the count of registered Pokémon as the filled arc and the remaining as unfilled

#### Scenario: Donut updates with generation filter
- **WHEN** the user changes active generations in settings
- **THEN** the donut chart SHALL recalculate both the registered count and the total to include only Pokémon from active generations

#### Scenario: Donut updates with variation toggles
- **WHEN** the user enables or disables a variation toggle (e.g. regionalForms)
- **THEN** the donut chart total SHALL include or exclude the corresponding forms and the registered count SHALL update accordingly

#### Scenario: Percentage label
- **WHEN** the donut chart is rendered
- **THEN** the center of the chart SHALL display the percentage as a formatted string (e.g. "82.6%") and the registered/total counts below it

---

### Requirement: Progress bars by generation
The stats page SHALL display a horizontal progress bar for each active generation showing registered vs total Pokémon for that generation.

#### Scenario: Bar per active generation
- **WHEN** the stats page is rendered
- **THEN** one progress bar SHALL appear for each generation in `activeGenerations`, labeled with the generation name

#### Scenario: Bar respects variation toggles
- **WHEN** a variation toggle is active
- **THEN** forms belonging to that variation that are part of a given generation SHALL be included in that generation's total and registered counts

#### Scenario: Complete generation bar
- **WHEN** all Pokémon in a generation (within active variations) are registered
- **THEN** the progress bar for that generation SHALL be visually styled as fully complete (100%)

---

### Requirement: Type progress grid
The stats page SHALL display a grid of all Pokémon types, each showing the percentage of registered Pokémon that have that type.

#### Scenario: Grid covers all 18 types
- **WHEN** the stats page is rendered
- **THEN** all 18 Pokémon types SHALL be present in the grid with their type name and a percentage indicator

#### Scenario: Percentage based on filtered total
- **WHEN** generation and variation filters are active
- **THEN** the type grid SHALL compute percentages using only Pokémon/forms that match those filters

#### Scenario: Type color coding
- **WHEN** a type tile is rendered
- **THEN** it SHALL use the type's associated color (consistent with type badges elsewhere in the app)

---

### Requirement: Box heatmap
The stats page SHALL display a heatmap grid of all user boxes, color-coded by completion state: green (complete), yellow (partial), red (empty).

#### Scenario: One tile per box
- **WHEN** the stats page is rendered
- **THEN** one tile SHALL appear in the heatmap for each box in `useBoxStore`

#### Scenario: Empty box is red
- **WHEN** a box has all 30 slots as null
- **THEN** its heatmap tile SHALL be red

#### Scenario: Complete box is green
- **WHEN** a box has at least one occupied slot AND all occupied slots have `registered: true`
- **THEN** its heatmap tile SHALL be green

#### Scenario: Partial box is yellow
- **WHEN** a box has some slots null OR has some slots with `registered: false`
- **THEN** its heatmap tile SHALL be yellow

#### Scenario: Tile shows box name on hover
- **WHEN** the user hovers over a heatmap tile
- **THEN** the box name SHALL be shown in a tooltip

---

### Requirement: Box summary counts
The stats page SHALL display a summary of how many boxes are complete, partial, and empty.

#### Scenario: Three counts displayed
- **WHEN** the stats page is rendered
- **THEN** three labeled counts SHALL be shown: complete boxes, partial boxes, and empty boxes

#### Scenario: Counts match heatmap
- **WHEN** box states are calculated
- **THEN** the complete + partial + empty counts SHALL sum to the total number of boxes and match the heatmap color distribution

---

### Requirement: Stats computed client-side via useStatsData hook
All statistics SHALL be derived entirely from `usePokedexStore`, `useBoxStore`, and `useSettingsStore` with no additional API calls or server-side data fetching beyond what is already available as static JSON.

#### Scenario: No network requests on stats page
- **WHEN** the user navigates to the stats page
- **THEN** no new network requests SHALL be made to fetch Pokémon data

#### Scenario: Stats update reactively
- **WHEN** the user registers or unregisters a Pokémon in another part of the app
- **THEN** returning to or remaining on the stats page SHALL show updated counts without a page reload
