## Why

The Home page is currently a placeholder (title + subtitle only) — users land there every visit but get no value from it. A dashboard gives an immediate at-a-glance view of Pokédex progress, quick access to key workflows, and surfaces the next actions a user should take, making the app genuinely useful as a daily driver.

## What Changes

- Replace the placeholder Home page with a full dashboard layout
- Add a prominent overall completion ring (reusing `OverallDonut` from Stats)
- Add a quick-stats row: registered / total, boxes used, total shiny
- Add a "Next Up" preview: the next N missing Pokémon in dex order with sprites, clickable to open `PokemonCard`
- Add a "Recent" section: last 5–10 Pokémon registered (derived from insertion order of `registered[]`)
- Add a quick-actions row: Boxes, Missing Pokémon, Stats, Settings — especially useful on mobile
- Add per-generation milestone badges (25 / 50 / 75 / 90 / 100 %) shown inline with generation rows
- All widgets respect active variation toggles and generation filters from `useSettingsStore`
- New i18n keys in `en.json` and `pt-BR.json` for all dashboard copy

## Capabilities

### New Capabilities

- `home-dashboard`: Dashboard widgets — completion ring, quick stats, next-up preview, recent registrations, quick actions, generation milestones

### Modified Capabilities

<!-- No existing spec-level requirements are changing -->

## Impact

- **`src/app/[locale]/page.tsx`** — rewritten as a client component dashboard
- **`src/components/home/`** — new directory with widget components
- **`src/hooks/useRecentRegistrations.ts`** — derive last-N entries from `registered[]` insertion order
- **`src/lib/milestones.ts`** — compute milestone thresholds per generation and overall
- **`src/i18n/messages/en.json`** + **`pt-BR.json`** — new `Home.*` keys
- Reuses: `OverallDonut`, `useStatsData`, `MissingEntry` types, `buildMissingEntries` logic
- No new runtime dependencies; no store schema changes
