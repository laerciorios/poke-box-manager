## 1. Utilities & Data Layer

- [x] 1.1 Create `src/lib/milestones.ts` exporting `Milestone` type and `getMilestones(percentage: number): Milestone[]` for thresholds [25, 50, 75, 90, 100]
- [x] 1.2 Create `src/hooks/useRecentRegistrations.ts` — reads last N entries from `usePokedexStore.registered[]` (insertion order), maps each key to `PokemonEntry | PokemonForm`, returns typed array

## 2. i18n Keys

- [x] 2.1 Add `Home.*` keys to `src/i18n/messages/en.json`: section titles (overallProgress, quickStats, nextUp, recentlyAdded, quickActions, generationProgress), stat labels (registered, total, boxesUsed, shiny), quick-action labels (goToBoxes, goToMissing, goToStats, goToSettings), empty-state messages (nothingMissing, noneRegistered), milestone label pattern
- [x] 2.2 Add the same `Home.*` keys (translated) to `src/i18n/messages/pt-BR.json`

## 3. Widget Components

- [x] 3.1 Create `src/components/home/CompletionRing.tsx` — wraps `OverallDonut` with a milestone pip row below it (uses `getMilestones`)
- [x] 3.2 Create `src/components/home/QuickStats.tsx` — 3 stat tiles: registered/total, boxes in use, shiny count; data from `useStatsData`
- [x] 3.3 Create `src/components/home/NextUpStrip.tsx` — calls `buildMissingEntries`, slices first 5, renders horizontal scrollable sprite buttons; empty-state text when none; clicking sets selected pokemonId for PokemonCard
- [x] 3.4 Create `src/components/home/RecentStrip.tsx` — calls `useRecentRegistrations(5)`, renders horizontal scrollable sprite buttons; hidden when empty; clicking sets selected pokemonId for PokemonCard
- [x] 3.5 Create `src/components/home/QuickActions.tsx` — 4 icon+label button grid linking to /boxes, /missing, /stats, /settings using `useRouter` from `@/i18n/navigation`
- [x] 3.6 Create `src/components/home/GenerationMilestones.tsx` — compact list of active generations, each row shows gen name, completion bar/percentage, and 5 milestone pips (filled when reached); data from `useStatsData.byGeneration`

## 4. Home Page

- [x] 4.1 Rewrite `src/app/[locale]/page.tsx` as a `'use client'` component — assembles all dashboard widgets in a single-column layout with section headings; manages `useState<number | null>` for PokemonCard open state; passes `onSelectPokemon` down to NextUpStrip and RecentStrip

## 5. Polish

- [x] 5.1 Verify all widgets render correctly on mobile (< 768px) — strips scroll horizontally, quick actions stack in a 2×2 grid, no overflow
- [x] 5.2 Verify PT-BR locale: all Home strings show in Portuguese
- [x] 5.3 Verify generation milestones update when a new Pokémon is registered (reactive via store subscription)
