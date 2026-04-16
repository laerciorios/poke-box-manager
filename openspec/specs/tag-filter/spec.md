## ADDED Requirements

### Requirement: Tag filter panel

The system SHALL provide a `TagFilterPanel` component that displays a list of all user-created tags as toggleable filter chips. The panel SHALL be available in the filter/toolbar area of the Boxes screen, the Missing Pokémon screen, and the Pokédex screen.

#### Scenario: Filter panel shows all tags

- **WHEN** tags have been created and the filter panel is rendered
- **THEN** each tag SHALL appear as a chip with its color and name

#### Scenario: Filter panel hidden when no tags exist

- **WHEN** no tags have been created
- **THEN** the tag filter panel SHALL not be rendered (or show an empty state without visual noise)

### Requirement: Tag filter uses OR logic

When one or more tags are selected in the filter panel, the screen SHALL show only Pokémon/slots that have AT LEAST ONE of the selected tags assigned.

#### Scenario: Single tag filter

- **WHEN** the user selects one tag in the filter panel
- **THEN** only slots with that tag SHALL be visible

#### Scenario: Multiple tags filter (OR)

- **WHEN** the user selects two or more tags
- **THEN** slots with ANY of the selected tags SHALL be visible

#### Scenario: No tags selected shows all

- **WHEN** no tags are selected in the filter panel
- **THEN** all Pokémon/slots SHALL be shown (filter is inactive)

### Requirement: Tag filter works on Boxes screen

The Boxes screen SHALL integrate the `TagFilterPanel` and filter the displayed slots accordingly.

#### Scenario: Filtered box view

- **WHEN** a tag filter is active on the Boxes screen
- **THEN** slots without any of the selected tags SHALL be visually dimmed or hidden (configurable per UX decision)
- **THEN** slots matching the filter SHALL remain fully visible

### Requirement: Tag filter works on Missing Pokémon screen

The Missing Pokémon screen SHALL integrate the `TagFilterPanel` and filter the missing Pokémon list.

#### Scenario: Filtered missing list

- **WHEN** a tag filter is active on the Missing Pokémon screen
- **THEN** only missing Pokémon entries that have at least one of the selected tags assigned (in any slot) SHALL be shown

### Requirement: Tag filter works on Pokédex screen

The Pokédex screen SHALL integrate the `TagFilterPanel` and filter the Pokédex entries list.

#### Scenario: Filtered Pokédex

- **WHEN** a tag filter is active on the Pokédex screen
- **THEN** only Pokédex entries with at least one matching tag (in any slot) SHALL be shown

### Requirement: Tag filter state is local (not persisted)

Tag filter selections SHALL be component-local state (e.g., `useState`) and SHALL NOT be persisted to IndexedDB or the settings store. The filter SHALL reset on page navigation.

#### Scenario: Filter resets on navigation

- **WHEN** the user navigates away and returns to a screen
- **THEN** the tag filter panel SHALL have no tags selected
