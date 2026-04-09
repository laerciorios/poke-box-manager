## ADDED Requirements

### Requirement: Pokedex store tracks registered Pokémon
The system SHALL provide a `usePokedexStore` Zustand store at `src/stores/usePokedexStore.ts` that tracks which Pokémon and forms the user has registered. Registration state SHALL be stored as a `Set<string>` of composite keys (`"{pokemonId}"` for base forms, `"{pokemonId}:{formId}"` for alternate forms).

#### Scenario: Register a base Pokémon
- **WHEN** calling `toggleRegistered(25)` for an unregistered Pokémon
- **THEN** the key `"25"` SHALL be added to the registered set
- **THEN** `isRegistered(25)` SHALL return `true`

#### Scenario: Register a specific form
- **WHEN** calling `toggleRegistered(25, "pikachu-gmax")` for an unregistered form
- **THEN** the key `"25:pikachu-gmax"` SHALL be added to the registered set
- **THEN** `isRegistered(25, "pikachu-gmax")` SHALL return `true`

#### Scenario: Unregister a Pokémon
- **WHEN** calling `toggleRegistered(25)` for an already registered Pokémon
- **THEN** the key `"25"` SHALL be removed from the registered set
- **THEN** `isRegistered(25)` SHALL return `false`

### Requirement: Bulk registration operations
The system SHALL support bulk operations for registering and unregistering multiple Pokémon at once.

#### Scenario: Register all Pokémon in a list
- **WHEN** calling `registerAll(keys)` with an array of string keys
- **THEN** all provided keys SHALL be added to the registered set

#### Scenario: Unregister all Pokémon in a list
- **WHEN** calling `unregisterAll(keys)` with an array of string keys
- **THEN** all provided keys SHALL be removed from the registered set

#### Scenario: Clear all registrations
- **WHEN** calling `clearAll()`
- **THEN** the registered set SHALL be empty
- **THEN** `isRegistered` SHALL return `false` for any Pokémon

### Requirement: Pokedex store persists to IndexedDB
The `usePokedexStore` SHALL persist its state to IndexedDB using the `createPersistedStore` helper with store name `"pokedex"` and schema version `1`.

#### Scenario: State survives page reload
- **WHEN** a Pokémon is registered and the page is reloaded
- **THEN** the registered state SHALL be restored from IndexedDB
- **THEN** `isRegistered` SHALL return the same values as before reload
