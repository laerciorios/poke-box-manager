## ADDED Requirements

### Requirement: PresetPreview panel
The system SHALL provide a `PresetPreview` component that renders a summary of the boxes that would result from applying a given preset, without modifying any stored state.

#### Scenario: Preview triggered by button
- **WHEN** the user clicks the "Preview" button in the `PresetEditor`
- **THEN** the `PresetPreview` panel SHALL become visible within or below the editor dialog

#### Scenario: Preview shows box names and slot counts
- **WHEN** the preview panel is shown
- **THEN** for each `Box` returned by `applyPreset`, it SHALL display the box name and the count of filled slots out of 30

#### Scenario: Preview reflects current editor state
- **WHEN** the user modifies rules and clicks "Preview" again
- **THEN** the preview SHALL re-run `applyPreset` and update the displayed boxes

#### Scenario: Preview uses all base Pokémon
- **WHEN** computing the preview
- **THEN** `applyPreset` SHALL be called with all base-species `PokemonEntry` items from `src/data/pokemon.json` (no form variants, no active variation filters applied)
- **THEN** the preview represents the maximum possible layout

#### Scenario: Preview shows total box and Pokémon count
- **WHEN** the preview panel is visible
- **THEN** a summary line SHALL display total box count and total Pokémon placed (e.g., "34 boxes · 1025 Pokémon")

#### Scenario: Empty rules produce no preview
- **WHEN** the editor has no rules configured
- **THEN** the preview SHALL show a message: "Add at least one rule to see a preview"
