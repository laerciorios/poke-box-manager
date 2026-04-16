## Why

Users configure active generations and variation toggles, which directly determines how many Pokémon they are tracking — but nowhere in the app is this count translated into the number of physical boxes they need to prepare. Spec section 4.4 defines the Box Calculator as a utility that answers "With your settings, you need X boxes (Y Pokémon / 30 per box)", helping users plan their Pokémon Home layout before they start organizing.

## What Changes

- New `computeFilteredTotal(variations, activeGenerations)` utility function that combines existing `computeTotal` logic with generation filtering over `pokemon.json` and `forms.json`
- New `BoxCalculatorCard` component displaying box count, Pokémon count, and breakdown — dynamically reactive to settings changes
- Card rendered on the **Settings page** (alongside `VariationTogglesPanel`) and as an optional widget on the **Home dashboard**
- No new dependencies; fully derived from static JSON and existing store state

## Capabilities

### New Capabilities

- `box-calculator`: Computation logic (`computeFilteredTotal`, `computeBoxCount`) and `BoxCalculatorCard` UI widget

### Modified Capabilities

- `variation-counts`: Extend with `computeFilteredTotal(variations, activeGenerations)` — new exported function added to existing module (spec-level addition since the module's requirement set grows)
- `home-dashboard`: Home page gains an optional `BoxCalculatorCard` widget in the quick-stats area

## Impact

- Modified: `src/lib/variation-counts.ts` — new `computeFilteredTotal` export
- New: `src/components/settings/BoxCalculatorCard.tsx`
- Modified: settings page layout to include `BoxCalculatorCard`
- Modified: `src/app/(pages)/page.tsx` (or home dashboard component) to include the widget
- No new dependencies; computation uses existing `pokemon.json`, `forms.json`, and `VARIATION_COUNTS` / `TOGGLE_FORM_TYPES` constants
- Relates to spec section **4.4 Box Calculator**
