## MODIFIED Requirements

### Requirement: VariationTogglesPanel renders all 12 toggles
The system SHALL provide a `VariationTogglesPanel` component at `src/components/settings/VariationTogglesPanel.tsx` that renders a toggle row for each of the 12 keys in `VariationToggles`. On viewports `<768px`, the toggle list SHALL be wrapped in a collapsible section (collapsed by default). On viewports ≥768px, the full toggle list SHALL always be visible.

#### Scenario: All 12 toggle rows are rendered (desktop)
- **WHEN** `VariationTogglesPanel` is mounted on a viewport ≥768px
- **THEN** exactly 12 toggle rows SHALL be visible, one per `VariationToggles` key

#### Scenario: Toggle list is collapsed by default on mobile
- **WHEN** `VariationTogglesPanel` is first mounted on a viewport `<768px`
- **THEN** the toggle list SHALL be hidden (collapsed)
- **THEN** a collapsible trigger row SHALL be visible showing "Variation Filters (N active)" where N is the count of currently enabled toggles

#### Scenario: User expands the toggle list on mobile
- **WHEN** the user taps the collapsible trigger on a viewport `<768px`
- **THEN** the full list of 12 toggle rows SHALL become visible

#### Scenario: User collapses the toggle list on mobile
- **WHEN** the toggle list is expanded on mobile and the user taps the trigger again
- **THEN** the toggle list SHALL collapse and only the trigger row SHALL be visible

#### Scenario: Active toggle count in trigger updates in real time
- **WHEN** the toggle list is expanded on mobile and the user enables or disables a variation
- **THEN** the trigger row label SHALL update to reflect the new count of active toggles

#### Scenario: Toggle rows reflect store state
- **WHEN** a variation is enabled in `useSettingsStore`
- **THEN** the corresponding Switch control SHALL render in the checked/on state

#### Scenario: Toggle rows reflect disabled state
- **WHEN** a variation is disabled in `useSettingsStore`
- **THEN** the corresponding Switch control SHALL render in the unchecked/off state

### Requirement: Live total reflects active toggles
The panel SHALL display a running total section showing "Total with selected variations: N" and "Base total (no variations): M", where N updates in real time as toggles change. On mobile, the total summary SHALL remain visible outside the collapsible (always shown, even when the toggle list is collapsed).

#### Scenario: Total updates when toggle is enabled
- **WHEN** the user enables a variation toggle
- **THEN** the "Total with selected variations" number SHALL increase by the toggle's `additionalCount`

#### Scenario: Total updates when toggle is disabled
- **WHEN** the user disables a variation toggle
- **THEN** the "Total with selected variations" number SHALL decrease by the toggle's `additionalCount`

#### Scenario: Total summary visible on mobile while list is collapsed
- **WHEN** the variation toggle list is collapsed on mobile
- **THEN** the total summary section SHALL remain visible below the collapsible trigger
