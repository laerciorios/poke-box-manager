## Why

The box management system has types (`Box`, `BoxSlot`) and will have stores, but no visual representation exists yet. The box grid is the app's primary interaction surface — users spend most of their time viewing, navigating, and managing Pokémon across boxes. This change builds the core visual components described in spec section 5.3, enabling the foundational UI that all other features (drag-and-drop, presets, registration) build upon.

## What Changes

- Create `BoxGrid` component: 6×5 CSS Grid rendering a single box's 30 slots with proper responsive behavior
- Create `BoxSlotCell` component: individual slot rendering with 5 visual states (registered, missing, empty, hover, selected) using CVA variants
- Create `BoxNavigation` component: arrow controls + box name display to navigate between boxes
- Create `BoxOverview` component: miniature grid view of all boxes for quick navigation
- Create `SpritePlaceholder` SVG component: silhouette placeholder shown while sprites lazy-load
- Implement lazy loading for Pokémon sprites using Next.js `Image` with blur placeholder strategy

## Capabilities

### New Capabilities
- `box-grid`: BoxGrid component rendering a 6×5 CSS grid of slots with responsive layout (desktop full grid, tablet adapted, mobile horizontal scroll)
- `box-slot-cell`: BoxSlotCell component with visual state variants (registered, missing, empty, hover, selected), sprite display, registration indicator, and tooltip
- `box-navigation`: BoxNavigation component with previous/next arrows, box name display, and box index indicator
- `box-overview`: BoxOverview component showing miniature representations of all boxes for quick navigation
- `sprite-loading`: Lazy loading strategy for Pokémon sprites with SVG silhouette placeholders

### Modified Capabilities
_(none — this is a net-new UI layer consuming existing types)_

## Impact

- **New files**: `src/components/boxes/BoxGrid.tsx`, `src/components/boxes/BoxSlotCell.tsx`, `src/components/boxes/BoxNavigation.tsx`, `src/components/boxes/BoxOverview.tsx`, `src/components/pokemon/SpritePlaceholder.tsx`, `src/components/boxes/index.ts`
- **Types consumed**: `Box`, `BoxSlot`, `BOX_COLUMNS`, `BOX_ROWS` from `src/types/box.ts`; `PokemonEntry` from `src/types/pokemon.ts`
- **UI dependencies**: shadcn/ui `Tooltip`, `Button`; `lucide-react` icons (ChevronLeft, ChevronRight); Next.js `Image`
- **No new npm dependencies** — uses existing stack (Tailwind CSS, CVA, shadcn/ui, Next.js Image)
- **Relates to**: spec section 5.3 (slot visual states), section 5.2 (responsive layout)
