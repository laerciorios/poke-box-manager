## Context

The `/stats` route already exists as a stub page (`src/app/[locale]/stats/page.tsx`) and `src/components/stats/` is in place. The three source stores are read-only from this feature's perspective:

- `usePokedexStore` — `registered: string[]` using keys like `"25"` or `"25:pikachu-alola"`
- `useBoxStore` — `boxes: Box[]` where each box has 30 `(BoxSlot | null)` slots
- `useSettingsStore` — `variations: VariationToggles`, `activeGenerations: number[]`

Static data available at build-time: `src/data/generations.json` (with `pokemonCount` per gen), `src/data/types.json`, `src/data/pokemon.json` (with type assignments and generation IDs per Pokémon/form).

## Goals / Non-Goals

**Goals:**
- Render a fully-functional statistics dashboard from existing store data
- Compute all stats client-side, respecting active generation and variation filters
- Provide a donut chart (overall), horizontal bars (by generation), type grid, box heatmap, and box summary counts
- Full i18n support (PT-BR + EN)

**Non-Goals:**
- Tracking progress over time / streaks (spec section 3.5 extras — out of scope for this change)
- "Completion estimate" calculation (requires history which doesn't exist yet)
- Writing to any store — this is a pure read/visualize feature

## Decisions

### 1. Charting library: recharts

**Decision**: Use `recharts` (already a common Next.js/React pairing).

**Rationale**: Recharts is composable, SSR-safe (renders nothing on server, hydrates on client), and suits the three chart types needed: `RadialBarChart` (donut), `BarChart` (generation bars). The type grid and box heatmap are pure CSS/Tailwind — no chart library needed there.

**Alternatives considered**:
- `chart.js` — heavier, canvas-based (harder to style with Tailwind)
- `victory` — larger bundle, less Tailwind-friendly
- Pure CSS only — feasible for bars/grid but a donut in pure CSS is fragile

### 2. Stats computation: custom hook `useStatsData`

**Decision**: Extract all computation into a single `src/hooks/useStatsData.ts` hook that reads all three stores and returns pre-computed stat objects.

**Rationale**: Keeps the page component declarative. Computation is pure (no side effects), so it can be memoized with `useMemo`. Centralizing it makes the logic testable and prevents prop-drilling.

```ts
interface StatsData {
  overall: { registered: number; total: number; percentage: number }
  byGeneration: GenerationStat[]
  byType: TypeStat[]
  boxSummary: { complete: number; partial: number; empty: number }
  boxes: BoxHeatmapEntry[]
}
```

### 3. "Total" Pokémon count respects filters

**Decision**: The denominator for all progress stats is computed dynamically from `pokemon.json`, filtered by `activeGenerations` and `variations`.

- Base Pokémon always included
- Each `VariationToggles` key maps to the `formType` field on `PokemonForm` — only count forms where their toggle is `true`
- `activeGenerations` filters by the Pokémon's `generationId`

This matches the behavior described in spec 3.5 and how the rest of the app handles counts (see `variation-counts` spec).

### 4. Box state classification

**Decision**:
- **Empty**: all 30 slots are `null`
- **Complete**: all non-null slots have `registered: true` AND at least 1 slot is occupied
- **Partial**: anything in between (has some slots, not all registered, OR has empty slots mixed with registered)

The heatmap tile color maps directly: green = complete, yellow = partial, red = empty.

### 5. Page layout: responsive grid

The stats page uses a CSS grid layout:
```
┌─────────────────────────────────────────┐
│         Overall Donut + Summary         │
├──────────────────────┬──────────────────┤
│  Progress by Gen     │  Progress by Type│
│  (horizontal bars)   │  (grid w/ %)     │
├──────────────────────┴──────────────────┤
│           Box Heatmap                   │
│  (grid of colored tiles per box)        │
└─────────────────────────────────────────┘
```

shadcn/ui `Card` components wrap each section. Layout collapses to single-column on mobile.

## Risks / Trade-offs

- **Large pokemon.json iteration** → `useMemo` with store deps prevents recalculation on unrelated re-renders. Pokémon data is ~1025 entries — negligible.
- **Recharts SSR** → wrap chart components in a client component with `'use client'`; the page itself can remain a server component for the `getTranslations` call, passing translated strings as props.
- **Box heatmap scale** → if users have many boxes (50+), tiles will be very small. A max-width container with wrapping grid keeps it usable.
