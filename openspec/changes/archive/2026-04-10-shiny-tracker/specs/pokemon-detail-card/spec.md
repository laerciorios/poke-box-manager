## ADDED Requirements

### Requirement: PokemonCard shows Register Shiny button when tracker is enabled
When `shinyTrackerEnabled` is `true` in `useSettingsStore`, `PokemonCard` SHALL render a "Register Shiny" button that reflects the current shiny-registration state for the displayed Pokémon (and the active form, if one is selected). Clicking the button SHALL call `usePokedexStore.toggleShinyRegistered(pokemonId, formId?)`.

#### Scenario: Register Shiny button is visible when tracker is enabled
- **WHEN** `PokemonCard` is open and `shinyTrackerEnabled` is `true`
- **THEN** a "Register Shiny" (or "Registered Shiny ✓") button SHALL be visible below the shiny sprite toggle

#### Scenario: Register Shiny button is hidden when tracker is disabled
- **WHEN** `PokemonCard` is open and `shinyTrackerEnabled` is `false`
- **THEN** no shiny registration button SHALL be rendered

#### Scenario: Button reflects current shiny-registration state
- **WHEN** the Pokémon is already shiny-registered
- **THEN** the button SHALL display in an "active" or "registered" visual state (e.g., filled variant)
- **WHEN** the Pokémon is not shiny-registered
- **THEN** the button SHALL display in an "inactive" or "outline" visual state

#### Scenario: Clicking the button toggles shiny registration
- **WHEN** the user clicks the "Register Shiny" button for an unregistered-shiny Pokémon
- **THEN** `toggleShinyRegistered(pokemonId)` SHALL be called (using active form's formId if a form is selected)
- **THEN** the button state SHALL update to reflect the new shiny-registration status

#### Scenario: Shiny registration uses the active form's key
- **WHEN** the user has selected an alternate form in the form switcher and clicks "Register Shiny"
- **THEN** `toggleShinyRegistered(pokemonId, activeFormId)` SHALL be called with the form's id
