## MODIFIED Requirements

### Requirement: Directory structure follows spec section 2.2
The project SHALL create the following directory structure under `src/`:
- `app/` — App Router pages
- `components/ui/` — shadcn/ui base components
- `components/layout/` — Layout components (Sidebar, Header, ThemeToggle, SearchBar, LanguageSwitch, MobileMoreMenu)
- `components/boxes/` — Box-related components (empty, for future use)
- `components/pokemon/` — Pokemon-related components (empty, for future use)
- `components/pokedex/` — Pokedex components (empty, for future use)
- `components/stats/` — Stats components (empty, for future use)
- `components/settings/` — Settings components (empty, for future use)
- `lib/` — Utility libraries
- `types/` — TypeScript type definitions
- `stores/` — Zustand stores
- `data/` — Static data (build-time generated)
- `hooks/` — Custom React hooks
- `i18n/` — Internationalization (empty, for future use)
- `scripts/` — Build scripts (empty, for future use)

#### Scenario: All spec directories exist
- **WHEN** the project setup is complete
- **THEN** all directories listed above SHALL exist under `src/`

#### Scenario: Layout components include new files
- **WHEN** inspecting `src/components/layout/`
- **THEN** `SearchBar.tsx`, `LanguageSwitch.tsx`, and `MobileMoreMenu.tsx` SHALL exist alongside existing layout components
