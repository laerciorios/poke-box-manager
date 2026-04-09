## Context

The app shell exists with a basic `Header` (only ThemeToggle), a `Sidebar` (desktop fixed + mobile bottom nav, skipping tablet), and a root layout wiring them together. The current implementation jumps from bottom nav (<1024px) to fixed sidebar (≥1024px) with no tablet intermediate. The Header is minimal — just a theme toggle aligned right. There is no search, no language switch, and mobile bottom nav drops Settings/Presets (shows only 5 of 7 items).

Existing UI components available: `Button`, `Sheet`, `Input`, `DropdownMenu`, `Tooltip`, `Dialog` — all shadcn/ui with CVA + `cn()` pattern.

## Goals / Non-Goals

**Goals:**
- Add global search bar and language switch to Header
- Implement 3-tier responsive layout: fixed sidebar (≥1024px), collapsible sheet sidebar (768–1023px), bottom nav (<768px)
- Give mobile bottom nav access to Settings/Presets via a "More" overflow menu
- Support Cmd/Ctrl+K keyboard shortcut to focus search
- Keep all components client-only (`'use client'`) since they depend on `usePathname`, `useTheme`, and user interaction state

**Non-Goals:**
- Search results display or filtering logic (this change only builds the input/trigger — results are a separate concern)
- Actual locale switching via `next-intl` (LanguageSwitch sets the preference; i18n integration is a future change)
- Page content or route changes
- Sidebar content beyond navigation links (no user avatar, no stats summary)

## Decisions

### 1. Shadcn `Sheet` for tablet collapsible sidebar

**Choice**: Use `Sheet` (side="left") as the tablet sidebar, triggered by a hamburger button in the Header.

**Why**: `Sheet` is already installed and provides an accessible slide-over drawer with overlay, focus trap, and Escape-to-close. It matches the "collapsible sidebar" pattern from spec 5.2 without adding a dependency.

**Alternative considered**: Custom CSS sidebar with translate transform — rejected because it lacks built-in focus management, overlay, and close-on-outside-click that Sheet provides for free.

**Breakpoint approach**:
- `≥1024px` (`lg:`): Fixed sidebar visible, hamburger hidden, Sheet never renders
- `768–1023px` (`md:` to `lg:`): Fixed sidebar hidden, hamburger visible in Header, Sheet opens on click
- `<768px`: Bottom nav visible, hamburger hidden, Sheet hidden

### 2. SearchBar as a controlled input with command palette trigger

**Choice**: A search `Input` in the Header that acts as the trigger/display for search. Pressing Cmd/Ctrl+K focuses it. The input emits `onChange` events via a callback prop — actual filtering/results are deferred to a future change.

**Why**: Building the input now establishes the UX pattern and keyboard shortcut. Decoupling from search results keeps this change focused on layout. The input can later be upgraded to open a command palette (`Dialog`) for richer search.

**Props interface**:
```typescript
interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}
```

### 3. LanguageSwitch as a simple toggle button

**Choice**: A `Button` (ghost variant) that toggles between "PT" and "EN" labels, updating a locale state. For now, it stores the preference but does not trigger actual i18n switching.

**Why**: The app supports only two locales (`Locale = 'pt-BR' | 'en'`). A toggle is simpler and more discoverable than a dropdown for two options. When `next-intl` is integrated later, this component will call the locale setter.

**Alternative considered**: `Select` dropdown — overkill for two options and takes more space.

### 4. Mobile "More" menu via DropdownMenu

**Choice**: Replace the 5th bottom nav slot with a "More" (ellipsis icon) item that opens a `DropdownMenu` upward, showing Settings and Presets links.

**Why**: Bottom nav has limited horizontal space. Showing 4 primary items + "More" is a standard mobile pattern (iOS tab bars, Material bottom nav). `DropdownMenu` is already installed.

**Nav item distribution**:
- Bottom nav visible items: Home, Boxes, Pokedex, Stats (4 items)
- "More" menu items: Missing, Settings, Presets (3 items)

### 5. Root layout breakpoint adjustments

**Choice**: Add `md:` breakpoint utilities alongside existing `lg:` to support the 3-tier pattern.

**Current**: `lg:pl-56` on content wrapper, `lg:hidden`/`hidden lg:flex` on sidebar/mobile nav.
**New**: Content wrapper uses `lg:pl-56` (unchanged). Tablet hamburger visible at `md:` but hidden at `lg:`. Mobile bottom nav hidden at `md:` (tablet uses Sheet instead).

## Risks / Trade-offs

**[Risk] Sheet sidebar on tablet may conflict with page-level sheets** → Mitigation: Use a unique `Sheet` instance scoped to the layout. The sidebar sheet state is local to the Sidebar component.

**[Risk] Cmd/Ctrl+K shortcut may conflict with browser shortcuts** → Mitigation: Use `preventDefault()` only when the search input is not already focused. This is a well-established pattern (VS Code, GitHub, Linear all use it).

**[Risk] Language toggle without i18n has no visible effect** → Mitigation: The toggle visually updates its label (PT↔EN) and can persist the preference. Actual content translation comes in a future change — this establishes the UI affordance now.

**[Trade-off] "More" menu hides 3 nav items on mobile** → Acceptable: The 4 most-used sections remain visible. Settings/Presets/Missing are accessed less frequently and are one tap + one tap away.
