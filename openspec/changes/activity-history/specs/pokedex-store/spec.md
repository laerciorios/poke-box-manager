## ADDED Requirements

### Requirement: Pokedex store pushes history entries on registration mutations
After each successful mutation, `usePokedexStore` SHALL call `useHistoryStore.getState().pushEntry(entry)` with an `ActivityEntry` describing the change. This applies to `toggleRegistered`, `registerAll`, and `unregisterAll`.

#### Scenario: toggleRegistered pushes a register entry
- **WHEN** `toggleRegistered(pokemonId)` registers a previously unregistered Pokémon
- **THEN** a `pushEntry` call SHALL be made with `actionType: 'register'` and `undoPayload.key` set to the registration key

#### Scenario: toggleRegistered pushes an unregister entry
- **WHEN** `toggleRegistered(pokemonId)` unregisters a previously registered Pokémon
- **THEN** a `pushEntry` call SHALL be made with `actionType: 'unregister'` and `undoPayload.key` set to the registration key

#### Scenario: registerAll pushes a bulk-register entry
- **WHEN** `registerAll(keys)` is called with a non-empty array
- **THEN** a single `pushEntry` call SHALL be made with `actionType: 'bulk-register'` and `undoPayload.keys` containing only the keys that were not already registered (the net-new registrations)

#### Scenario: registerAll with all already-registered keys does not push entry
- **WHEN** `registerAll(keys)` is called and all keys are already in `registered`
- **THEN** no `pushEntry` call SHALL be made (no effective change occurred)

#### Scenario: unregisterAll pushes a bulk-unregister entry
- **WHEN** `unregisterAll(keys)` is called with a non-empty array
- **THEN** a single `pushEntry` call SHALL be made with `actionType: 'bulk-unregister'` and `undoPayload.keys` containing only the keys that were actually registered before the call
