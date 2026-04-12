## ADDED Requirements

### Requirement: Home page shows overall completion ring

The system SHALL display the user's overall Pokédex completion as a donut/ring chart on the Home page, showing the registered count, total count, and percentage. The ring SHALL reuse the `OverallDonut` component and respect active variation toggles and generation filters from `useSettingsStore`.

#### Scenario: User with partial completion

- **WHEN** the user navigates to the Home page with some Pokémon registered
- **THEN** the ring displays the correct percentage and registered/total counts

#### Scenario: Filters active

- **WHEN** the user has a generation filter active in settings
- **THEN** the ring reflects completion within the filtered scope only

### Requirement: Home page shows quick stats row

The system SHALL display a row of stat tiles below the completion ring including: total registered, total Pokémon, number of boxes in use, and total shiny count. All values SHALL be derived from `useStatsData` and SHALL update reactively when the user registers or removes Pokémon.

#### Scenario: Stats update after registration

- **WHEN** the user registers a new Pokémon and returns to Home
- **THEN** the registered count tile reflects the new total

### Requirement: Home page shows "Next Up" strip

The system SHALL display a horizontal scrollable strip of the next 5 missing Pokémon in national dex order. Each entry SHALL show the Pokémon's sprite and dex number. Clicking an entry SHALL open the `PokemonCard` detail sheet for that Pokémon. The strip SHALL respect active variation toggles and generation filters.

#### Scenario: Strip shows first missing Pokémon

- **WHEN** Pokémon #001–#003 are registered and #004 is missing
- **THEN** Bulbasaur (or the first missing entry) appears first in the strip

#### Scenario: Strip is empty when complete

- **WHEN** all Pokémon within the active filters are registered
- **THEN** the "Next Up" strip shows an empty-state message

#### Scenario: Click opens PokemonCard

- **WHEN** the user clicks a sprite in the strip
- **THEN** the PokemonCard sheet opens for that Pokémon

### Requirement: Home page shows recently registered strip

The system SHALL display a horizontal scrollable strip of the last 5 Pokémon registered, derived from the insertion order of the `registered[]` array. Each entry SHALL show the sprite and dex number. Clicking SHALL open the `PokemonCard` detail sheet. The strip SHALL be hidden if no Pokémon have been registered.

#### Scenario: Strip reflects last registered

- **WHEN** the user registers Pikachu as the most recent Pokémon
- **THEN** Pikachu appears first (leftmost) in the recently registered strip

#### Scenario: Strip hidden when empty

- **WHEN** the user has not registered any Pokémon
- **THEN** the recently registered strip is not rendered

### Requirement: Home page shows quick-action buttons

The system SHALL display a row of quick-action buttons linking to: Boxes (`/boxes`), Missing Pokémon (`/missing`), Stats (`/stats`), and Settings (`/settings`). These SHALL always be visible and SHALL be especially prominent on mobile where the sidebar is hidden.

#### Scenario: Navigation from quick action

- **WHEN** the user taps the "Boxes" quick-action button
- **THEN** the browser navigates to the Boxes page

### Requirement: Home page shows generation milestone badges

The system SHALL display a compact list of all active generations with inline milestone pip badges at 25%, 50%, 75%, 90%, and 100% thresholds. Reached milestones SHALL be visually distinguished from unreached ones. The list SHALL respect the active generation filters from `useSettingsStore`.

#### Scenario: Milestone reached

- **WHEN** a generation's completion reaches exactly 50%
- **THEN** the 50% milestone pip for that generation becomes visually active (filled/colored)

#### Scenario: All milestones unreached for new user

- **WHEN** the user has registered 0 Pokémon
- **THEN** all milestone pips appear in their inactive (unfilled) state

### Requirement: Home dashboard respects i18n

All user-visible strings on the Home page SHALL be translated via `next-intl` and available in both `en` and `pt-BR` locales using keys under the `Home.*` namespace.

#### Scenario: PT-BR locale

- **WHEN** the user's locale is set to `pt-BR`
- **THEN** all Home page labels render in Portuguese
