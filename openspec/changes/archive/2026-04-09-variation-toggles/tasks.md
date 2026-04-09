## 1. Variation Counts Utility

- [x] 1.1 Create `src/lib/variation-counts.ts` with `TOGGLE_FORM_TYPES` mapping each `VariationToggles` key to its `formType` string(s)
- [x] 1.2 Compute and export `VARIATION_COUNTS: Record<keyof VariationToggles, number>` by scanning `src/data/forms.json` at module load
- [x] 1.3 Compute and export `BASE_POKEMON_COUNT: number` by reading the length of `src/data/pokemon.json`
- [x] 1.4 Implement and export `computeTotal(variations: VariationToggles): number`

## 2. Presentational Component — VariationToggleItem

- [x] 2.1 Create `src/components/settings/VariationToggleItem.tsx` with props: `checked`, `label`, `subtitle`, `additionalCount`, `hasWarning`, `onToggle`
- [x] 2.2 Render a shadcn/ui `Switch`, label text, subtitle, and `+N` badge using existing UI components
- [x] 2.3 Show a warning icon (e.g. `lucide-react` `AlertTriangle`) when `hasWarning` is true, with a tooltip explaining that registered data will be hidden

## 3. Container Component — VariationTogglesPanel

- [x] 3.1 Create `src/components/settings/VariationTogglesPanel.tsx` that reads `variations` from `useSettingsStore` and calls `setVariation` on toggle
- [x] 3.2 Subscribe to `usePokedexStore` to compute, for each toggle key, whether any registered form IDs map to that toggle's `TOGGLE_FORM_TYPES`
- [x] 3.3 Render 12 `VariationToggleItem` rows in the order: regionalForms, genderForms, unownLetters, vivillonPatterns, alcremieVariations, colorVariations, sizeVariations, megaEvolutions, gmaxForms, battleForms, originForms, costumedPokemon
- [x] 3.4 Render the totals footer: "Total with selected variations: N" and "Base total (no variations): M" using `computeTotal` and `BASE_POKEMON_COUNT`
- [x] 3.5 Export `VariationTogglesPanel` from `src/components/settings/index.ts` (create barrel if it doesn't exist)

## 4. i18n Strings

- [x] 4.1 Add PT-BR messages for each toggle label, subtitle examples, and total footer lines in the appropriate `messages/pt-BR.json` (or equivalent) locale file
- [x] 4.2 Add EN messages for the same keys in `messages/en.json`
- [x] 4.3 Replace hardcoded strings in `VariationToggleItem` with `useTranslations` calls

## 5. Settings Page Integration

- [x] 5.1 Add a "Variações" / "Variations" section to the Settings page (`src/app/settings/page.tsx` or equivalent) that renders `VariationTogglesPanel`
- [x] 5.2 Verify the panel renders correctly in both PT-BR and EN locales via the dev server
