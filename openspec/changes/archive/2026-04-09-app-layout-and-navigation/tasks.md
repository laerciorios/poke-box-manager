## 1. New Layout Components

- [x] 1.1 Create `src/components/layout/SearchBar.tsx` — text input with placeholder, `onChange` callback, Cmd/Ctrl+K global keydown listener to focus, Escape to clear and blur, shortcut hint badge, `aria-label`
- [x] 1.2 Create `src/components/layout/LanguageSwitch.tsx` — ghost Button toggling between "PT" and "EN" labels, stores preference in localStorage (to be replaced by settings store later), `aria-label="Switch language"`
- [x] 1.3 Create `src/components/layout/MobileMoreMenu.tsx` — DropdownMenu (opens upward) triggered by an ellipsis/MoreHorizontal icon, containing links to Missing, Settings, and Presets with their icons

## 2. Update Header

- [x] 2.1 Update `src/components/layout/Header.tsx` to include SearchBar (left side), and LanguageSwitch + ThemeToggle (right side) with flex layout
- [x] 2.2 Add a hamburger menu button (Menu icon) visible only at `md:` to `lg:` breakpoint (768–1023px), hidden on desktop and mobile

## 3. Update Sidebar — Tablet Collapsible

- [x] 3.1 Update `src/components/layout/Sidebar.tsx` to wrap desktop sidebar nav content in a reusable fragment or extract a `SidebarNav` internal component for reuse
- [x] 3.2 Add tablet Sheet sidebar: render a shadcn `Sheet` (side="left") containing the same nav items, controlled by an `open` state prop passed from Header's hamburger button
- [x] 3.3 Close Sheet on navigation: call `setOpen(false)` when a nav link inside the Sheet is clicked
- [x] 3.4 Hide fixed desktop sidebar below `lg:` breakpoint (already done), hide mobile bottom nav at `md:` breakpoint and above

## 4. Update Mobile Bottom Nav

- [x] 4.1 Update mobile bottom nav to show 4 primary items (Home, Boxes, Pokedex, Stats) plus the MobileMoreMenu as the 5th slot
- [x] 4.2 Ensure bottom nav is hidden at `md:` breakpoint and above (tablet uses Sheet, desktop uses fixed sidebar)

## 5. Update Root Layout

- [x] 5.1 Update `src/app/layout.tsx` to wire sidebar open state between Header hamburger button and Sidebar Sheet (lift state or use a shared context/callback)
- [x] 5.2 Adjust content wrapper padding for tablet breakpoint if needed (`md:pl-0 lg:pl-56`)

## 6. Verification

- [x] 6.1 Verify TypeScript compilation passes with `tsc --noEmit`
- [x] 6.2 Verify responsive behavior at all 3 breakpoints: fixed sidebar ≥1024px, collapsible Sheet 768–1023px, bottom nav <768px
