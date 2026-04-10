## 1. Types & Settings Store

- [x] 1.1 Add `shinyTrackerEnabled: boolean` (default `false`) to `SettingsState` interface in `src/types/settings.ts` and to `DEFAULT_SETTINGS`
- [x] 1.2 Add `setShinyTrackerEnabled(value: boolean)` action to `useSettingsStore`
- [x] 1.3 Bump `useSettingsStore` schema version from `3` to `4` (or from whatever the current version is after export-import-system); add v→4 migration that sets `shinyTrackerEnabled: false` on persisted state missing the field

## 2. Pokedex Store — Shiny Registration

- [x] 2.1 Add `registeredShiny: string[]` (default `[]`) to `PokedexState` interface in `src/stores/usePokedexStore.ts`
- [x] 2.2 Add `toggleShinyRegistered(pokemonId: number, formId?: string)` action — same composite-key builder as `toggleRegistered`
- [x] 2.3 Add `isShinyRegistered(pokemonId: number, formId?: string): boolean` action
- [x] 2.4 Add `registerAllShiny(keys: string[])` and `unregisterAllShiny(keys: string[])` actions
- [x] 2.5 Bump `usePokedexStore` schema version from `1` to `2`; add migration that sets `registeredShiny: []` on persisted state missing the field

## 3. BoxSlotCell — Sparkle Overlay & Shiny Registration Button

- [x] 3.1 Add `isShinyRegistered?: boolean` and `onShinyRegistrationToggle?: (e: React.MouseEvent) => void` props to `BoxSlotCellProps`
- [x] 3.2 Add the sparkle overlay: render a small `<Sparkles>` icon (already imported from lucide-react) in the top-right corner of the slot when `isShinyRegistered` is `true`; style it as a fixed-position overlay with a subtle gold/yellow tint and `pointer-events-none`
- [x] 3.3 Add the shiny registration mini-button: render a secondary ✦ button in registration mode when `onShinyRegistrationToggle` is provided and the slot is occupied; clicking calls the callback and stops event propagation
- [x] 3.4 Update the box grid parent(s) that render `BoxSlotCell` to derive `isShinyRegistered` per slot: read `usePokedexStore.registeredShiny` as a `Set<string>` via `useMemo`, check `shinySet.has(makeKey(slot.pokemonId, slot.formId))` per slot; pass `onShinyRegistrationToggle` that calls `toggleShinyRegistered(slot.pokemonId, slot.formId)` when `shinyTrackerEnabled` is true

## 4. PokemonCard — Register Shiny Button

- [x] 4.1 In `PokemonCard`, read `shinyTrackerEnabled` from `useSettingsStore` and `isShinyRegistered` / `toggleShinyRegistered` from `usePokedexStore`
- [x] 4.2 Render a "Register Shiny" button (below the existing shiny sprite toggle) when `shinyTrackerEnabled` is `true`; button variant reflects current shiny-registration state (`'default'` if registered, `'outline'` if not)
- [x] 4.3 On click, call `toggleShinyRegistered(pokemonId, activeFormId ?? undefined)` (pass `activeFormId` when a form is selected in the form switcher)
- [x] 4.4 Add i18n keys for "Register Shiny" button label in both registered and unregistered states

## 5. Stats — Shiny Progress Section

- [x] 5.1 In `useStatsData`, read `shinyTrackerEnabled` from `useSettingsStore` and `registeredShiny` from `usePokedexStore`
- [x] 5.2 When `shinyTrackerEnabled` is `true`, compute `shiny.overall` and `shiny.byGeneration` using the same loop structure as normal stats but counting `registeredShinySet.has(key)` instead; add these to the `StatsData` return type as `shiny?: { overall: {...}; byGeneration: GenerationStat[] }`
- [x] 5.3 Create `src/components/stats/ShinyProgressSection.tsx` — renders an overall shiny count display (number + percentage) and a generation breakdown using the existing `GenerationBars` component; accepts `shiny` data as props
- [x] 5.4 In `StatsClientPage`, conditionally render `<ShinyProgressSection>` when `useStatsData().shiny` is defined; add the section below the existing content
- [x] 5.5 Add i18n keys for the shiny progress section title, count label, and generation breakdown header in both PT-BR and EN

## 6. Settings UI — ShinyTrackerPanel

- [x] 6.1 Create `src/components/settings/ShinyTrackerPanel.tsx` — client component with a `Switch` for `shinyTrackerEnabled`, a description of what the mode does, and a count of shiny-registered Pokémon (from `registeredShiny.length`) shown only when the tracker is enabled
- [x] 6.2 Add i18n keys for ShinyTrackerPanel: section title, description, "N shiny Pokémon registered" count label, in both PT-BR and EN
- [x] 6.3 Add `<ShinyTrackerPanel />` as a new section in `src/app/[locale]/settings/page.tsx`

## 7. Export/Import Compatibility

- [x] 7.1 Verify `registeredShiny` is included in the export payload from `usePokedexStore` (the export-import-system change exports all store state, so this should be automatic once the field exists — confirm by inspecting the export output)
- [x] 7.2 Verify that importing a backup that pre-dates the `registeredShiny` field correctly defaults it to `[]` via the store migration (not the import logic)

## 8. Polish & Edge Cases

- [x] 8.1 Verify that disabling the shiny tracker in settings hides all sparkle overlays without mutating `registeredShiny`
- [x] 8.2 Verify that re-enabling the tracker after disabling it still shows sparkles for previously shiny-registered Pokémon
- [x] 8.3 Verify the shiny registration button in PokemonCard uses `activeFormId` when a form is selected (not the base id)
- [x] 8.4 Confirm the `Sparkles` icon overlay does not obscure the slot's registration checkmark or the sprite; position and z-index should be tested at both default and small slot sizes
- [x] 8.5 Verify `shinyTrackerEnabled: false` is correctly included in the settings migration so existing users are not unexpectedly opted in
