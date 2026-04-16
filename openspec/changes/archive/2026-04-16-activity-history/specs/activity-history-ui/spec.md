## ADDED Requirements

### Requirement: ActivityHistoryPanel renders the activity log
The system SHALL provide an `ActivityHistoryPanel` component at `src/components/history/ActivityHistoryPanel.tsx` that displays the list of `ActivityEntry` records from `useHistoryStore`, ordered newest-first, with relative timestamps and action descriptions.

#### Scenario: Panel lists entries newest-first
- **WHEN** the panel is rendered with entries in the store
- **THEN** the most recent entry SHALL appear at the top of the list

#### Scenario: Each entry shows description and relative timestamp
- **WHEN** an entry is rendered
- **THEN** the entry's `description` SHALL be visible
- **THEN** a relative timestamp (e.g., "2 minutes ago", "just now") SHALL be shown next to the description

#### Scenario: Empty state when no history
- **WHEN** `entries` is empty
- **THEN** the panel SHALL display an empty-state message (e.g., "No recent activity")

#### Scenario: Panel is scrollable when entries exceed visible area
- **WHEN** more than ~5 entries are present
- **THEN** the panel SHALL be vertically scrollable without expanding indefinitely

### Requirement: ActivityHistoryPanel is collapsible
The panel SHALL be collapsible — the user can toggle it open or closed. The collapsed state SHALL be component-local (not persisted).

#### Scenario: Panel starts collapsed
- **WHEN** the panel is first rendered
- **THEN** the entry list SHALL be hidden and only the panel header (with title and toggle control) SHALL be visible

#### Scenario: Toggle expands and collapses the list
- **WHEN** the user clicks the toggle control
- **THEN** the entry list SHALL toggle between visible and hidden

### Requirement: Undo button on the most recent entry
The panel SHALL render an "Undo" button alongside the topmost (most recent) entry. Clicking it SHALL call `useHistoryStore.undoLast()`.

#### Scenario: Undo button visible on most recent entry only
- **WHEN** the panel is open and has at least one entry
- **THEN** an "Undo" button SHALL appear only on the first entry
- **THEN** all other entries SHALL NOT have an undo button

#### Scenario: Clicking undo removes the entry and reverses the action
- **WHEN** the user clicks "Undo" on the most recent entry
- **THEN** `undoLast()` SHALL be called
- **THEN** the entry SHALL disappear from the list
- **THEN** the affected store state SHALL be reversed (e.g., Pokémon becomes unregistered)

#### Scenario: No undo button when history is empty
- **WHEN** `entries` is empty
- **THEN** no "Undo" button SHALL be rendered

### Requirement: ActivityHistoryPanel surfaced on Home dashboard
The `ActivityHistoryPanel` SHALL be rendered on the Home page as a collapsible section below the quick stats / BoxCalculatorCard area.

#### Scenario: Panel visible on Home page
- **WHEN** the user navigates to the Home page
- **THEN** the `ActivityHistoryPanel` header SHALL be visible (collapsed by default)

### Requirement: ActivityHistoryPanel is localised
All user-facing strings in the panel (title, empty state, "Undo" button label, timestamp labels) SHALL use the app's i18n system with PT-BR and EN translations.

#### Scenario: Panel strings appear in user's locale
- **WHEN** the user's locale is `pt-BR`
- **THEN** the panel title, empty state, and button label SHALL appear in Portuguese
