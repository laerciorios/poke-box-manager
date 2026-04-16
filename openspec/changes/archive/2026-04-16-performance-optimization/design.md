## Context

The app currently has no performance optimizations in place. All Pokémon data is imported as a single static JSON, all sprites are loaded eagerly, and all boxes are rendered regardless of visibility. With 1,025–1,149 Pokémon entries and dozens of possible boxes, this produces:

- A large initial JS/data bundle that can easily exceed 150KB gzip
- Hundreds of eager sprite image requests on first load, driving up LCP
- A non-virtualized box list that mounts thousands of DOM nodes in the box overview

Spec §6 defines concrete targets: LCP <1.5s, FID <100ms, CLS <0.1, JS bundle <150KB gzip, Pokémon data <300KB gzip. This design delivers all of them without changing the offline-first, zero-backend architecture.

## Goals / Non-Goals

**Goals:**
- Reduce JS bundle to <150KB gzip via code splitting and dynamic imports
- Hit LCP <1.5s by deferring sprite loading to viewport visibility
- Keep CLS <0.1 by reserving space with fixed-size slot placeholders before sprites load
- Reduce sprite network overhead with WebP conversion and optional sprite sheet
- Virtualize box overview and Pokédex table to keep DOM size bounded
- Service Worker pre-caching for instant repeat visits

**Non-Goals:**
- Server-side rendering of user data (app is client-only / IndexedDB)
- Real-time performance monitoring or RUM integration
- Optimizing the build script itself (CI speed is not a target)
- PWA install prompt or offline fallback pages (pure caching only)

## Decisions

### D1: IntersectionObserver on BoxGrid, not BoxSlotCell

**Decision**: Mount one `IntersectionObserver` per `BoxGrid` container (not per sprite). When the box enters the viewport, set a `visible` flag; `BoxSlotCell` children render real sprites only when `visible` is true, otherwise show the `SpritePlaceholder`.

**Alternatives considered**:
- *Per-sprite IntersectionObserver*: ~30 observers per box — too expensive; observer creation itself has cost.
- *`loading="lazy"` only*: Native lazy loading is browser-controlled and cannot guarantee the LCP window; also does not handle the placeholder-to-sprite fade.
- *Virtualize `BoxGrid` cells*: Over-engineering for a fixed 30-slot grid; IO-based visibility is sufficient.

**Why box-level IO**: One observer per box matches the natural scroll unit. A box is either on-screen (load all 30 sprites) or off-screen (load zero). Simple, predictable, no per-cell overhead.

### D2: react-window for box overview and Pokédex table

**Decision**: Use `react-window` (`FixedSizeList` for box overview, `FixedSizeList` with row render for Pokédex). Row/item heights are fixed so `FixedSizeList` is cheaper than `VariableSizeList`.

**Alternatives considered**:
- *TanStack Virtual*: More flexible but heavier API; no advantage for fixed-height rows.
- *Intersection Observer on each box card*: Does not reduce DOM nodes — defeats the purpose of virtualization.
- *`react-virtuoso`*: Good library but another dependency; `react-window` is the spec's named example.

**Why react-window**: Spec §6.2 names it explicitly. Fixed-height rows in both lists make `FixedSizeList` the right variant. Small bundle footprint (~3KB gzip).

### D3: Per-generation dynamic JSON chunks via Next.js dynamic import

**Decision**: Split `pokemon.json` into `pokemon-gen-{1..9}.json`. Each generation's data is imported via `import()` when that generation is first needed (active-generation filter changes). A lightweight manifest (`pokemon-manifest.json`) listing national dex IDs per generation is imported statically and drives the dynamic loads.

**Alternatives considered**:
- *One monolithic JSON*: Simplest but blows the 300KB data budget and delays TTI.
- *Route-level splitting*: Generation data is used across pages (boxes, pokédex, missing tracker) — per-route splitting would duplicate data or require a shared cache layer.
- *IndexedDB prefetch at build time*: Adds complexity with no benefit for static data.

**TypeScript type for manifest**:
```ts
type PokemonManifest = {
  generations: {
    id: number;           // 1–9
    name: string;         // "generation-i" etc.
    range: [number, number]; // [firstDexId, lastDexId]
    chunk: string;        // "pokemon-gen-1" (import path key)
  }[];
};
```

### D4: sharp for WebP conversion at build time (not next/image)

**Decision**: In the fetch script, after downloading sprites, pipe each PNG through `sharp` to produce a `.webp` sibling. The `BoxSlotCell` `<picture>` element serves `<source type="image/webp">` with `<img>` PNG fallback. Next.js Image optimization is NOT used for sprites — sprites are static assets served from `public/sprites/`.

**Alternatives considered**:
- *next/image with on-demand optimization*: Adds a serverless function invocation per sprite; contradicts the zero-backend constraint and doesn't help with first-paint LCP.
- *SVG sprites*: Pokémon sprites are pixel-art PNGs; SVG is not applicable.
- *AVIF*: Better compression but `sharp` AVIF encoding is slower at build time and Safari support was incomplete until recently.

### D5: Workbox via next-pwa for Service Worker

**Decision**: Use `next-pwa` (Workbox wrapper) configured for `StaleWhileRevalidate` on sprites and `CacheFirst` on data JSON chunks. Service Worker is only registered in production builds.

**Alternatives considered**:
- *Manual Service Worker*: Significantly more code for the same outcome.
- *`@ducanh2912/next-pwa`* (fork): Same API, slightly better Next.js 13+ compatibility — prefer this over the unmaintained original `next-pwa`.
- *No SW*: Misses the spec §6.3 requirement for static asset caching.

### D6: Sprite sheet is optional / deferred

**Decision**: The sprite sheet pipeline (packing sprites into a single image + CSS offset map) is designed but not implemented in this pass. The sprite download and WebP conversion stage is implemented; the packing step is scaffolded as a flag (`--sprite-sheet`) that exits early with a TODO message.

**Why deferred**: Sprite sheet generation requires a CSS/JSON offset map consumed by `BoxSlotCell`. This is a significant UI contract change. The IO-based lazy loading (D1) achieves the network-request reduction goal for the initial load; sprite sheets are an incremental optimization that can land in a follow-up without blocking the core targets.

## Risks / Trade-offs

- **[Risk] CLS from sprite load** → `BoxSlotCell` uses fixed `width` + `height` on the slot container (CSS grid cell is already fixed); placeholder occupies the same space. CLS should be 0 for sprites.
- **[Risk] react-window breaks drag-and-drop in box overview** → DnD between boxes in overview mode requires both source and target to be mounted. Virtualization may unmount boxes. Mitigation: overscan (render N extra boxes above/below viewport), or disable cross-box DnD in overview and rely on the detail view.
- **[Risk] Dynamic import waterfall for all 9 generations on first load** → If all generations are active by default, 9 imports fire simultaneously. Mitigation: import all chunks in parallel (`Promise.all`), not sequentially.
- **[Risk] Service Worker cache staleness** → Static assets are content-hashed by Next.js; SW cache entries are keyed by URL. When assets change, new hashes produce new cache entries. Old entries are cleaned up on SW activation. No staleness risk for immutable assets.
- **[Risk] sharp build dependency on CI** → `sharp` requires native binaries. Most CI environments (Node 18+) have pre-built binaries available. Mitigation: document required Node version; add `sharp` to `devDependencies` only.

## Migration Plan

1. Add `sharp`, `react-window`, `@ducanh2912/next-pwa` to `devDependencies` / `dependencies`
2. Extend fetch script with WebP conversion stage; re-run `npm run fetch-data`
3. Split `pokemon.json` → per-gen shards + manifest; update all static imports
4. Wire IO observer to `BoxGrid`; update `BoxSlotCell` to respect `visible` prop
5. Virtualize box overview with `react-window`
6. Virtualize Pokédex table with `react-window`
7. Add `next-pwa` to `next.config.ts`; verify SW registers in production build
8. Measure bundle + Core Web Vitals with Lighthouse; iterate until targets are met

Rollback: Each step is independently revertable. Feature flags are not needed — each change is additive or replaces a direct import with a dynamic one.

## Open Questions

- Should cross-box drag-and-drop in overview mode be disabled when virtualization is active, or should a high overscan value (e.g., 5 boxes) be used to keep likely drag targets mounted?
- Is the 300KB gzip data budget per page load (all active generations) or per generation chunk?
- Should sprite WebP conversion run on CI or only locally (checked in)?
