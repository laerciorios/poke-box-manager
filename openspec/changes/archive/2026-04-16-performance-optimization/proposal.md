## Why

The app must render up to 1,149 Pokémon sprites across potentially dozens of boxes — without performance work the initial bundle and data payload will blow past spec §6.4 targets (LCP <1.5s, JS bundle <150KB gzip). Delivering these optimizations now prevents regressions from becoming load-bearing in later features.

## What Changes

- **Sprite lazy loading**: Sprites are loaded only when their parent box scrolls into the viewport via `IntersectionObserver`; a static SVG silhouette is shown while they load
- **Sprite optimization pipeline**: Build-time script downloads, converts to WebP (with PNG fallback), and optionally packs a sprite sheet to collapse ~1,000 individual requests into one
- **Box overview virtualization**: The box list renders only visible boxes using `react-window` (or equivalent) — off-screen boxes are unmounted
- **Pokédex table virtualization**: The 1,000+ row Pokédex table is virtualized so only visible rows are in the DOM
- **Generation-based code splitting**: `pokemon.json` is split into per-generation chunks; each chunk is dynamically imported only when the relevant generation is active
- **Service Worker caching**: A Workbox-powered Service Worker pre-caches static assets (sprites, JSON chunks, JS/CSS bundles) for instant repeat loads

## Capabilities

### New Capabilities

- `sprite-optimization`: Build-time WebP conversion, PNG fallback generation, and optional sprite sheet packing
- `sprite-lazy-loading`: `IntersectionObserver`-based per-box sprite loading with SVG placeholder (refines existing `sprite-loading` spec)
- `box-overview-virtualization`: `react-window` list virtualization for the box overview screen
- `pokedex-virtualization`: `react-window` table virtualization for the Pokédex screen (1,000+ rows)
- `data-code-splitting`: Per-generation dynamic import chunks for Pokémon data, loaded on demand
- `service-worker-caching`: Workbox Service Worker pre-caching sprites, data chunks, and static bundles

### Modified Capabilities

- `sprite-loading`: Existing spec covers placeholder behavior — new requirement is that sprites SHALL NOT load until the parent `BoxGrid` enters the viewport (lazy trigger changes the loading contract)
- `pokeapi-fetcher`: Build pipeline gains two new output stages: WebP conversion and sprite sheet generation

## Impact

- **New devDependencies**: `sharp` (WebP conversion), `react-window`, `react-virtual` (TBD — see design), `workbox-webpack-plugin` or `next-pwa`
- **Build script**: `src/scripts/fetch-pokemon-data.ts` extended with sprite download + conversion stage
- **Components**: `BoxGrid`, `BoxSlotCell` (lazy sprite trigger), `BoxOverview` (virtualized list), Pokédex page (virtualized table)
- **Next.js config**: `next.config.ts` updated for dynamic imports and Service Worker integration
- **Static data**: `src/data/` gains per-generation JSON shards; `pokemon.json` may be removed or kept as a full manifest
