## ADDED Requirements

### Requirement: Box name is editable via double-click
The box name displayed in `BoxNavigation` SHALL enter an inline edit mode when the user double-clicks it. Committing the edit calls `useBoxStore.renameBox`. Canceling restores the original name.

#### Scenario: Double-click enters edit mode
- **WHEN** the user double-clicks the box name text in `BoxNavigation`
- **THEN** the name text SHALL be replaced by a focused `<input>` element pre-filled with the current box name

#### Scenario: Pressing Enter commits the new name
- **WHEN** edit mode is active and the user presses Enter
- **THEN** `useBoxStore.renameBox(boxId, trimmedName)` SHALL be called with the trimmed input value
- **THEN** edit mode SHALL exit and the updated name SHALL be displayed

#### Scenario: Pressing Escape cancels the edit
- **WHEN** edit mode is active and the user presses Escape
- **THEN** `useBoxStore.renameBox` SHALL NOT be called
- **THEN** edit mode SHALL exit and the original name SHALL be restored

#### Scenario: Blurring the input commits the new name
- **WHEN** edit mode is active and the input loses focus (blur)
- **THEN** `useBoxStore.renameBox(boxId, trimmedName)` SHALL be called
- **THEN** edit mode SHALL exit

#### Scenario: Empty name is rejected
- **WHEN** the user submits (Enter or blur) with an empty or whitespace-only input
- **THEN** `useBoxStore.renameBox` SHALL NOT be called
- **THEN** the original box name SHALL be restored

### Requirement: Box name edit is accessible
The inline edit input SHALL have an accessible label so screen readers can identify it as a box name field.

#### Scenario: Input has an aria-label
- **WHEN** edit mode is active
- **THEN** the `<input>` SHALL have an `aria-label` attribute describing it as the box name field (e.g., "Edit box name")

### Requirement: Box label/color is assignable via a color picker popover
A color picker trigger button SHALL appear in the box header. Clicking it opens a `Popover` containing a palette of 8 named color swatches and a "Clear" option. Selecting a color calls `useBoxStore.renameBox`-equivalent action... The selected color key SHALL be stored in `Box.label` via a dedicated store action (or `setSlot` equivalent — the store's existing interface is used; if no dedicated color-setter exists, the page layer calls `setBoxes` with the updated box). The box header SHALL display a colored dot/badge when a label color is set.

#### Scenario: Color picker opens on button click
- **WHEN** the user clicks the palette/color icon button in the box header
- **THEN** a `Popover` SHALL open showing 8 colored swatches and a "Clear" swatch

#### Scenario: Selecting a color stores it in Box.label
- **WHEN** the user clicks a color swatch in the picker
- **THEN** `Box.label` SHALL be updated to the corresponding color key (e.g., `"red"`, `"blue"`)
- **THEN** the box header SHALL display a colored visual indicator matching the selected color
- **THEN** the popover SHALL close

#### Scenario: Clearing the color removes the label
- **WHEN** the user clicks "Clear" in the color picker
- **THEN** `Box.label` SHALL be set to `undefined`
- **THEN** no color indicator SHALL appear in the box header

#### Scenario: Box header shows color dot when label is set
- **WHEN** `Box.label` contains a valid color key
- **THEN** the box header SHALL render a small colored dot or badge adjacent to the box name

#### Scenario: No indicator when label is unset
- **WHEN** `Box.label` is `undefined`
- **THEN** no color indicator SHALL appear in the box header

### Requirement: Box store supports updating Box.label
The system SHALL provide a way to update `Box.label` for a given box ID. This SHALL be implemented as a new `setBoxLabel(boxId: string, label: string | undefined) => void` action on `useBoxStore`.

#### Scenario: setBoxLabel updates the label
- **WHEN** calling `setBoxLabel(boxId, "blue")`
- **THEN** the box with that ID SHALL have `label === "blue"`
- **THEN** other boxes SHALL be unchanged

#### Scenario: setBoxLabel clears the label
- **WHEN** calling `setBoxLabel(boxId, undefined)`
- **THEN** the box with that ID SHALL have `label === undefined`
