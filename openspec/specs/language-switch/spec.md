## ADDED Requirements

### Requirement: LanguageSwitch component
The system SHALL provide a `LanguageSwitch` component at `src/components/layout/LanguageSwitch.tsx` that toggles between PT-BR and EN locales. The component SHALL render as a ghost-variant button displaying the current locale abbreviation ("PT" or "EN").

#### Scenario: Display current locale
- **WHEN** the LanguageSwitch is rendered
- **THEN** it SHALL display the abbreviation of the currently active locale ("PT" for pt-BR, "EN" for en)

#### Scenario: Toggle locale
- **WHEN** the user clicks the LanguageSwitch
- **THEN** the locale SHALL toggle from the current value to the other option (PT-BR ↔ EN)
- **THEN** the button label SHALL update to reflect the new locale

### Requirement: LanguageSwitch persists preference
The LanguageSwitch SHALL persist the selected locale so it survives page reloads.

#### Scenario: Locale preference survives reload
- **WHEN** the user selects EN and reloads the page
- **THEN** the LanguageSwitch SHALL display "EN" as the active locale

### Requirement: LanguageSwitch is accessible
The LanguageSwitch SHALL be accessible to assistive technologies.

#### Scenario: Accessible label
- **WHEN** a screen reader encounters the LanguageSwitch
- **THEN** the button SHALL have an `aria-label` describing its purpose (e.g., "Switch language")
