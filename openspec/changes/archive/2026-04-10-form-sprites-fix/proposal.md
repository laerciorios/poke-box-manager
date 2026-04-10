## Why

Alternate Pokémon forms (Megas, G-Max, regional variants, etc.) display old pixel sprites while base Pokémon use modern Home 3D sprites. Additionally, no alternate form has a shiny sprite — the `spriteShiny` field does not even exist on `PokemonForm`. The problem is in the data pipeline, not the UI: the fetch script already downloads the correct data (via the `/pokemon/<id>` endpoint for each variety) which contains Home 3D and shiny sprites, but the form normalizer ignores those and only reads from the `/pokemon-form/<id>` endpoint, which only provides pixel sprites.

This fix is a prerequisite for the `shiny-tracker` change, where forms like Mega Charizard X/Y need to display their shiny sprites in `PokemonCard`.

## What Changes

- Add `spriteShiny?: string` to the `PokemonForm` type
- Update `form-normalizer.ts` to receive and prioritize data from the `/pokemon/<id>` endpoint (already cached in `altPokemonRaw`), using `sprites.other.home.front_default` and `sprites.other.home.front_shiny` with fallback to the pixel sprites from the `/pokemon-form/<id>` endpoint
- Update `fetch-pokemon-data.ts` to build an `altPokemonByName` index and pass it to the normalizer
- Run `npm run fetch-data` to regenerate `src/data/pokemon.json` and `src/data/forms.json` with corrected sprites
- No UI changes — all components already consuming `form.sprite` will automatically display the Home 3D sprite; `PokemonCard` already has logic to display `spriteShiny` and will use it for forms once the data is present (one-line fix)

## Capabilities

### New Capabilities

<!-- None — this is a data pipeline bug fix -->

### Modified Capabilities

- `data-normalization`: The form normalizer now uses Home 3D sprites (from the `/pokemon/<id>` variety endpoint) and captures shiny sprites for alternate forms

## Impact

- **Modified**: `src/types/pokemon.ts` — adds `spriteShiny?: string` to `PokemonForm`
- **Modified**: `src/scripts/normalizers/form-normalizer.ts` — receives and uses `altPokemonData` to extract Home 3D and shiny sprites
- **Modified**: `src/scripts/fetch-pokemon-data.ts` — builds `altPokemonByName` index and passes it to `normalizeForms`
- **Modified**: `src/components/pokemon/PokemonCard.tsx` — reads `activeForm?.spriteShiny` as the shiny sprite source when a form is active (one-line change)
- **Regenerated**: `src/data/pokemon.json` and `src/data/forms.json` via `npm run fetch-data`
- **No other UI changes** — zero impact on other components; all consumers of `form.sprite` benefit automatically
- Expected coverage after fix: 295/362 forms with Home 3D sprite (81%), 287/362 with shiny (79%); remaining forms (fanmade megas, alternate builds) fall back to existing pixel sprites
