## 1. Setup & Dependencies

- [x] 1.1 Install `recharts` package (`npm install recharts`)
- [x] 1.2 Verify `src/components/stats/` directory exists (create if missing)
- [x] 1.3 Verify `src/hooks/` directory exists (create if missing)

## 2. Stats Computation Hook

- [x] 2.1 Create `src/hooks/useStatsData.ts` — define `StatsData`, `GenerationStat`, `TypeStat`, `BoxHeatmapEntry` TypeScript interfaces
- [x] 2.2 Implement overall progress computation: iterate `pokemon.json` filtered by `activeGenerations` + `variations`, count registered keys against `usePokedexStore.registered`
- [x] 2.3 Implement `byGeneration` computation: group filtered Pokémon by `generationId`, compute registered/total per generation
- [x] 2.4 Implement `byType` computation: group filtered Pokémon by type(s), compute registered/total per type (a Pokémon can count toward up to 2 types)
- [x] 2.5 Implement box summary computation: classify each box from `useBoxStore.boxes` as `complete | partial | empty` per design rules (all occupied+registered = complete, all null = empty, else partial)
- [x] 2.6 Wrap all computations in `useMemo` keyed on `registered`, `boxes`, `activeGenerations`, and `variations`

## 3. Overall Donut Chart Component

- [x] 3.1 Create `src/components/stats/OverallDonut.tsx` as a `'use client'` component using `recharts` `RadialBarChart`
- [x] 3.2 Render filled arc proportional to `registered / total` with centered labels showing count and percentage (e.g. "847 / 1025 — 82.6%")
- [x] 3.3 Accept translated label strings as props (no `useTranslations` inside client component)

## 4. Generation Progress Bars Component

- [x] 4.1 Create `src/components/stats/GenerationBars.tsx` as a `'use client'` component using `recharts` `BarChart` (horizontal layout)
- [x] 4.2 Render one bar per active generation labeled with generation name; show registered/total as a tooltip or inline label
- [x] 4.3 Style completed generations (100%) with a distinct fill color

## 5. Type Progress Grid Component

- [x] 5.1 Create `src/components/stats/TypeGrid.tsx` as a client component
- [x] 5.2 Render an 18-tile grid — each tile shows type name, type badge color, and `X%` indicator
- [x] 5.3 Reuse type color mapping already used in type badge components (grep for existing `TYPE_COLORS` or equivalent)

## 6. Box Heatmap Component

- [x] 6.1 Create `src/components/stats/BoxHeatmap.tsx` as a client component
- [x] 6.2 Render one colored tile per box: green = complete, yellow = partial, red = empty (use Tailwind classes)
- [x] 6.3 Add tooltip on hover showing the box name using shadcn/ui `Tooltip`

## 7. Box Summary Counts Component

- [x] 7.1 Create `src/components/stats/BoxSummary.tsx` — three labeled count cards: complete / partial / empty
- [x] 7.2 Style each card with an appropriate accent color matching the heatmap scheme

## 8. i18n Keys

- [x] 8.1 Add Stats translation keys in `src/i18n/messages/pt-BR.json`: overall section labels, generation section label, type section label, heatmap section label, box summary labels (complete/partial/empty), and the `%` format string
- [x] 8.2 Mirror the same keys in `src/i18n/messages/en.json`

## 9. Page Assembly

- [x] 9.1 Update `src/app/[locale]/stats/page.tsx` to call `getTranslations('Stats')`, pass translated strings as props to a new `StatsClientPage` component
- [x] 9.2 Create `src/components/stats/StatsClientPage.tsx` as `'use client'` — calls `useStatsData()` and renders all section cards in the responsive grid layout (see design.md)
- [x] 9.3 Wrap each chart section in a shadcn/ui `Card` with a section heading
- [x] 9.4 Handle empty-state: if `boxes` is empty and `registered` is empty, show a placeholder message directing the user to add boxes
