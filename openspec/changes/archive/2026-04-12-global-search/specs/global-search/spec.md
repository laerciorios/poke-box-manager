## ADDED Requirements

### Requirement: Search index covers all Pokémon names in both locales
The system SHALL build a search index from static Pokémon data that includes each Pokémon's English name, PT-BR name, and national dex number. The index SHALL be built once at module initialization.

#### Scenario: English name is searchable
- **WHEN** the user types "Charizard" into the search bar
- **THEN** Pokémon #6 SHALL appear in the results

#### Scenario: PT-BR name is searchable
- **WHEN** the user types "Charmander" in PT-BR locale (where the name may differ)
- **THEN** the matching Pokémon SHALL appear in the results regardless of which locale the user typed in

#### Scenario: Dex number search
- **WHEN** the user types "6" or "006" into the search bar
- **THEN** Pokémon #6 (Charizard) SHALL appear in the results

### Requirement: Search supports fuzzy matching for common typos
The search engine SHALL use trigram similarity scoring to return relevant results even when the query contains minor typos (up to ~2 character edits).

#### Scenario: Single-character typo is corrected
- **WHEN** the user types "charzard"
- **THEN** Charizard SHALL appear in the results with a non-zero match score

#### Scenario: Transposition typo is corrected
- **WHEN** the user types "piakchu"
- **THEN** Pikachu SHALL appear in the results

#### Scenario: Query below similarity threshold returns no match
- **WHEN** the user types a random string with no resemblance to any Pokémon name
- **THEN** the results list SHALL be empty

### Requirement: Search results panel displays enriched result cards
When the search input has a non-empty value, the system SHALL show a results panel with up to 20 matching Pokémon. Each result SHALL display: sprite image, localized name, national dex number (zero-padded to 4 digits), type badge(s), registration status indicator (registered / missing), and box location (box name + slot, or "Not in a box" if unplaced).

#### Scenario: Result card shows correct data
- **WHEN** a search result is displayed for a registered Pokémon placed in "Box 3"
- **THEN** the card SHALL show the Pokémon's sprite, name, "#0006", its type badge(s), a "Registered" indicator, and "Box 3"

#### Scenario: Unregistered Pokémon shows missing status
- **WHEN** a search result is displayed for a Pokémon not in `usePokedexStore`
- **THEN** the card SHALL show a "Missing" or unregistered indicator

#### Scenario: Unplaced Pokémon shows no box location
- **WHEN** a search result is displayed for a Pokémon not placed in any box slot
- **THEN** the card SHALL show "Not in a box" or equivalent label in the active locale

#### Scenario: Results are capped at 20
- **WHEN** the query matches more than 20 Pokémon
- **THEN** only the top 20 results by score SHALL be displayed

### Requirement: Results panel has quick filter chips
The results panel SHALL include quick filter chips for: type, generation, category (Normal / Legendary / Mythical), and registration status (All / Registered / Missing). Selecting a chip narrows results without clearing the query.

#### Scenario: User applies type filter chip
- **WHEN** the user clicks the "Fire" type chip
- **THEN** only results with Fire as one of their types SHALL be shown

#### Scenario: User applies registration status filter
- **WHEN** the user clicks the "Missing" chip
- **THEN** only unregistered Pokémon SHALL appear in results

#### Scenario: User clears a chip filter
- **WHEN** the user clicks an active chip again
- **THEN** the filter SHALL be deactivated and all matching results SHALL return

### Requirement: Clicking a result navigates to the Pokémon's location
Clicking a search result SHALL perform context-appropriate navigation: if the Pokémon is in a box, navigate to that box and highlight the slot; if not in a box, open the Pokémon detail card.

#### Scenario: Click result for boxed Pokémon
- **WHEN** the user clicks a result for a Pokémon in Box 3, slot 14
- **THEN** the app SHALL navigate to the boxes page with `?box=<boxId>&slot=14` in the URL
- **THEN** that slot SHALL be visually highlighted

#### Scenario: Click result for unplaced Pokémon
- **WHEN** the user clicks a result for a Pokémon not placed in any box
- **THEN** the Pokémon detail card (modal) SHALL open showing that Pokémon's data

#### Scenario: Results panel closes after navigation
- **WHEN** the user clicks any result
- **THEN** the results panel SHALL close and the search input SHALL be cleared

### Requirement: Search query can be pre-filled via URL param
The system SHALL read a `?search=<query>` URL parameter on page load and pre-fill the search input with that value, opening the results panel automatically.

#### Scenario: URL param pre-fills search
- **WHEN** the user navigates to any page with `?search=bulba` in the URL
- **THEN** the search input SHALL contain "bulba"
- **THEN** the results panel SHALL open showing matching results

### Requirement: Search input is debounced
The search engine SHALL only run after the user has stopped typing for 150ms to avoid excessive computation on every keystroke.

#### Scenario: Engine does not run on every keystroke
- **WHEN** the user rapidly types "charizard" character by character
- **THEN** the search engine SHALL run at most once per 150ms interval
- **THEN** results SHALL update within 200ms of the user stopping

### Requirement: Search panel is fully internationalized
All labels in the search panel (filter chips, status indicators, empty state, placeholder) SHALL be available in both PT-BR and EN locales.

#### Scenario: Panel labels render in PT-BR
- **WHEN** the active locale is `pt-BR`
- **THEN** all chip labels, status text, and empty-state messages SHALL be in Brazilian Portuguese

#### Scenario: Panel labels render in EN
- **WHEN** the active locale is `en`
- **THEN** all chip labels, status text, and empty-state messages SHALL be in English

### Requirement: Results panel closes on Escape or outside click
The results panel SHALL close when the user presses Escape or clicks outside the panel and search input area.

#### Scenario: Escape closes the panel
- **WHEN** the results panel is open and the user presses Escape
- **THEN** the panel SHALL close
- **THEN** the search input SHALL be cleared and lose focus

#### Scenario: Outside click closes the panel
- **WHEN** the results panel is open and the user clicks anywhere outside it
- **THEN** the panel SHALL close without clearing the query
