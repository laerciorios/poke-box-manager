## 1. Project Initialization

- [x] 1.1 Initialize Next.js 14+ project with App Router, TypeScript strict, and `src/` directory
- [x] 1.2 Configure `tsconfig.json` with strict mode and `@/` path alias
- [x] 1.3 Install and configure ESLint with Next.js recommended rules
- [x] 1.4 Install and configure Prettier, add `format` script to `package.json`
- [x] 1.5 Verify all required npm scripts exist: `dev`, `build`, `start`, `lint`, `format`

## 2. Directory Structure

- [x] 2.1 Create all spec 2.2 directories under `src/`: `components/{ui,layout,boxes,pokemon,pokedex,stats,settings}`, `lib/`, `types/`, `stores/`, `data/`, `hooks/`, `i18n/`, `scripts/`
- [x] 2.2 Add `.gitkeep` files to empty directories to preserve structure in git

## 3. Typography

- [x] 3.1 Configure Inter font via `next/font/google` with `display: swap`
- [x] 3.2 Configure JetBrains Mono font via `next/font/google` with `display: swap`
- [x] 3.3 Apply Inter as the default body font and expose JetBrains Mono via a CSS class (e.g., `font-mono`)

## 4. Tailwind CSS and Theme

- [x] 4.1 Configure CSS custom properties for light/dark palettes matching spec 5.1 (background, surface, accent colors)
- [x] 4.2 Extend Tailwind config to reference CSS custom properties as theme colors
- [x] 4.3 Add design tokens: border-radius (8-12px), shadows, transition durations (150-300ms)

## 5. shadcn/ui Setup

- [x] 5.1 Initialize shadcn/ui with "new-york" style variant and configure `components.json`
- [x] 5.2 Install base components: Button, Card, Dialog, Tooltip, DropdownMenu, Badge, Input, Select, Tabs, Separator, Sheet
- [x] 5.3 Verify `cn()` utility and `class-variance-authority` are available

## 6. Dark/Light Mode

- [x] 6.1 Install `next-themes` and configure `ThemeProvider` with `attribute="class"` and `defaultTheme="dark"`
- [x] 6.2 Add `ThemeProvider` wrapper to root layout with `suppressHydrationWarning` on `<html>`
- [x] 6.3 Create `ThemeToggle` component at `src/components/layout/ThemeToggle.tsx` using Lucide icons (Sun/Moon)
- [x] 6.4 Verify theme persists across page reloads

## 7. Zustand Setup

- [x] 7.1 Install Zustand as a dependency
- [x] 7.2 Create persist helper utility at `src/lib/store.ts` with consistent configuration for future stores
- [x] 7.3 Verify the persist helper works by creating a minimal example (can be removed after verification)

## 8. Layout and Navigation

- [x] 8.1 Create `Sidebar` component at `src/components/layout/Sidebar.tsx` with navigation links (Home, Boxes, Pokedex, Stats, Missing, Settings, Presets) and Lucide React icons
- [x] 8.2 Create `Header` component at `src/components/layout/Header.tsx` with ThemeToggle
- [x] 8.3 Create root layout at `src/app/layout.tsx` wiring Sidebar, Header, ThemeProvider, and fonts
- [x] 8.4 Add responsive CSS foundations: fixed sidebar on desktop (>1024px), collapsible on tablet, bottom nav on mobile (<768px)
- [x] 8.5 Create placeholder page at `src/app/page.tsx`
- [x] 8.6 Create placeholder pages for each route: `boxes`, `pokedex`, `stats`, `missing`, `settings`, `presets`

## 9. Verification

- [x] 9.1 Run `npm run build` and verify no errors
- [x] 9.2 Run `npm run lint` and verify no errors
- [x] 9.3 Verify dark mode toggle works visually in the browser
- [x] 9.4 Verify sidebar navigation renders all links with icons
