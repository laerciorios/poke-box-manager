## MODIFIED Requirements

### Requirement: Responsive layout foundation
The system SHALL provide CSS foundations for responsive behavior as defined in spec 5.2:
- Desktop (≥1024px): Fixed sidebar visible alongside the content area
- Tablet (768–1023px): Collapsible sidebar via Sheet drawer, triggered by a hamburger button in the Header
- Mobile (<768px): Bottom navigation bar with overflow "More" menu for additional items

#### Scenario: Desktop layout
- **WHEN** the viewport is 1024px or wider
- **THEN** the sidebar SHALL be fixed and visible alongside the content area
- **THEN** the hamburger button SHALL NOT be visible

#### Scenario: Tablet layout
- **WHEN** the viewport is between 768px and 1023px
- **THEN** the fixed sidebar SHALL be hidden
- **THEN** a hamburger button SHALL be visible in the Header
- **THEN** clicking the hamburger button SHALL open a Sheet drawer from the left containing all navigation links

#### Scenario: Tablet Sheet closes on navigation
- **WHEN** the tablet Sheet sidebar is open and the user clicks a navigation link
- **THEN** the Sheet SHALL close
- **THEN** the app SHALL navigate to the selected route

#### Scenario: Mobile layout
- **WHEN** the viewport is narrower than 768px
- **THEN** a bottom navigation bar SHALL be visible with the primary navigation items
- **THEN** a "More" menu button SHALL provide access to additional navigation items (Missing, Settings, Presets)
- **THEN** the hamburger button SHALL NOT be visible

### Requirement: Root layout with sidebar navigation
The system SHALL provide a root layout containing:
- A sidebar with navigation links to: Home, Boxes, Pokedex, Stats, Missing, Settings, Presets
- A header area containing a SearchBar, LanguageSwitch, and ThemeToggle
- Lucide React icons for each navigation item

#### Scenario: Navigation links visible
- **WHEN** the application loads on desktop
- **THEN** the sidebar SHALL display navigation links to all main sections with corresponding icons

#### Scenario: Header contains all controls
- **WHEN** the application loads
- **THEN** the Header SHALL contain the SearchBar, LanguageSwitch, and ThemeToggle

#### Scenario: Layout persists across navigation
- **WHEN** navigating between pages
- **THEN** the sidebar and header SHALL remain visible without re-rendering
