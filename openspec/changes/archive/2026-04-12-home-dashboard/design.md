## Context

The Home page (`src/app/[locale]/page.tsx`) currently renders a static title and subtitle — it contributes nothing to the user's workflow. The app already has all the data needed for a meaningful dashboard: `useStatsData` computes overall and per-generation completion, `buildMissingEntries` yields the next missing Pokémon in dex order, and the `registered[]` array (ordered by insertion) gives a proxy for recent activity. No new stores or data sources are required.

Key constraints discovered during exploration:
- `useStatsData` is the authoritative data computation hook — reuse it, don't duplicate logic.
- `registered[]` in `usePokedexStore` is an ordered array (push-appended); the last N items are the "most recently registered."
- No timestamps exist in any store — "recent" is purely insertion-order based.
- No "active preset" concept in `usePresetsStore` — the preset indicator widget is deferred (out of scope).
- `OverallDonut` accepts `{ registered, total, percentage, labelRegistered, labelTotal }`.
- `PokemonCard` accepts `{ pokemonId, isOpen, onClose }` for the detail sheet.
- `buildMissingEntries` from `src/lib/missing-pokemon.ts` returns `MissingEntry[]` filtered by active settings.

## Goals / Non-Goals

**Goals:**
- Replace placeholder with a useful dashboard on first visit
- Surface overall completion percentage prominently (donut ring)
- Show quick stats: registered/total, boxes in use, shiny count
- "Next Up" strip: next 5 missing Pokémon in dex order, clickable to open PokemonCard
- "Recently Added" strip: last 5 Pokémon registered, clickable to open PokemonCard
- Quick-action buttons: Boxes, Missing Pokémon, Stats, Settings
- Generation milestone badges (25 / 50 / 75 / 90 / 100 %) alongside generation data
- Fully i18n'd (PT-BR + EN); respects variation toggles and active generation filters

**Non-Goals:**
- Persistent "active preset" indicator (no concept exists in the store)
- Chronological timestamps for recent activity (no timestamp data)
- Editable widgets or drag-to-reorder layout
- Animations or confetti (milestone badges are static indicators)

## Decisions

### 1. Home page as a client component
The dashboard reads Zustand stores, so the page must be `'use client'`. No server-side data is needed beyond what's already statically imported.

**Alternative considered**: hybrid (server shell + client islands). Rejected — every widget reads store state, making an RSC shell hollow.

### 2. Data sourcing via `useStatsData`
All computed numbers (overall %, per-generation counts, shiny count) come from the existing `useStatsData` hook. This avoids duplicating selector logic.

**Alternative considered**: raw selectors inline in the page. Rejected — `useStatsData` already handles variation toggles and generation filtering.

### 3. Recent registrations from insertion order
`usePokedexStore.registered` is a `string[]` of `"pokemonId"` or `"pokemonId/formId"` keys appended in registration order. The last 5 entries are "recently added". Map them to `PokemonEntry` / `PokemonForm` via the static JSON maps at render time.

**Alternative considered**: add a `recentlyRegistered: string[]` field to the store. Rejected — insertion order is already encoded; a separate field would require a store migration.

### 4. "Next Up" via `buildMissingEntries`
Reuse `buildMissingEntries(registeredSet, variations, activeGenerations, locale)` from `src/lib/missing-pokemon.ts`, sliced to the first 5 results (already sorted by dex number).

### 5. Milestone computation in a pure utility
`src/lib/milestones.ts` exports `getMilestones(percentage: number): Milestone[]` where each `Milestone = { threshold: number; reached: boolean }`. Thresholds: 25, 50, 75, 90, 100. Used for both overall and per-generation badges.

```ts
export type Milestone = { threshold: number; reached: boolean }
export function getMilestones(percentage: number): Milestone[] {
  return [25, 50, 75, 90, 100].map((t) => ({ threshold: t, reached: percentage >= t }))
}
```

### 6. Widget component structure
New directory `src/components/home/` with one file per widget:
- `CompletionRing.tsx` — wraps `OverallDonut`, adds milestone badges below
- `QuickStats.tsx` — 3-4 stat tiles (registered, boxes used, shiny)
- `NextUpStrip.tsx` — horizontal scrollable row of 5 sprite buttons → opens `PokemonCard`
- `RecentStrip.tsx` — same layout as NextUpStrip but for last-5 registered
- `QuickActions.tsx` — 4 large icon buttons (Boxes, Missing, Stats, Settings)
- `GenerationMilestones.tsx` — compact list of generations with inline milestone pips

## Risks / Trade-offs

- **`registered[]` order assumption** → If a future change reorders the array (e.g., sort-on-insert), "recently added" breaks silently. Mitigation: document the assumption in the hook.
- **`buildMissingEntries` performance** → Called on every render of the home page. Mitigation: `useMemo` with stable deps (`registeredSet`, `variations`, `activeGenerations`).
- **PokemonCard state in dashboard** → The page needs `{ isOpen, selectedId }` local state to open the card sheet from two strips. Keep it simple with a single `useState<number | null>(null)`.
