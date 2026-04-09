## Context

The app has box data types (`Box`, `BoxSlot`, `BOX_COLUMNS=6`, `BOX_ROWS=5`) and an empty `src/components/boxes/` directory awaiting UI components. The design system provides CSS custom properties for colors, radii, and transitions, plus 11 shadcn/ui components including `Tooltip` and `Button`. Pokémon sprites are static assets referenced by URL from build-time data — no runtime API calls.

This change builds the first visual layer users interact with: a box grid showing 30 Pokémon slots with registration states, navigation between boxes, and a miniature overview for quick access.

## Goals / Non-Goals

**Goals:**
- Render a 6×5 grid that adapts to desktop, tablet, and mobile breakpoints
- Clearly communicate slot states (registered, missing, empty, hover, selected) through visual design
- Lazy-load sprites efficiently with meaningful placeholder feedback
- Provide keyboard-navigable box navigation
- Keep components pure/presentational — data comes via props, not direct store access

**Non-Goals:**
- Drag-and-drop interactions (separate change using `@dnd-kit/core`)
- Store integration / data fetching (components receive `Box` objects as props)
- Box editing UI (rename, create, delete — separate change)
- i18n of component text (will be added when `next-intl` integration is implemented)
- Animation beyond CSS transitions (no Framer Motion)

## Decisions

### 1. Presentational components with prop-driven data

**Choice**: All box components receive `Box`, `BoxSlot[]`, and callback props — no direct store access inside components.

**Why**: This makes components testable in isolation, reusable across contexts (e.g., overview uses the same slot rendering as the main grid), and decoupled from the store implementation. Container components (pages) will wire stores to these presentational components later.

**Alternative considered**: Components directly consuming Zustand stores — rejected because it couples rendering to state shape and makes testing harder.

### 2. CSS Grid for the 6×5 layout

**Choice**: Use `display: grid` with `grid-template-columns: repeat(6, 1fr)` and explicit gap, not flexbox or table.

**Why**: CSS Grid naturally maps to a 2D grid layout. It handles equal-width columns, automatic row creation, and gap spacing with minimal CSS. The grid is inherently responsive — column count can shift at breakpoints.

**Responsive strategy**:
- Desktop (≥1024px): `grid-cols-6` — full 6×5 grid
- Tablet (768–1023px): `grid-cols-6` — same grid, smaller cells
- Mobile (<768px): Horizontal scroll container with `grid-cols-6` at fixed cell size, `overflow-x: auto`

### 3. CVA variants for slot visual states

**Choice**: Use `class-variance-authority` to define slot state variants, consistent with existing shadcn/ui component patterns.

**Why**: The codebase already uses CVA for all UI components (`Button`, `Badge`, etc.). Slot states map cleanly to CVA variants:

```typescript
const slotVariants = cva('...base', {
  variants: {
    state: {
      registered: '...',   // full opacity + green indicator
      missing: '...',      // 30% opacity or silhouette
      empty: '...',        // dashed border + "?" icon
    },
    selected: {
      true: '...',         // accent border highlight
    },
  },
})
```

Hover and focus states use Tailwind pseudo-class utilities (`hover:shadow-md`, `focus-visible:ring-2`).

### 4. Next.js `Image` with blur placeholder for sprite lazy loading

**Choice**: Use Next.js `<Image>` component with `loading="lazy"`, `placeholder="empty"`, and a custom SVG silhouette shown via CSS until `onLoad` fires.

**Why**: Next.js `Image` provides automatic lazy loading, format optimization (WebP/AVIF), and proper `width`/`height` to prevent layout shift. The SVG silhouette placeholder uses a generic Pokéball or Pokémon outline shown as a CSS background on the slot container, replaced when the image loads.

**Alternative considered**: `placeholder="blur"` with `blurDataURL` — rejected because generating 1000+ blur hashes at build time is costly and the silhouette approach gives a more intentional design.

### 5. BoxOverview as a clickable mini-grid

**Choice**: BoxOverview renders each box as a small `grid-cols-6` with tiny colored dots (not actual sprites) indicating slot occupancy.

**Why**: Rendering 30 actual sprites × N boxes would be expensive. Colored dots (3–4px circles) provide at-a-glance occupancy info: green for registered, orange for missing, transparent for empty. Clicking a mini-box navigates to it.

### 6. Component file structure

```
src/components/boxes/
├── BoxGrid.tsx          # 6×5 grid container, maps slots to BoxSlotCell
├── BoxSlotCell.tsx      # Individual slot with state variants, sprite, tooltip
├── BoxNavigation.tsx    # Prev/next arrows, box name, index indicator
├── BoxOverview.tsx      # Mini-grid view of all boxes
└── index.ts             # Barrel export

src/components/pokemon/
├── SpritePlaceholder.tsx # SVG silhouette placeholder
└── index.ts             # Barrel export
```

## Risks / Trade-offs

**[Risk] Many sprites on screen could impact performance** → Mitigation: Native lazy loading ensures only visible sprites load. BoxOverview uses dots, not sprites. Grid cells have explicit dimensions to prevent layout shift.

**[Risk] SVG placeholder may not match actual Pokémon shape** → Mitigation: Use a generic Pokéball silhouette, not per-Pokémon outlines. This is simpler and avoids needing 1000+ SVG silhouettes.

**[Risk] Mobile horizontal scroll may feel unintuitive** → Mitigation: Add subtle scroll indicators (gradient fade at edges) and ensure touch scroll works smoothly. This matches the Pokémon Home mobile UI pattern.

**[Trade-off] Presentational-only components means no immediate interactivity** → Acceptable: This change delivers the visual foundation. Store wiring and event handlers will be added in subsequent changes, keeping each change focused.
