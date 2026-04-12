## ADDED Requirements

### Requirement: BoxGrid accepts and renders keyboard focus state
The `BoxGrid` component SHALL accept a `keyboardFocusIndex?: number | null` prop. When this prop is non-null, the `BoxSlotCell` at that index SHALL render a keyboard focus ring. All other slots SHALL not render the focus ring.

#### Scenario: Focus ring appears on focused slot
- **WHEN** `BoxGrid` receives `keyboardFocusIndex={7}`
- **THEN** the `BoxSlotCell` at index 7 SHALL render with a keyboard focus ring class (e.g., `ring-2 ring-primary`)
- **THEN** all other `BoxSlotCell` components SHALL NOT render the keyboard focus ring

#### Scenario: No focus ring when keyboardFocusIndex is null
- **WHEN** `BoxGrid` receives `keyboardFocusIndex={null}` or the prop is omitted
- **THEN** no `BoxSlotCell` SHALL render a keyboard focus ring
