## 1. Computation Utilities

- [x] 1.1 Add `computeFilteredTotal(variations: VariationToggles, activeGenerations: number[]): number` to `src/lib/variation-counts.ts` — iterate `pokemon.json` for base count filtered by generation, then iterate `forms.json` for enabled variation counts filtered by generation; treat empty `activeGenerations` as all generations
- [x] 1.2 Add `computeBoxCount(pokemonCount: number): { boxes: number; lastBoxSlots: number; emptySlots: number }` to `src/lib/variation-counts.ts` using `BOX_SIZE` from `src/types/box.ts`

## 2. BoxCalculatorCard Component

- [x] 2.1 Create `src/components/settings/BoxCalculatorCard.tsx` that reads `variations` and `activeGenerations` from `useSettingsStore` (using `useShallow`)
- [x] 2.2 Call `computeFilteredTotal` and `computeBoxCount` inside the component and render: box count (primary), Pokémon count / 30 (secondary), last-box slot detail (shown only when last box is not full)
- [x] 2.3 Add i18n translation keys for all card labels ("boxes needed", "Pokémon / 30 per box", "last box: X / 30 slots used", "based on your current settings") in PT-BR and EN locale files
- [x] 2.4 Format numbers with `Intl.NumberFormat` using the active locale for thousand separators

## 3. Settings Page Integration

- [x] 3.1 Import and render `BoxCalculatorCard` on the settings page, positioned below or alongside `VariationTogglesPanel`
- [x] 3.2 Verify the card updates immediately when a toggle is switched (no page reload needed)
- [x] 3.3 Verify the card updates immediately when a generation filter is changed

## 4. Home Dashboard Integration

- [x] 4.1 Import and render `BoxCalculatorCard` on the Home page within or below the quick stats row
- [x] 4.2 Verify the card is visible and correct on initial load with default settings

## 5. QA and Verification

- [x] 5.1 Manually verify with all variations off, all generations: count matches `BASE_POKEMON_COUNT`; box count is `Math.ceil(BASE_POKEMON_COUNT / 30)`
- [x] 5.2 Manually verify with only Gen 1 active, no variations: card shows 151 Pokémon, 6 boxes
- [x] 5.3 Manually verify enabling a variation toggle increases the count and recalculates boxes
- [x] 5.4 Run `npm run build` and confirm no TypeScript errors
