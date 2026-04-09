## ADDED Requirements

### Requirement: VariationTogglesPanel renders all 12 toggles
The system SHALL provide a `VariationTogglesPanel` component at `src/components/settings/VariationTogglesPanel.tsx` that renders a toggle row for each of the 12 keys in `VariationToggles`: `regionalForms`, `genderForms`, `unownLetters`, `vivillonPatterns`, `alcremieVariations`, `colorVariations`, `sizeVariations`, `megaEvolutions`, `gmaxForms`, `battleForms`, `originForms`, and `costumedPokemon`.

#### Scenario: All 12 toggle rows are rendered
- **WHEN** `VariationTogglesPanel` is mounted
- **THEN** exactly 12 toggle rows SHALL be visible, one per `VariationToggles` key

#### Scenario: Toggle rows reflect store state
- **WHEN** a variation is enabled in `useSettingsStore`
- **THEN** the corresponding Switch control SHALL render in the checked/on state

#### Scenario: Toggle rows reflect disabled state
- **WHEN** a variation is disabled in `useSettingsStore`
- **THEN** the corresponding Switch control SHALL render in the unchecked/off state

### Requirement: Each toggle row displays name, examples, and additional count
Each toggle row SHALL display: a human-readable name, a subtitle with example Pokémon names, and the number of additional Pokémon forms that toggle adds (derived from `VARIATION_COUNTS`).

#### Scenario: Additional count shown for enabled toggle
- **WHEN** a toggle row is rendered
- **THEN** a badge or label showing `+N pokémon` SHALL be visible, where N is the count from `VARIATION_COUNTS`

#### Scenario: Example Pokémon subtitle is present
- **WHEN** a toggle row is rendered
- **THEN** a subtitle line with at least one example Pokémon name SHALL be visible

### Requirement: Toggling a switch updates the settings store
The system SHALL call `useSettingsStore.setVariation(key, value)` when the user interacts with a Switch control.

#### Scenario: User enables a toggle
- **WHEN** the user clicks a Switch that is currently off
- **THEN** `setVariation(key, true)` SHALL be called with the corresponding key
- **THEN** the Switch SHALL render in the on state

#### Scenario: User disables a toggle
- **WHEN** the user clicks a Switch that is currently on
- **THEN** `setVariation(key, false)` SHALL be called with the corresponding key
- **THEN** the Switch SHALL render in the off state

### Requirement: Live total reflects active toggles
The panel SHALL display a running total section showing "Total with selected variations: N" and "Base total (no variations): M", where N updates in real time as toggles change.

#### Scenario: Total updates when toggle is enabled
- **WHEN** the user enables a variation toggle
- **THEN** the "Total with selected variations" number SHALL increase by the toggle's `additionalCount`

#### Scenario: Total updates when toggle is disabled
- **WHEN** the user disables a variation toggle
- **THEN** the "Total with selected variations" number SHALL decrease by the toggle's `additionalCount`

#### Scenario: Base total is always constant
- **WHEN** any combination of toggles is active
- **THEN** the "Base total (no variations)" number SHALL remain constant and equal to the count of non-variation Pokémon entries

### Requirement: Warning shown when disabling a toggle with registered forms
The panel SHALL display a non-blocking warning indicator on a toggle row when: (a) the toggle is currently enabled, and (b) the Pokédex has at least one registered form whose `formType` maps to that toggle key.

#### Scenario: Warning appears for a toggle with registered forms
- **WHEN** a toggle is on and the user has registered at least one form belonging to that toggle's formTypes
- **THEN** a warning icon or label SHALL appear on that toggle row indicating that turning it off will hide registered data

#### Scenario: Warning is absent when no forms are registered
- **WHEN** a toggle is on but no forms belonging to it are registered
- **THEN** no warning indicator SHALL appear on that row

#### Scenario: Disabling a toggle does not delete registered data
- **WHEN** the user disables a toggle that has registered forms
- **THEN** the registered forms SHALL remain in `usePokedexStore` unchanged
- **THEN** only the visibility/counting of those forms SHALL change

### Requirement: VariationToggleItem is a pure presentational component
The system SHALL provide a `VariationToggleItem` component at `src/components/settings/VariationToggleItem.tsx` that accepts all its data via props and emits changes via a callback, with no direct store access.

#### Scenario: Renders from props only
- **WHEN** `VariationToggleItem` is rendered with `checked`, `label`, `subtitle`, `additionalCount`, `hasWarning`, and `onToggle` props
- **THEN** it SHALL render correctly without accessing any Zustand store directly

#### Scenario: Calls onToggle callback on interaction
- **WHEN** the user clicks the Switch inside `VariationToggleItem`
- **THEN** the `onToggle(newValue: boolean)` callback SHALL be called with the new boolean value
