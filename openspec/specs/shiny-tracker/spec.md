## Requirements

### Requirement: Shiny Tracker mode is gated by a settings toggle
The system SHALL provide a `shinyTrackerEnabled: boolean` setting (default `false`) that, when disabled, hides all shiny-tracking UI entirely. No shiny registration data is lost when the toggle is turned off — it is merely hidden.

#### Scenario: Shiny tracker is disabled by default
- **WHEN** a user opens the app for the first time
- **THEN** `shinyTrackerEnabled` SHALL be `false`
- **THEN** no sparkle overlays, "Register Shiny" buttons, or shiny stats sections SHALL be visible

#### Scenario: Enabling shiny tracker reveals shiny UI
- **WHEN** the user enables the Shiny Tracker toggle in Settings
- **THEN** sparkle overlays SHALL appear on any box slot whose Pokémon is already shiny-registered
- **THEN** the "Register Shiny" button SHALL appear in PokemonCard
- **THEN** the shiny progress section SHALL appear on the stats page

#### Scenario: Disabling shiny tracker hides UI without deleting data
- **WHEN** the user disables the Shiny Tracker toggle
- **THEN** all shiny-tracking UI SHALL be hidden
- **THEN** `registeredShiny` data SHALL remain intact in the store (not cleared)
- **WHEN** the user re-enables the toggle
- **THEN** previously shiny-registered Pokémon SHALL still be shiny-registered

### Requirement: Shiny Tracker settings panel is in the Settings page
The system SHALL provide a `ShinyTrackerPanel` component in the Settings page with a toggle to enable/disable Shiny Tracker mode, a description of what it does, and a count of currently shiny-registered Pokémon (when enabled).

#### Scenario: Panel renders with toggle
- **WHEN** the user visits the Settings page
- **THEN** a "Shiny Tracker" section SHALL be visible with a labelled Switch control

#### Scenario: Shiny count shown when enabled
- **WHEN** shiny tracker is enabled and the user has at least one shiny-registered Pokémon
- **THEN** the panel SHALL display a count such as "N shiny Pokémon registered"
