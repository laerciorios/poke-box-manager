## 1. Dependencies and Configuration

- [ ] 1.1 Add `sharp` to `devDependencies` in `package.json` *(out of scope — sprite pipeline deferred)*
- [ ] 1.2 Add `react-window` and `@types/react-window` to `dependencies` *(out of scope — virtualization deferred)*
- [ ] 1.3 Add `@ducanh2912/next-pwa` to `dependencies` *(dropped — incompatible with Turbopack; replaced by manual SW)*
- [ ] 1.4 Update `next.config.ts` to wrap the config with `withPWA` *(dropped — see 1.3)*
- [x] 1.5 Add `public/sw.js`, `public/workbox-*.js` to `.gitignore` *(updated: sw.js removed from gitignore since it's now a static committed asset; workbox-*.js kept)*

## 2. Build Script — Sprite Download and WebP Conversion

*(Entire section deferred — sprites are served from raw.githubusercontent.com, not hosted locally. WebP conversion would require local hosting and is a separate architectural change.)*

- [ ] 2.1 *(deferred)*
- [ ] 2.2 *(deferred)*
- [ ] 2.3 *(deferred)*
- [ ] 2.4 *(deferred)*
- [ ] 2.5 *(deferred)*

## 3. Build Script — Per-Generation JSON Shards

- [x] 3.1 Define the `PokemonManifest` TypeScript type in `src/types/` or `src/data/`
- [x] 3.2 Add a `splitByGeneration(entries: PokemonEntry[])` function that partitions the full list into 9 arrays keyed by generation ID
- [x] 3.3 Write each partition to `src/data/pokemon-gen-{1..9}.json`
- [x] 3.4 Write `src/data/pokemon-manifest.json` with each generation's `id`, `range`, and `chunk` key
- [x] 3.5 Verify all 9 shard files and the manifest are produced correctly after re-running the fetch script

## 4. Data Layer — Dynamic Generation Imports

- [x] 4.1 Create `src/lib/pokemon-data.ts`: import `pokemon-manifest.json` statically; export `loadGeneration(genId: number): Promise<PokemonEntry[]>` that dynamically imports the correct chunk and caches it in a module-level `Map`
- [ ] 4.2 Update all existing static `import pokemonData from '@/data/pokemon.json'` usages to use `loadGeneration` or a `loadActiveGenerations()` helper *(deferred — requires async refactor across all consumers)*
- [x] 4.3 Implement `loadActiveGenerations(): Promise<PokemonEntry[]>` that reads active generation IDs from `useSettingsStore` and calls `Promise.all` over the relevant `loadGeneration` calls
- [ ] 4.4 Ensure the Pokédex page and box organizer await `loadActiveGenerations()` before rendering Pokémon lists *(deferred — blocked by 4.2)*
- [ ] 4.5 Remove or deprecate `src/data/pokemon.json` once all consumers use the shard loader *(deferred — blocked by 4.2)*

## 5. BoxGrid — IntersectionObserver Lazy Loading

- [x] 5.1 Add a `useInViewport(ref: RefObject<Element>)` hook in `src/hooks/` that uses `IntersectionObserver` and disconnects after first intersection
- [x] 5.2 Wire `useInViewport` to the `BoxGrid` container ref; pass the resulting `visible` boolean down to each `BoxSlotCell`
- [x] 5.3 Update `BoxSlotCell` to accept a `visible?: boolean` prop; render only `SpritePlaceholder` when `visible` is `false`
- [ ] 5.4 Update `BoxSlotCell` sprite markup to use `<picture>` with `<source type="image/webp" srcSet="...">` and `<img src="...png">` fallback *(deferred — no local WebP sprites)*
- [ ] 5.5 Verify that boxes scrolled out of initial viewport show zero sprite network requests on first load *(manual verification)*

## 6. Box Overview — react-window Virtualization

*(Entire section deferred — risk of breaking dnd-kit cross-box drag; benefit limited by box count in typical usage)*

- [ ] 6.1–6.5 *(deferred)*

## 7. Pokédex Table — react-window Virtualization

*(Entire section deferred — search/filter already bounds visible rows in practice)*

- [ ] 7.1–7.4 *(deferred)*

## 8. Service Worker — Caching Setup

- [x] 8.1 Create `public/sw.js` with install/activate/fetch handlers: `StaleWhileRevalidate` for sprites (raw.githubusercontent.com), `CacheFirst` for `/_next/static/`, `NetworkFirst` for HTML navigation
- [x] 8.2 Create `src/components/ServiceWorkerRegistration.tsx` client component that calls `navigator.serviceWorker.register('/sw.js')` on mount; render it in root layout
- [x] 8.3 Run `npm run build` and confirm no TypeScript/build errors
- [ ] 8.4 Serve the production build locally (`npm start`) and confirm the Service Worker activates in DevTools Application tab
- [ ] 8.5 Reload the page with Network set to Offline and verify cached assets are served (sprites load from `sprites` cache)

## 9. Baseline Measurement and Target Verification

- [ ] 9.1 Run Lighthouse (production build) before and after changes; record LCP, FID/INP, CLS, and JS bundle size
- [ ] 9.2 Verify JS bundle gzip is <150KB (check Next.js build output or `next-bundle-analyzer`)
- [ ] 9.3 Verify total active-generation data gzip is <300KB per page load
- [ ] 9.4 Confirm LCP <1.5s, CLS <0.1 in Lighthouse report
- [x] 9.5 Add `@next/bundle-analyzer` to `devDependencies` and document `npm run analyze` command in README/CLAUDE.md
