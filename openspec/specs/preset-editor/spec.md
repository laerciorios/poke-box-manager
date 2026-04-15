## ADDED Requirements

### Requirement: Presets page — management hub

The system SHALL render the `/presets` page with two sections: "Built-in Presets" (read-only cards) and "My Presets" (editable cards), plus a "New Preset" button that opens the `PresetEditor` dialog.

#### Scenario: Built-in presets displayed as read-only

- **WHEN** the user visits `/presets`
- **THEN** all 8 built-in presets from `BUILTIN_PRESETS` SHALL be displayed with their name and description
- **THEN** built-in presets SHALL NOT have edit or delete actions (only "Use" and "Customize")

#### Scenario: Custom presets displayed with full actions

- **WHEN** the user has saved one or more custom presets
- **THEN** each custom preset SHALL show Edit, Duplicate, and Delete actions

#### Scenario: Empty custom presets state

- **WHEN** the user has no custom presets
- **THEN** an empty state message SHALL be shown with a "Create your first preset" call-to-action

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

#### Scenario: Seed rules from built-in preset

- **WHEN** the user selects a built-in preset from the "Start from" Select
- **THEN** the rule list SHALL be replaced with a deep copy of that preset's rules
- **THEN** if existing rules are present, a confirmation prompt SHALL appear before replacing

### Requirement: RuleRow component

The system SHALL render each `PresetRule` as a `RuleRow` with controls for all rule fields.

#### Scenario: Filter controls — categories

- **WHEN** editing a rule
- **THEN** a group of checkboxes SHALL allow selecting any combination of `PokemonCategory` values: normal, legendary, mythical, baby, ultra-beast, paradox
- **THEN** checking no categories SHALL result in `filter.categories` being `undefined` (no category filter)

#### Scenario: Filter controls — generations

- **WHEN** editing a rule
- **THEN** checkboxes for generations 1 through 9 SHALL allow multi-selection
- **THEN** checking no generations SHALL result in `filter.generations` being `undefined`

#### Scenario: Filter controls — types

- **WHEN** editing a rule
- **THEN** checkboxes for all 18 types (in canonical order) SHALL allow multi-selection
- **THEN** checking no types SHALL result in `filter.types` being `undefined`

#### Scenario: Match remaining toggle

- **WHEN** the user enables "Match remaining" on a rule
- **THEN** all filter checkboxes SHALL be disabled and `rule.filter` SHALL be set to `{}` (empty — catches everything not claimed by prior rules)

#### Scenario: Sort criteria selector

- **WHEN** editing a rule
- **THEN** a Select control SHALL offer all `SortCriteria` options: dex-number, name, type-primary, generation, evolution-chain, regional-dex
- **THEN** the selected value SHALL be stored in `rule.sort`

#### Scenario: Box name template input

- **WHEN** editing a rule
- **THEN** a text input SHALL allow entering a `boxNameTemplate` string
- **THEN** a hint SHALL display the available variables: `{n}`, `{total}`, `{start}`, `{end}`, `{gen}`, `{type}`, `{region}`

#### Scenario: Rule reordering

- **WHEN** a rule is not the first in the list
- **THEN** an ↑ button SHALL move it one position up
- **WHEN** a rule is not the last in the list
- **THEN** a ↓ button SHALL move it one position down

#### Scenario: Rule deletion

- **WHEN** there is more than one rule
- **THEN** each rule SHALL have a Delete (×) button that removes it from the list

### Requirement: Duplicate and delete custom presets

The system SHALL allow duplicating and deleting custom presets from the presets page.

#### Scenario: Duplicate a preset

- **WHEN** the user clicks "Duplicate" on any preset card (built-in or custom)
- **THEN** `usePresetsStore.duplicatePreset` SHALL be called
- **THEN** a copy SHALL appear in "My Presets" with " (Copy)" appended to the name

#### Scenario: Delete a custom preset

- **WHEN** the user clicks "Delete" on a custom preset
- **THEN** a confirmation dialog SHALL appear
- **WHEN** confirmed
- **THEN** `usePresetsStore.deletePreset` SHALL be called and the preset SHALL be removed from the list
