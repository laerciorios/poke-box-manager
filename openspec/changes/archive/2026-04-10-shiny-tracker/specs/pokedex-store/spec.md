## ADDED Requirements

### Requirement: Pokedex store tracks shiny-registered Pokémon
The system SHALL add a `registeredShiny: string[]` field to `usePokedexStore` that tracks which Pokémon and forms the user has registered a shiny version of. Keys SHALL use the identical composite-key format as `registered` (`"pokemonId"` for base, `"pokemonId:formId"` for alternate forms). The field SHALL default to an empty array and SHALL persist to IndexedDB.

#### Scenario: Toggle shiny registration for a base Pokémon
- **WHEN** calling `toggleShinyRegistered(25)` for an unregistered-shiny Pokémon
- **THEN** the key `"25"` SHALL be added to `registeredShiny`
- **THEN** `isShinyRegistered(25)` SHALL return `true`

#### Scenario: Toggle shiny registration for an alternate form
- **WHEN** calling `toggleShinyRegistered(25, "pikachu-gmax")` for an unregistered-shiny form
- **THEN** the key `"25:pikachu-gmax"` SHALL be added to `registeredShiny`
- **THEN** `isShinyRegistered(25, "pikachu-gmax")` SHALL return `true`

#### Scenario: Toggling an already shiny-registered Pokémon removes it
- **WHEN** calling `toggleShinyRegistered(25)` for an already shiny-registered Pokémon
- **THEN** the key `"25"` SHALL be removed from `registeredShiny`
- **THEN** `isShinyRegistered(25)` SHALL return `false`

#### Scenario: Shiny registration is independent of normal registration
- **WHEN** a Pokémon is shiny-registered but not normally registered
- **THEN** `isRegistered(pokemonId)` SHALL return `false`
- **THEN** `isShinyRegistered(pokemonId)` SHALL return `true`

### Requirement: Bulk shiny registration operations
The store SHALL support `registerAllShiny(keys)` and `unregisterAllShiny(keys)` for operating on multiple shiny registrations at once.

#### Scenario: Register multiple shiny Pokémon
- **WHEN** calling `registerAllShiny(["1", "4", "7"])` 
- **THEN** all provided keys SHALL be present in `registeredShiny`

#### Scenario: Unregister multiple shiny Pokémon
- **WHEN** calling `unregisterAllShiny(["1", "4"])`
- **THEN** those keys SHALL be removed from `registeredShiny`

## MODIFIED Requirements

### Requirement: Pokedex store persists to IndexedDB
The `usePokedexStore` SHALL persist its state to IndexedDB using the `createPersistedStore` helper with store name `"pokedex"` and schema version `2`.

The migration from version `1` to version `2` SHALL add `registeredShiny: []` to any previously persisted state object that is missing the field.

#### Scenario: State survives page reload
- **WHEN** a Pokémon is shiny-registered and the page is reloaded
- **THEN** the shiny registration state SHALL be restored from IndexedDB
- **THEN** `isShinyRegistered` SHALL return the same values as before reload

#### Scenario: Migration from v1 adds empty registeredShiny
- **WHEN** a user's IndexedDB contains a `pokedex` store at version `1` (without `registeredShiny`)
- **THEN** on next app load the migration SHALL run
- **THEN** the resulting state SHALL contain `registeredShiny: []`
- **THEN** the existing `registered` array SHALL be preserved unchanged
