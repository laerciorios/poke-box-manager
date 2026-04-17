## ADDED Requirements

### Requirement: Per-box menu exposes Clear Box and Re-apply Preset actions

The box view SHALL expose a per-box action menu (e.g., via a "⋯" overflow button near the box header or `BoxNavigation`). It SHALL contain at minimum: "Clear box" and "Re-apply preset".

#### Scenario: Per-box action menu is reachable from the box view

- **WHEN** the user is viewing a box
- **THEN** a button or menu trigger SHALL be visible that opens the per-box action menu
- **THEN** the menu SHALL list "Clear box" and "Re-apply preset"

### Requirement: "Clear box" empties all slots after confirmation

Selecting "Clear box" SHALL display an `AlertDialog` warning that all 30 slots will be emptied. On confirmation, every slot in the current box is set to null.

#### Scenario: Clear box shows confirmation dialog

- **WHEN** the user selects "Clear box"
- **THEN** an `AlertDialog` SHALL appear with a warning message
- **THEN** the box SHALL remain unchanged until the user confirms

#### Scenario: Confirming Clear box empties all slots

- **WHEN** the user confirms the "Clear box" dialog
- **THEN** `useBoxStore.clearSlot(boxId, i)` SHALL be called for each occupied slot index 0–29 (or an equivalent batch clear action)
- **THEN** all 30 slots in the box SHALL render as empty

#### Scenario: Cancelling Clear box leaves the box unchanged

- **WHEN** the user dismisses the "Clear box" dialog
- **THEN** no slots SHALL be modified

### Requirement: "Re-apply preset" regenerates the full layout from the active preset

Selecting "Re-apply preset" SHALL display an `AlertDialog` warning that the current manual layout will be fully replaced. On confirmation, it calls `applyPreset` with the active preset and commits the result via `setBoxes`.

#### Scenario: Re-apply preset shows confirmation dialog

- **WHEN** the user selects "Re-apply preset"
- **THEN** an `AlertDialog` SHALL appear warning that all manual changes will be overwritten
- **THEN** the box layout SHALL remain unchanged until the user confirms

#### Scenario: Confirming Re-apply preset regenerates the full layout

- **WHEN** the user confirms the "Re-apply preset" dialog
- **THEN** `applyPreset` SHALL be called with the currently active preset and current store state
- **THEN** `useBoxStore.setBoxes(result)` SHALL be called, replacing the entire box array
- **THEN** the box view SHALL render the regenerated layout

#### Scenario: Cancelling Re-apply preset leaves the layout unchanged

- **WHEN** the user dismisses the "Re-apply preset" dialog
- **THEN** no changes SHALL be made to `useBoxStore`

#### Scenario: Re-apply preset is disabled when no preset is active

- **WHEN** `usePresetsStore` has no presets
- **THEN** the "Re-apply preset" menu item SHALL be disabled
- **THEN** a tooltip SHALL indicate that no preset is configured
