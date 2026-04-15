## ADDED Requirements

### Requirement: Home page shows BoxCalculatorCard widget
The system SHALL render a `BoxCalculatorCard` component on the Home dashboard, positioned within or below the quick stats row. The card SHALL be always visible (not user-dismissible) and SHALL reflect the user's current settings reactively.

#### Scenario: Widget visible on home page
- **WHEN** the user navigates to the Home page
- **THEN** the `BoxCalculatorCard` SHALL be visible showing the current box count derived from active settings

#### Scenario: Widget reflects live settings changes
- **WHEN** the user changes variation toggles or generation filters in settings and returns to the Home page
- **THEN** the widget SHALL display updated values matching the new settings
