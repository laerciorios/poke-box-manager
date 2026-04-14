## 1. Dependencies and Configuration

- [ ] 1.1 Add `sharp` to `devDependencies` in `package.json`
- [ ] 1.2 Add `react-window` and `@types/react-window` to `dependencies`
- [ ] 1.3 Add `@ducanh2912/next-pwa` to `dependencies`
- [ ] 1.4 Update `next.config.ts` to wrap the config with `withPWA` (disabled in development, enabled in production)
- [ ] 1.5 Add `public/sw.js`, `public/workbox-*.js` to `.gitignore`

## 2. Build Script — Sprite Download and WebP Conversion

- [ ] 2.1 Add a `downloadSprites(forms: PokemonForm[])` function to the fetch script that downloads each form's `spriteUrl` PNG to `public/sprites/<formId>.png`, skipping existing files
- [ ] 2.2 Add a `convertToWebP(forms: PokemonForm[])` function that uses `sharp` to convert each PNG to `public/sprites/<formId>.webp`, skipping existing files
- [ ] 2.3 Wire both stages into the main pipeline (after JSON generation); add `--force` flag to bypass skip logic
- [ ] 2.4 Scaffold the `--sprite-sheet` flag: detect it, log the TODO message, and exit cleanly
- [ ] 2.5 Run `npm run fetch-data` to verify both stages complete without errors

## 3. Build Script — Per-Generation JSON Shards

- [ ] 3.1 Define the `PokemonManifest` TypeScript type in `src/types/` or `src/data/`
- [ ] 3.2 Add a `splitByGeneration(entries: PokemonEntry[])` function that partitions the full list into 9 arrays keyed by generation ID
- [ ] 3.3 Write each partition to `src/data/pokemon-gen-{1..9}.json`
- [ ] 3.4 Write `src/data/pokemon-manifest.json` with each generation's `id`, `range`, and `chunk` key
- [ ] 3.5 Verify all 9 shard files and the manifest are produced correctly after re-running the fetch script

## 4. Data Layer — Dynamic Generation Imports

- [ ] 4.1 Create `src/lib/pokemon-data.ts`: import `pokemon-manifest.json` statically; export `loadGeneration(genId: number): Promise<PokemonEntry[]>` that dynamically imports the correct chunk and caches it in a module-level `Map`
- [ ] 4.2 Update all existing static `import pokemonData from '@/data/pokemon.json'` usages to use `loadGeneration` or a `loadActiveGenerations()` helper
- [ ] 4.3 Implement `loadActiveGenerations(): Promise<PokemonEntry[]>` that reads active generation IDs from `useSettingsStore` and calls `Promise.all` over the relevant `loadGeneration` calls
- [ ] 4.4 Ensure the Pokédex page and box organizer await `loadActiveGenerations()` before rendering Pokémon lists
- [ ] 4.5 Remove or deprecate `src/data/pokemon.json` once all consumers use the shard loader (keep as full manifest for reference if needed)

## 5. BoxGrid — IntersectionObserver Lazy Loading

- [ ] 5.1 Add a `useInViewport(ref: RefObject<Element>)` hook in `src/hooks/` that uses `IntersectionObserver` and disconnects after first intersection
- [ ] 5.2 Wire `useInViewport` to the `BoxGrid` container ref; pass the resulting `visible` boolean down to each `BoxSlotCell`
- [ ] 5.3 Update `BoxSlotCell` to accept a `visible?: boolean` prop; render only `SpritePlaceholder` when `visible` is `false`
- [ ] 5.4 Update `BoxSlotCell` sprite markup to use `<picture>` with `<source type="image/webp" srcSet="...">` and `<img src="...png">` fallback
- [ ] 5.5 Verify that boxes scrolled out of initial viewport show zero sprite network requests on first load (check Network tab)

## 6. Box Overview — react-window Virtualization

- [ ] 6.1 Identify the box overview list component (e.g., `BoxOverview.tsx`) and measure the rendered height of a single box row
- [ ] 6.2 Replace the mapped box list with a `react-window` `FixedSizeList`, configuring `itemSize`, `height` (container height), and `itemCount`
- [ ] 6.3 Set `overscanCount={3}` to keep nearby boxes mounted for drag-and-drop
- [ ] 6.4 Ensure the `DndContext` wraps the virtualized list so cross-box drag still works for mounted boxes
- [ ] 6.5 Verify scrolling renders/unmounts boxes and the scrollbar reflects the total box count

## 7. Pokédex Table — react-window Virtualization

- [ ] 7.1 Identify the Pokédex list component and measure the rendered height of a single row
- [ ] 7.2 Replace the mapped row list with `react-window` `FixedSizeList`, configuring `itemSize`, `height`, and `itemCount`
- [ ] 7.3 Pass filtered/sorted entry array as the data source; reset scroll to index 0 when filters change (via `listRef.current?.scrollToItem(0)`)
- [ ] 7.4 Verify that filtering to 50 results mounts ≤ 50 + overscan row elements in the DOM

## 8. Service Worker — Workbox Caching Setup

- [ ] 8.1 Configure `withPWA` in `next.config.ts` with `dest: 'public'` and `disable: process.env.NODE_ENV === 'development'`
- [ ] 8.2 Create `src/app/sw.ts` (or `public/sw-custom.js`) with runtime caching rules: `StaleWhileRevalidate` for `/sprites/`, `CacheFirst` for `/pokemon-gen-*.json`
- [ ] 8.3 Run `npm run build` and verify `public/sw.js` and `public/workbox-*.js` are generated
- [ ] 8.4 Serve the production build locally (`npm start`) and confirm the Service Worker activates in DevTools
- [ ] 8.5 Reload the page with the network set to Offline and verify cached assets are served

## 9. Baseline Measurement and Target Verification

- [ ] 9.1 Run Lighthouse (production build) before and after changes; record LCP, FID/INP, CLS, and JS bundle size
- [ ] 9.2 Verify JS bundle gzip is <150KB (check Next.js build output or `next-bundle-analyzer`)
- [ ] 9.3 Verify total active-generation data gzip is <300KB per page load
- [ ] 9.4 Confirm LCP <1.5s, CLS <0.1 in Lighthouse report
- [ ] 9.5 Add `@next/bundle-analyzer` to `devDependencies` and document `npm run analyze` command in README/CLAUDE.md
