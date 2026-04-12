## MODIFIED Requirements

### Requirement: PresetEditor dialog
The system SHALL provide a `PresetEditor` component that, on viewports ≥768px, renders as a centered Dialog (`max-w-2xl`), and on viewports `<768px` renders as a bottom Sheet (`side="bottom"`, full-width, `max-h-[90dvh]` with scrollable rule list). The inner form content (name input, "Start from" select, rule list, and action buttons) SHALL be identical in both containers.

#### Scenario: Open editor for new preset
- **WHEN** the user clicks "New Preset"
- **THEN** the editor SHALL open (as Dialog on desktop, as bottom Sheet on mobile) with an empty name and one empty rule

#### Scenario: Open editor to customize a built-in preset
- **WHEN** the user clicks "Customize" on a built-in preset card
- **THEN** the editor SHALL open pre-filled with that preset's name (suffixed with " (Custom)") and a copy of its rules

#### Scenario: Open editor to edit an existing custom preset
- **WHEN** the user clicks "Edit" on a custom preset card
- **THEN** the editor SHALL open pre-filled with that preset's current name and rules

#### Scenario: Bottom sheet renders on mobile viewport
- **WHEN** the viewport width is less than 768px and the editor is opened
- **THEN** the editor SHALL slide up from the bottom of the screen as a Sheet
- **THEN** the rule list SHALL be scrollable within the Sheet without the entire page scrolling

#### Scenario: Dialog renders on desktop viewport
- **WHEN** the viewport width is 768px or greater and the editor is opened
- **THEN** the editor SHALL render as a centered Dialog with `max-w-2xl`

#### Scenario: Save creates a new custom preset
- **WHEN** the user fills in a name, configures at least one rule, and clicks "Save"
- **THEN** `usePresetsStore.createPreset` SHALL be called with the constructed `OrganizationPreset`
- **THEN** `isBuiltIn` SHALL be `false`
- **THEN** the editor SHALL close and the new preset SHALL appear in "My Presets"

#### Scenario: Save updates an existing custom preset
- **WHEN** the user edits an existing custom preset and clicks "Save"
- **THEN** `usePresetsStore.updatePreset` SHALL be called with the preset's id and changed fields

#### Scenario: Save blocked when name is empty
- **WHEN** the preset name field is empty
- **THEN** the "Save" button SHALL be disabled and a validation hint SHALL be shown
