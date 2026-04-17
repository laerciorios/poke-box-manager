## ADDED Requirements

### Requirement: Re-apply preset action reuses the preset engine

The box view SHALL expose a "Re-apply preset" action (defined in the `per-box-actions` capability) that calls the existing `applyPreset` function and commits via `useBoxStore.setBoxes`. No changes to the `applyPreset` function signature or behavior are required.

#### Scenario: Re-apply preset produces the same layout as initial autofill

- **WHEN** "Re-apply preset" is confirmed with the same preset and same registered keys as the original autofill
- **THEN** `useBoxStore.boxes` SHALL equal the result of `applyPreset(preset, pokemon, evolutionChains)`
- **THEN** the output SHALL follow all existing `preset-autofill` requirements (rule ordering, variation filters, registered flags, box name templates)

## MODIFIED Requirements

### Requirement: Auto-fill button applies preset to box store

The system SHALL provide an "Auto-fill" button in the box view that, when clicked, applies the currently selected preset via `applyPreset` and commits the result to `useBoxStore.setBoxes`. The resulting layout is a starting point only — users may freely modify boxes, slots, and counts after autofill without any constraint from the preset.

#### Scenario: Auto-fill with empty boxes proceeds immediately

- **WHEN** the user clicks "Auto-fill" and `useBoxStore.boxes` has no non-null slots
- **THEN** `applyPreset` SHALL be called with the active preset and current store state
- **THEN** `useBoxStore.setBoxes(boxes)` SHALL be called with the result
- **THEN** the box grid SHALL display the newly generated layout

#### Scenario: Auto-fill with existing data shows confirmation dialog

- **WHEN** the user clicks "Auto-fill" and at least one box slot is non-null
- **THEN** an `AlertDialog` SHALL appear warning that the current layout will be replaced
- **THEN** the existing box data SHALL remain unchanged until the user confirms

#### Scenario: User confirms auto-fill

- **WHEN** the user clicks "Confirm" in the auto-fill confirmation dialog
- **THEN** `applyPreset` SHALL be called and `useBoxStore.setBoxes` SHALL be committed
- **THEN** the dialog SHALL be dismissed

#### Scenario: User cancels auto-fill

- **WHEN** the user clicks "Cancel" in the auto-fill confirmation dialog
- **THEN** no changes SHALL be made to `useBoxStore`
- **THEN** the dialog SHALL be dismissed

#### Scenario: Post-autofill layout is freely editable

- **WHEN** the user applies a preset via autofill and then adds a box, removes a box, or changes a slot
- **THEN** those changes SHALL persist without any constraint from the originally applied preset
