## ADDED Requirements

### Requirement: Registration state changes are announced to screen readers
When a Pokémon is registered or unregistered (individually or in bulk), the system SHALL announce the outcome to screen readers via a shared `aria-live="polite"` region.

#### Scenario: Single registration announced
- **WHEN** the user registers a single Pokémon in Registration Mode
- **THEN** the live region SHALL announce "Bulbasaur registered" (localized, using the Pokémon's name)

#### Scenario: Single unregistration announced
- **WHEN** the user unregisters a single Pokémon in Registration Mode
- **THEN** the live region SHALL announce "Bulbasaur unregistered" (localized)

#### Scenario: Bulk registration announced
- **WHEN** the user registers N selected Pokémon via the floating action bar
- **THEN** the live region SHALL announce "3 Pokémon registered" (localized, with count)

#### Scenario: Bulk unregistration announced
- **WHEN** the user unregisters N selected Pokémon via the floating action bar
- **THEN** the live region SHALL announce "3 Pokémon unregistered" (localized, with count)
