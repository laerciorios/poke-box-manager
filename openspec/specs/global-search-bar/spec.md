## ADDED Requirements

### Requirement: SearchBar component in Header

The system SHALL provide a `SearchBar` component at `src/components/layout/SearchBar.tsx` that renders a text input for global search. The SearchBar SHALL be displayed in the `Header` component, positioned to the left of the theme and language controls. The SearchBar `value` and `onChange` SHALL be wired to the global `SearchContext` rather than local `Header` state, so the query is shared with the results panel.

#### Scenario: SearchBar renders in Header

- **WHEN** the application loads
- **THEN** a search input SHALL be visible in the Header
- **THEN** the input SHALL display a placeholder text indicating search functionality

#### Scenario: SearchBar emits value changes to search context

- **WHEN** the user types in the search input
- **THEN** `SearchContext.setQuery` SHALL be called with the current input value
- **THEN** the results panel SHALL open if the query is non-empty

### Requirement: Keyboard shortcut to focus search

The SearchBar SHALL be focusable via the Cmd+K (macOS) or Ctrl+K (Windows/Linux) keyboard shortcut.

#### Scenario: Cmd/Ctrl+K focuses the search input

- **WHEN** the user presses Cmd+K (macOS) or Ctrl+K (Windows/Linux) from anywhere in the app
- **THEN** the search input SHALL receive focus
- **THEN** the browser's default action for that shortcut SHALL be prevented

#### Scenario: Shortcut hint displayed in input

- **WHEN** the SearchBar is rendered and not focused
- **THEN** a visual hint showing "⌘K" (macOS) or "Ctrl+K" SHALL be displayed inside or beside the input

### Requirement: SearchBar is accessible

The SearchBar SHALL meet accessibility requirements.

#### Scenario: Screen reader label

- **WHEN** a screen reader encounters the SearchBar
- **THEN** the input SHALL have an accessible label describing its purpose

#### Scenario: Escape clears and blurs

- **WHEN** the search input has focus and the user presses Escape
- **THEN** the input value SHALL be cleared
- **THEN** the input SHALL lose focus
