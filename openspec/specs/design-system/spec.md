## ADDED Requirements

### Requirement: Tailwind CSS with spec 5.1 color palette
The system SHALL use Tailwind CSS with a custom color palette matching spec section 5.1:
- Dark mode: Background `#0f0f0f`, Surface `#1a1a2e`, Accent `#e63946` (Poke Ball red)
- Light mode: Background `#f8f9fa`, Surface `#ffffff`, Accent `#e63946`

Colors SHALL be defined as CSS custom properties and referenced in Tailwind config.

#### Scenario: Dark mode colors applied
- **WHEN** the application is in dark mode
- **THEN** the background color SHALL be `#0f0f0f`, surface color SHALL be `#1a1a2e`, and accent color SHALL be `#e63946`

#### Scenario: Light mode colors applied
- **WHEN** the application is in light mode
- **THEN** the background color SHALL be `#f8f9fa`, surface color SHALL be `#ffffff`, and accent color SHALL be `#e63946`

### Requirement: Typography with Inter and JetBrains Mono
The system SHALL use Inter as the primary UI font and JetBrains Mono as the monospace font for numbers, IDs, and codes. Fonts SHALL be loaded via `next/font/google` with `display: swap`.

#### Scenario: Inter font applied to UI text
- **WHEN** rendering body text, headings, and UI labels
- **THEN** the Inter font family SHALL be applied

#### Scenario: JetBrains Mono applied to numeric content
- **WHEN** a component uses the monospace font class
- **THEN** the JetBrains Mono font family SHALL be applied

### Requirement: shadcn/ui initialization with base components
The system SHALL initialize shadcn/ui with the "new-york" style variant. Components SHALL be installed under `src/components/ui/`. The following base components SHALL be installed: Button, Card, Dialog, Tooltip, DropdownMenu, Badge, Input, Select, Tabs, Separator, Sheet.

#### Scenario: Base components importable
- **WHEN** a file imports from `@/components/ui/button`
- **THEN** the Button component SHALL be available and render without errors

#### Scenario: Components use shadcn/ui patterns
- **WHEN** inspecting installed UI components
- **THEN** they SHALL use `class-variance-authority` for variants and `cn()` utility for class merging

### Requirement: Dark/light mode toggle
The system SHALL support dark and light color modes using `next-themes`. Dark mode SHALL be the default (spec 5.1). A `ThemeToggle` component SHALL allow switching between modes. The selected mode SHALL persist across page reloads.

#### Scenario: Default theme is dark
- **WHEN** a user visits the application for the first time
- **THEN** the application SHALL render in dark mode

#### Scenario: Theme toggle switches modes
- **WHEN** the user clicks the ThemeToggle component
- **THEN** the application SHALL switch between dark and light modes
- **THEN** the `<html>` element SHALL have the `dark` class when in dark mode

#### Scenario: Theme persists across reloads
- **WHEN** the user selects light mode and reloads the page
- **THEN** the application SHALL load in light mode

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

### Requirement: Design tokens for borders and shadows
The system SHALL configure design tokens matching spec 5.1:
- Border radius: 8-12px (rounded corners)
- Subtle shadows for elevation
- Smooth transitions: 150-300ms duration

#### Scenario: Components use consistent border radius
- **WHEN** rendering cards, buttons, and containers
- **THEN** they SHALL use border radius between 8px and 12px

#### Scenario: Transitions are smooth
- **WHEN** interactive elements change state (hover, focus, toggle)
- **THEN** transitions SHALL use durations between 150ms and 300ms
