## ADDED Requirements

### Requirement: Next.js project with App Router and TypeScript strict
The system SHALL be initialized as a Next.js 14+ project using App Router with TypeScript in strict mode. The project SHALL use `src/` as the source directory with `@/` path alias configured in `tsconfig.json`.

#### Scenario: Project builds successfully
- **WHEN** running `npm run build`
- **THEN** the project SHALL compile without errors and produce a valid Next.js build output

#### Scenario: Development server starts
- **WHEN** running `npm run dev`
- **THEN** the development server SHALL start and serve the application at `localhost:3000`

#### Scenario: Strict type checking enforced
- **WHEN** a source file contains an implicit `any` type
- **THEN** the TypeScript compiler SHALL report an error

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

### Requirement: ESLint configuration
The project SHALL include ESLint with Next.js recommended rules. The `npm run lint` script SHALL be available and pass on the initial project.

#### Scenario: Lint passes on clean project
- **WHEN** running `npm run lint`
- **THEN** no lint errors SHALL be reported

### Requirement: Prettier configuration
The project SHALL include Prettier for code formatting. The `npm run format` script SHALL be available.

#### Scenario: Format script available
- **WHEN** running `npm run format`
- **THEN** Prettier SHALL format all source files according to project rules

### Requirement: Package scripts
The project SHALL define the following npm scripts: `dev`, `build`, `start`, `lint`, `format`.

#### Scenario: All required scripts exist
- **WHEN** inspecting `package.json`
- **THEN** scripts `dev`, `build`, `start`, `lint`, and `format` SHALL be defined
