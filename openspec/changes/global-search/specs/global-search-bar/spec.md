## MODIFIED Requirements

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
