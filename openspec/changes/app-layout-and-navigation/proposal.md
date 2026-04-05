## Why

The app shell (Sidebar, Header, root layout) exists as a scaffold but is missing key features from spec section 5.2: the Header lacks a global search bar and language switch, the Sidebar has no tablet breakpoint (jumps directly from mobile bottom nav to desktop fixed sidebar at 1024px), and mobile bottom nav truncates Settings/Presets without an overflow mechanism. These gaps block user workflows — search is a primary discovery tool, and the tablet layout is a common viewport for users managing Pokémon on secondary devices.

## What Changes

- Enhance `Header` with a global search bar (client-side filtering, not API), a `LanguageSwitch` component (PT-BR/EN toggle), and the existing `ThemeToggle`
- Create `LanguageSwitch` component to toggle between PT-BR and EN locales
- Enhance `Sidebar` with a collapsible drawer pattern for tablet viewports (768–1023px) using shadcn `Sheet`
- Add an overflow menu or "More" button to mobile bottom nav to access Settings and Presets
- Update root layout breakpoints to support the 3-tier responsive pattern (desktop fixed sidebar, tablet collapsible, mobile bottom nav)
- Create `SearchBar` component with client-side search input and keyboard shortcut (Cmd/Ctrl+K)

## Capabilities

### New Capabilities
- `global-search-bar`: SearchBar component with keyboard shortcut, client-side filtering input, and search results display area
- `language-switch`: LanguageSwitch component to toggle between PT-BR and EN locales, persisting preference

### Modified Capabilities
- `design-system`: Adding tablet collapsible sidebar breakpoint (768–1023px) and mobile overflow menu requirements to the responsive layout specification
- `project-foundation`: Updating the root layout to support the 3-tier responsive pattern and new Header composition

## Impact

- **Modified files**: `src/components/layout/Header.tsx`, `src/components/layout/Sidebar.tsx`, `src/app/layout.tsx`
- **New files**: `src/components/layout/LanguageSwitch.tsx`, `src/components/layout/SearchBar.tsx`, `src/components/layout/MobileMoreMenu.tsx`
- **UI dependencies used**: shadcn `Sheet` (for tablet collapsible sidebar), shadcn `Input` (for search bar), shadcn `DropdownMenu` (for mobile overflow)
- **No new npm dependencies** — all components use existing shadcn/ui primitives
- **Relates to**: spec section 5.2 (responsive layout), design system spec (responsive breakpoints)
