## ADDED Requirements

### Requirement: Pokédex page renders a full list of all visible Pokémon
The system SHALL replace the `/pokedex` stub with a functional page that displays every Pokémon entry visible under the current variation and generation settings. Each base Pokémon SHALL appear as a row; each alternate form SHALL appear as an additional row only when its corresponding variation toggle is enabled in `useSettingsStore`.

#### Scenario: Base Pokémon rows always appear for active generations
- **WHEN** the user opens the Pokédex page
- **THEN** one row SHALL be present for each base Pokémon whose generation is in `useSettingsStore.activeGenerations`

#### Scenario: Form rows appear when their variation toggle is enabled
- **WHEN** the Mega Evolutions toggle is enabled in `useSettingsStore`
- **THEN** a row SHALL appear for each Mega Evolution form, immediately after its base Pokémon row

#### Scenario: Form rows are hidden when their variation toggle is disabled
- **WHEN** the Mega Evolutions toggle is disabled
- **THEN** no Mega Evolution rows SHALL appear in the table

#### Scenario: Empty state when no Pokémon match active filters
- **WHEN** all active filters produce zero matching rows
- **THEN** an empty-state message SHALL be displayed instead of an empty table

### Requirement: Each table row displays core Pokémon data
Every row in the Pokédex table SHALL display: sprite image (40×40), national dex number (zero-padded to 4 digits), localized name, type badge(s), generation number, category label, and registration status pill (Registered / Missing).

#### Scenario: Row shows correct data for a base Pokémon
- **WHEN** a base Pokémon row is rendered for Charizard (#6)
- **THEN** the row SHALL display Charizard's sprite, "#0006", the localized name, Fire and Flying type badges, "Gen 1", "Normal" category, and its current registration status

#### Scenario: Form row shows form-specific name, sprite, and types
- **WHEN** a form row is rendered for Mega Charizard X
- **THEN** the row SHALL display Mega Charizard X's sprite, the base dex number "#0006", the form's localized name, and Mega Charizard X's types (Fire, Dragon)

#### Scenario: Dex number is the base Pokémon's id for all form rows
- **WHEN** a form row is rendered
- **THEN** the displayed dex number SHALL be the base Pokémon's national dex id, not the form's internal id

### Requirement: Table supports column sorting
The user SHALL be able to sort the table by: dex number (default, ascending), name (A–Z), primary type (alphabetically), or generation (ascending). Clicking a column header that is already the active sort SHALL reverse direction (asc ↔ desc).

#### Scenario: Default sort is dex number ascending
- **WHEN** the page loads with no sort param in the URL
- **THEN** rows SHALL be ordered by national dex number ascending

#### Scenario: Clicking Name header sorts by localized name
- **WHEN** the user clicks the Name column header
- **THEN** rows SHALL be re-ordered alphabetically by the display name in the active locale

#### Scenario: Clicking an active sort header reverses direction
- **WHEN** the Name sort is active (ascending) and the user clicks Name again
- **THEN** rows SHALL be ordered by name descending

#### Scenario: Sort state is reflected in URL
- **WHEN** the user selects a sort column
- **THEN** the URL SHALL update to include `?sort=name` (or the relevant key) and `?dir=asc|desc`

### Requirement: Table supports filtering by generation
The user SHALL be able to filter rows to show only Pokémon from one or more specific generations via filter chips or a multi-select control.

#### Scenario: Selecting a generation filter limits rows
- **WHEN** the user selects generation 1 from the generation filter
- **THEN** only rows whose generation is 1 SHALL be displayed

#### Scenario: Clearing generation filter shows all active-generation rows
- **WHEN** the user clears the generation filter
- **THEN** rows from all generations in `useSettingsStore.activeGenerations` SHALL be shown

### Requirement: Table supports filtering by type
The user SHALL be able to filter rows to show only Pokémon that have a specific primary or secondary type.

#### Scenario: Type filter limits rows
- **WHEN** the user selects "Dragon" from the type filter
- **THEN** only rows whose types include Dragon SHALL be displayed

### Requirement: Table supports filtering by category
The user SHALL be able to filter rows by category: All, Normal, Legendary, Mythical, Baby, Ultra-Beast, or Paradox.

#### Scenario: Category filter limits rows
- **WHEN** the user selects "Legendary"
- **THEN** only rows with `category === 'legendary'` SHALL be displayed

### Requirement: Table has a local search input
The Pokédex page SHALL include a text input that filters rows in real time by Pokémon name (locale-aware, case-insensitive substring match) or dex number.

#### Scenario: Search by name substring filters rows
- **WHEN** the user types "saur" in the search input
- **THEN** only rows whose name contains "saur" (case-insensitive) SHALL be visible

#### Scenario: Search by dex number filters rows
- **WHEN** the user types "001" in the search input
- **THEN** the row for #0001 SHALL be shown (and any others matching "001" as a substring of their dex string)

#### Scenario: Search clears with the × button
- **WHEN** the search input is non-empty and the user clicks the clear button
- **THEN** the input SHALL be cleared and all rows matching other active filters SHALL return

### Requirement: Inline registration toggle per row
Each row SHALL display a registration status pill that, when clicked, immediately toggles the Pokémon's registered state without opening the detail card.

#### Scenario: Clicking "Missing" pill registers the Pokémon
- **WHEN** the user clicks the "Missing" status pill on an unregistered row
- **THEN** `toggleRegistered(pokemonId, formId?)` SHALL be called
- **THEN** the pill SHALL update to "Registered" immediately (optimistic)

#### Scenario: Clicking "Registered" pill unregisters the Pokémon
- **WHEN** the user clicks the "Registered" status pill on a registered row
- **THEN** `toggleRegistered(pokemonId, formId?)` SHALL be called
- **THEN** the pill SHALL update to "Missing" immediately

### Requirement: Row click opens PokemonCard side panel
Clicking anywhere on a row except the registration pill SHALL open the `PokemonCard` Sheet panel for that Pokémon.

#### Scenario: Row click opens PokemonCard
- **WHEN** the user clicks a row (outside the registration pill)
- **THEN** the `PokemonCard` Sheet SHALL open with the corresponding `pokemonId`

#### Scenario: PokemonCard closes on Escape or outside click
- **WHEN** the PokemonCard Sheet is open and the user presses Escape or clicks outside
- **THEN** the Sheet SHALL close and the table SHALL remain visible

### Requirement: Table is virtualized for performance
The Pokédex table SHALL use `@tanstack/react-virtual` to render only the DOM nodes for visible rows, keeping the page responsive even when the full list exceeds 1 000 rows.

#### Scenario: Only visible rows have DOM nodes
- **WHEN** the table contains 1 500 rows and 20 fit in the viewport
- **THEN** at most ~30 row DOM nodes SHALL exist in the document at any time (visible ± overscan)

### Requirement: Filter and sort state persists in URL search params
Active filters, sort column, sort direction, and search query SHALL be reflected in the URL so the state is bookmarkable.

#### Scenario: Filter application updates URL
- **WHEN** the user applies a type filter for "Fire"
- **THEN** the URL SHALL update to include `?type=fire` without a full page reload

#### Scenario: Pre-filled state from URL
- **WHEN** the user navigates to `/pokedex?gen=1&cat=legendary&sort=name`
- **THEN** the page SHALL render with generation 1 and Legendary filters active, sorted by name

### Requirement: Pokédex page is fully internationalized
All labels (column headers, filter labels, category names, status pills, empty state, search placeholder) SHALL be available in both PT-BR and EN locales.

#### Scenario: Column headers render in active locale
- **WHEN** the active locale is `pt-BR`
- **THEN** column headers and filter labels SHALL be displayed in Brazilian Portuguese
