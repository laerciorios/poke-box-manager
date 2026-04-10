## ADDED Requirements

### Requirement: Missing Pokémon page is accessible at /missing route
The system SHALL provide a dedicated page at the `/missing` route that lists all Pokémon not yet registered by the user.

#### Scenario: Navigating to /missing shows unregistered Pokémon
- **WHEN** the user navigates to `/missing`
- **THEN** the page SHALL render and display all Pokémon whose dex IDs are returned by `usePokedexStore.getMissingPokemon()`

#### Scenario: Empty state when all Pokémon are registered
- **WHEN** `getMissingPokemon()` returns an empty array
- **THEN** the page SHALL display an empty-state message indicating the Pokédex is complete

### Requirement: Missing list respects variation toggles and active generation filters
The missing screen SHALL only show Pokémon and forms that are visible under the current `useSettingsStore` variation toggles and active generation settings.

#### Scenario: Forms whose variation toggle is off are excluded
- **WHEN** a variation toggle (e.g. `megaEvolutions`) is disabled in `useSettingsStore`
- **THEN** forms belonging to that variation type SHALL NOT appear in the missing list

#### Scenario: Pokémon from inactive generations are excluded
- **WHEN** a generation is not active in `useSettingsStore`
- **THEN** Pokémon from that generation SHALL NOT appear in the missing list

### Requirement: Missing Pokémon are displayed as sprite cards
Each unregistered Pokémon SHALL be displayed as a card showing: sprite image, dex number, localized name, and type badge(s).

#### Scenario: Sprite card renders correct data
- **WHEN** a missing entry card is rendered
- **THEN** it SHALL display the Pokémon's official sprite, national dex number, name in the active locale, and at least one type badge

#### Scenario: Sprite image falls back gracefully
- **WHEN** a sprite image fails to load
- **THEN** the card SHALL display a placeholder silhouette without breaking the layout

### Requirement: Missing list supports filtering by generation
The user SHALL be able to filter the missing list to show only Pokémon from one or more specific generations.

#### Scenario: User selects a single generation filter
- **WHEN** the user selects generation 1 from the generation filter
- **THEN** only missing Pokémon from generation 1 SHALL be displayed

#### Scenario: User clears the generation filter
- **WHEN** the user clears the generation filter (selects "All")
- **THEN** missing Pokémon from all active generations SHALL be displayed

### Requirement: Missing list supports filtering by type
The user SHALL be able to filter the missing list to show only Pokémon that have a specific type.

#### Scenario: User selects a type filter
- **WHEN** the user selects "Fire" from the type filter
- **THEN** only missing Pokémon that have Fire as one of their types SHALL be displayed

#### Scenario: User clears the type filter
- **WHEN** the user clears the type filter
- **THEN** missing Pokémon of all types SHALL be displayed

### Requirement: Missing list supports filtering by category
The user SHALL be able to filter the missing list by category: All, Normal, Legendary, or Mythical.

#### Scenario: User filters by Legendary
- **WHEN** the user selects the "Legendary" category filter
- **THEN** only missing Pokémon with category `legendary` SHALL be displayed

#### Scenario: User filters by Mythical
- **WHEN** the user selects the "Mythical" category filter
- **THEN** only missing Pokémon with category `mythical` SHALL be displayed

#### Scenario: User selects All categories
- **WHEN** the user selects the "All" category filter
- **THEN** missing Pokémon of all categories SHALL be displayed

### Requirement: Missing list supports sorting
The user SHALL be able to sort the missing list by: dex number (ascending), name (A–Z), first type (alphabetically), or generation (ascending).

#### Scenario: Default sort is by dex number ascending
- **WHEN** the missing page loads with no sort parameter in the URL
- **THEN** the list SHALL be sorted by national dex number in ascending order

#### Scenario: User selects sort by name
- **WHEN** the user selects "Name" from the sort control
- **THEN** the list SHALL be re-ordered alphabetically by localized Pokémon name

#### Scenario: User selects sort by type
- **WHEN** the user selects "Type" from the sort control
- **THEN** the list SHALL be ordered alphabetically by the Pokémon's primary type

#### Scenario: User selects sort by generation
- **WHEN** the user selects "Generation" from the sort control
- **THEN** the list SHALL be ordered by generation number ascending, with dex order as secondary sort

### Requirement: Filter and sort state persists in URL search parameters
Active filters and sort selection SHALL be reflected in the page URL as query parameters so the state is bookmarkable and shareable.

#### Scenario: Applying a filter updates the URL
- **WHEN** the user selects a generation filter
- **THEN** the URL SHALL update to include the corresponding query parameter (e.g. `?gen=1`) without a full page reload

#### Scenario: Loading a URL with filter params pre-applies filters
- **WHEN** the user navigates to `/missing?gen=2&cat=legendary`
- **THEN** the page SHALL render with generation 2 and Legendary filters already active

### Requirement: Quick Add button marks a Pokémon as registered inline
Each missing Pokémon card SHALL display a "Quick Add" button that, when clicked, immediately registers the Pokémon and removes the card from the missing list.

#### Scenario: User clicks Quick Add on a card
- **WHEN** the user clicks the Quick Add button on a missing Pokémon card
- **THEN** `usePokedexStore.toggleRegistered(id)` SHALL be called
- **THEN** the card SHALL be removed from the visible list immediately (optimistic update)

#### Scenario: Quick Add respects form-level registration
- **WHEN** a missing entry is an alternate form (e.g. Mega Charizard X)
- **THEN** clicking Quick Add SHALL call `toggleRegistered(pokemonId, formId)` with the correct composite key

### Requirement: "Next up" mode shows the next N missing in dex order
The page SHALL support a "Next up" mode activated via the `?nextup=N` URL parameter that restricts the view to the first N missing Pokémon in ascending dex order.

#### Scenario: Next up mode is activated via URL
- **WHEN** the user navigates to `/missing?nextup=10`
- **THEN** the page SHALL display exactly 10 (or fewer if less than 10 are missing) Pokémon in ascending dex order

#### Scenario: Next up mode displays a contextual banner
- **WHEN** Next up mode is active
- **THEN** a banner SHALL be visible stating "Showing next N missing in dex order" where N is the active count

#### Scenario: User can change the Next up count
- **WHEN** Next up mode is active
- **THEN** the banner SHALL include a selector with options: 5, 10, 20, 50
- **WHEN** the user selects a different count
- **THEN** the URL SHALL update to `?nextup=<new count>` and the list SHALL update accordingly

#### Scenario: Filter controls are hidden in Next up mode
- **WHEN** Next up mode is active
- **THEN** the generation, type, and category filter controls SHALL NOT be visible (Next up mode implies dex-order with no additional filtering)

### Requirement: Missing screen is fully internationalized
All user-facing text on the missing screen (labels, buttons, empty states, banners) SHALL be available in both PT-BR and EN locales.

#### Scenario: Page renders in PT-BR locale
- **WHEN** the active locale is `pt-BR`
- **THEN** all labels, button text, and messages SHALL be displayed in Brazilian Portuguese

#### Scenario: Page renders in EN locale
- **WHEN** the active locale is `en`
- **THEN** all labels, button text, and messages SHALL be displayed in English

#### Scenario: Pokémon names reflect active locale
- **WHEN** the active locale is `pt-BR`
- **THEN** Pokémon names SHALL be displayed using their localized PT-BR names where available
