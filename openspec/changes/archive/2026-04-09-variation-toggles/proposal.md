## Why

The app's data model and settings store already define all 12 variation toggle flags (`VariationToggles`), but there is no UI for the user to configure them. Without this panel, users cannot express which forms they want to track, making the Pokédex total meaningless and box planning inaccurate. This is a core piece of the UX described in spec section 3.3.

## What Changes

- **New**: `VariationTogglesPanel` component — a settings panel listing all 12 variation toggles, each showing the name, description, affected Pokémon examples, and the count of additional forms the toggle adds.
- **New**: Real-time running total that reacts to toggle changes and shows both the selected-variation total and base total.
- **New**: Warning indicator when disabling a toggle that has already-registered Pokémon in the active boxes.
- **New**: Utility function `getVariationCounts()` that returns the additional-Pokémon count for each toggle key, computed from the static `forms.json` data.
- **New**: Utility function `computeTotalWithVariations(variations)` that returns the full tracking total for a given `VariationToggles` state.
- **Behavior**: Disabling a toggle hides associated forms from tracking/counting but does **not** delete any registered Pokémon data (non-destructive as per spec 3.3).

## Capabilities

### New Capabilities

- `variation-toggles-panel`: UI panel that displays and controls the 12 variation toggles, shows per-toggle counts and examples, a live total, and a warning when disabling a toggle affects already-organized boxes.
- `variation-counts`: Utility that derives per-toggle additional-Pokémon counts from the static forms data and exposes a function to compute the full Pokédex total for a given toggle configuration.

### Modified Capabilities

<!-- No existing spec-level requirements are changing. The settings store and types already support variation toggles; this change adds the missing UI and computation layer. -->

## Impact

- `src/components/settings/` — new `VariationTogglesPanel.tsx` component (and supporting sub-components)
- `src/lib/variation-counts.ts` — new utility computing counts from `src/data/forms.json`
- `src/stores/useSettingsStore.ts` — consumed (read + write via `setVariation`); no store changes needed
- `src/stores/usePokedexStore.ts` — read-only access to detect registered forms when showing warnings
- `src/data/forms.json` — read at import time to compute counts; no changes
- No new dependencies required (shadcn/ui `Switch`, `Badge`, `Tooltip` already available)
