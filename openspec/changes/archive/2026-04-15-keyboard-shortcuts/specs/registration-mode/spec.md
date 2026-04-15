## ADDED Requirements

### Requirement: Enter key toggles registration on keyboard-focused slot
When Registration Mode is active and a slot has keyboard focus (`focusedSlotIndex` is non-null), pressing `Enter` SHALL toggle the registration status of that slot, equivalent to a plain click on it.

#### Scenario: Enter registers an unregistered focused slot
- **WHEN** Registration Mode is active, `focusedSlotIndex` points to a non-empty slot whose Pokémon is not registered
- **THEN** pressing `Enter` SHALL call `usePokedexStore.toggleRegistered(pokemonId, formId)` for that slot
- **THEN** the slot SHALL render in the registered state

#### Scenario: Enter unregisters a registered focused slot
- **WHEN** Registration Mode is active, `focusedSlotIndex` points to a non-empty slot whose Pokémon is registered
- **THEN** pressing `Enter` SHALL call `usePokedexStore.toggleRegistered(pokemonId, formId)` for that slot
- **THEN** the slot SHALL render in the missing state

#### Scenario: Enter on focused empty slot has no effect
- **WHEN** Registration Mode is active and `focusedSlotIndex` points to a `null` slot
- **THEN** pressing `Enter` SHALL NOT call any registration action

#### Scenario: Enter has no effect when Registration Mode is inactive
- **WHEN** Registration Mode is inactive and `focusedSlotIndex` is non-null
- **THEN** pressing `Enter` SHALL NOT call any registration action
