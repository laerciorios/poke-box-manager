## ADDED Requirements

### Requirement: Stats dashboard shows shiny progress when tracker is enabled
When `shinyTrackerEnabled` is `true`, the stats page SHALL display a "Shiny Progress" section below the existing stats sections. The section SHALL show an overall shiny-registered count vs the full tracked total, and a generation-by-generation breakdown.

#### Scenario: Shiny section appears when tracker is enabled
- **WHEN** `shinyTrackerEnabled` is `true`
- **THEN** a "Shiny Progress" section SHALL be visible on the stats page showing the overall shiny-registered count

#### Scenario: Shiny section is absent when tracker is disabled
- **WHEN** `shinyTrackerEnabled` is `false`
- **THEN** no shiny progress section SHALL appear on the stats page

#### Scenario: Shiny overall count reflects registeredShiny store
- **WHEN** the user has 42 Pokémon in `registeredShiny`
- **THEN** the shiny overall count SHALL display 42 as the registered value

#### Scenario: Shiny total uses the same denominator as normal stats
- **WHEN** the shiny section renders
- **THEN** the total (denominator) SHALL equal the same filtered total used in the normal overall progress (active generations + variation toggles applied)

#### Scenario: Shiny generation bars reflect per-generation shiny counts
- **WHEN** the shiny progress section is rendered
- **THEN** one progress bar per active generation SHALL appear, each showing the shiny-registered count vs total for that generation

#### Scenario: Shiny stats update reactively
- **WHEN** the user shiny-registers a Pokémon in another view
- **THEN** the shiny progress section SHALL update without a page reload

## MODIFIED Requirements

### Requirement: Stats computed client-side via useStatsData hook
All statistics SHALL be derived entirely from `usePokedexStore`, `useBoxStore`, and `useSettingsStore` with no additional API calls or server-side data fetching beyond what is already available as static JSON. The hook SHALL additionally read `usePokedexStore.registeredShiny` and `useSettingsStore.shinyTrackerEnabled` when computing shiny statistics.

#### Scenario: No network requests on stats page
- **WHEN** the user navigates to the stats page
- **THEN** no new network requests SHALL be made to fetch Pokémon data

#### Scenario: Stats update reactively
- **WHEN** the user registers or unregisters a Pokémon in another part of the app
- **THEN** returning to or remaining on the stats page SHALL show updated counts without a page reload

#### Scenario: Shiny data absent when tracker disabled
- **WHEN** `shinyTrackerEnabled` is `false`
- **THEN** the `shiny` field returned by `useStatsData` SHALL be `undefined`
- **THEN** no shiny computation SHALL run (performance: skip the shiny accumulation pass)
